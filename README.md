# Stop Dengue!

Stop Dengue! is a desktop-first, single-page educational experience that teaches students, families, and communities in Sri Lanka how to recognize and prevent dengue fever. The site combines friendly visuals, structured content, and an interactive quiz to reinforce key lessons.

## Features
- Multi-section layout covering the basics of dengue, symptoms, prevention tactics, and community action tips.
- Navigation system with smooth scrolling, active section highlighting, and contextual call-to-action links throughout the page.
- Interactive quiz with randomized answer order, instant feedback, score tracking, and personalized result messages.
- Desktop-only presentation that gently blocks mobile viewports to preserve the intended layout.
- Lightweight stack: semantic HTML, modern CSS with custom theming, and vanilla JavaScript (no external build tools required).

## Project Structure
```
.
├── index.html            # Entry point with all content sections
└── src
    ├── assets            # PNG illustrations and background artwork
    ├── css
    │   └── style.css     # Global styles, layout, and theming
    └── js
        └── main.js       # Navigation logic and quiz functionality
```

## Getting Started
1. Clone or download this repository.
2. Open `index.html` directly in a desktop browser **or** start a simple static server (recommended for consistent font loading):
   ```bash
   python3 -m http.server 8080
   ```
3. Visit `http://localhost:8080` in your browser to explore the site.

The site is optimized for modern Chromium, Firefox, and Safari browsers on laptops or desktops. Mobile devices are intentionally blocked while the responsive design is still being refined.

## Customization
- **Text & layout:** Most content lives in `index.html`. Update sections to reflect new guidance or localize the experience.
- **Styling:** Adjust colors, spacing, or typography inside `src/css/style.css`.
- **Quiz content:** Quiz questions, answers, and explanations are defined in the `quizData` array within `src/js/main.js`.
- **Assets:** Replace images in `src/assets/` (keeping the same filenames) or point to new assets from the markup.

## Deployment
Because the project is entirely static, you can deploy it to any static hosting service—GitHub Pages, Netlify, Vercel, or even a school intranet. Upload `index.html` and the `src/` directory, and the site is ready to share.

## Credits & Licensing
Project assets are bundled for convenience; confirm licensing for any third-party imagery before public distribution. The educational content focuses on dengue awareness in Sri Lanka—feel free to adapt the material for other regions while keeping health guidance accurate.
