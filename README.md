# Article Builder

A small static project for building and previewing articles. It includes minimal HTML, CSS and JavaScript files so you can edit content locally and preview it in the browser.

Files in this repository

- `index.html` — entry page
- `preview.html` — alternate preview page
- `preview.css` — styles used by `preview.html`
- `style.css` — main stylesheet (project currently open)
- `script.js`, `renderer.js` — project scripts

Quick start

1. Open `index.html` or `preview.html` in your browser. For a local development server (recommended), run a simple static server from this folder.

On Windows (PowerShell), using Python 3:

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

2. Quickly Test out using GitHub Pages.
Click the link: [https://gfrosh/github.io/article-builder/](https://gfrosh/github.io/article-builder/)


Development notes

- Edit HTML files to change layout/content.
- Edit `style.css` and `preview.css` for styling.
- Edit `script.js` and `renderer.js` to change runtime behavior.
- This is intentionally minimal so you can wrap it in a more advanced build system if needed.

Licensing (recommended)

This repository contains two different kinds of artifacts:

1. Code (HTML/CSS/JS): recommended license — MIT. This permits reuse and modification, and is widely used for code projects.
2. Written content you create with this project (articles): recommended license — Creative Commons Attribution 4.0 International (CC BY 4.0). This is a standard content license that allows sharing and adaptation while requiring attribution.

What this repo contains now

- Code is licensed under the MIT license (see `LICENSE`).
- If you publish article content from this project and want to apply a content license, we recommend CC BY 4.0 — add a short note to your exported article files explaining that license and author attribution.

How to change the license

- To change the code license, replace the `LICENSE` file with your chosen license text.
- To apply a content license to your articles, add a short footer or metadata in your exported HTML/Markdown with the appropriate CC BY 4.0 notice and a link: https://creativecommons.org/licenses/by/4.0/

Contributing

Small one-file/feature PRs welcome (HTML/CSS/JS). If you add features that change the public API (for example, new JS functions used externally), add a short note in the README and include a minimal example.

Author / Contact

Gideon Onyegbula || [WhatsApp](https://wa.me/+2348137960057/)

License summary

- Code: MIT (see `LICENSE`).
- Content you publish: recommended CC BY 4.0 (not enforced by files here).
