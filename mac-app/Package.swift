// swift-tools-version: 6.0
import PackageDescription
let package = Package(name: "LearningCollection", platforms: [.macOS(.v14)], products: [.executable(name: "LearningCollection", targets: ["LearningApp"])], targets: [.target(name: "CollectionCore"), .executableTarget(name: "LearningApp", dependencies: ["CollectionCore"]), .testTarget(name: "CollectionCoreTests", dependencies: ["CollectionCore"])])
