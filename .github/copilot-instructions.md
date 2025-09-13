# CocoPilot Development Instructions

Always follow these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview

CocoPilot is a static HTML/CSS/JavaScript Progressive Web Application (PWA) that demonstrates autonomous software evolution through AI-driven daily improvements. The application is served via Python's HTTP server for development and deployed to GitHub Pages automatically via GitHub Actions.

## Working Effectively

### Prerequisites and Environment Setup
- Python 3.6+ (Python 3.12.3 available in this environment)
- Node.js 16+ (Node.js v20.19.5 available in this environment)  
- Modern web browser

### Bootstrap and Development Commands
Run these commands in order to set up the development environment:

1. **Navigate to repository**:
   ```bash
   cd /home/runner/work/cocopilot/cocopilot
   ```

2. **Install dependencies** (NETWORK RESTRICTIONS WARNING):
   ```bash
   npm install
   ```
   **WARNING**: `npm install` fails due to firewall limitations preventing ChromeDriver download from googlechromelabs.github.io. This is a known environment limitation and does not affect core development workflow.

3. **Start development server**:
   ```bash
   python3 -m http.server 8000
   ```
   - **TIMING**: Server starts in < 1 second
   - **NEVER CANCEL**: Keep server running throughout development
   - Access at: `http://localhost:8000`

### Build Process
- **No build required**: This is a static site with no compilation step
- Run: `npm run build` (outputs: "Static site - no build required")
- **TIMING**: Instant (< 0.1 seconds)

### Testing and Quality Assurance
**CRITICAL**: Due to network restrictions, full test suite cannot be run in this environment, but individual components can be validated.

#### Working Commands (Validated):
- **Start server**: `python3 -m http.server 8000` - **TIMING**: < 1 second
- **Manual validation**: Browse to `http://localhost:8000` and test functionality
- **HTML structure validation**: Can be done manually via browser inspection

#### Commands That Fail (Network Restrictions):
- `npm run test` - **FAILS**: ChromeDriver download blocked
- `npm run test:e2e` - **FAILS**: Playwright requires ChromeDriver  
- `npm run test:unit` - **FAILS**: Jest dependencies not fully installed
- `npm run lint` - **FAILS**: ESLint not installed due to npm install failure
- `npm run validate` - **FAILS**: html-validate not installed

#### Workaround Testing Strategy:
Since automated testing fails due to network restrictions, **ALWAYS** use manual validation:

1. **Start the server**: `python3 -m http.server 8000`
2. **Manual functionality testing**: 
   - Browse to `http://localhost:8000`
   - Test theme toggle (🌙/☀️ button) - should switch between light/dark themes
   - Test timeline navigation (Next → / ← Previous buttons)
   - Verify GitHub API integration (repository stats should load or show ∞ fallback)
   - Test all navigation links (GitHub, Issues, Documentation)
   - Verify PWA functionality (service worker registration, manifest)
   - Test responsive design on different viewport sizes

### Validation Scenarios

**CRITICAL**: After making any changes, ALWAYS run through these complete user scenarios:

#### Core Functionality Test (5 minutes):
1. **Load application**: Navigate to `http://localhost:8000`
2. **Verify visual layout**: Check that robot icon, heading, and status indicators display
3. **Test theme toggle**: Click theme button, verify dark/light mode switch
4. **Test timeline**: Click "Next →" and "← Previous" buttons, verify content changes
5. **Test external links**: Verify GitHub and Issues links point to correct URLs
6. **Test repository stats**: Confirm either live stats load or fallback ∞ symbols display
7. **Test responsive design**: Resize browser window, verify layout adapts

#### PWA Features Test (3 minutes):
1. **Service worker**: Check browser dev tools → Application → Service Workers
2. **Manifest**: Verify `http://localhost:8000/manifest.json` loads correctly
3. **Offline capability**: Service worker should cache critical resources
4. **Performance**: Page should load quickly with minimal layout shifts

### Repository Structure

#### Key Files and Directories:
```
/home/runner/work/cocopilot/cocopilot/
├── index.html              # Main application file (37KB)
├── sw.js                   # Service worker for PWA functionality  
├── manifest.json           # PWA manifest configuration
├── favicon.svg             # Site icon
├── js/
│   └── timeline.js         # Interactive timeline component
├── tests/
│   ├── unit/               # Jest unit tests (require npm install)
│   ├── integration/        # Integration tests (require npm install)  
│   ├── e2e/                # Playwright end-to-end tests (require npm install)
│   └── setup.js            # Test configuration
├── docs/
│   └── DEVELOPMENT.md      # Development documentation
├── .github/
│   └── workflows/
│       ├── ci-cd.yml       # Main CI/CD pipeline
│       ├── self-maintainer.yml # Daily AI improvement workflow
│       └── automerge.yml   # Automatic PR merging
├── package.json            # Dependencies and scripts
├── jest.config.js          # Jest testing configuration
├── playwright.config.js    # Playwright E2E testing configuration
├── .eslintrc.json          # ESLint code style configuration
├── .prettierrc.json        # Prettier code formatting configuration
└── .htmlvalidate.json      # HTML validation rules
```

#### Configuration Files:
- **ESLint**: Enforces JavaScript code quality with 2-space indentation, single quotes
- **Prettier**: Code formatting with Unix line endings  
- **HTML Validate**: Validates HTML structure and accessibility
- **Jest**: Unit testing with jsdom environment
- **Playwright**: E2E testing with Chromium browser

### Deployment

**Automatic Deployment**:
- Every push to `main` branch triggers GitHub Actions deployment
- Site deploys automatically to GitHub Pages at: `https://acbart.github.io/cocopilot/`
- **TIMING**: Deployment takes 3-5 minutes via GitHub Actions

**Manual Deployment**:
- No manual deployment commands - everything is automated
- Changes are live after GitHub Actions workflow completes

### Common Development Tasks

#### Making Code Changes:
1. **ALWAYS** start development server first: `python3 -m http.server 8000`
2. **Edit files** using your preferred editor
3. **Test changes** manually by refreshing `http://localhost:8000`
4. **Validate functionality** using the scenarios above
5. **NEVER CANCEL** the development server during active development

#### Adding New Features:
1. **Update HTML** in `index.html` (main application)
2. **Add JavaScript** in `js/` directory if needed
3. **Update service worker** in `sw.js` if adding new cacheable resources
4. **Test PWA functionality** after any structural changes
5. **Update manifest.json** if changing app metadata

#### Troubleshooting:
- **Server won't start**: Check if port 8000 is available
- **Changes not visible**: Hard refresh browser (Ctrl+F5)
- **Service worker issues**: Clear browser cache and storage
- **GitHub API errors**: Expected due to CORS - fallback ∞ symbols will display

### GitHub Actions CI/CD Pipeline

The repository includes comprehensive CI/CD that runs on every push:

#### Pipeline Stages (Total time: ~10-15 minutes):
1. **Quality Assurance** (~8 minutes):
   - Node.js dependency installation (~2 minutes)
   - Linting and formatting checks (~1 minute)  
   - Unit tests (~2 minutes)
   - E2E tests (~2 minutes)
   - HTML validation (~30 seconds)
   - Lighthouse performance audit (~1 minute)

2. **Accessibility Check** (~3 minutes):
   - Axe accessibility testing

3. **Security Scan** (~2 minutes):
   - npm audit for vulnerabilities
   - Secret scanning with TruffleHog

4. **Deployment** (~2 minutes):
   - GitHub Pages deployment (main branch only)

**CRITICAL**: Since local npm testing fails due to network restrictions, changes MUST be validated manually before pushing to avoid CI failures.

### Important Notes

#### Network Environment Limitations:
- **ChromeDriver download blocked**: Prevents Playwright installation
- **GitHub API calls**: May be restricted, causing fallback behavior
- **CDN resources**: Some external resources may be blocked

#### Development Best Practices:
- **Always test manually**: Cannot rely on automated testing in this environment
- **Use git carefully**: All changes are visible in public repository
- **Follow existing patterns**: Maintain consistency with current code style
- **Document changes**: Update relevant documentation when making structural changes

#### Performance Considerations:
- **Service worker caching**: Ensures fast repeat visits
- **Minimal dependencies**: Static site loads quickly
- **Progressive enhancement**: Core functionality works without JavaScript
- **Responsive design**: Works on all device sizes

### Quick Reference Commands

**ALWAYS WORKING**:
```bash
cd /home/runner/work/cocopilot/cocopilot  # Navigate to repository
python3 -m http.server 8000               # Start development server (< 1 second)
curl http://localhost:8000                # Test server response
curl http://localhost:8000/manifest.json  # Test PWA manifest
curl http://localhost:8000/sw.js          # Test service worker
```

**FAIL DUE TO NETWORK RESTRICTIONS**:
```bash
npm install        # FAILS - ChromeDriver download blocked
npm test          # FAILS - Dependencies not installed  
npm run lint      # FAILS - ESLint not available
npm run validate  # FAILS - html-validate not available
```

### Final Validation Checklist

Before considering any changes complete, **ALWAYS** verify:

- [ ] Development server starts successfully
- [ ] Application loads at `http://localhost:8000` 
- [ ] Theme toggle works (light ↔ dark)
- [ ] Timeline navigation functions properly
- [ ] All links point to correct destinations
- [ ] Repository stats display (live data or ∞ fallback)
- [ ] Service worker registers without errors
- [ ] No console errors in browser developer tools
- [ ] Responsive layout works on different screen sizes
- [ ] PWA manifest loads correctly

**Remember**: This environment has network restrictions that prevent full automated testing. Manual validation is essential and sufficient for ensuring code quality.