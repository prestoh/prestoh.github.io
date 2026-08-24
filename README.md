# prestoh.github.io

Hand-written static site. No framework, no build step, no dependencies.
Push to `main` and GitHub Pages serves it.

## Getting it live

1. Create a public repo named exactly `prestoh.github.io`
2. Copy these files into it and push to `main`
3. Repo **Settings → Pages** → Source: *Deploy from a branch* → `main` / `root`
4. It appears at `https://prestoh.github.io` within a minute or two

Delete `CNAME` until you actually own the domain — GitHub will complain otherwise.

## Working on it locally

No tooling needed. Open `index.html` in a browser and refresh as you edit.
If you want proper paths (so `/writeups/...` resolves like it will in production):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Layout

```
index.html              home page — all sections live here
assets/style.css        every visual decision, driven by CSS variables at the top
assets/main.js          theme toggle + draggable chips
assets/img/             images
writeups/example.html   template — copy it for each new post
CNAME                   your custom domain (delete until you own one)
```

## Making changes

**Colours and fonts.** Top of `style.css`. The `:root` block is the light
theme, `[data-theme="dark"]` is the dark theme. Change a value once and it
propagates everywhere. Do not hardcode a colour anywhere else.

**A new write-up.** Copy `writeups/example.html`, rename it, edit the content,
then add a matching `<article class="card">` block to `index.html`. Two files
per post.

**The chips in the hero.** They are plain `<button class="chip">` elements in
`index.html`. Add, remove, or reword them freely — the JavaScript picks up
whatever is there.

## Before you go public

- [ ] Swap the Google Fonts `<link>` for self-hosted `.woff2` files in
      `assets/fonts/`. Download from [fonts.google.com](https://fonts.google.com),
      convert if needed, and `@font-face` them in `style.css`. Removes a
      third-party request and loads faster.
- [ ] Replace the placeholder SVGs in `assets/img/`
- [ ] Update the email and LinkedIn links in the contact section
- [ ] Check it on a phone — the layout is responsive but your content might not be
- [ ] Reread every project write-up for anything client-specific or
      employer-identifying that should not be public

## Notes on the design

The monospace uppercase label (`.field`) is the connective tissue — dates,
categories, small notes all use it. Keep using it and the site stays coherent.

The amber accent (`--signal`) is the "warning" colour every SIEM uses. It is
the only saturated colour on the page, so it stays meaningful. Resist adding a
second accent.

The hero underline is a tick mark — the symbol an auditor puts next to a figure
they have verified. It only appears on the two verbs that carry the argument.
