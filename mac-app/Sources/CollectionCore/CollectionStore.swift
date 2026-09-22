import Foundation

public struct Concept: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let title: String
    public let source: String
}
public struct Lesson: Codable, Equatable, Sendable, Identifiable {
    public let id: String
    public let title: String
    public let version: String
    public let entry: String
    public let route: String
    public let concepts: [Concept]
    public var key: String { id + "@" + version }
}
public struct VisualizationFolder: Identifiable {
    public let id: String
    public let editions: [Lesson]
    public var title: String { editions.first?.title ?? id }
    public static func grouping(_ lessons: [Lesson]) -> [VisualizationFolder] {
        Dictionary(grouping: lessons, by: \.id).map { id, editions in
            VisualizationFolder(id: id, editions: editions.sorted {
                $0.version.compare($1.version, options: .numeric) == .orderedDescending
            })
        }.sorted { $0.id < $1.id }
    }
}
public final class CollectionStore {
    public let root: URL
    private var state = History()
    private let files = FileManager.default
    public init(root: URL) throws {
        self.root = root
        let stateURL = root.appendingPathComponent("history.json")
        if FileManager.default.fileExists(atPath: stateURL.path) {
            state = try JSONDecoder().decode(History.self, from: Data(contentsOf: stateURL))
        }
        try files.createDirectory(at: root.appendingPathComponent("lessons"), withIntermediateDirectories: true)
    }
    public func importLesson(from package: URL) throws -> Lesson {
        let lesson = try JSONDecoder().decode(Lesson.self, from: Data(contentsOf: package.appendingPathComponent("lesson.json")))
        try validate(lesson, in: package)
        let existing = try lessons().flatMap(\.concepts)
        for concept in lesson.concepts {
            if existing.contains(where: { $0.id == concept.id && $0 != concept }) { throw CollectionError.conflictingConcept }
        }
        let staging = root.appendingPathComponent(UUID().uuidString)
        defer { try? files.removeItem(at: staging) }
        try files.copyItem(at: package, to: staging)
        try files.moveItem(at: staging, to: directory(for: lesson))
        return lesson
    }
    public func lessons() throws -> [Lesson] {
        try files.contentsOfDirectory(at: root.appendingPathComponent("lessons"), includingPropertiesForKeys: nil, options: [.skipsHiddenFiles]).map {
            try JSONDecoder().decode(Lesson.self, from: Data(contentsOf: $0.appendingPathComponent("lesson.json")))
        }.sorted { $0.key < $1.key }
    }
    public func resource(for lesson: Lesson) throws -> URL { directory(for: lesson).appendingPathComponent(lesson.entry) }
    public func editionNote(for lesson: Lesson) -> String {
        state.editionNotes?[lesson.key] ?? state.visualizationNotes?[lesson.id] ?? ""
    }
    public func setEditionNote(for lesson: Lesson, text: String) throws {
        var next = state
        if next.editionNotes == nil { next.editionNotes = [:] }
        next.editionNotes?[lesson.key] = text
        try save(next)
    }
    public func visualizationNote(for id: String) -> String { state.visualizationNotes?[id] ?? "" }
    public func setVisualizationNote(for id: String, text: String) throws {
        var next = state
        if next.visualizationNotes == nil { next.visualizationNotes = [:] }
        next.visualizationNotes?[id] = text.isEmpty ? nil : text
        try save(next)
    }
    public func textEdits(for lessonKey: String) -> [String: String] {
        state.textEdits?[lessonKey] ?? [:]
    }
    public func setTextEdit(for lessonKey: String, field: String, text: String?) throws {
        var next = state
        if next.textEdits == nil { next.textEdits = [:] }
        var edits = next.textEdits?[lessonKey] ?? [:]
        edits[field] = text
        next.textEdits?[lessonKey] = edits.isEmpty ? nil : edits
        try save(next)
    }
    public func isUnderstood(_ concept: String) -> Bool { state.understood.contains(concept) }
    public func setUnderstood(_ concept: String, _ understood: Bool) throws {
        var next = state
        if understood { next.understood.insert(concept) } else { next.understood.remove(concept) }
        try save(next)
    }
    private func save(_ next: History) throws {
        try JSONEncoder().encode(next).write(to: root.appendingPathComponent("history.json"), options: .atomic)
        state = next
    }
    public func libraryItem(_ key: String, defaultDescription: String = "", defaultTags: [String] = []) -> LibraryChoice { state.library[key] ?? LibraryChoice(description: defaultDescription, tags: defaultTags, approved: false) }
    public func updateLibraryItem(_ key: String, description: String, tags: [String], approved: Bool) throws {
        var next = state
        next.library[key] = LibraryChoice(description: description, tags: tags, approved: approved)
        try save(next)
    }
    public func exportBackup() throws -> Data { try JSONEncoder().encode(Backup(format: 1, history: state)) }
    public func previewBackup(_ data: Data) throws -> BackupPreview {
        let backup = try decodeBackup(data)
        return BackupPreview(understoodCount: backup.history.understood.count, libraryCount: backup.history.library.count)
    }
    public func restoreBackup(_ data: Data) throws -> URL {
        let backup = try decodeBackup(data)
        let safetyDirectory = root.appendingPathComponent("backups")
        try files.createDirectory(at: safetyDirectory, withIntermediateDirectories: true)
        let safety = safetyDirectory.appendingPathComponent("before-restore-" + UUID().uuidString + ".json")
        try exportBackup().write(to: safety, options: .atomic)
        try save(backup.history)
        return safety
    }
    private func decodeBackup(_ data: Data) throws -> Backup {
        guard let backup = try? JSONDecoder().decode(Backup.self, from: data), backup.format == 1 else { throw CollectionError.invalidBackup }
        return backup
    }
    public func conceptsApproved(for key: String) -> Bool { state.approvedConceptLists.contains(key) }
    public func approveConcepts(for key: String) throws {
        var next = state
        next.approvedConceptLists.insert(key)
        try save(next)
    }
    public func lastVisited(_ key: String) -> Date? { state.visits[key] }
    public func recordVisit(_ key: String) throws {
        var next = state
        next.visits[key] = Date()
        try save(next)
    }
    public func isExperiment(_ key: String) -> Bool { state.experiments?[key] ?? true }
    public func setExperiment(_ key: String, _ experiment: Bool) throws {
        var next = state
        if next.experiments == nil { next.experiments = [:] }
        next.experiments?[key] = experiment
        try save(next)
    }
    public func animationIsExperiment(sourceLessonKeys: [String]) -> Bool {
        sourceLessonKeys.isEmpty || sourceLessonKeys.contains(where: isExperiment)
    }
    private func validate(_ lesson: Lesson, in package: URL) throws {
        let safe = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.")
        guard [lesson.id, lesson.version].allSatisfy({ !$0.isEmpty && $0 != "." && $0 != ".." && $0.unicodeScalars.allSatisfy(safe.contains) }),
              !lesson.title.isEmpty, !lesson.entry.hasPrefix("/"),
              !lesson.entry.split(separator: "/").contains(".."),
              lesson.entry.hasSuffix(".html"),
              (try? package.appendingPathComponent(lesson.entry).resourceValues(forKeys: [.isRegularFileKey]).isRegularFile) == true,
              Set(lesson.concepts.map(\.id)).count == lesson.concepts.count,
              lesson.concepts.allSatisfy({ !$0.id.isEmpty && !$0.title.isEmpty && URL(string: $0.source)?.scheme == "https" })
        else { throw CollectionError.invalidPackage }
        let enumerator = files.enumerator(at: package, includingPropertiesForKeys: [.isSymbolicLinkKey])
        while let url = enumerator?.nextObject() as? URL {
            if try url.resourceValues(forKeys: [.isSymbolicLinkKey]).isSymbolicLink == true { throw CollectionError.invalidPackage }
        }
    }
    private func directory(for lesson: Lesson) -> URL { root.appendingPathComponent("lessons").appendingPathComponent(lesson.key) }
}

public enum CollectionError: LocalizedError {
    case invalidPackage, conflictingConcept, invalidBackup
    public var errorDescription: String? {
        switch self {
        case .invalidPackage: "This lesson package is incomplete or contains invalid paths or concepts."
        case .conflictingConcept: "This concept ID already describes a different idea. Give the changed concept a new ID."
        case .invalidBackup: "This backup is invalid or uses an unsupported format."
        }
    }
}

private struct History: Codable {
    var editionNotes: [String: String]? = nil
    var visualizationNotes: [String: String]? = nil
    var textEdits: [String: [String: String]]? = nil
    var experiments: [String: Bool]? = nil
    var visits: [String: Date] = [:]
    var approvedConceptLists: Set<String> = []
    var understood: Set<String> = []
    var library: [String: LibraryChoice] = [:]
}

public struct LibraryChoice: Codable, Sendable {
    public var description: String = ""
    public var tags: [String] = []
    public var approved: Bool = false
}

public struct BackupPreview: Sendable {
    public let understoodCount: Int
    public let libraryCount: Int
}

private struct Backup: Codable {
    let format: Int
    let history: History
}
