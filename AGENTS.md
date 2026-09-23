# Component workflow

- This repository has two symmetric libraries: `atom-components/` and `large-components/`.
- Components live in `<library>/components/<Name>/`. Start with only the target's README, index.jsx, index.css, preview.jsx and preview.css.
- Do not read generated `preview.html` / `index.html`, unrelated components, or `.history/` by default. HTML is disposable output, never a source template.
- For focused edits run `node scripts/build.mjs atom <Name>` and `node scripts/verify.mjs atom <Name>` (use `large` for composed components). Do not refresh galleries unless asked to aggregate or rebuild all.
- When asked to aggregate run `node scripts/build.mjs <atom|large> --gallery`, then the same target with `scripts/verify.mjs`.
- New components require an entry in the library's `registry.json`. Both independent pages and galleries import the same standard-ES-module `preview.jsx`, which imports the real component.
- Large components import atomic source directly from `../../../atom-components/components/<Name>/index.jsx`; do not copy atoms.
- Use existing `assets/` and `tooling/preview/`. Do not initialize another preview scaffold, copy runtime assets, or restore old HTML-patching scripts. These project-specific paths supersede generic scaffold paths in skills.
- Shared preview styles are not component styles. Keep implementation CSS in index.css and documentation/forced-state styles in preview.css.
- See README.md for command options. Verification is a runtime smoke check, not browser visual validation.
