import XCTest
import Foundation
@testable import CollectionCore

final class AgentWorkspaceTests: XCTestCase {
    var root: URL!
    override func setUpWithError() throws {
        root = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    }
    override func tearDownWithError() throws { try FileManager.default.removeItem(at: root) }
    func testConfirmationPersistsAndEditingInvalidatesIt() throws {
        let document = AgentDocument(id: "principles", title: "Principles", body: "Make connections.")
        var state = AgentWorkspace(documents: [document])
        XCTAssertFalse(state.ready)
        state.documents[0].confirmedBody = state.documents[0].body
        XCTAssertTrue(state.ready)
        let file = root.appendingPathComponent("workspace.json")
        try state.save(to: file)
        var restored = try AgentWorkspace.load(at: file, seed: file)
        XCTAssertTrue(restored.ready)
        restored.documents[0].body = "Revised content."
        XCTAssertFalse(restored.ready)
        XCTAssertTrue(restored.requestContext(stage: "Draft").contains("Revised content."))
    }
    func testOfflinePackagePreservesTeachingAndRejectsUnsafeArtwork() throws {
        let draft = try AgentProvider.decode(TeachingDraft.self, text: #"{"title":"A lesson","pages":[{"id":"start","text":"What changes when you move it?"}],"sources":[{"title":"Source","url":"https://example.org"}]}"#)
        let art = try AgentProvider.decode(GeneratedArt.self, text: #"{"pages":[{"id":"start","svg":"<svg viewBox=\"0 0 600 300\"><circle cx=\"100\" cy=\"100\" r=\"10\"><animate attributeName=\"cx\" from=\"100\" to=\"200\" dur=\"6s\" begin=\"0s\" fill=\"freeze\"/></circle></svg>"}]}"#)
        let package = root.appendingPathComponent("package")
        try GeneratedLesson.write(draft: draft, art: art, to: package, id: "lesson", version: "1")
        let collection = try CollectionStore(root: root.appendingPathComponent("collection"))
        let lesson = try collection.importLesson(from: package)
        XCTAssertEqual(lesson.title, draft.title)
        let html = try String(contentsOf: collection.resource(for: lesson), encoding: .utf8)
        XCTAssertTrue(html.contains("What changes when you move it?"))
        XCTAssertTrue(html.contains("connect-src 'none'"))
        XCTAssertTrue(html.contains("prefers-reduced-motion"))
        for payload in ["<script>alert(1)</script>", "<image href='https://bad.example/image'/>", "<rect onclick='alert(1)'/>", "<foreignObject/>", "<animate attributeName='href' to='file:///etc/passwd' dur='6s' begin='0s'/>"] {
            let bad = GeneratedArt(pages: [.init(id: "start", svg: "<svg viewBox='0 0 600 300'>\(payload)</svg>")])
            XCTAssertThrowsError(try bad.validate(for: draft))
        }
        let mismatch = GeneratedArt(pages: [.init(id: "other", svg: "<svg viewBox='0 0 600 300'/>")])
        XCTAssertThrowsError(try mismatch.validate(for: draft))
    }
    func testCollectionReferencesRespectReuseAndReadCurrentWording() throws {
        let package = root.appendingPathComponent("reference")
        try FileManager.default.createDirectory(at: package, withIntermediateDirectories: true)
        try Data(#"{"id":"interest-rate","title":"Interest rate","version":"1","entry":"index.html","route":"","concepts":[]}"#.utf8).write(to: package.appendingPathComponent("lesson.json"))
        try Data("<html></html>".utf8).write(to: package.appendingPathComponent("index.html"))
        try Data(#"window.InterestPlan = [{"id":"start","cue":"Original wording","title":"Do not include title","detail":"Do not include optional explanation"}];"#.utf8).write(to: package.appendingPathComponent("plan.js"))
        let store = try CollectionStore(root: root.appendingPathComponent("collection"))
        let lesson = try store.importLesson(from: package)
        XCTAssertTrue(try CollectionReference.approved(from: store).isEmpty)
        try store.updateLibraryItem(lesson.key, description: "", tags: [], approved: true)
        let first = try XCTUnwrap(CollectionReference.approved(from: store).first)
        XCTAssertEqual(first.text, "[P01 | start]\nOriginal wording")
        let field = ##"["/index.html","#cue",0,"Original wording"]"##
        try store.setTextEdit(for: lesson.key, field: field, text: "My clearer wording")
        let updated = try XCTUnwrap(CollectionReference.approved(from: store).first)
        XCTAssertEqual(updated.text, "[P01 | start]\nMy clearer wording")
        try store.updateLibraryItem(lesson.key, description: "", tags: [], approved: false)
        XCTAssertTrue(try CollectionReference.approved(from: store).isEmpty)
        let installed = store.root.appendingPathComponent("lessons").appendingPathComponent(lesson.key)
        try Data(#"window.MoneyCourse = [{"say":"Before payment","result":"After payment"}];"#.utf8).write(to: installed.appendingPathComponent("course-plan.js"))
        let course = try CollectionReference.read(lesson, store: store)
        XCTAssertTrue(course.text.contains("Before payment"))
        XCTAssertTrue(course.text.contains("After payment"))
        XCTAssertFalse(course.text.contains("Original wording"))
    }
    func testVisualControlsReachPromptValidationAndPackage() throws {
        var settings = VisualSettings()
        settings.diagramWidth = 800; settings.diagramHeight = 400; settings.duration = 8
        settings.accent = "#12ABCD"; settings.textSize = 22
        var state = AgentWorkspace(documents: [])
        state.visualSettings = settings
        let file = root.appendingPathComponent("visual-workspace.json")
        try state.save(to: file)
        let restored = try AgentWorkspace.load(at: file, seed: file)
        XCTAssertEqual(restored.visuals, settings)
        XCTAssertTrue(restored.context.contains("#12ABCD"))
        XCTAssertTrue(AgentStages.animation(for: settings).contains("0 0 800 400"))
        let draft = try AgentProvider.decode(TeachingDraft.self, text: #"{"title":"Test","pages":[{"id":"start","text":"Watch the change."}],"sources":[{"title":"Source","url":"https://example.org"}]}"#)
        let svg = "<svg viewBox='0 0 800 400'><circle r='7'><animate attributeName='cx' from='0' to='100' dur='8s' begin='0s'/></circle></svg>"
        let art = GeneratedArt(pages: [.init(id: "start", svg: svg)])
        XCTAssertThrowsError(try art.validate(for: draft))
        try art.validate(for: draft, settings: settings)
        let output = root.appendingPathComponent("visual-package")
        try GeneratedLesson.write(draft: draft, art: art, to: output, id: "visual", version: "1", settings: settings)
        let html = try String(contentsOf: output.appendingPathComponent("index.html"), encoding: .utf8)
        XCTAssertTrue(html.contains("font-size:22px"))
        XCTAssertTrue(html.contains("background:#12ABCD"))
        XCTAssertTrue(html.contains("getCurrentTime()>=8"))
        XCTAssertTrue(html.contains(" / 8 s"))
        settings.background = "url(https://invalid.example)"
        XCTAssertThrowsError(try settings.validate())
    }
    func testMalformedStateIsNotReplacedWithDefaults() throws {
        let url = root.appendingPathComponent("state.json")
        try Data("broken".utf8).write(to: url)
        XCTAssertThrowsError(try AgentWorkspace.load(at: url, seed: url))
    }
    func testProviderResearchUsesSearchAndCollectsActualURLs() async throws {
        let config = URLSessionConfiguration.ephemeral; config.protocolClasses = [AgentStub.self]
        let session = URLSession(configuration: config); defer { session.invalidateAndCancel() }
        let result = try await AgentProvider(session: session).complete(key: "test-only", model: "test-model", system: "Context", input: "Lesson request", research: true)
        XCTAssertEqual(result.text, "Research notes")
        XCTAssertEqual(result.sourceURLs, ["https://example.org/source"])
    }
}
private final class AgentStub: URLProtocol, @unchecked Sendable {
    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        XCTAssertEqual(request.url?.host, "api.anthropic.com")
        XCTAssertEqual(request.value(forHTTPHeaderField: "anthropic-version"), "2023-06-01")
        let data = Data(#"{"stop_reason":"end_turn","content":[{"type":"web_search_tool_result","content":[{"url":"https://example.org/source"}]},{"type":"text","text":"Research notes"}]}"#.utf8)
        let response = HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        client?.urlProtocol(self, didLoad: data); client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() {}
}
