# Video and 360° virtual-tour recovery — source-grounded inventory

Reviewed public website and indexed external venue media November 2026.

## Original-site references
- `https://horseheadlakelodge.com/video-gallery/` exists, but the accessible page text does **not** expose video iframe IDs.
- `https://horseheadlakelodge.com/wedding/` explicitly labels an **“Indoor Ceremony Hall 360°”** experience. The actual embed URL was **not recoverable** from public page text, so no simulated 360 viewer or invented panorama is shipped.
- The Knot and WeddingWire venue listings independently mention a 360° tour, but do not expose a verified embedded tour URL to the retrieved public text.

## Externally verified venue films (not proven to have been embedded on the original site)
- Rose & Daniel — Wild Bloom Films (YouTube `dcqyySknUgg`)
- Kole & Kaden — Hunt Films (YouTube `aAHhcv0chHc`)
- Waterfall-cabin experience — Kelly Hays (YouTube `tTy_rpJ74qU`)
- Madison & Garren — Topher Films (Vimeo `1151683961`; externally published by filmmaker)

These third-party films may be shown as external embeds with creator attribution if enabled and permitted; do not label them Horsehead-owned productions.

## To recover the real panorama
From Scott's existing WordPress admin: edit the Wedding page using Elementor, locate the `Indoor Ceremony Hall 360°` block, and copy the iframe `src` or the underlying panorama plugin shortcode/source. If the embed references a deleted service, export its original spherical JPEG panorama (typically equirectangular 2:1) and commission a new 360 player. The supplied `Horsehead.zip` contains wedding and property photos but not a verified 2:1 spherical panorama.

Check other virtual-tour blocks and inspect iframe HTML from Gallery and Wedding pages as well. Do not point the public site at a broken 360 tour. Add the validated embed only after confirming it loads on mobile and that Scott has permission to reuse it.
