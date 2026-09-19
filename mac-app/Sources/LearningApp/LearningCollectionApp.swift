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
        .windowToolbarStyle(.unifiedCompact)
    }
}

struct Pattern: Decodable, Identifiable {
    let id: String
    let title: String
    let tags: [String]
    let communicates: String
    let preview: String
    let sourceLessonKeys: [String]
    var key: String { "pattern-" + id + "@2026-09-19" }
}

@MainActor
final class AppModel: ObservableObject {
    @Published var lessons: [Lesson] = []
    @Published var patterns: [Pattern] = []
    @Published var selected: String? = nil
    @Published var opened: Lesson? = nil
    @Published var error: String? = nil
    @Published var revision = 0
    @Published var restoreGeneration = 0
    var store: CollectionStore?
    init() {
        if let icon = Bundle.main.url(forResource: "Wink", withExtension: "icns") {
            NSApplication.shared.applicationIconImage = NSImage(contentsOf: icon)
        }
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
    func open(_ lesson: Lesson) {
        perform { try store?.recordVisit(lesson.key); opened = lesson }
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

struct LessonNotes: View {
    @ObservedObject var model: AppModel
    let lesson: Lesson
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text("Understanding").font(.system(size: 13, weight: .semibold))
                Text("Tick an idea when you understand it. You can change your mind anytime.").font(.caption).foregroundStyle(.secondary)
                if model.store?.conceptsApproved(for: lesson.key) != true {
                    Text("Proposed concepts").font(.system(size: 12, weight: .medium))
                    Text("Review these ideas and their subject sources before using this checklist.").font(.caption).foregroundStyle(.secondary)
                }
                ForEach(lesson.concepts) { concept in
                    VStack(alignment: .leading, spacing: 6) {
                        if model.store?.conceptsApproved(for: lesson.key) == true {
                            Toggle(concept.title, isOn: Binding(get: { model.store?.isUnderstood(concept.id) == true }, set: { value in model.perform { try model.store?.setUnderstood(concept.id, value) } })).toggleStyle(.checkbox)
                        } else { Text(concept.title).font(.system(size: 13)) }
                        if let url = URL(string: concept.source) { Link("Subject source ↗", destination: url).font(.caption) }
                    }
                }
                if model.store?.conceptsApproved(for: lesson.key) != true {
                    Button("Approve this concept list") { model.perform { try model.store?.approveConcepts(for: lesson.key) } }.buttonStyle(WorkspaceButtonStyle(primary: true))
                }
                Divider()
                Text("Reuse properties").font(.system(size: 12, weight: .semibold))
                LibraryEditor(model: model, itemKey: lesson.key, initialDescription: "", initialTags: [])
                Text("Excluding an edition keeps it here to revisit. Approval applies only to this edition.").font(.caption).foregroundStyle(.secondary)
            }.padding(20).font(.system(size: 13))
        }.background(WorkspaceStyle.surface)
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
        }.textFieldStyle(WorkspaceFieldStyle())
        .buttonStyle(WorkspaceButtonStyle())
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
    static func dismantleNSView(_ web: WKWebView, coordinator: Coordinator) {
        web.stopLoading()
        web.loadHTMLString("", baseURL: nil)
    }
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
