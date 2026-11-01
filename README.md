# Habibur Rahman Shaikh — Biodata Website

A responsive Bengali marriage biodata page using a dark-green and gold visual theme.

The page also includes a mobile navigation menu, accessible keyboard controls, section and reading-progress indicators, a back-to-top button, reduced-motion-aware scroll reveals, and print/PDF support. The page structure, styles, and interactions live in `index.html`, `styles.css`, and `app.js`, respectively. It remains a standalone site with no build step or server-side framework.

## Publish inside the existing GitHub Pages repository

1. Open the repository that publishes `https://habiburrahmanshaikh.github.io/Habiburrahmanshaikh/`.
2. Upload this entire `habiburrahman-biodata` folder into the repository root.
3. Rename the folder to `biodata` (recommended).
4. Commit the changes to the branch configured for GitHub Pages.
5. The page should then be available at:
   `https://habiburrahmanshaikh.github.io/Habiburrahmanshaikh/biodata/`
6. The existing page can link to the new page with:
   `<a href="./biodata/">বিবাহের বায়োডাটা</a>`

The site is static HTML/CSS/JS and requires no build process. The `../` links return to the existing portfolio root when hosted in the suggested folder.

## Before publishing

- Verify every biodata detail and the spelling of institutions/degrees.
- The profile photo is stored in `assets/profile.jpg`.
- Review whether the listed email addresses should be public. Phone numbers have intentionally not been included in this first public draft.
- The age field is left as a dash to avoid a value that changes over time; the date of birth is shown instead.
