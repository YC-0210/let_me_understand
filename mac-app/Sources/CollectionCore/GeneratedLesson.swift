import Foundation

public struct GeneratedArt: Codable, Sendable {
    public struct Page: Codable, Sendable { public var id: String; public var svg: String }
    public var pages: [Page]
    public func validate(for draft: TeachingDraft, settings: VisualSettings = VisualSettings()) throws {
        guard pages.map(\.id) == draft.pages.map(\.id) else { throw AgentFailure.invalidArt }
        try settings.validate()
        for page in pages { try SVGCheck.validate(page.svg, settings: settings) }
    }
}
private final class SVGCheck: NSObject, XMLParserDelegate {
    let settings: VisualSettings
    init(settings: VisualSettings) { self.settings = settings }
    var valid = true
    var root = false
    static let tags: Set<String> = ["svg","g","path","rect","circle","ellipse","line","polyline","polygon","text","tspan","defs","marker","title","desc","animate","animateTransform"]
    static let attributes: Set<String> = ["xmlns","viewBox","id","x","y","x1","x2","y1","y2","cx","cy","r","rx","ry","width","height","d","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","stroke-dasharray","opacity","fill-opacity","stroke-opacity","transform","text-anchor","dominant-baseline","font-size","font-family","font-weight","dx","dy","markerWidth","markerHeight","refX","refY","orient","markerUnits","marker-end","marker-start","attributeName","type","from","to","values","keyTimes","dur","begin","repeatCount","calcMode"]
    static func validate(_ svg: String, settings: VisualSettings) throws {
        guard svg.utf8.count < 40000, !svg.contains("<!"), !svg.contains("<?") else { throw AgentFailure.invalidArt }
        let delegate = SVGCheck(settings: settings); let parser = XMLParser(data: Data(svg.utf8)); parser.delegate = delegate
        parser.shouldResolveExternalEntities = false
        guard parser.parse(), delegate.valid, delegate.root else { throw AgentFailure.invalidArt }
    }
    func parser(_ parser: XMLParser, didStartElement name: String, namespaceURI: String?, qualifiedName: String?, attributes: [String: String]) {
        if !root { valid = name == "svg" && attributes["viewBox"] == settings.viewBox; root = true }
        if !Self.tags.contains(name) { valid = false }
        for (key,value) in attributes {
            if !Self.attributes.contains(key) { valid = false }
            if key != "xmlns" && (value.contains("://") || value.lowercased().contains("javascript:") || value.contains("&")) { valid = false }
            if value.contains("url(") && !(key == "marker-end" || key == "marker-start") { valid = false }
            if value.contains("url(") && value.range(of: "^url\\(#[a-zA-Z0-9_-]+\\)$", options: .regularExpression) == nil { valid = false }
            if key == "attributeName" && !["opacity","fill-opacity","stroke-opacity","x","y","cx","cy","x1","x2","y1","y2","stroke-dashoffset","transform"].contains(value) { valid = false }
        }
        if name == "animate" || name == "animateTransform" {
            if attributes["dur"] != "\(settings.duration)s" || attributes["begin"] != "0s" || attributes["repeatCount"] == "indefinite" { valid = false }
        }
    }
}
public enum GeneratedLesson {
    public static func write(draft: TeachingDraft, art: GeneratedArt, to directory: URL, id: String, version: String, settings: VisualSettings = VisualSettings()) throws {
        try draft.validate(); try art.validate(for: draft, settings: settings)
        guard !FileManager.default.fileExists(atPath: directory.path) else { throw AgentFailure.invalidArt }
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        let manifest: [String: Any] = ["id":id,"title":draft.title,"version":version,"entry":"index.html","route":"","concepts":[]]
        try JSONSerialization.data(withJSONObject: manifest).write(to: directory.appendingPathComponent("lesson.json"))
        let encoder = JSONEncoder()
        let content = String(decoding: try encoder.encode(draft), as: UTF8.self).replacingOccurrences(of: "<", with: "\\u003c")
        let drawings = String(decoding: try encoder.encode(art), as: UTF8.self).replacingOccurrences(of: "<", with: "\\u003c")
        var html = """
        <!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">
        <title>Learn with Wink</title><style>
        :root{color-scheme:dark;font:16px -apple-system,BlinkMacSystemFont,sans-serif;background:#101113;color:#f1f1f4}*{box-sizing:border-box}body{margin:0}main{max-width:760px;margin:auto;padding:28px}header,footer,.transport{display:flex;align-items:center;justify-content:space-between;gap:14px}header{font-size:13px;color:#aaaab5}h1{font-size:22px;font-weight:600}#art svg{width:100%;height:auto;max-height:340px}.guide{display:flex;gap:16px;border-top:1px solid #292a30;padding-top:20px;margin-top:16px}.wink{flex:0 0 38px;width:38px;height:38px;display:block}#words{margin:0;line-height:1.65;white-space:pre-wrap}.transport{justify-content:flex-start;margin-top:24px}button{font:inherit;font-size:13px;border:1px solid #34343a;border-radius:6px;background:#191a1e;color:#eee;padding:9px 14px;cursor:pointer}button:disabled{opacity:.4}button:focus-visible{outline:2px solid #b9adff}footer{margin-top:22px;padding-top:18px;border-top:1px solid #292a30}#next{background:#5e6ad2}details{margin-top:24px;color:#999;font-size:12px}a{color:#b9adff}li{margin:8px 0}#time{color:#999;font-size:12px}
        </style></head><body><main><header><span id="name"></span><span id="position"></span></header><h1 id="heading">Follow the idea</h1><div id="art"></div><section class="guide" aria-label="Wink’s guidance"><svg class="wink" viewBox="0 0 100 100" role="img" aria-label="Wink"><circle cx="50" cy="50" r="46" fill="#F5F0FF"/><ellipse cx="38" cy="45" rx="6" ry="9" fill="#4B3869"/><path d="M59 43 Q67 55 75 43" fill="none" stroke="#4B3869" stroke-width="4" stroke-linecap="round"/></svg><p id="words"></p></section><div class="transport"><button id="play">Pause</button><button id="replay">Replay</button><span id="time"></span></div><footer><button id="back">← Back</button><button id="next">Continue →</button></footer><details><summary>Sources</summary><ul id="sources"></ul></details></main>
        <script>const lesson=\(content), art=\(drawings);let i=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const $=id=>document.getElementById(id);let playing=false;function load(){document.title=lesson.title;$('name').textContent=lesson.title;$('position').textContent=(i+1)+' / '+lesson.pages.length;$('words').textContent=lesson.pages[i].text;$('art').innerHTML=art.pages[i].svg;const s=$('art').querySelector('svg');s.setCurrentTime(reduced?6:0);playing=!reduced;playing?s.unpauseAnimations():s.pauseAnimations();$('play').textContent=playing?'Pause':'Play';$('back').disabled=i===0;$('next').textContent=i===lesson.pages.length-1?'Back to beginning ↺':'Continue →';} $('next').onclick=()=>{i=(i+1)%lesson.pages.length;load()};$('back').onclick=()=>{if(i>0){i--;load()}};$('play').onclick=()=>{const s=$('art').querySelector('svg');if(s.getCurrentTime()>=6)s.setCurrentTime(0);playing=!playing;playing?s.unpauseAnimations():s.pauseAnimations();$('play').textContent=playing?'Pause':'Play'};$('replay').onclick=()=>{const s=$('art').querySelector('svg');s.setCurrentTime(reduced?6:0);playing=!reduced;playing?s.unpauseAnimations():s.pauseAnimations()};setInterval(()=>{const s=$('art').querySelector('svg');if(!s)return;if(s.getCurrentTime()>=6){s.setCurrentTime(6);s.pauseAnimations();playing=false;$('play').textContent='Play'}$('time').textContent=Math.min(6,Math.floor(s.getCurrentTime()))+' / 6 s'},100);for(const source of lesson.sources){const li=document.createElement('li'),a=document.createElement('a');a.textContent=source.title;a.href=source.url;li.append(a);$('sources').append(li)}load();</script></body></html>
        """
        let css = """
        <style>:root{background:\(settings.background);color:\(settings.text)}main{max-width:\(settings.diagramWidth + 56)px}#art svg{max-height:none;width:100%;aspect-ratio:\(settings.diagramWidth)/\(settings.diagramHeight)}#words{font-size:\(settings.textSize)px}button{background:\(settings.surface);color:\(settings.text);border-radius:\(settings.cornerRadius)px}#next{background:\(settings.accent)}a{color:\(settings.accent)}</style>
        """
        html = html.replacingOccurrences(of: "</head>", with: css + "</head>")
        html = html.replacingOccurrences(of: "reduced?6:0", with: "reduced?\(settings.duration):0")
            .replacingOccurrences(of: "getCurrentTime()>=6", with: "getCurrentTime()>=\(settings.duration)")
            .replacingOccurrences(of: "setCurrentTime(6)", with: "setCurrentTime(\(settings.duration))")
            .replacingOccurrences(of: "Math.min(6,", with: "Math.min(\(settings.duration),")
            .replacingOccurrences(of: "+' / 6 s'", with: "+' / \(settings.duration) s'")
        try encoder.encode(settings).write(to: directory.appendingPathComponent("visual-settings.json"))
        try Data(html.utf8).write(to: directory.appendingPathComponent("index.html"))
        try encoder.encode(draft).write(to: directory.appendingPathComponent("teaching.json"))
    }
}
