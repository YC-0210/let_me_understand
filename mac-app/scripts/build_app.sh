#!/bin/bash
set -euo pipefail
APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-$APP_ROOT/dist/Let Me Understand.app}"
swift build --package-path "$APP_ROOT" -c release
mkdir -p "$OUTPUT/Contents/MacOS" "$OUTPUT/Contents/Resources"
cp "$APP_ROOT/.build/release/LearningCollection" "$OUTPUT/Contents/MacOS/LearningCollection"
# Only disposable build resources are replaced; collection history is elsewhere.
rm -rf "$OUTPUT/Contents/Resources/Seeds"
python3 "$APP_ROOT/scripts/package_lessons.py" "$OUTPUT/Contents/Resources/Seeds"
cat > "$OUTPUT/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>LearningCollection</string>
<key>CFBundleIdentifier</key><string>com.letmeunderstand.collection</string>
<key>CFBundleName</key><string>Let Me Understand</string>
<key>CFBundleDisplayName</key><string>Let Me Understand</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>CFBundleShortVersionString</key><string>0.1.0</string>
<key>CFBundleVersion</key><string>1</string>
<key>LSMinimumSystemVersion</key><string>14.0</string>
<key>NSHighResolutionCapable</key><true/>
</dict></plist>
PLIST
xattr -cr "$OUTPUT"
codesign --force --deep --sign - "$OUTPUT"
codesign --verify --deep --strict "$OUTPUT"
printf '%s\n' "$OUTPUT"
