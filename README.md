# Manikantan & Saranya — Wedding Website

A complete static wedding invitation in a Kerala temple-and-mural aesthetic. This premium version uses a carved wooden temple entrance with **real 3D hinged door leaves**, synchronized shadows, sanctum lighting and a gentle camera movement. The full entrance is kept visible from top to bottom on the opening screen.

## Open it on your computer

Unzip this package and double-click `index.html`. For the closest preview to the hosted version, run a small local web server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Updating an existing GitHub Pages deployment

1. Extract this ZIP.
2. Replace the files in your GitHub repository with **every file and folder** from this package.
3. Commit the changes to the `main` branch.
4. Allow roughly 1–3 minutes for GitHub Pages to redeploy.
5. Hard-refresh the live website with **Ctrl+Shift+R** on Windows/Linux or **Cmd+Shift+R** on Mac.

The HTML uses versioned asset links so visitors receive the new door animation instead of an older cached copy.

## Free hosting — GitHub Pages

1. Create a new public GitHub repository.
2. Upload every file and folder from this package to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. GitHub will display the public website URL after deployment.

## Free hosting — Netlify Drop

1. Unzip the package.
2. Open Netlify Drop in your browser.
3. Drag the entire `manikantan-saranya-wedding-invite` folder onto the upload area.
4. Netlify will immediately provide a public website URL.

## Premium entrance assets

- `assets/temple-door-frame.webp` — fixed carved doorway and temple facade with a transparent portal opening
- `assets/temple-door-leaf-left.webp` — left door leaf, animated around its outer hinge
- `assets/temple-door-leaf-right.webp` — right door leaf, animated around its outer hinge
- `styles.css` — 3D perspective, heavy-door motion, lighting, shadows and responsive full-height fitting
- `script.js` — coordinates the opening sequence and main invitation reveal

## Other important files

- `index.html` — invitation wording and sections
- `assets/temple-door-frame.webp` and `assets/temple-door-leaf-*.webp` — responsive carved doorway artwork and moving door leaves
- `assets/save-the-date.png` — downloadable invitation card
- `calendar/` — calendar downloads for the wedding and evening reception

## Editing the details

Open `index.html` in a text editor and search for the exact name, time, venue or phone number you want to change. The website contact number is `7025671618`; WhatsApp RSVP is configured for the same number.

## Privacy

The RSVP form does not store guest information. It creates a pre-filled WhatsApp message to the family contact, and the guest chooses whether to send it.


## Wedding song
The user-provided `assets/kalyana-kacheri.mp3` begins from 0:00 when the visitor taps **Open the Invitation**, fades in gently, continues throughout the website, and loops only if the visitor remains longer than the complete track. The floating music control pauses or resumes playback. Browsers require this first tap before sound may begin.
