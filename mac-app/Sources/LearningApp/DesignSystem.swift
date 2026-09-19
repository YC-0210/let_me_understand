import SwiftUI

// DESIGN.md palette; desktop density follows direct observation of Linear for Mac.
enum WorkspaceStyle {
    static let canvas = color(0x010102)
    static let surface = color(0x0f1011)
    static let raised = color(0x141516)
    static let hover = color(0x18191a)
    static let line = color(0x23252a)
    static let strongLine = color(0x34343a)
    static let ink = color(0xf7f8f8)
    static let muted = color(0xd0d6e0)
    static let subtle = color(0x8a8f98)
    static let accent = color(0x5e6ad2)
    static let accentHover = color(0x828fff)
    static func color(_ hex: UInt32) -> Color {
        Color(red: Double((hex >> 16) & 255) / 255, green: Double((hex >> 8) & 255) / 255, blue: Double(hex & 255) / 255)
    }
}

struct WorkspaceButtonStyle: ButtonStyle {
    var primary = false
    @State private var hovered = false
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 12, weight: .medium))
            .foregroundStyle(primary ? .white : WorkspaceStyle.muted)
            .padding(.horizontal, 11).frame(minHeight: 30)
            .background(primary ? (hovered ? WorkspaceStyle.accentHover : WorkspaceStyle.accent) : (hovered ? WorkspaceStyle.hover : WorkspaceStyle.raised), in: RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(primary ? .clear : WorkspaceStyle.line))
            .opacity(configuration.isPressed ? 0.75 : 1)
            .onHover { hovered = $0 }
    }
}

struct WorkspaceRule: View {
    var body: some View { Rectangle().fill(WorkspaceStyle.line).frame(height: 1) }
}

struct WorkspaceBadge: View {
    let text: String
    var body: some View {
        Text(text).font(.system(size: 11)).foregroundStyle(WorkspaceStyle.subtle)
            .padding(.horizontal, 7).padding(.vertical, 3)
            .background(WorkspaceStyle.raised, in: RoundedRectangle(cornerRadius: 5))
            .overlay(RoundedRectangle(cornerRadius: 5).strokeBorder(WorkspaceStyle.line))
    }
}

struct WorkspaceFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration.textFieldStyle(.plain).font(.system(size: 13)).padding(8)
            .background(WorkspaceStyle.raised, in: RoundedRectangle(cornerRadius: 6))
            .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(WorkspaceStyle.strongLine))
    }
}
