import SwiftUI
import Security
import CollectionCore

@MainActor private enum AgentKeychain {
    static let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: "com.letmeunderstand.generation", kSecAttrAccount as String: "anthropic"]
    static func read() -> String? {
        var q = query; q[kSecReturnData as String] = true
        var item: CFTypeRef?
        guard SecItemCopyMatching(q as CFDictionary, &item) == errSecSuccess, let data = item as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
    static func save(_ key: String) throws {
        let data = Data(key.utf8)
        let update = SecItemUpdate(query as CFDictionary, [kSecValueData as String: data] as CFDictionary)
        if update == errSecItemNotFound {
            var q = query; q[kSecValueData as String] = data
            guard SecItemAdd(q as CFDictionary, nil) == errSecSuccess else { throw AgentFailure.missingKey }
        } else if update != errSecSuccess { throw AgentFailure.missingKey }
    }
}

@MainActor final class GenerationModel: ObservableObject {
    @Published var workspace: AgentWorkspace?
    @Published var error: String?
    @Published var busy = false
    @Published var status = ""
    @Published var composer = ""
    @Published var connectionKey = ""
    @Published var connected = false
    @Published var references: [CollectionReference] = []
    private var task: Task<Void, Never>?
    private var root: URL?
    private var file: URL? { root?.appendingPathComponent("agent-workspace/workspace.json") }
    func load(root: URL) {
        guard workspace == nil else { return }
        self.root = root
        do {
            guard let seed = Bundle.main.url(forResource: "workspace", withExtension: "json", subdirectory: "AgentContext"), let file else { throw AgentFailure.incomplete }
            workspace = try AgentWorkspace.load(at: file, seed: seed)
            workspace?.documents.removeAll { $0.id == "examples" || $0.id == "visual" }
            try refreshReferences()
        } catch { self.error = error.localizedDescription }
    }
    func refreshReferences() throws {
        guard let root else { return }
        references = try CollectionReference.approved(from: CollectionStore(root: root))
    }
    var referenceContext: String { CollectionReference.context(references) }
    func fullContext(_ workspace: AgentWorkspace, stage: String) -> String {
        workspace.requestContext(stage: stage) + "\n\n" + referenceContext
    }
    func save() {
        do { if let workspace, let file { try workspace.save(to: file) } }
        catch { self.error = error.localizedDescription }
    }
    func saveConnection() {
        do { try AgentKeychain.save(connectionKey.trimmingCharacters(in: .whitespacesAndNewlines)); connectionKey = ""; connected = true; status = "API key saved in macOS Keychain." }
        catch { self.error = error.localizedDescription }
    }
    func cancel() { task?.cancel(); status = "Stopping…" }
    func newLesson() {
        workspace?.messages = []; workspace?.draft = nil; workspace?.lessonID = nil; workspace?.research = ""; workspace?.brief = ""; save(); status = "New lesson. Your teaching context is kept."
    }
    var teachingInput: String {
        guard let w = workspace else { return "" }
        return "User request:\n\(w.brief)\n\nConversation:\n\(w.conversation)\n\nResearch:\n\(w.research)\n\nCurrent teaching draft:\n\(w.draft?.orderedText ?? "None yet.")"
    }
    var animationInput: String {
        guard let draft = workspace?.draft, let data = try? JSONEncoder().encode(draft) else { return "No teaching draft yet." }
        return String(decoding: data, as: UTF8.self)
    }
    func generate() {
        guard !busy, var w = workspace, let root else { return }
        guard w.ready else { error = AgentFailure.unconfirmed.localizedDescription; return }
        do { try refreshReferences() } catch { self.error = error.localizedDescription; return }
        let message = composer.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !message.isEmpty else { return }
        guard let key = AgentKeychain.read(), !key.isEmpty else { error = AgentFailure.missingKey.localizedDescription; return }
        if w.brief.isEmpty { w.brief = message }
        w.messages.append(AgentMessage(role: "user", text: message))
        workspace = w; composer = ""; save(); busy = true
        task = Task {
            defer { busy = false }
            do {
                let run = root.appendingPathComponent("agent-workspace/runs/" + UUID().uuidString)
                try FileManager.default.createDirectory(at: run, withIntermediateDirectories: true)
                try w.save(to: run.appendingPathComponent("context.json"))
                try JSONEncoder().encode(references).write(to: run.appendingPathComponent("collection-references.json"))
                status = "Researching sources…"
                let researchInput = "User request:\n\(w.brief)\n\nConversation:\n\(w.conversation)"
                let researchSystem = fullContext(w, stage: AgentStages.research)
                try Data((researchSystem + "\n\n" + researchInput).utf8).write(to: run.appendingPathComponent("research-request.md"))
                let research = try await AgentProvider().complete(key: key, model: w.model, system: researchSystem, input: researchInput, research: true)
                try Task.checkCancellation()
                w.research = research.text + "\n\nRetrieved URLs:\n" + research.sourceURLs.joined(separator: "\n")
                workspace?.research = w.research
                status = "Drafting teaching pages…"
                let input = "User request:\n\(w.brief)\n\nConversation:\n\(w.conversation)\n\nResearch:\n\(w.research)\n\nCurrent teaching draft:\n\(w.draft?.orderedText ?? "None yet.")"
                let system = fullContext(w, stage: AgentStages.teaching)
                try Data((system + "\n\n" + input).utf8).write(to: run.appendingPathComponent("teaching-request.md"))
                let reply = try await AgentProvider().complete(key: key, model: w.model, system: system, input: input)
                try Task.checkCancellation()
                let draft = try AgentProvider.decode(TeachingDraft.self, text: reply.text)
                try draft.validate()
                guard draft.sources.allSatisfy({ research.sourceURLs.contains($0.url) }) else { throw AgentFailure.invalidDraft }
                workspace?.draft = draft
                workspace?.messages.append(AgentMessage(role: "assistant", text: draft.orderedText))
                try JSONEncoder().encode(draft).write(to: run.appendingPathComponent("teaching.json"))
                save(); status = "Teaching draft ready. Review it, request changes, or build the visualization."
            } catch is CancellationError { status = "Stopped. Your previous draft is preserved." }
            catch { self.error = error.localizedDescription; status = "Generation stopped. Your previous draft is preserved." }
        }
    }
    func build(app: AppModel) {
        guard !busy, let w = workspace, let draft = w.draft, let root, let store = app.store else { return }
        guard w.ready else { error = AgentFailure.unconfirmed.localizedDescription; return }
        do { try refreshReferences() } catch { self.error = error.localizedDescription; return }
        guard let key = AgentKeychain.read(), !key.isEmpty else { error = AgentFailure.missingKey.localizedDescription; return }
        busy = true; status = "Building diagrams from your teaching draft…"
        let input = animationInput
        let lessonID = w.lessonID ?? "generated-" + UUID().uuidString.lowercased()
        workspace?.lessonID = lessonID; save()
        task = Task {
            defer { busy = false }
            do {
                let run = root.appendingPathComponent("agent-workspace/runs/" + UUID().uuidString)
                try FileManager.default.createDirectory(at: run, withIntermediateDirectories: true)
                try w.save(to: run.appendingPathComponent("context.json"))
                try JSONEncoder().encode(references).write(to: run.appendingPathComponent("collection-references.json"))
                let system = fullContext(w, stage: AgentStages.animation(for: w.visuals))
                try Data((system + "\n\n" + input).utf8).write(to: run.appendingPathComponent("animation-request.md"))
                let reply = try await AgentProvider().complete(key: key, model: w.model, system: system, input: input)
                try Task.checkCancellation()
                let art = try AgentProvider.decode(GeneratedArt.self, text: reply.text)
                let package = run.appendingPathComponent("package")
                let version = String(Int(Date().timeIntervalSince1970 * 1000))
                try GeneratedLesson.write(draft: draft, art: art, to: package, id: lessonID, version: version, settings: w.visuals)
                try Task.checkCancellation()
                let lesson = try store.importLesson(from: package)
                try app.reload(); app.open(lesson)
                status = "Saved in Experiments: \(draft.title). Review the new visualization there."
            } catch is CancellationError { status = "Stopped. Nothing was imported." }
            catch { self.error = error.localizedDescription; status = "Visualization was not imported." }
        }
    }
    func export() {
        guard let w = workspace else { return }
        let panel = NSSavePanel(); panel.nameFieldStringValue = "teaching-agent-context.md"
        guard panel.runModal() == .OK, let url = panel.url else { return }
        do {
            try refreshReferences()
            let text = "# Teaching agent context\n\nStatus: \(w.ready ? "User-confirmed" : "Draft — awaiting user confirmation")\n\n" + w.context + "\n\n" + referenceContext + "\n\n# Current lesson request\n" + w.brief
            try Data(text.utf8).write(to: url, options: .atomic)
            status = "Portable Markdown exported."
        } catch { self.error = error.localizedDescription }
    }
}

struct GenerationView: View {
    @ObservedObject var app: AppModel
    @ObservedObject var generator: GenerationModel
    @State private var tab = "Context"
    @State private var selected = "start-here"
    @State private var payloadStage = "Teaching"
    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Create a lesson").font(.system(size: 13, weight: .semibold))
                WorkspaceBadge(text: generator.workspace?.ready == true ? "Context confirmed" : "Context draft")
                Spacer()
                Button("Export context", action: generator.export).disabled(generator.workspace == nil || generator.busy)
            }.padding(.horizontal, 20).frame(height: 52)
            WorkspaceRule()
            HStack(spacing: 8) {
                ForEach(["Context", "Chat", "What the agent sees", "Connection"], id: \.self) { title in
                    Button(title) { tab = title }.foregroundStyle(tab == title ? WorkspaceStyle.ink : WorkspaceStyle.subtle)
                }
                Spacer()
            }.padding(12)
            WorkspaceRule()
            if generator.workspace == nil { ContentUnavailableView("Context unavailable", systemImage: "doc", description: Text(generator.error ?? "Loading…")) }
            else if tab == "Context" { contextEditor }
            else if tab == "Chat" { chat }
            else if tab == "Connection" { connection }
            else { payload }
            if !generator.status.isEmpty {
                WorkspaceRule()
                HStack { if generator.busy { ProgressView().controlSize(.small) }; Text(generator.status).font(.caption).foregroundStyle(WorkspaceStyle.subtle); Spacer(); if generator.busy { Button("Stop", action: generator.cancel) } }.padding(12)
            }
        }
        .onAppear { if let root = app.store?.root { generator.load(root: root) } }
        .alert("Generation needs attention", isPresented: Binding(get: { generator.error != nil }, set: { if !$0 { generator.error = nil } })) { Button("OK") { generator.error = nil } } message: { Text(generator.error ?? "") }
    }
    private var contextEditor: some View {
        HStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Offered to the agent").font(.caption).foregroundStyle(WorkspaceStyle.subtle).padding(.bottom, 10)
                    ForEach(generator.workspace?.documents ?? []) { doc in
                        Button { selected = doc.id } label: {
                            HStack { Text(doc.title).multilineTextAlignment(.leading); Spacer(); Image(systemName: doc.confirmed ? "checkmark.circle" : "circle.dotted").foregroundStyle(WorkspaceStyle.subtle) }.padding(9).frame(maxWidth: .infinity, alignment: .leading).background(selected == doc.id ? WorkspaceStyle.line : .clear, in: RoundedRectangle(cornerRadius: 6))
                        }.buttonStyle(.plain)
                    }
                    Button { selected = "visual" } label: {
                        HStack { Text("Visualization handoff"); Spacer(); Image(systemName: "slider.horizontal.3") }.padding(9).frame(maxWidth: .infinity, alignment: .leading).background(selected == "visual" ? WorkspaceStyle.line : .clear, in: RoundedRectangle(cornerRadius: 6))
                    }.buttonStyle(.plain)
                    Button { selected = "collection-references"; do { try generator.refreshReferences() } catch { generator.error = error.localizedDescription } } label: {
                        HStack { Text("Collection references"); Spacer(); Image(systemName: "books.vertical") }.padding(9).frame(maxWidth: .infinity, alignment: .leading).background(selected == "collection-references" ? WorkspaceStyle.line : .clear, in: RoundedRectangle(cornerRadius: 6))
                    }.buttonStyle(.plain)
                }.padding(14)
            }.frame(width: 235)
            Rectangle().fill(WorkspaceStyle.line).frame(width: 1)
            if selected == "visual" { VisualSettingsView(settings: Binding(get: { generator.workspace?.visuals ?? VisualSettings() }, set: { generator.workspace?.visualSettings = $0; generator.save() })).disabled(generator.busy) }
            else if selected == "collection-references" { referencePicker }
            else if let index = generator.workspace?.documents.firstIndex(where: { $0.id == selected }) {
                VStack(alignment: .leading, spacing: 16) {
                    HStack { Text(generator.workspace!.documents[index].title).font(.title3); Spacer(); WorkspaceBadge(text: generator.workspace!.documents[index].confirmed ? "Confirmed" : "Needs your review") }
                    Text("Edit the draft directly. Changes require confirmation again. Every document is included in the agent’s context.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
                    TextEditor(text: Binding(get: { generator.workspace?.documents[index].body ?? "" }, set: { generator.workspace?.documents[index].body = $0; generator.save() }))
                        .font(.system(size: 14)).scrollContentBackground(.hidden).padding(10).background(WorkspaceStyle.raised).disabled(generator.busy)
                    HStack {
                        Button("Confirm this content") { generator.workspace?.documents[index].confirmedBody = generator.workspace?.documents[index].body; generator.save() }.buttonStyle(WorkspaceButtonStyle(primary: true)).disabled(generator.busy || generator.workspace!.documents[index].body.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        Spacer()
                        if generator.workspace?.ready == true { Button("Continue to chat") { tab = "Chat" } }
                    }
                }.padding(24)
            }
        }
    }
    private var referencePicker: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Collection references").font(.title3)
            Text("The agent reads the actual teaching from editions you enable here. These switches share the collection’s ‘Use as a future example’ setting. Your notes are not included.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    ForEach(app.lessons, id: \.key) { lesson in
                        if let store = app.store {
                            let available = (try? CollectionReference.read(lesson, store: store)) != nil
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Toggle(isOn: Binding(get: { store.libraryItem(lesson.key).approved }, set: { value in
                                        app.perform {
                                            let current = store.libraryItem(lesson.key)
                                            try store.updateLibraryItem(lesson.key, description: current.description, tags: current.tags, approved: value)
                                            try generator.refreshReferences()
                                        }
                                    })) { VStack(alignment: .leading, spacing: 4) { Text(lesson.title); Text("Edition " + lesson.version).font(.caption).foregroundStyle(WorkspaceStyle.subtle) } }.toggleStyle(.checkbox).disabled(generator.busy || (!available && !store.libraryItem(lesson.key).approved))
                                    Spacer()
                                    Button("Open lesson") { app.open(lesson) }.disabled(generator.busy)
                                }
                                if !available { Text("Teaching-text export unavailable for this edition.").font(.caption).foregroundStyle(WorkspaceStyle.subtle) }
                                if store.libraryItem(lesson.key).approved, let reference = generator.references.first(where: { $0.id == lesson.key }) {
                                    DisclosureGroup("Text offered to the agent") { Text(reference.text).font(.system(size: 12)).textSelection(.enabled).frame(maxWidth: .infinity, alignment: .leading).padding(.top, 8) }
                                }
                            }.padding(14).background(WorkspaceStyle.raised, in: RoundedRectangle(cornerRadius: 6))
                        }
                    }
                }
            }
            Text("Read fresh before each request • Exact edition and text saved with the run").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
        }.padding(24)
    }
    private var chat: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Teaching first, then visualization").font(.title3)
                Spacer()
                Button("New lesson", action: generator.newLesson).disabled(generator.busy)
            }
            Text("Describe what you want to learn. The agent researches sources and drafts the teaching before creating diagrams. API requests are billed by Anthropic.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            if generator.workspace?.ready != true { Text("Review and confirm the context documents before starting.").foregroundStyle(WorkspaceStyle.accentHover) }
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 22) {
                    if generator.workspace?.messages.isEmpty == true { Text("What would you like to understand?").font(.title2).padding(.vertical, 48) }
                    ForEach(generator.workspace?.messages ?? []) { message in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(message.role == "user" ? "You" : "Teaching draft").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
                            Text(message.text).textSelection(.enabled).lineSpacing(5).frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    if let draft = generator.workspace?.draft {
                        DisclosureGroup("Sources found by the agent") {
                            ForEach(draft.sources, id: \.url) { source in if let url = URL(string: source.url) { Link(source.title, destination: url).font(.caption).padding(.vertical, 3) } }
                        }
                    }
                }.frame(maxWidth: 800).frame(maxWidth: .infinity)
            }
            TextField("Describe a lesson, or ask for a change…", text: $generator.composer, axis: .vertical).lineLimit(2...5).textFieldStyle(WorkspaceFieldStyle()).disabled(generator.busy)
            HStack {
                Button(generator.workspace?.draft == nil ? "Research & draft" : "Revise teaching", action: generator.generate).buttonStyle(WorkspaceButtonStyle(primary: true)).disabled(generator.busy || generator.workspace?.ready != true || generator.composer.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                if generator.workspace?.draft != nil { Button("Build visualization") { generator.build(app: app) }.disabled(generator.busy || generator.workspace?.ready != true) }
                Spacer()
                Text(generator.workspace?.model ?? "").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            }
        }.padding(24)
    }
    private var connection: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Anthropic API").font(.title3)
            Text("Your API key stays in macOS Keychain. It is never included in context exports or run records. Claude subscriptions do not cover API usage.").foregroundStyle(WorkspaceStyle.subtle)
            TextField("Model ID", text: Binding(get: { generator.workspace?.model ?? "" }, set: { generator.workspace?.model = $0; generator.save() })).textFieldStyle(WorkspaceFieldStyle())
            Text("For example: claude-opus-5 or claude-fable-5. Model availability depends on your API account.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            SecureField("Anthropic API key", text: $generator.connectionKey).textFieldStyle(WorkspaceFieldStyle())
            Button("Save API key", action: generator.saveConnection).disabled(generator.connectionKey.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            Text("Requests send the confirmed context, your conversation, teaching draft and research to Anthropic. Web search uses topic-derived queries. Only editions enabled in Collection references are included. Other lessons, personal notes and files are not sent.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            Spacer()
        }.padding(28).frame(maxWidth: 760).frame(maxWidth: .infinity, alignment: .leading).disabled(generator.busy)
    }
    private var payload: some View {
        VStack(alignment: .leading, spacing: 16) {
            Picker("Stage", selection: $payloadStage) { Text("Research").tag("Research"); Text("Teaching").tag("Teaching"); Text("Animation").tag("Animation") }.pickerStyle(.segmented)
            Text("These are the application-controlled instructions and current input. A typed message joins the conversation when you send it. Research results are added before drafting. Every actual request is saved locally in agent-workspace/runs.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
            ScrollView {
                let stage = payloadStage == "Research" ? AgentStages.research : payloadStage == "Teaching" ? AgentStages.teaching : AgentStages.animation(for: generator.workspace?.visuals ?? VisualSettings())
                Text((generator.workspace.map { generator.fullContext($0, stage: stage) } ?? "") + "\n\n# Input\n" + (payloadStage == "Animation" ? generator.animationInput : payloadStage == "Research" ? "User request:\n\(generator.workspace?.brief ?? "")\n\nConversation:\n\(generator.workspace?.conversation ?? "")" : generator.teachingInput)).font(.system(size: 12, design: .monospaced)).textSelection(.enabled).frame(maxWidth: .infinity, alignment: .leading)
            }
        }.padding(24)
    }
}
