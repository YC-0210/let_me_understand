# Phosphor access for future agents

Phosphor Regular is the learner's preferred family. Start here before choosing a new pictogram.

## Reuse the current symbols

Read `sources.json`: it maps teaching concepts to exact upstream names and pins the source revision. The `phosphor/` folder contains the nine original SVGs used by this lesson and the upstream MIT license. This is a subset, not the full catalog.

`../symbol-families.js` wraps the SVG geometry for the lesson renderer. Phosphor's 256 × 256 canvas is normalized to a centered 72-unit artboard with `translate(-36 -36) scale(0.28125)`. Preserve its original geometry and use `currentColor`.

## Find additional symbols

Browse https://phosphoricons.com/ and select Regular. The complete source catalog and SVGs are at https://github.com/phosphor-icons/core . Fetch additions from the revision in `sources.json`, using:

```
https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/regular/<icon-name>.svg
```

Check that the icon exists at that revision. If it does not, choose an existing icon or explicitly update the pinned version and review the existing symbols. Do not silently mix weights or revisions.

Save the original SVG under `phosphor/`, add its concept/name mapping to `sources.json`, and add the normalized geometry to the Phosphor entry in `../symbol-families.js`. Preserve the license. Do not paste arbitrary SVG from search results. Keep the local geometry and renderer entry in sync.

## Teaching and movement contract

Reuse an existing concept mapping before inventing one. Give a new concept a distinct, explained symbol and a clear label. Related instances share the symbol and use different labels. Neutral color is the base; emphasis has a separate role.

Actors use the common artboard. Travelling messages and exit records use the same 0.36 token scale throughout their lifetime, including movement; never shrink a token as it travels. Transfers use the shared `travelDuration` helper in `../intuition.js` (180 SVG units/second and linear interpolation). Responsive scaling applies equally to the entire diagram. Reduced-motion mode skips travel. Wink remains a separate guidance character.

Check the full path and destination, including labels, connectors and Wink, for collisions on desktop and mobile. Do not place unrelated symbols on top of one another to imply a relationship.
