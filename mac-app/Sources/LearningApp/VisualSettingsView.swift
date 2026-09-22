import SwiftUI
import CollectionCore

struct VisualSettingsView: View {
    @Binding var settings: VisualSettings
    @State private var playing = true
    @State private var began = Date()
    @State private var frozen: Double = 0
    @Environment(\.accessibilityReduceMotion) private var reduced
    private func color(_ value: String) -> Color {
        WorkspaceStyle.color(UInt32(value.dropFirst(), radix: 16) ?? 0)
    }
    private func colorBinding(_ path: WritableKeyPath<VisualSettings, String>) -> Binding<Color> {
        Binding(get: { color(settings[keyPath: path]) }, set: { value in
            guard let rgb = NSColor(value).usingColorSpace(.sRGB) else { return }
            settings[keyPath: path] = String(format: "#%02X%02X%02X", Int((rgb.redComponent * 255).rounded()), Int((rgb.greenComponent * 255).rounded()), Int((rgb.blueComponent * 255).rounded()))
        })
    }
    var body: some View {
        GeometryReader { available in
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Visualization handoff").font(.title3)
                Spacer()
                Button("Linear palette") { let preset = VisualSettings(); settings.background = preset.background; settings.surface = preset.surface; settings.text = preset.text; settings.accent = preset.accent }
            }
            HStack(alignment: .top, spacing: 24) {
                VStack(alignment: .leading, spacing: 14) {
                    Text("LIVE PREVIEW").font(.system(size: 10, weight: .medium)).foregroundStyle(WorkspaceStyle.subtle)
                    VStack(spacing: 14) {
                        TimelineView(.animation(minimumInterval: 1.0 / 30, paused: !playing || reduced)) { context in
                            let elapsed = reduced ? Double(settings.duration) : min(Double(settings.duration), playing ? frozen + context.date.timeIntervalSince(began) : frozen)
                            Canvas { ctx, size in
                                let scale = size.width / Double(settings.diagramWidth)
                                let left = size.width * 0.2, right = size.width * 0.8, y = size.height * 0.47
                                let node: CGFloat = 52 * scale
                                var line = Path(); line.move(to: CGPoint(x: left + node * 0.65, y: y)); line.addLine(to: CGPoint(x: right - node * 0.65, y: y))
                                ctx.stroke(line, with: .color(color(settings.text).opacity(0.25)), lineWidth: max(1,2 * scale))
                                for (x, symbol, label) in [(left,"person","You"),(right,"building.columns","Bank")] {
                                    let box = CGRect(x: x - node/2, y: y - node/2, width: node, height: node)
                                    ctx.fill(Path(roundedRect: box, cornerRadius: CGFloat(settings.cornerRadius) * scale), with: .color(color(settings.surface)))
                                    ctx.draw(Text(Image(systemName: symbol)).font(.system(size: 26 * scale)).foregroundColor(color(settings.text)), at: CGPoint(x: x,y: y))
                                    ctx.draw(Text(label).font(.system(size: CGFloat(settings.labelSize) * scale)).foregroundColor(color(settings.text)), at: CGPoint(x: x,y: y + node * 0.85))
                                }
                                let start = left + node * 0.85, end = right - node * 0.85
                                let x = min(end, start + CGFloat(elapsed) * CGFloat(settings.tokenSpeed) * scale)
                                let diameter = CGFloat(settings.tokenSize) * scale
                                ctx.fill(Path(ellipseIn: CGRect(x: x - diameter/2, y: y - diameter/2, width: diameter, height: diameter)), with: .color(color(settings.accent)))
                            }.aspectRatio(CGFloat(settings.diagramWidth) / CGFloat(settings.diagramHeight), contentMode: .fit)
                        }.frame(maxHeight: 280)
                        HStack(alignment: .top, spacing: 12) {
                            WinkMark()
                            Text("Follow your payment. What changes when it reaches the bank?").font(.system(size: CGFloat(settings.textSize))).foregroundStyle(color(settings.text)).fixedSize(horizontal: false, vertical: true)
                        }
                        HStack {
                            Button(playing ? "Pause" : "Play") { if playing { frozen = min(Double(settings.duration), frozen + Date().timeIntervalSince(began)); playing = false } else { if frozen >= Double(settings.duration) { frozen = 0 }; began = Date(); playing = true } }
                            Button("Replay") { frozen = 0; began = Date(); playing = true }
                            Spacer()
                            Text("\(settings.duration) s").font(.caption).foregroundStyle(color(settings.text).opacity(0.65))
                        }
                    }.padding(18).background(color(settings.background), in: RoundedRectangle(cornerRadius: CGFloat(settings.cornerRadius))).overlay(RoundedRectangle(cornerRadius: CGFloat(settings.cornerRadius)).strokeBorder(WorkspaceStyle.strongLine))
                    Text("\(settings.diagramWidth) × \(settings.diagramHeight) px · Scales to fit this preview").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
                    Text("Saved automatically. Used for new visualizations; existing lessons stay as they are.").font(.caption).foregroundStyle(WorkspaceStyle.subtle)
                    Spacer(minLength: 0)
                }.frame(maxWidth: .infinity)
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Colors").font(.system(size: 12, weight: .semibold))
                        swatch("Background", \.background)
                        swatch("Surface", \.surface)
                        swatch("Text", \.text)
                        swatch("Accent", \.accent)
                        WorkspaceRule()
                        Text("Size & type").font(.system(size: 12, weight: .semibold))
                        VisualNumber(label: "Width", value: $settings.diagramWidth, range: 320...1000, unit: "px", step: 20)
                        VisualNumber(label: "Height", value: $settings.diagramHeight, range: 180...600, unit: "px", step: 20)
                        VisualNumber(label: "Wink text", value: $settings.textSize, range: 12...28, unit: "px")
                        VisualNumber(label: "Diagram labels", value: $settings.labelSize, range: 12...32, unit: "px")
                        VisualNumber(label: "Corners", value: $settings.cornerRadius, range: 0...24, unit: "px")
                        WorkspaceRule()
                        Text("Motion").font(.system(size: 12, weight: .semibold))
                        VisualNumber(label: "Duration", value: $settings.duration, range: 2...20, unit: "s")
                        VisualNumber(label: "Token size", value: $settings.tokenSize, range: 6...32, unit: "px")
                        VisualNumber(label: "Token speed", value: $settings.tokenSpeed, range: 10...150, unit: "px/s", step: 5)
                    }.padding(.trailing, 6)
                }.frame(width: 250)
            }
        }.padding(24).frame(width: available.size.width, height: available.size.height, alignment: .topLeading).onChange(of: settings) { _, _ in frozen = 0; began = Date() }
    }
    }
    private func swatch(_ title: String, _ path: WritableKeyPath<VisualSettings, String>) -> some View {
        HStack { ColorPicker(title, selection: colorBinding(path), supportsOpacity: false); Text(settings[keyPath: path]).font(.system(size: 10, design: .monospaced)).foregroundStyle(WorkspaceStyle.subtle) }
    }
}
private struct VisualNumber: View {
    let label: String
    @Binding var value: Int
    let range: ClosedRange<Int>
    let unit: String
    var step = 1
    @State private var entry = ""
    @FocusState private var focused: Bool
    var body: some View {
        HStack(spacing: 5) {
            Text(label).font(.system(size: 12)); Spacer()
            TextField(label, text: $entry).textFieldStyle(.roundedBorder).multilineTextAlignment(.trailing).frame(width: 50).focused($focused).onSubmit(commit)
            Text(unit).font(.system(size: 10)).foregroundStyle(WorkspaceStyle.subtle).frame(width: 24, alignment: .leading)
            Stepper(label, value: $value, in: range, step: step).labelsHidden()
        }.onAppear { entry = String(value) }.onChange(of: value) { _, next in entry = String(next) }.onChange(of: focused) { _, next in if !next { commit() } }
    }
    private func commit() { if let number = Int(entry) { value = min(range.upperBound,max(range.lowerBound,number)) }; entry = String(value) }
}
