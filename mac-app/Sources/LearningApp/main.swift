import SwiftUI
import WebKit
import UniformTypeIdentifiers
import CollectionCore

@main
struct LearningCollectionApp: App {
    @StateObject private var model = AppModel()
    var body: some Scene {
        Window("Let me understand", id: "collection") {
            CollectionView(model: model)
                .frame(minWidth: 1000, minHeight: 680)
                .preferredColorScheme(.dark)
        }
        .defaultSize(width: 1380, height: 900)
    }
}

struct Pattern: Decodable, Identifiable {
    let id: String
    let title: String
    let tags: [String]
    let communicates: String
    var key: String { "pattern-" + id + "@2026-09-19" }
}

@MainActor
final class AppModel: ObservableObject {
    @Published var lessons: [Lesson] = []
    @Published var patterns: [Pattern] = []
    @Published var selected: String? = nil
    @Published var opened: Lesson? = nil
    @Published var gallery = false
    @Published var error: String? = nil
    @Published var revision = 0
    @Published var restoreGeneration = 0
    var store: CollectionStore?
    init() {
        perform {
            let root = ProcessInfo.processInfo.environment["LEARNING_COLLECTION_HOME"].map { URL(fileURLWithPath: $0) }
                ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0].appendingPathComponent("Let Me Understand")
            let collection = try CollectionStore(root: root)
            store = collection
            guard let seed = Bundle.main.resourceURL?.appendingPathComponent("Seeds"),
                  FileManager.default.fileExists(atPath: seed.path) else {
                throw NSError(domain: "App", code: 1, userInfo: [NSLocalizedDescriptionKey: "Bundled lessons are missing. Build the app with mac-app/scripts/build_app.sh."])
            }
            for name in ["part1", "part2", "part3"] {
                let package = seed.appendingPathComponent(name)
                let manifest = try JSONDecoder().decode(Lesson.self, from: Data(contentsOf: package.appendingPathComponent("lesson.json")))
                if try !collection.lessons().contains(where: { $0.key == manifest.key }) { _ = try collection.importLesson(from: package) }
            }
            patterns = try JSONDecoder().decode([Pattern].self, from: Data(contentsOf: seed.appendingPathComponent("patterns.json")))
            try reload()
        }
    }
    func perform(_ action: () throws -> Void) {
        do { try action(); revision += 1 } catch { self.error = error.localizedDescription }
    }
    func reload() throws { lessons = try store?.lessons() ?? [] }
    func open(_ lesson: Lesson, gallery: Bool = false) {
        perform { try store?.recordVisit(lesson.key); self.gallery = gallery; opened = lesson }
    }
    func importLesson() {
        let panel = NSOpenPanel()
        panel.title = "Import a lesson package"
        panel.message = "Choose the folder containing lesson.json and its offline material."
        panel.canChooseDirectories = true; panel.canChooseFiles = false
        guard panel.runModal() == .OK, let url = panel.url else { return }
        perform { _ = try store?.importLesson(from: url); try reload() }
    }
    func exportBackup() {
        let panel = NSSavePanel()
        panel.nameFieldStringValue = "Learning-history.json"
        panel.allowedContentTypes = [.json]
        guard panel.runModal() == .OK, let url = panel.url else { return }
        perform { try store?.exportBackup().write(to: url, options: .atomic) }
    }
    func restoreBackup() {
        let panel = NSOpenPanel()
        panel.allowedContentTypes = [.json]
        guard panel.runModal() == .OK, let url = panel.url, let store else { return }
        perform {
            let data = try Data(contentsOf: url)
            let preview = try store.previewBackup(data)
            let alert = NSAlert()
            alert.messageText = "Restore this learning history?"
            alert.informativeText = "This backup contains \(preview.understoodCount) understanding marks and \(preview.libraryCount) library choices. It replaces your current history and choices. Saved lessons stay in your collection. A safety backup will be created first."
            alert.addButton(withTitle: "Restore"); alert.addButton(withTitle: "Cancel")
            if alert.runModal() == .alertFirstButtonReturn {
                let safety = try store.restoreBackup(data)
                restoreGeneration += 1
                let done = NSAlert()
                done.messageText = "History restored"
                done.informativeText = "Your previous history is saved at \(safety.path)."
                done.addButton(withTitle: "Done"); done.addButton(withTitle: "Show safety backup")
                if done.runModal() == .alertSecondButtonReturn { NSWorkspace.shared.activateFileViewerSelecting([safety]) }
            }
        }
    }
}

struct CollectionView: View {
    @ObservedObject var model: AppModel
    @State private var section = "collection"
    @State private var showNotes = true
    var body: some View {
        NavigationSplitView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Image(systemName: "sparkle.magnifyingglass").font(.system(size: 28)).foregroundStyle(.purple)
                    Text("Let me\nunderstand").font(.system(size: 25, weight: .semibold, design: .rounded))
                    Text("YOUR LEARNING COLLECTION").font(.system(size: 9, weight: .semibold)).tracking(1.5).foregroundStyle(.secondary)
                }.padding(.top, 22)
                VStack(spacing: 6) {
                    sidebar("My visualizations", icon: "square.stack", id: "collection")
                    sidebar("Animation library", icon: "play.rectangle.on.rectangle", id: "library")
                }
                Spacer()
                Label("Saved on this Mac", systemImage: "internaldrive").font(.caption).foregroundStyle(.secondary)
                Menu("Collection tools") {
                    Button("Import lesson package…", action: model.importLesson)
                    Divider()
                    Button("Export history & choices…", action: model.exportBackup)
                    Button("Restore history & choices…", action: model.restoreBackup)
                    Button("Show local collection") { if let root = model.store?.root { NSWorkspace.shared.open(root) } }
                }.menuStyle(.borderlessButton)
            }.padding(20)
            .navigationSplitViewColumnWidth(230)
        } detail: {
            if let lesson = model.opened, let store = model.store {
                VStack(spacing: 0) {
                    HStack {
                        Button { model.opened = nil } label: { Label("Collection", systemImage: "chevron.left") }
                        Text(model.gallery ? "Animation gallery" : lesson.title).font(.headline)
                        Spacer()
                        Text(lesson.version).font(.caption).foregroundStyle(.secondary)
                        Button { showNotes.toggle() } label: { Label("Learning notes", systemImage: "sidebar.right") }
                    }.padding(14)
                    Divider()
                    HStack(spacing: 0) {
                        if let resource = try? store.resource(for: lesson) {
                            LessonWebView(file: resource, directory: store.root.appendingPathComponent("lessons").appendingPathComponent(lesson.key), route: model.gallery ? "?symbols=phosphor#animation" : lesson.route)
                                .id(lesson.key + (model.gallery ? "gallery" : "lesson"))
                        }
                        if showNotes && !model.gallery {
                            Divider()
                            LessonNotes(model: model, lesson: lesson).frame(width: 280)
                        }
                    }
                }
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 26) {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 10) {
                                Text(section == "collection" ? "Pick up an idea." : "Motion with a purpose.").font(.system(size: 34, weight: .semibold, design: .rounded))
                                Text(section == "collection" ? "Revisit your visualizations. Keep what you understand." : "Browse the patterns behind your lessons and choose what can guide future work.")
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            if section == "collection" { Button("Import lesson…", action: model.importLesson).buttonStyle(.borderedProminent).tint(.purple) }
                        }
                        if section == "collection" {
                            ForEach(model.lessons, id: \.key) { lesson in lessonCard(lesson) }
                        } else {
                            ForEach(model.patterns) { pattern in
                                VStack(alignment: .leading, spacing: 14) {
                                    HStack {
                                        Text(pattern.id).font(.caption.monospaced()).foregroundStyle(.purple)
                                        Text(pattern.title).font(.title3.bold())
                                        Spacer()
                                        Button("View animations") {
                                            if let lesson = model.lessons.last(where: { $0.id == "part3" }) { model.open(lesson, gallery: true) }
                                        }
                                    }
                                    LibraryEditor(model: model, itemKey: pattern.key, initialDescription: pattern.communicates, initialTags: pattern.tags)
                                }.padding(22).background(.white.opacity(0.035), in: RoundedRectangle(cornerRadius: 18))
                            }
                        }
                    }.padding(36).frame(maxWidth: 1150, alignment: .leading)
                }
            }
        }
        .tint(Color(red: 0.73, green: 0.65, blue: 1))
        .alert("Couldn’t complete that action", isPresented: Binding(get: { model.error != nil }, set: { if !$0 { model.error = nil } })) {
            Button("OK") { model.error = nil }
        } message: { Text(model.error ?? "") }
    }
    func sidebar(_ title: String, icon: String, id: String) -> some View {
        Button { section = id; model.opened = nil } label: {
            Label(title, systemImage: icon).frame(maxWidth: .infinity, alignment: .leading).padding(10)
                .background(section == id ? Color.purple.opacity(0.18) : .clear, in: RoundedRectangle(cornerRadius: 9))
        }.buttonStyle(.plain)
    }
    func lessonCard(_ lesson: Lesson) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 18) {
                Image(systemName: lesson.id == "part1" ? "arrow.left.arrow.right" : lesson.id == "part2" ? "puzzlepiece.extension" : "point.3.connected.trianglepath.dotted")
                    .font(.system(size: 27)).foregroundStyle(.purple).frame(width: 54, height: 54).background(.purple.opacity(0.12), in: RoundedRectangle(cornerRadius: 14))
                VStack(alignment: .leading, spacing: 7) {
                    Text(lesson.title).font(.title2.weight(.semibold))
                    Text("Edition \(lesson.version) · Available offline").font(.caption).foregroundStyle(.secondary)
                    if let date = model.store?.lastVisited(lesson.key) {
                        Text("Last opened \(date.formatted(date: .abbreviated, time: .shortened))").font(.caption).foregroundStyle(.secondary)
                    }
                }
                Spacer()
                Button("Open visualization →") { model.open(lesson) }.buttonStyle(.borderedProminent).tint(.purple)
            }
            HStack {
                if model.store?.conceptsApproved(for: lesson.key) == true {
                    let count = lesson.concepts.filter { model.store?.isUnderstood($0.id) == true }.count
                    Label("\(count) of \(lesson.concepts.count) concepts marked understood", systemImage: "checkmark.circle")
                } else {
                    Label("Concept list ready for your review", systemImage: "list.bullet.clipboard")
                }
                Spacer()
                Text(model.store?.libraryItem(lesson.key).approved == true ? "Approved as an example" : "Excluded from future examples")
            }.font(.caption).foregroundStyle(.secondary)
        }.padding(24).background(.white.opacity(0.035), in: RoundedRectangle(cornerRadius: 18))
    }
}

struct LessonNotes: View {
    @ObservedObject var model: AppModel
    let lesson: Lesson
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Your understanding").font(.title3.bold())
                Text("Tick an idea when you understand it. You can change your mind anytime.").font(.caption).foregroundStyle(.secondary)
                if model.store?.conceptsApproved(for: lesson.key) != true {
                    Text("Proposed concept list").font(.headline)
                    Text("Review these ideas and their subject sources before using this checklist.").font(.caption).foregroundStyle(.secondary)
                }
                ForEach(lesson.concepts) { concept in
                    VStack(alignment: .leading, spacing: 6) {
                        if model.store?.conceptsApproved(for: lesson.key) == true {
                            Toggle(concept.title, isOn: Binding(get: { model.store?.isUnderstood(concept.id) == true }, set: { value in model.perform { try model.store?.setUnderstood(concept.id, value) } })).toggleStyle(.checkbox)
                        } else { Text(concept.title).font(.callout) }
                        if let url = URL(string: concept.source) { Link("Subject source ↗", destination: url).font(.caption) }
                    }
                }
                if model.store?.conceptsApproved(for: lesson.key) != true {
                    Button("Approve this concept list") { model.perform { try model.store?.approveConcepts(for: lesson.key) } }.buttonStyle(.borderedProminent)
                }
                Divider()
                Text("Future examples").font(.headline)
                LibraryEditor(model: model, itemKey: lesson.key, initialDescription: "", initialTags: [])
                Text("Excluding an edition keeps it here to revisit. Approval applies only to this edition.").font(.caption).foregroundStyle(.secondary)
            }.padding(20)
        }
    }
}

struct LibraryEditor: View {
    @ObservedObject var model: AppModel
    let itemKey: String
    let initialDescription: String
    let initialTags: [String]
    @State private var description = ""
    @State private var tags = ""
    @State private var approved = false
    @State private var saved = false
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            TextField("Description", text: $description, axis: .vertical).lineLimit(2...5)
            TextField("Tags, separated by commas", text: $tags)
            Toggle("Use as a future example", isOn: $approved).toggleStyle(.checkbox)
            HStack {
                Button("Save choices") {
                    model.perform {
                        try model.store?.updateLibraryItem(itemKey, description: description, tags: tags.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }, approved: approved)
                        saved = true
                    }
                }
                if saved { Text("Saved on this Mac").font(.caption).foregroundStyle(.secondary) }
            }
        }.textFieldStyle(.roundedBorder)
        .onAppear(perform: load)
        .onChange(of: model.restoreGeneration) { _, _ in load() }
        .onChange(of: description) { _, _ in saved = false }
        .onChange(of: tags) { _, _ in saved = false }
        .onChange(of: approved) { _, _ in saved = false }
    }
    func load() {
        guard let choice = model.store?.libraryItem(itemKey, defaultDescription: initialDescription, defaultTags: initialTags) else { return }
        description = choice.description
        tags = choice.tags.joined(separator: ", ")
        approved = choice.approved
    }
}

struct LessonWebView: NSViewRepresentable {
    let file: URL
    let directory: URL
    let route: String
    func makeCoordinator() -> Coordinator { Coordinator(directory: directory) }
    func makeNSView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .nonPersistent()
        let gallery = "if(location.hash==='#animation') document.querySelector('[data-nav=animation]')?.click();"
        configuration.userContentController.addUserScript(WKUserScript(source: gallery, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        let web = WKWebView(frame: .zero, configuration: configuration)
        web.navigationDelegate = context.coordinator
        web.setValue(false, forKey: "drawsBackground")
        let url = URL(string: file.absoluteString + route) ?? file
        let rules = """
        [{"trigger":{"url-filter":"^https?://.*"},"action":{"type":"block"}}]
        """
        WKContentRuleListStore.default().compileContentRuleList(forIdentifier: "OfflineLessons", encodedContentRuleList: rules) { list, error in
            if let list { web.configuration.userContentController.add(list) }
            if error == nil { web.loadFileURL(url, allowingReadAccessTo: directory) }
            else { web.loadHTMLString("<h1>Offline lesson protection could not load.</h1>", baseURL: nil) }
        }
        return web
    }
    func updateNSView(_ web: WKWebView, context: Context) {}
    @MainActor final class Coordinator: NSObject, WKNavigationDelegate {
        let directory: URL
        init(directory: URL) { self.directory = directory }
        func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping @MainActor @Sendable (WKNavigationActionPolicy) -> Void) {
            guard let url = action.request.url else { decisionHandler(.cancel); return }
            if url.isFileURL && url.standardizedFileURL.path.hasPrefix(directory.standardizedFileURL.path + "/") {
                decisionHandler(.allow)
            } else if url.scheme == "about" { decisionHandler(.allow) }
            else {
                if action.navigationType == .linkActivated && ["https", "http"].contains(url.scheme ?? "") { NSWorkspace.shared.open(url) }
                decisionHandler(.cancel)
            }
        }
    }
}
