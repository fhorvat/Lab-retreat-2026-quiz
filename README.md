# Facts, or Faith? — live audience voting

A phone-based audience-response ("clicker") quiz. The audience scans a QR code and votes
**Facts** or **Faith** on each claim; the presenter advances the room one question at a time
and reveals the answer (verdict + explanation + references) on the projector.

Runs entirely on **free GitHub Pages + a Google Sheet** — no server, no account beyond
GitHub and Google. Architecture is templated on
[`BIMSBbioinfo/Course_SystemsBiology` → `how_to_single_cell`](https://github.com/BIMSBbioinfo/Course_SystemsBiology).

## Files

| File | What it is |
|---|---|
| `index.html` | The app (voter view + presenter view). |
| `app.js` | Frontend logic. **Put your backend URL here** (`GOOGLE_SCRIPT_URL`). |
| `questions.js` | The 11 questions, verdicts, explanations, references. **Edit this to change content.** |
| `style.css` | Styling (matches the course template). |
| `google_apps_script.js` | The backend — pasted into a Google Sheet's Apps Script (not run by GitHub). |
| `facts-or-faith.html`, `facts-or-faith-answer-key.html` | Stand-alone printable quiz + answer key (unchanged). |

## How it works

```
 Phones (voter)                 Presenter (?teacher=true&key=KEY)
   index.html                     index.html?teacher=true&key=KEY
     │ poll  ?action=state          │ ?action=setState&q=N&key=KEY   (advance room)
     │ send  ?action=vote           │ ?action=results                (poll tally ~4s)
     ▼                              ▼
            Google Apps Script web app  (google_apps_script.js)
                         │
              Google Sheet (votes) + Script Properties (current question)
```

The presenter sets which question is "live"; phones poll and show only that one. Answers are
shown **only on the presenter screen** (projector) when you click *Reveal*.

## Setup

### 1. Backend (Google Sheet) — one time, ~3 minutes
1. Create a new **Google Sheet**.
2. **Extensions → Apps Script**. Delete any sample code, paste all of `google_apps_script.js`.
3. Near the top, change `var PRESENTER_KEY = 'changeme';` to your own secret word.
4. **Deploy → New deployment → Web app**: *Execute as* **Me**, *Who has access* **Anyone**. Authorise when prompted.
5. Copy the **Web app URL** (ends in `/exec`).

### 2. Frontend
6. Open `app.js`, paste the URL into `const GOOGLE_SCRIPT_URL = '...';`.
   *(Leave it empty to keep running in single-browser **local demo mode** for testing.)*

### 3. Host on GitHub Pages
7. Create a GitHub repo, push these files to the **main** branch (root).
8. **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`**.
9. After a minute your site is live at `https://<you>.github.io/<repo>/`.

## Running a session

- **Audience:** `https://<you>.github.io/<repo>/`  — show this as a QR code (the presenter screen displays one).
- **You (presenter):** `https://<you>.github.io/<repo>/?teacher=true&key=YOURKEY`
  - **Next → / ← Previous** move everyone to the next/previous question.
  - The bar shows live **Facts vs Faith** percentages and how many people voted.
  - **Reveal answer** shows the verdict + explanation + references on your screen only.

> Tip: open the presenter URL on the projector and keep your phone on the audience URL to test as you go.

## Editing questions

Edit `questions.js`. Each entry:

```js
{
  id: 12,                       // unique number; defines the topicId in the vote sheet
  tag: 'Category · subtopic',
  text: 'The claim shown to the audience.',
  verdict: 'facts',             // 'facts' (real) or 'faith' (plausible but unsupported)
  oneLiner: 'Short verdict summary.',
  explanation: 'Longer rationale shown on reveal.',
  refs: ['Author et al., <em>Journal</em> Vol (Year), pages.']
}
```

The order in the array is the presentation order. Commit and push to update the live site.
(If you change `id`s after people have voted, old votes keyed to the old ids won't aggregate.)

## Notes & limits

- Polling is ~4 s, so tallies update within a few seconds — fine for a meeting-sized room.
- The presenter `key` is visible in the URL; it only stops casual hijacking of the live question.
- To reset between sessions: clear the rows in the Google Sheet, and set the question back with
  the presenter's **← Previous** (down to "Not started").
