# CocoPilot Development Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.6+ (for local development server)
- Node.js 16+ (for development tools, optional)
- Modern web browser

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/acbart/cocopilot.git
   cd cocopilot
   ```

2. **Start the development server**:
   ```bash
   # Using Python (recommended)
   python3 -m http.server 8000
   
   # Or using npm (if package.json is available)
   npm run dev
   
   # Or using Node.js
   npx serve .
   ```

3. **Open your browser**: Navigate to `http://localhost:8000`

### Development Tools (Optional)

Install development dependencies for validation and testing:

```bash
npm install
```

Available commands:
- `npm run validate` - Validate HTML and CSS
- `npm run lighthouse` - Run Lighthouse performance audit
- `npm run test` - Run validation tests

## 🏗️ Architecture

### File Structure
```
cocopilot/
├── index.html          # Main webpage
├── sw.js              # Service Worker for PWA features
├── favicon.svg        # Custom SVG favicon
├── README.md          # Project documentation
├── CHANGELOG.md       # Version history
├── tomorrow.md        # Future planning document
├── package.json       # Development dependencies
├── .github/
│   └── workflows/
│       ├── self-maintainer.yml  # Daily AI updates
│       └── automerge.yml        # Auto-merge PRs
└── docs/
    └── DEVELOPMENT.md  # This file
```

### Key Technologies
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, Grid, Flexbox
- **PWA**: Service Worker, Web App Manifest
- **Automation**: GitHub Actions, GitHub Copilot
- **Hosting**: GitHub Pages

## 🎨 Design System

### CSS Architecture
- CSS Custom Properties for theming
- Mobile-first responsive design
- CSS Grid and Flexbox for layouts
- Semantic HTML structure
- Accessibility-first approach

### Theme System
The site supports light/dark themes using CSS custom properties:
- Light theme (default)
- Dark theme (toggle via button or 'T' key)
- System preference detection
- LocalStorage persistence

### Color Palette
```css
/* Light Theme */
--bg-gradient-start: #667eea;
--bg-gradient-end: #764ba2;
--container-bg: rgba(255, 255, 255, 0.95);

/* Dark Theme */
--bg-gradient-start: #2d1b69;
--bg-gradient-end: #11998e;
--container-bg: rgba(30, 30, 30, 0.95);
```

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-improvement
   ```

2. **Make your changes**:
   - Edit files using your preferred editor
   - Test changes locally using the development server
   - Validate HTML/CSS if tools are installed

3. **Test thoroughly**:
   - Check responsive design on different screen sizes
   - Test both light and dark themes
   - Verify accessibility with screen readers
   - Test offline functionality

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: your improvement description"
   git push origin feature/your-improvement
   ```

### Code Style Guidelines

#### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels
- Maintain proper heading hierarchy
- Validate markup

#### CSS
- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Use meaningful class names
- Group related properties
- Add comments for complex sections

#### JavaScript
- Use modern ES6+ features
- Add error handling for API calls
- Use const/let instead of var
- Add JSDoc comments for functions
- Handle offline scenarios gracefully

## 🧪 Testing

### Manual Testing Checklist
- [ ] Page loads correctly in multiple browsers
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Light/dark theme toggle functions properly
- [ ] Service worker caches resources for offline use
- [ ] All links and buttons work as expected
- [ ] GitHub API integration displays stats (when online)
- [ ] Social sharing buttons function correctly
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: screen reader compatibility

### Automated Testing
```bash
# Validate HTML and CSS
npm run validate

# Run Lighthouse audit
npm run lighthouse

# Full test suite
npm test
```

## 📈 Performance Optimization

### Current Optimizations
- Efficient CSS with minimal reflows
- Optimized images (SVG favicon)
- Service Worker for caching
- Lazy loading for non-critical features
- Minimal JavaScript bundle

### Performance Monitoring
Use Lighthouse to monitor:
- Performance score
- Accessibility score  
- Best Practices score
- SEO score
- PWA features

## 🤝 Contributing

### AI-Driven Development
This project primarily evolves through AI (GitHub Copilot) making daily improvements. However, human contributions are welcome:

1. **Bug Reports**: Create issues for problems you encounter
2. **Feature Suggestions**: Propose ideas in issues or discussions
3. **Documentation**: Help improve documentation and guides
4. **Code Review**: Provide feedback on AI-generated changes

### Contribution Guidelines
- Keep changes focused and minimal
- Test thoroughly before submitting
- Follow existing code style and patterns
- Update documentation when necessary
- Reference relevant issues in PRs

## 🔮 Future Enhancements

See [tomorrow.md](../tomorrow.md) for planned improvements and long-term vision.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/acbart/cocopilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/acbart/cocopilot/discussions)
- **Documentation**: [README.md](../README.md)

---

*This development guide is maintained as part of the self-updating repository and evolves with the project.*