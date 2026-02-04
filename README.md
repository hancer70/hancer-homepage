# Hancer Homepage

Personal academic homepage for Dr. Murat Hancer

**Live Site:** https://hancer70.github.io/hancer-homepage (or custom domain: hancer.org)

## Features

- 🎨 Professional Rust color theme (#B7410E)
- 📊 Automated weekly citation updates from Google Scholar
- 📱 Fully responsive design
- ⚡ Fast loading with optimized assets
- 🔄 GitHub Actions automation

## Automated Citation Updates

This website automatically updates citation metrics every Monday at 9:00 AM UTC using GitHub Actions.

### How it works:
1. GitHub Actions workflow runs weekly
2. Scrapes latest metrics from Google Scholar
3. Updates `index.html` with new data
4. Commits changes automatically

### Manual Update:
```bash
npm install
npm run update-citations
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/hancer70/hancer-homepage.git
cd hancer-homepage
```

2. Open `index.html` in your browser

## Deployment

This site is automatically deployed via GitHub Pages. Any push to the `main` branch will update the live site.

## Files

- `index.html` - Main homepage
- `styles.css` - Rust-themed styling
- `script.js` - Animations and interactions
- `murat-hancer-photo.jpg` - Profile photo
- `update-citations.js` - Citation scraping script
- `.github/workflows/update-citations.yml` - Automation workflow

## License

© 2026 Dr. Murat Hancer. All rights reserved.
