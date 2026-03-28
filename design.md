# UI/UX Design Document

## Design Philosophy
The interface must feel dynamic, premium, and deeply interactive, serving as a hub for a multi-persona author. The UI utilizes modern Next.js 14+ capabilities, 21st.dev interactive components, and Tailwind CSS. The design heavily leans into a high-end cultural-fantasy aesthetic.

## Global Design Rules
* **Core Base Palette:** Strict, premium **White, Ink Black, and Gold**. All primary text, buttons, borders, and main UI containers must utilize this base to ensure high readability and a luxurious feel.
* **Theme States (Dynamic Backgrounds):** The background canvas shifts dramatically based on the active persona, sitting *behind* the clean White/Black/Gold UI elements.
  - **State 1 (Light Pen):** Sleek, sharp, minimal glassmorphism. Deep, subtle shadows with crisp borders (representing handsome, suffering male leads).
  - **State 2 (Author Eliora):** Warm, blooming, ethereal gold gradients with very soft, subtle rose accents (representing emotional romance).
  - **State 3 (Heavenly_Daoist):** Authentic **Xianxia Inkdrop**. A high-fidelity, monochromatic ink-wash animation. It features stark whites, deep greys, and pitch-black ink spreading organically, pierced by glowing Gold and subtle deep Azure/Teal energy trails. It must evoke traditional calligraphy, ink dragons, and powerful Qi energy. Absolutely no neon colors.

## Typography & Animations
* **Typography:** Clean, highly legible modern sans-serif for UI data/buttons. Distinct stylized headers (elegant serif or brush-stroke aesthetics) for the different persona titles.
* **Animations:** Framer Motion handles 2.5D cursor tracking and smooth layout transitions. The Heavenly_Daoist state specifically requires an advanced SVG mask or an integrated Canvas-based fluid/ink simulation mapped strictly to black, white, gold, and azure to achieve the swirling ink aesthetic.

## Key Views
1. **The Hub (Homepage):** Distinct interactive section cards for the three personas. The background of the entire page reacts to which persona is active.
2. **Book Portal View:** Massive interactive cover. The page layout prioritizes the outbound "Read" link, flanked by the real-time Live Viewer Ranking and the scrolling comment feed.
