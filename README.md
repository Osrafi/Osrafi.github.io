# Md. Omar Sha Rafi — Academic Portfolio

A fast, animated, single-page academic portfolio with **two switchable themes**:

- **Scientific** (dark) — a lab / research aesthetic with an animated molecular-network background.
- **Academic** (light) — a warm, journal-inspired paper theme with elegant serif headings.

The theme toggle lives in the top-right of the navigation bar and your choice is remembered
in the browser (via `localStorage`). No build step, no frameworks — just HTML, CSS, and vanilla
JavaScript, so it hosts perfectly on **GitHub Pages for free**.

---

## 📁 Project structure

```
.
├── index.html                 # The whole site (all sections)
├── css/style.css              # Styling + both theme palettes + animations
├── js/main.js                 # Theme toggle, molecular canvas, scroll effects, filters
├── assets/
│   ├── img/profile.jpg        # Your portrait
│   ├── Md_Omar_Sha_Rafi_CV.docx   # Downloadable CV
│   └── certificates/          # 27 certificates (clean filenames), linked from the site
├── .nojekyll                  # Tells GitHub Pages to serve files as-is
└── README.md
```

> The `.claude/` folder only contains a tiny local preview server and can be ignored — it is not
> part of the published website.

---

## 🚀 Publish to GitHub Pages (free)

Your GitHub username is **Osrafi**, so the cleanest option is a *user site* served at
`https://osrafi.github.io`.

### Option A — User site (recommended, cleanest URL)

1. On GitHub, create a **new public repository** named exactly:
   ```
   Osrafi.github.io
   ```
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/Osrafi/Osrafi.github.io.git
   git push -u origin main
   ```
   > A local commit has already been created for you — if so, you can skip `git init`,
   > `git add`, and `git commit` and go straight to `git remote add ...` and `git push`.
3. On GitHub: **Settings → Pages**. Under *Build and deployment*, set **Source = Deploy from a branch**,
   **Branch = `main`**, folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute. Your site is live at **https://osrafi.github.io** 🎉

### Option B — Project site (any repo name)

1. Create a public repo, e.g. `portfolio`, and push these files the same way
   (`git remote add origin https://github.com/Osrafi/portfolio.git`).
2. **Settings → Pages → Source = Deploy from a branch → `main` / root**.
3. Your site is live at **https://osrafi.github.io/portfolio/**.
   (All links are relative, so this works with no changes.)

---

## ✏️ Things you may want to update

- **Social links** — the ResearchGate and LinkedIn URLs in `index.html` are best-guess placeholders.
  Search for `researchgate.net/profile/Md-Omar-Sha-Rafi` and `linkedin.com/in/osrafi` and replace
  them with your exact profile URLs. GitHub (`github.com/Osrafi`) and email are already correct.
- **CV** — replace `assets/Md_Omar_Sha_Rafi_CV.docx` with a newer version any time (keep the filename,
  or update the two `href`s that point to it). A PDF often downloads more reliably than `.docx`; if you
  export a PDF, drop it in `assets/` and update the links.
- **Add a publication or certificate** — copy an existing block in `index.html` and edit the text /
  file path. Certificate cards use `data-cat` to control which filter tab they appear under.
- **Custom domain** — add a `CNAME` file containing your domain and configure DNS (optional).

---

## 🔍 Preview locally

Any static file server works. If you have Python:

```bash
python -m http.server 4321
```

Then open <http://localhost:4321>. (Opening `index.html` directly also works, though a server is
closer to how GitHub Pages serves it.)

---

*Built with HTML, CSS, and vanilla JavaScript. Respects `prefers-reduced-motion` and is fully responsive.*
