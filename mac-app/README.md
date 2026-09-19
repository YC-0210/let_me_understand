# Let Me Understand for Mac

A personal offline collection for Parts 1–3 and the Money & Banking chapter-two experiment. SwiftUI supplies the collection and learning controls; WebKit displays independent copies of the existing HTML lessons. No server, account, API key, or network is needed to study.

## Build and launch

Requires macOS 14 or newer and Xcode's Swift 6 toolchain. From the repository root:

```sh
mac-app/scripts/build_app.sh
open 'mac-app/dist/Let Me Understand.app'
```

The build produces a locally ad-hoc-signed application. To build directly into your user Applications folder, run `mac-app/scripts/build_app.sh "$HOME/Applications/Let Me Understand.app"`. Keep the installed app outside a cloud-synced folder, whose file-provider metadata can interfere with code-signature validation. This is a personal Mac build, not a notarized distribution release. Generated app binaries and packaged lesson copies are ignored by Git; build them from the committed sources.

## Use

- **Experiments** contains Money & Banking · Natural hierarchy of money and the preserved editions of Parts 1–3, whose animation, symbol and style systems differ. **Collection** is reserved for visualizations you choose for your consistent system. The menu beside each lesson moves it between these sections; its linked animations follow automatically. New imports default to Experiments. Open a lesson and use its original controls; **Learning notes** can be hidden for more room.
- Review each proposed concept list and its linked subject sources, then select **Approve this concept list**. Approval defines the checklist, not your understanding. Tick and untick concepts directly. Unchanged concepts share marks across lessons.
- **Use as a future example** and **Save choices** control eligibility for a particular edition. Every new edition defaults to excluded. Exclusion never removes it from your collection.
- **Animation library** displays fourteen standalone, interactive players directly in the app: extracted Part 1/2 exchanges, A01–A06 patterns, and six Money & Banking diagrams. Switch between Collection and Experiments. Play, pause, replay or scrub each player; expand **Description, tags & reuse** to edit its metadata. There are no embedded lesson/gallery pages. A04–A06 directly use the accepted causal renderer. Section placement is independent from approval for future reuse. Pattern edits do not rewrite lessons.
- **Collection tools** offers lesson import, history export, and restore. Restore previews the incoming counts and creates a safety backup before replacing history and library choices.

Part 2's manual unfamiliar-term choices remain intact. Stored understanding never adjusts lesson content or pacing. External source links open your browser and require internet; remote resources inside lesson WebViews are blocked. Packaged Parts 1–2 use their existing system-font fallbacks instead of Google Fonts. Part 1's package adds a UTF-8 declaration so its punctuation displays correctly when opened as a local file. The original source HTML and animation scripts are unchanged.

## Local data and backup

Data lives in `~/Library/Application Support/Let Me Understand/`:

- `lessons/<id>@<version>/`: independent, preserved package copies.
- `history.json`: understanding marks, approved concept lists, visits, library descriptions/tags, reuse choices, and experiment placement.
- `backups/`: safety backups created before restore.

Exported JSON backs up history and choices, **not lesson files**. To move the complete collection, copy the application-support folder as well, or reimport the same lesson packages. Safety backups can be selected using the normal restore command. A malformed history file is reported rather than silently reset; recover it using a known-good backup. During testing, `LEARNING_COLLECTION_HOME` can point to an isolated directory.

## Authoring a lesson package in Codex

A package is a folder with a `lesson.json` manifest and local HTML/CSS/JavaScript assets. Choose that folder in **Import lesson package…**. Example:

```json
{
  "id": "my-lesson",
  "title": "My visualization",
  "version": "1",
  "entry": "index.html",
  "route": "",
  "concepts": [
    {
      "id": "http-request-v1",
      "title": "An HTTP request identifies what the client is asking for.",
      "source": "https://ruslanspivak.com/lsbaws-part1/"
    }
  ]
}
```

IDs and versions use letters, numbers, hyphens, underscores and dots. Entry paths are relative HTML files; no symlinks or parent-directory traversal. Include all lesson assets locally. A duplicate edition is rejected rather than overwritten. Reuse an existing concept ID only with its unchanged title and citation; different ideas need different IDs. The app presents imported concept lists for user approval.

The initial package authoring script is `scripts/package_lessons.py`. It copies the accepted source material, retains the Part 3 relative resource layout, and proposes 11 distinct concepts across the three lessons (3, 5 and 7 appearances, with shared concepts). These are a draft selection, not an automatically approved curriculum. Source citations are embedded in the manifests; subject sources are Ruslan Spivak's Parts 1–3, distinct from the existing educator teaching library.

## Verification

```sh
swift test --package-path mac-app
python3 -m unittest discover -s mac-app/Tests
```

Tests cross the collection, understanding, library, backup and package-output interfaces using real temporary folders. See `TESTING.md` for the red/green record and native-app checks.

Website/file generation, cloud sync, automatic teaching adaptation and visual editing of animation behavior are deferred.

Preview extraction lives in `scripts/extract_previews.py`. It retains original drawing geometry and data, removes lesson narration/popover wiring, and adds standalone playback controls. The lesson packages themselves remain unchanged. Existing histories and backups without experiment placement continue to load; their items default to Experiments.

## Money & Banking experiment

Chapter 2 adds 21 short, user-paced screens beginning with a $5 lunch, visible Wink guidance, six-second animations, optional source notes, and seven proposed concepts. Its six animation entries use the same renderer as the lesson. See [the experiment notes](../experiment/money-hierarchy/README.md). The supplied lecture compilation has no available transcript; the installed source notes disclose this.
