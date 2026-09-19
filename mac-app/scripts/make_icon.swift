// The accepted Part 3 Wink: same circle, eye and curved wink as intuition.js.
import AppKit

let destination = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: destination, withIntermediateDirectories: true)
func color(_ red: CGFloat, _ green: CGFloat, _ blue: CGFloat) -> NSColor {
    NSColor(srgbRed: red / 255, green: green / 255, blue: blue / 255, alpha: 1)
}
func render(size: Int, name: String) throws {
    let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    let scale = CGFloat(size) / 100
    let transform = NSAffineTransform()
    transform.scaleX(by: scale, yBy: scale)
    transform.concat()
    // A quiet violet Mac icon tile frames Wink without changing the character.
    color(36, 29, 52).setFill()
    NSBezierPath(roundedRect: NSRect(x: 5, y: 5, width: 90, height: 90), xRadius: 20, yRadius: 20).fill()
    let mascot = NSAffineTransform()
    mascot.translateX(by: 13, yBy: 13)
    mascot.scale(by: 0.74)
    mascot.concat()
    color(245, 240, 255).setFill()
    NSBezierPath(ovalIn: NSRect(x: 4, y: 4, width: 92, height: 92)).fill()
    color(75, 56, 105).setFill()
    NSBezierPath(ovalIn: NSRect(x: 32, y: 46, width: 12, height: 18)).fill()
    color(75, 56, 105).setStroke()
    let wink = NSBezierPath()
    wink.move(to: NSPoint(x: 59, y: 57))
    // Quadratic SVG M59 43 Q67 55 75 43 converted to cubic in flipped coordinates.
    wink.curve(to: NSPoint(x: 75, y: 57), controlPoint1: NSPoint(x: 64.333333, y: 49), controlPoint2: NSPoint(x: 69.666667, y: 49))
    wink.lineWidth = 4
    wink.stroke()
    NSGraphicsContext.restoreGraphicsState()
    try bitmap.representation(using: .png, properties: [:])!.write(to: destination.appendingPathComponent(name))
}
for points in [16, 32, 128, 256, 512] {
    try render(size: points, name: "icon_\(points)x\(points).png")
    try render(size: points * 2, name: "icon_\(points)x\(points)@2x.png")
}
