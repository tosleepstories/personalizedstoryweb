# Partner pitch + trial website (GitHub Pages)

One static page for personalised-gift and photo-book companies: hero, real samples, how it works,
why partner, fulfilment options, partner pilot (no prices shown), photo/child-data policy, the trial order form, FAQ.
`thanks.html` is where the form lands after a successful send.

Facts on the page come from `../personalizedstory/partner/` (COMMERCIAL_OFFER.md, outreach/PILOT_OFFER.md,
PHOTO_AND_CHILD_DATA.md, API.md, PRINT_CHECKLIST.md, SAMPLE_ROSTER.md). If those terms change, update
the page text (pilot section, "Free trial ebooks" card, FAQ "What does it cost?"). Pricing is deliberately "on request".
Images in `assets/` are compressed web copies of the sample-kit books (jobs 1, 2 and the Aug/Sept family jobs).


GitHub only hosts the page. It cannot store photos or emails. Submissions go to **Forminit** (formerly Getform, free plan), which emails you and keeps the files. Plain static files, no build step.

## 1. Forminit (five minutes)

1. Open [https://forminit.com](https://forminit.com) and create a free account (an old Getform login may work).
2. Create a form. Its ID is the last part of the endpoint `https://forminit.com/f/<FORM_ID>`.
3. In the form's settings, set authentication to **Public** (static sites can't hold an API key).
4. Paste the ID into `config.js`:

```js
forminitFormId: "abc123xyz",
```

5. Turn on email notifications to your inbox (Form settings → Email Notifications).
6. Optional: Form settings → Authorized domains → add your domain so only your site can post to the form.
7. Test: open the live page, send a request with 1–2 characters and real photos, check you land on `thanks.html`, the submission (with photos) shows up in Forminit, and the email arrives. After the first submission you can rename the field labels under Form settings → Blocks.

Free plan limits: 1 form, 100 submissions/month, 100 MB file storage in total. Photos are shrunk in the browser (max 1600 px, JPEG, usually 0.3–1.5 MB each) and a request is capped at 20 MB (Forminit allows 25 MB). Download and delete old submissions to free storage. Public forms accept 1 submission per 30 seconds per visitor.

Opening `index.html` straight from disk is fine for looking at it; for a real test send, use the live site (or `python -m http.server` in this folder).

## 2. Put it on GitHub

Create a new **public** repo (or a `gh-pages` branch) that contains only this folder’s files at the root:

- `index.html`
- `thanks.html`
- `styles.css`
- `form.js`
- `config.js`
- `assets/` (sample covers, inside spread, likeness portraits, logo)

GitHub → Settings → Pages → Deploy from branch `main` / `/ (root)`.

Test URL: `https://YOUR_USER.github.io/REPO/`

## 3. Your Namecheap domain

1. In the repo, add a file named `CNAME` with one line: `www.yourdomain.com` (or the root name you want).
2. GitHub Pages will show the DNS records.
3. At Namecheap, add those records (usually an `A` record for `@` and a `CNAME` for `www` pointing at `YOUR_USER.github.io`).
4. Wait for DNS, then tick “Enforce HTTPS” on GitHub Pages.

Do not put API keys, Flask, or studio on this repo.

## What you receive

Each submission (Forminit field names in brackets):

- Contact: name (`fi-sender-fullName`), company (`fi-sender-company`), work email (`fi-sender-email`)
- Number of characters (`fi-select-characterCount`)
- Per character N = 1–6: name (`fi-text-charNName`), role (`fi-select-charNRole`), age for child/cousin (`fi-select-charNAge`)
- A readable summary of the cast (`fi-text-cast`)
- Story setting (`fi-select-scenario`), read-aloud age (`fi-select-readingAge`), language (`fi-select-language`), notes (`fi-text-notes`)
- Photos, 1–3 per character (`fi-file-photos[]`), named `c<N>-<Name>-<k>.jpg` so you can tell whose they are

Values use the same ids as the story app (e.g. `forest_path`, `6-9`, `english`). You make the book locally and email the PDF back.
