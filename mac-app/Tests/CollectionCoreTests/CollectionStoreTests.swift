import XCTest
import Foundation
import CollectionCore

final class CollectionStoreTests: XCTestCase {
    var temporary: URL!
    override func setUpWithError() throws {
        temporary = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: temporary, withIntermediateDirectories: true)
    }
    override func tearDownWithError() throws { try FileManager.default.removeItem(at: temporary) }
    func package(version: String = "1", entry: String = "index.html") throws -> URL {
        let folder = temporary.appendingPathComponent("package-" + version)
        try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        let manifest = """
        {"id":"web-server","title":"Web server","version":"\(version)","entry":"\(entry)","route":"","concepts":[{"id":"request","title":"A request asks a server for a resource","source":"https://ruslanspivak.com/lsbaws-part1/"}]}
        """
        try Data(manifest.utf8).write(to: folder.appendingPathComponent("lesson.json"))
        try Data("<h1>Independent lesson</h1>".utf8).write(to: folder.appendingPathComponent("index.html"))
        return folder
    }
    func store() throws -> CollectionStore { try CollectionStore(root: temporary.appendingPathComponent("collection")) }
    func testEditionNotesPreserveOldNotesButEditsAndClearingAreIndependent() throws {
        let collection = try store()
        let first = try collection.importLesson(from: package())
        let second = try collection.importLesson(from: package(version: "2"))
        try collection.setVisualizationNote(for: first.id, text: "Existing shared note")
        XCTAssertEqual(collection.editionNote(for: first), "Existing shared note")
        try collection.setEditionNote(for: first, text: "First edition reminder")
        XCTAssertEqual(try store().editionNote(for: first), "First edition reminder")
        XCTAssertEqual(collection.editionNote(for: second), "Existing shared note")
        try collection.setEditionNote(for: second, text: "")
        XCTAssertEqual(try store().editionNote(for: second), "")
        let backup = try collection.exportBackup()
        try collection.setEditionNote(for: first, text: "Changed")
        _ = try collection.restoreBackup(backup)
        XCTAssertEqual(try store().editionNote(for: first), "First edition reminder")
    }
    func testFoldersKeepEditionsTogetherNewestFirst() throws {
        let collection = try store()
        _ = try collection.importLesson(from: package(version: "2"))
        _ = try collection.importLesson(from: package(version: "10"))
        let folders = VisualizationFolder.grouping(try collection.lessons())
        XCTAssertEqual(folders.count, 1)
        XCTAssertEqual(folders[0].id, "web-server")
        XCTAssertEqual(folders[0].editions.map(\.version), ["10", "2"])
    }
    func testVisualizationNoteIsSharedByEditionsAndIncludedInBackup() throws {
        let collection = try store()
        let first = try collection.importLesson(from: package())
        let second = try collection.importLesson(from: package(version: "2"))
        try collection.setVisualizationNote(for: first.id, text: "Explain this with a daily-life example next time.")
        XCTAssertEqual(try store().visualizationNote(for: second.id), "Explain this with a daily-life example next time.")
        XCTAssertEqual(collection.visualizationNote(for: "another-lesson"), "")
        let backup = try collection.exportBackup()
        try collection.setVisualizationNote(for: first.id, text: "")
        XCTAssertEqual(try store().visualizationNote(for: first.id), "")
        _ = try collection.restoreBackup(backup)
        XCTAssertEqual(try store().visualizationNote(for: first.id), "Explain this with a daily-life example next time.")
    }
    func testPersonalWordingPersistsPerEditionAndCanRestoreOriginal() throws {
        let collection = try store()
        let first = try collection.importLesson(from: package())
        let second = try collection.importLesson(from: package(version: "2"))
        try collection.setTextEdit(for: first.key, field: "heading", text: "A clearer explanation")
        let reopened = try store()
        XCTAssertEqual(reopened.textEdits(for: first.key)["heading"], "A clearer explanation")
        XCTAssertTrue(reopened.textEdits(for: second.key).isEmpty)
        XCTAssertEqual(try String(contentsOf: reopened.resource(for: first), encoding: .utf8), "<h1>Independent lesson</h1>")
        let backup = try reopened.exportBackup()
        try reopened.setTextEdit(for: first.key, field: "heading", text: nil)
        XCTAssertTrue(try store().textEdits(for: first.key).isEmpty)
        _ = try reopened.restoreBackup(backup)
        XCTAssertEqual(try store().textEdits(for: first.key)["heading"], "A clearer explanation")
    }
    func testImportedLessonSurvivesRemovalOfAuthoringFolder() throws {
        let collection = try store()
        let source = try package()
        let lesson = try collection.importLesson(from: source)
        try FileManager.default.removeItem(at: source)
        let reopened = try store()
        XCTAssertEqual(try reopened.lessons().map(\.title), ["Web server"])
        XCTAssertEqual(try String(contentsOf: reopened.resource(for: lesson), encoding: .utf8), "<h1>Independent lesson</h1>")
    }
    func testInvalidEntryCannotEnterCollection() throws {
        let collection = try store()
        let source = try package(entry: "../outside.html")
        XCTAssertThrowsError(try collection.importLesson(from: source))
        XCTAssertTrue(try collection.lessons().isEmpty)
    }
    func testUnderstandingIsSharedAcrossEditionsAndSurvivesReopening() throws {
        let collection = try store()
        let first = try collection.importLesson(from: package())
        let second = try collection.importLesson(from: package(version: "2"))
        XCTAssertFalse(collection.isUnderstood(first.concepts[0].id))
        try collection.setUnderstood(first.concepts[0].id, true)
        let reopened = try store()
        XCTAssertTrue(reopened.isUnderstood(second.concepts[0].id))
        try reopened.setUnderstood(second.concepts[0].id, false)
        XCTAssertFalse(try store().isUnderstood(first.concepts[0].id))
        XCTAssertEqual(try reopened.lessons().map(\.version), ["1", "2"])
        XCTAssertThrowsError(try reopened.importLesson(from: package()))
    }
    func testLibraryChoicesPersistWithoutChangingSavedLessonsOrNewEditionApproval() throws {
        let collection = try store()
        let first = try collection.importLesson(from: package())
        try collection.updateLibraryItem(first.key, description: "Keep this example", tags: ["network"], approved: true)
        let second = try collection.importLesson(from: package(version: "2"))
        let reopened = try store()
        XCTAssertEqual(reopened.libraryItem(first.key).description, "Keep this example")
        XCTAssertEqual(reopened.libraryItem(first.key).tags, ["network"])
        XCTAssertTrue(reopened.libraryItem(first.key).approved)
        XCTAssertFalse(reopened.libraryItem(second.key).approved)
        try reopened.updateLibraryItem(first.key, description: "Keep this example", tags: [], approved: false)
        XCTAssertEqual(try reopened.lessons().count, 2)
        XCTAssertEqual(try String(contentsOf: reopened.resource(for: first), encoding: .utf8), "<h1>Independent lesson</h1>")
    }
    func testBackupPreviewDoesNotMutateAndRestoreCreatesRecoverableSafetyCopy() throws {
        let collection = try store()
        try collection.setUnderstood("request", true)
        try collection.updateLibraryItem("A01@1", description: "Comparison", tags: ["scale"], approved: true)
        let backup = try collection.exportBackup()
        try collection.setUnderstood("request", false)
        try collection.setUnderstood("socket", true)
        let preview = try collection.previewBackup(backup)
        XCTAssertEqual(preview.understoodCount, 1)
        XCTAssertFalse(collection.isUnderstood("request"))
        let safety = try collection.restoreBackup(backup)
        XCTAssertTrue(try store().isUnderstood("request"))
        XCTAssertFalse(collection.isUnderstood("socket"))
        XCTAssertTrue(collection.libraryItem("A01@1").approved)
        _ = try collection.restoreBackup(Data(contentsOf: safety))
        XCTAssertTrue(collection.isUnderstood("socket"))
        XCTAssertFalse(collection.isUnderstood("request"))
    }
    func testChangedConceptCannotReuseAnExistingUnderstandingMark() throws {
        let collection = try store()
        _ = try collection.importLesson(from: package())
        try collection.setUnderstood("request", true)
        let changed = try package(version: "2")
        let manifest = changed.appendingPathComponent("lesson.json")
        let text = try String(contentsOf: manifest, encoding: .utf8).replacingOccurrences(of: "A request asks a server for a resource", with: "A different idea")
        try Data(text.utf8).write(to: manifest)
        XCTAssertThrowsError(try collection.importLesson(from: changed))
        XCTAssertEqual(try collection.lessons().count, 1)
    }
    func testConceptListApprovalIsExplicitAndPerEdition() throws {
        let collection = try store()
        let lesson = try collection.importLesson(from: package())
        XCTAssertFalse(collection.conceptsApproved(for: lesson.key))
        try collection.approveConcepts(for: lesson.key)
        XCTAssertTrue(try store().conceptsApproved(for: lesson.key))
        let second = try collection.importLesson(from: package(version: "2"))
        XCTAssertFalse(collection.conceptsApproved(for: second.key))
        XCTAssertFalse(collection.isUnderstood("request"))
    }
    func testOpeningLessonRecordsVisitWithoutClaimingUnderstanding() throws {
        let collection = try store()
        let lesson = try collection.importLesson(from: package())
        try collection.recordVisit(lesson.key)
        XCTAssertNotNil(try store().lastVisited(lesson.key))
        XCTAssertFalse(collection.isUnderstood("request"))
    }
    func testLibraryDefaultsApplyOnlyBeforeFirstEdit() throws {
        let collection = try store()
        XCTAssertEqual(collection.libraryItem("A01", defaultDescription: "Compare", defaultTags: ["scale"]).tags, ["scale"])
        try collection.updateLibraryItem("A01", description: "", tags: [], approved: false)
        let saved = try store().libraryItem("A01", defaultDescription: "Compare", defaultTags: ["scale"])
        XCTAssertEqual(saved.description, "")
        XCTAssertEqual(saved.tags, [])
    }
    func testFinderMetadataDoesNotPreventReopeningCollection() throws {
        let collection = try store()
        _ = try collection.importLesson(from: package())
        try Data("Finder metadata".utf8).write(to: temporary.appendingPathComponent("collection/lessons/.DS_Store"))
        XCTAssertEqual(try store().lessons().map(\.title), ["Web server"])
    }
    func testDirectoryNamedHTMLIsNotAnOpenableLesson() throws {
        let collection = try store()
        let source = try package()
        let entry = source.appendingPathComponent("index.html")
        try FileManager.default.removeItem(at: entry)
        try FileManager.default.createDirectory(at: entry, withIntermediateDirectories: true)
        XCTAssertThrowsError(try collection.importLesson(from: source))
        XCTAssertTrue(try collection.lessons().isEmpty)
    }
    func testExperimentPlacementPersistsAndLinkedAnimationsFollowTheirLesson() throws {
        let collection = try store()
        let lesson = try collection.importLesson(from: package())
        XCTAssertTrue(collection.isExperiment(lesson.key))
        XCTAssertTrue(collection.animationIsExperiment(sourceLessonKeys: [lesson.key]))
        try collection.setExperiment(lesson.key, false)
        let reopened = try store()
        XCTAssertFalse(reopened.isExperiment(lesson.key))
        XCTAssertFalse(reopened.animationIsExperiment(sourceLessonKeys: [lesson.key]))
        try reopened.setExperiment(lesson.key, true)
        XCTAssertTrue(reopened.animationIsExperiment(sourceLessonKeys: [lesson.key]))
        XCTAssertEqual(try reopened.lessons().count, 1)
    }
}
