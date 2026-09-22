import SwiftUI

// Same face geometry and colors as the accepted Wink icon; independent of fonts.
struct WinkMark: View {
    var body: some View {
        Canvas { context, size in
            let scale = min(size.width, size.height) / 100
            context.scaleBy(x: scale, y: scale)
            context.fill(Path(ellipseIn: CGRect(x: 4, y: 4, width: 92, height: 92)), with: .color(WorkspaceStyle.color(0xF5F0FF)))
            context.fill(Path(ellipseIn: CGRect(x: 32, y: 36, width: 12, height: 18)), with: .color(WorkspaceStyle.color(0x4B3869)))
            var wink = Path()
            wink.move(to: CGPoint(x: 59, y: 43))
            wink.addQuadCurve(to: CGPoint(x: 75, y: 43), control: CGPoint(x: 67, y: 55))
            context.stroke(wink, with: .color(WorkspaceStyle.color(0x4B3869)), style: StrokeStyle(lineWidth: 4, lineCap: .round))
        }.frame(width: 38, height: 38).accessibilityLabel("Wink")
    }
}
