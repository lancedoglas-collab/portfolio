# Portfolio — Kit Anthony Z. Lebosada

A personal developer portfolio built with plain HTML, CSS and JavaScript.
No frameworks, no build step, no dependencies. Opening `index.html` in a
browser runs the whole site.

---

## Running it locally

**Option 1 — run the included server** (recommended, matches how Vercel
serves it).

*In VS Code:* right-click `serve.ps1` → **Open in Integrated Terminal**, then
run:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

*In Windows File Explorer:* right-click `serve.ps1` → **Run with PowerShell**.
(This entry exists only in File Explorer — VS Code's right-click menu does not
have it. From VS Code you can get there with **Reveal in File Explorer**,
Shift+Alt+R.)

Either way, then open <http://localhost:8000>. Press **Ctrl+C** in the
terminal to stop it.

Use a different port with `-Port 3000`. The server needs nothing installed —
it uses what ships with Windows — and it handles `cleanUrls` the same way
Vercel does.

**Option 2 — just open it.** Double-click `index.html`. Everything works
except the inline PDF preview and the CV file-size label, which browsers
restrict on `file://` URLs.

> The usual `python -m http.server 8000` does **not** work on this machine.
> The `python` command here is the Microsoft Store placeholder, not a real
> install — it exits with "Python was not found". That is why `serve.ps1`
> exists.

---

## What to edit

Almost everything lives in two files. You should not need to touch
`index.html` at all.

### `js/config.js` — you, your details, your skills

| What you want to change | Where |
| --- | --- |
| Name, title, location | `name`, `title`, `location` at the top |
| The "open to internships" badge | `availability` (currently `null`, so no badge; set a string to show one) |
| Hero headline and intro | `headline`, `intro` |
| Profile photo path | `photo` |
| Email, phone | `email`, `phone` (set `phone: null` to hide it) |
| GitHub / LinkedIn / Facebook / Instagram | `socials` |
| CV file and download name | `cv` |
| About Me paragraphs | `about.paragraphs` |
| The four small stat cards | `about.highlights` |
| Skills | `skills` |
| Work experience | `experience` |
| Education | `education` |
| Contact heading and invitation | `contact` |
| Footer tagline | `footer.tagline` |

Anything set to `null` is hidden automatically. Links that do not exist are
never rendered, so there are no dead buttons.

### `js/projects.js` — your projects

Adding a project means adding one object to the `PROJECTS` array. The cards,
the category filter buttons and the detail dialogs are all generated from it.

```js
{
  id: 'my-project',
  name: 'My Project',
  tagline: 'One line shown on the card.',
  description: ['A paragraph for the details dialog.'],
  category: 'Web Applications',   // must match a value in CATEGORIES
  featured: false,                // true = large full-width showcase row
  year: '2026',
  role: 'What you did on it.',
  tech: ['JavaScript', 'CSS'],
  image: 'assets/images/projects/my-project.png',  // or null
  imageAlt: 'Screenshot of My Project',
  mockup: 'browser',              // 'browser' | 'phone' | null
  links: {
    liveUrl: 'https://example.com',
    liveLabel: 'Live Demo',
    codeUrl: 'https://github.com/you/repo'         // or null
  },
  gallery: []
}
```

Filter buttons only appear for categories that actually contain a project, so
you can leave all the `CATEGORIES` values in place.

---

## Things still to add

These are the only gaps left. Nothing breaks without them — each one falls
back to something sensible.

### 1. Your profile photo

Save your photo as:

```
assets/images/profile.jpg
```

A square image of roughly 800×800 looks best; the frame crops to a square.
Until that file exists, the hero shows a styled "KL" monogram instead of a
broken image. The path is set by `photo` in `js/config.js`, so a `.png` works
too if you update it there.

### 2. Project screenshots

Save them in `assets/images/projects/` and point each project's `image` field
at them, for example:

```js
image: 'assets/images/projects/emberfall.png',
```

Until then, each project shows a generated placeholder with its initial.
Good screenshots to take:

- **Emberfall** — a combat screen with the enemy, health bars and the log.
- **ShiftGear** — the home page with the featured models.
- **Barangay Mambaling** — the main dashboard or landing page.
- **Zoki** — a phone screenshot (this one renders in a phone frame).

### 3. Confirm the Barangay Mambaling stack

The description is written from the live site. The one guess left is `tech`:
PHP and MySQL were inferred from the host (InfinityFree runs PHP only), not
confirmed. Correct that array if it was built with something else.

### 4. Confirm the Zoki tech stack

The Play Store link and description are filled in. The only unknown left is
`tech` on the `zoki` entry — it currently says `Mobile Development`, `Android`,
`Google Play`, which is true but vague. Replace it with what the app was
actually built with (Flutter? React Native? Kotlin? Firebase?).

### 5. Optional: LinkedIn and a social preview image

- Add your LinkedIn URL to `socials.linkedin` in `js/config.js`.
- Add `assets/images/og-image.jpg` (1200×630) for a custom link preview when
  the site is shared. The `og:image` meta tag in `index.html` already points
  at that path.
- Update `og:url` in `index.html` to your deployed address after the first
  deploy.

---

## The CV

The current file is `assets/cv/cv.pdf`, copied from your `resume_kit.pdf`.

To update it, replace that file. Keep the same filename and nothing else
needs changing. The name the visitor's browser saves it under is set by
`cv.fileName` in `js/config.js`.

**One thing worth knowing:** this PDF is public to anyone who visits the site,
and it currently contains your home address, phone number, date of birth,
religion, height and weight. Recruiters do not need any of those. If you later
want a version without them, make a second PDF and drop it in as
`assets/cv/cv.pdf` — the site does not care which file it is.

---

## The contact form

The form opens the visitor's own email app with the message pre-filled. It
does not send anything through a server, because a static site has no server
to send it with. Nothing is silently dropped and no API keys are involved.

If you later want messages delivered straight to your inbox, sign up for a
form service such as Formspree or Web3Forms and change the submit handler in
`js/script.js` (`initContactForm`) to POST to their endpoint instead of
building a `mailto:` link.

---

## Deploying to Vercel

### First deployment

1. **Create a GitHub repository.** On <https://github.com> click **New**, name
   it (for example `portfolio`), leave it public, and create it without a
   README.
2. **Upload the project.** Either drag this whole folder's contents into
   GitHub's upload page, or from this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/lancedoglas-collab/portfolio.git
   git push -u origin main
   ```

3. **Sign in to Vercel** at <https://vercel.com> using your GitHub account.
4. **Import the repository.** Click **Add New → Project**, find the repo and
   click **Import**.
5. **Configure it as a static site:**
   - Framework Preset: **Other**
   - Root Directory: **`./`** (leave as is)
   - Build Command: **leave empty**
   - Output Directory: **leave empty**
   - Install Command: **leave empty**

   There is nothing to build. If Vercel has guessed a framework, change it to
   "Other" so it does not try to run a build.
6. **Click Deploy.** It takes under a minute.
7. **Open the URL** Vercel gives you and check the site: scroll through every
   section, open the mobile menu, try the project filters, and confirm the CV
   both views and downloads.

### Updating the site later

Push to GitHub and Vercel redeploys automatically:

```bash
git add .
git commit -m "Update projects"
git push
```

### About `vercel.json`

It contains one setting, `cleanUrls`, which serves pages without the `.html`
extension. A static site does not need anything more. Do not add rewrites or
redirects unless you have a specific reason — they can break asset delivery.

---

## Project structure

```
portfolio/
├── index.html          Page structure (rarely needs editing)
├── serve.ps1           Local preview server (Windows, no install needed)
├── vercel.json         Minimal static-hosting config
├── README.md           This file
├── css/
│   └── style.css       All styling, themes and animations
├── js/
│   ├── config.js       ← your details, skills, education, experience
│   ├── projects.js     ← your projects
│   └── script.js       Rendering and interactions
└── assets/
    ├── images/
    │   ├── profile.jpg     ← add this
    │   └── projects/       ← add screenshots here
    ├── cv/
    │   └── cv.pdf
    └── icons/
```

---

## Notes on how it is built

- **Theme.** Dark by default, with a light theme behind the toggle in the
  navigation bar. The choice is saved in `localStorage` and applied by a small
  inline script before first paint, so there is no flash of the wrong colours.
- **Animations.** CSS transitions driven by `IntersectionObserver`, using only
  `transform` and `opacity`. Every animation is disabled under
  `prefers-reduced-motion: reduce`.
- **Without JavaScript.** Content is hidden for animation only after the
  script confirms it is running, so if the script fails the page still renders
  fully — just without the reveals and the generated project cards.
- **Accessibility.** Semantic landmarks, a skip link, visible focus rings,
  labelled form fields, `aria-expanded` on the menu toggle, and an escape key
  that closes both the menu and the project dialog.
- **No tracking, no analytics, no cookies.**
