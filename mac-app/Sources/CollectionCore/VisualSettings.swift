import Foundation

public struct VisualSettings: Codable, Equatable, Sendable {
    public var background = "#101113"
    public var surface = "#191A1E"
    public var text = "#F1F1F4"
    public var accent = "#5E6AD2"
    public var diagramWidth = 600
    public var diagramHeight = 300
    public var textSize = 17
    public var labelSize = 18
    public var cornerRadius = 6
    public var duration = 6
    public var tokenSize = 14
    public var tokenSpeed = 50
    public init() {}
    public var viewBox: String { "0 0 \(diagramWidth) \(diagramHeight)" }
    public func validate() throws {
        guard [background, surface, text, accent].allSatisfy({ $0.range(of: "^#[0-9a-fA-F]{6}$", options: .regularExpression) != nil }),
              (320...1000).contains(diagramWidth), (180...600).contains(diagramHeight),
              (12...28).contains(textSize), (12...32).contains(labelSize), (0...24).contains(cornerRadius),
              (2...20).contains(duration), (6...32).contains(tokenSize), (10...150).contains(tokenSpeed) else { throw VisualSettingsError.invalid }
    }
    public var context: String {
        let encoder = JSONEncoder(); encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let json = (try? encoder.encode(self)).map { String(decoding: $0, as: UTF8.self) } ?? "{}"
        return """
        # Visualization settings
        These settings come directly from the user's visual controls. Dimensions, font sizes and token diameter are in CSS/SVG pixels; duration is seconds; tokenSpeed is pixels per second. Use these values rather than a prose style preset.
        \(json)
        Keep consistent symbols, readable labels, one focal diagram, and no overlaps. Use fixed-size tokens with constant travel speed; cover only the distance supported by the selected duration, then hold. Preserve teaching order and text. No automatic page advance. The shell provides Wink, navigation, playback, and reduced-motion handling. These values apply to newly generated editions, not previously saved lessons.
        """
    }
}
public enum VisualSettingsError: LocalizedError {
    case invalid
    public var errorDescription: String? { "A visual setting is outside its supported range. Check the numeric controls and colors." }
}
