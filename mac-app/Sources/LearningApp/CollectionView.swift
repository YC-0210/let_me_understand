import SwiftUI
import CollectionCore

struct CollectionView: View {
    @ObservedObject var model: AppModel
    @State private var section = "experiments"
    @State private var experimentalAnimations = true
    @State private var showNotes = false
    @State private var hoveredRow: String? = nil

    private var sectionTitle: String { section == "library" ? "Animation library" : section == "experiments" ? "Experiments" : "Collection" }
    private var items: [Lesson] { model.lessons.filter { (model.store?.isExperiment($0.key) ?? true) == (section == "experiments") } }
    private var patterns: [Pattern] { model.patterns.filter { (model.store?.animationIsExperiment(sourceLessonKeys: $0.sourceLessonKeys) ?? true) == experimentalAnimations } }

    var body: some View {
        NavigationSplitView {
            navigation
                .navigationSplitViewColumnWidth(min: 205, ideal: 220, max: 260)
        } detail: {
            VStack(spacing: 0) {
                if let lesson = model.opened, let store = model.store {
                    lessonHeader(lesson)
                    WorkspaceRule()
                    HStack(spacing: 0) {
                        if let resource = try? store.resource(for: lesson) {
                            LessonWebView(file: resource, directory: store.root.appendingPathComponent("lessons").appendingPathComponent(lesson.key), route: lesson.route).id(lesson.key)
                        }
                        if showNotes {
                            Rectangle().fill(WorkspaceStyle.line).frame(width: 1)
                            LessonNotes(model: model, lesson: lesson).frame(width: 280)
                        }
                    }
                } else {
                    collectionHeader
                    WorkspaceRule()
                    if section == "library" { animationList } else { visualizationList }
                }
            }
            .background(WorkspaceStyle.surface)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(WorkspaceStyle.line))
            .padding(.trailing, 8).padding(.bottom, 8)
            .background(WorkspaceStyle.canvas)
        }
        .font(.system(size: 13))
        .foregroundStyle(WorkspaceStyle.ink)
        .tint(WorkspaceStyle.accent)
        .buttonStyle(WorkspaceButtonStyle())
        .toolbarBackground(WorkspaceStyle.canvas, for: .windowToolbar)
        .toolbarBackground(.visible, for: .windowToolbar)
        .alert("Couldn’t complete that action", isPresented: Binding(get: { model.error != nil }, set: { if !$0 { model.error = nil } })) {
            Button("OK") { model.error = nil }
        } message: { Text(model.error ?? "") }
    }

    private var navigation: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 9) {
                if let url = Bundle.main.url(forResource: "Wink", withExtension: "icns"), let icon = NSImage(contentsOf: url) {
                    Image(nsImage: icon).resizable().frame(width: 26, height: 26).accessibilityLabel("Wink")
                }
                Text("Let me understand").font(.system(size: 13, weight: .semibold))
                Spacer(minLength: 0)
            }.padding(.horizontal, 12).padding(.top, 16).padding(.bottom, 26)
            Text("Workspace").font(.system(size: 11, weight: .medium)).foregroundStyle(WorkspaceStyle.subtle).padding(.horizontal, 14).padding(.bottom, 8)
            sidebar("Collection", icon: "square.stack", id: "collection", count: model.lessons.filter { model.store?.isExperiment($0.key) == false }.count)
            sidebar("Experiments", icon: "flask", id: "experiments", count: model.lessons.filter { model.store?.isExperiment($0.key) != false }.count)
            Text("Libraries").font(.system(size: 11, weight: .medium)).foregroundStyle(WorkspaceStyle.subtle).padding(.horizontal, 14).padding(.top, 26).padding(.bottom, 8)
            sidebar("Animations", icon: "play.rectangle", id: "library", count: model.patterns.count)
            Spacer()
            VStack(alignment: .leading, spacing: 10) {
                Menu {
                    Button("Import lesson package…", action: model.importLesson)
                    Divider()
                    Button("Export history & choices…", action: model.exportBackup)
                    Button("Restore history & choices…", action: model.restoreBackup)
                    Button("Show local collection") { if let root = model.store?.root { NSWorkspace.shared.open(root) } }
                } label: {
                    HStack { Image(systemName: "slider.horizontal.3"); Text("Collection tools"); Spacer(); Image(systemName: "chevron.down").font(.system(size: 9)) }
                }.menuStyle(.borderlessButton).foregroundStyle(WorkspaceStyle.muted).tint(WorkspaceStyle.muted)
                Label("Local workspace", systemImage: "internaldrive").font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
            }.padding(14)
        }.padding(.horizontal, 6).frame(maxHeight: .infinity).background(WorkspaceStyle.canvas)
    }

    private var collectionHeader: some View {
        HStack(spacing: 10) {
            Image(systemName: section == "library" ? "play.rectangle" : section == "experiments" ? "flask" : "square.stack").foregroundStyle(WorkspaceStyle.subtle)
            Text(sectionTitle).font(.system(size: 13, weight: .semibold))
            WorkspaceBadge(text: String(section == "library" ? patterns.count : items.count))
            Spacer()
            if section != "library" {
                Button(action: model.importLesson) { Label("Import lesson", systemImage: "plus") }.buttonStyle(WorkspaceButtonStyle(primary: true))
            }
        }.padding(.horizontal, 20).frame(height: 52)
    }

    private var visualizationList: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                HStack {
                    Text(section == "experiments" ? "Explorations in teaching, symbols and motion" : "Your consistent visual system")
                        .font(.system(size: 12)).foregroundStyle(WorkspaceStyle.subtle)
                    Spacer()
                    Label("Available offline", systemImage: "checkmark.circle").font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
                }.padding(.horizontal, 22).padding(.vertical, 18)
                if items.isEmpty {
                    emptyState("No visualizations here yet", detail: "Parts 1–3 are in Experiments. Move a visualization here when its animation, symbols and style fit your chosen system.", icon: "square.stack")
                } else {
                    HStack(spacing: 8) {
                        Text(section == "experiments" ? "Experimental editions" : "Visualizations").fontWeight(.medium)
                        Text(String(items.count)).foregroundStyle(WorkspaceStyle.subtle)
                        Spacer()
                    }.font(.system(size: 12)).padding(.horizontal, 14).frame(height: 34)
                        .background(WorkspaceStyle.hover, in: RoundedRectangle(cornerRadius: 5)).padding(.horizontal, 8)
                    ForEach(items, id: \.key) { lesson in lessonRow(lesson) }
                }
            }
        }
    }

    private var animationList: some View {
        VStack(spacing: 0) {
            HStack(spacing: 6) {
                animationTab("Collection", experiment: false)
                animationTab("Experiments", experiment: true)
                Spacer()
                Text("Linked to their source visualization").font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
            }.padding(.horizontal, 20).frame(height: 46)
            WorkspaceRule()
            ScrollView {
                if patterns.isEmpty {
                    emptyState("No animations here yet", detail: "Animations follow their source visualization. Explore the experimental players in the other tab.", icon: "play.rectangle")
                }
                LazyVStack(spacing: 16) {
                    ForEach(patterns) { pattern in
                        VStack(alignment: .leading, spacing: 0) {
                            HStack(spacing: 10) {
                                Image(systemName: "play.rectangle").foregroundStyle(WorkspaceStyle.subtle)
                                Text(pattern.title).font(.system(size: 13, weight: .medium))
                                Spacer()
                                WorkspaceBadge(text: experimentalAnimations ? "Experiment" : "Collection")
                            }.padding(.horizontal, 16).frame(height: 46)
                            WorkspaceRule()
                            if let seed = Bundle.main.resourceURL?.appendingPathComponent("Seeds") {
                                LessonWebView(file: seed.appendingPathComponent(pattern.preview), directory: seed.appendingPathComponent("previews"), route: "").frame(height: 330)
                            }
                            WorkspaceRule()
                            DisclosureGroup("Properties") {
                                LibraryEditor(model: model, itemKey: pattern.key, initialDescription: pattern.communicates, initialTags: pattern.tags).padding(.top, 12)
                            }.font(.system(size: 12)).foregroundStyle(WorkspaceStyle.subtle).padding(14)
                        }.background(WorkspaceStyle.raised)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(WorkspaceStyle.line))
                    }
                }.padding(20).frame(maxWidth: 1100).frame(maxWidth: .infinity)
            }
        }
    }

    private func animationTab(_ title: String, experiment: Bool) -> some View {
        Button { experimentalAnimations = experiment } label: {
            Text(title).font(.system(size: 12, weight: .medium)).padding(.horizontal, 12).padding(.vertical, 6)
                .foregroundStyle(experimentalAnimations == experiment ? WorkspaceStyle.ink : WorkspaceStyle.subtle)
                .background(experimentalAnimations == experiment ? WorkspaceStyle.line : WorkspaceStyle.raised, in: RoundedRectangle(cornerRadius: 6))
        }.buttonStyle(.plain).accessibilityAddTraits(experimentalAnimations == experiment ? .isSelected : [])
    }

    private func sidebar(_ title: String, icon: String, id: String, count: Int) -> some View {
        Button { section = id; model.opened = nil } label: {
            HStack(spacing: 10) {
                Image(systemName: icon).font(.system(size: 13)).frame(width: 16)
                Text(title)
                Spacer()
                Text(String(count)).font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
            }.font(.system(size: 13, weight: section == id ? .medium : .regular))
                .foregroundStyle(section == id ? WorkspaceStyle.ink : WorkspaceStyle.muted)
                .padding(.horizontal, 10).frame(height: 32)
                .background(section == id ? WorkspaceStyle.line : .clear, in: RoundedRectangle(cornerRadius: 6))
                .contentShape(Rectangle())
        }.buttonStyle(.plain).padding(.vertical, 1)
    }

    private func lessonRow(_ lesson: Lesson) -> some View {
        HStack(spacing: 12) {
            Button { model.open(lesson) } label: {
                HStack(spacing: 14) {
                    Image(systemName: lesson.id == "part1" ? "arrow.left.arrow.right" : lesson.id == "part2" ? "puzzlepiece.extension" : "point.3.connected.trianglepath.dotted")
                        .font(.system(size: 15)).foregroundStyle(WorkspaceStyle.subtle).frame(width: 20)
                    VStack(alignment: .leading, spacing: 7) {
                        Text(lesson.title).font(.system(size: 13, weight: .medium)).foregroundStyle(WorkspaceStyle.ink)
                        HStack(spacing: 8) {
                            Text("Edition \(lesson.version)")
                            Text("·")
                            if model.store?.conceptsApproved(for: lesson.key) == true {
                                let count = lesson.concepts.filter { model.store?.isUnderstood($0.id) == true }.count
                                Text("\(count) / \(lesson.concepts.count) understood")
                            } else { Text("Concepts awaiting review") }
                        }.font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
                    }
                    Spacer(minLength: 8)
                    if let date = model.store?.lastVisited(lesson.key) {
                        Text(date.formatted(.dateTime.month(.abbreviated).day())).font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
                    }
                    Image(systemName: "arrow.up.right").font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
                }.contentShape(Rectangle())
            }.buttonStyle(.plain).accessibilityLabel("Open \(lesson.title)")
            Menu {
                Button(model.store?.isExperiment(lesson.key) == true ? "Move to Collection" : "Move to Experiments") {
                    model.perform { try model.store?.setExperiment(lesson.key, !(model.store?.isExperiment(lesson.key) ?? true)) }
                }
            } label: { Image(systemName: "ellipsis").foregroundStyle(WorkspaceStyle.subtle) }
                .menuStyle(.borderlessButton).tint(WorkspaceStyle.subtle).frame(width: 22).help("Visualization options")
        }.padding(.horizontal, 20).frame(height: 76)
            .background(hoveredRow == lesson.key ? WorkspaceStyle.hover : .clear)
            .overlay(alignment: .bottom) { WorkspaceRule().padding(.leading, 54) }
            .onHover { hoveredRow = $0 ? lesson.key : nil }
    }

    private func lessonHeader(_ lesson: Lesson) -> some View {
        HStack(spacing: 10) {
            Button { model.opened = nil } label: { Image(systemName: "chevron.left") }.help("Back to visualizations")
            Text(sectionTitle).foregroundStyle(WorkspaceStyle.subtle)
            Image(systemName: "chevron.right").font(.system(size: 9)).foregroundStyle(WorkspaceStyle.subtle)
            Text(lesson.title).fontWeight(.medium).lineLimit(1)
            Spacer()
            WorkspaceBadge(text: lesson.version)
            Button { showNotes.toggle() } label: { Image(systemName: "sidebar.right") }.help("Toggle learning notes").accessibilityLabel("Learning notes")
        }.font(.system(size: 12)).padding(.horizontal, 16).frame(height: 52)
    }

    private func emptyState(_ title: String, detail: String, icon: String) -> some View {
        VStack(spacing: 12) {
            Image(systemName: icon).font(.system(size: 26, weight: .light)).foregroundStyle(WorkspaceStyle.subtle)
            Text(title).font(.system(size: 16, weight: .medium))
            Text(detail).font(.system(size: 13)).foregroundStyle(WorkspaceStyle.subtle).multilineTextAlignment(.center).frame(maxWidth: 380)
        }.frame(maxWidth: .infinity).padding(.vertical, 100)
    }
}
