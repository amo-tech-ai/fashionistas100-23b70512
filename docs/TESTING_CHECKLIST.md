# Mobile Testing Checklist

## Pre-Launch Testing Checklist

### 🎯 Phase 1: Visual & Layout Testing

#### Device Matrix
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 (390x844)
- [ ] iPhone 13 Pro Max (428x926)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] Samsung Galaxy S21 Ultra (384x854)
- [ ] iPad Mini (768x1024)
- [ ] iPad Pro 11" (834x1194)
- [ ] Desktop (1920x1080)

#### Every Page Must Pass
- [ ] Home page (`/`)
- [ ] Events listing (`/events`)
- [ ] Event detail pages
- [ ] Dashboard (`/dashboard`)
- [ ] Sponsors dashboard (`/dashboard/sponsors`)
- [ ] Bookings dashboard (`/dashboard/bookings`)
- [ ] Contact/Forms pages
- [ ] Authentication pages

#### Visual Checks
- [ ] No horizontal scroll on any page
- [ ] No content cut off or hidden
- [ ] Images scale properly
- [ ] Typography readable (min 14px body text)
- [ ] Colors maintain contrast ratios
- [ ] No overlapping elements
- [ ] Proper spacing between sections
- [ ] Buttons and CTAs clearly visible

---

### 🖐️ Phase 2: Touch Target Compliance

#### All Interactive Elements
- [ ] Buttons ≥ 44x44px
- [ ] Links ≥ 44x44px (or adequate line-height)
- [ ] Form inputs ≥ 44px height
- [ ] Checkboxes/radios ≥ 44x44px
- [ ] Select dropdowns ≥ 44px height
- [ ] Icon buttons ≥ 44x44px
- [ ] Tab navigation items ≥ 44px
- [ ] Pagination buttons ≥ 44x44px

#### Spacing
- [ ] Minimum 8px spacing between touch targets
- [ ] No overlapping interactive areas
- [ ] Easy to tap without accidentally hitting adjacent elements

#### Test Method
```bash
npm run test -- tests/touch-compliance.spec.ts
```

---

### ⚡ Phase 3: Performance Testing

#### Core Web Vitals (Mobile)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] TTFB (Time to First Byte) < 800ms

#### Load Time Targets
- [ ] Home page < 2.5s (3G)
- [ ] Events page < 3s (3G)
- [ ] Dashboard < 3s (3G)
- [ ] Images lazy load
- [ ] No render-blocking resources

#### Test Method
```bash
npm run test -- tests/performance.spec.ts
```

#### Manual Testing
1. Chrome DevTools > Lighthouse
2. Run mobile audit
3. Check Performance score > 90
4. Check Accessibility score > 95
5. Check Best Practices > 90

---

### ♿ Phase 4: Accessibility Testing

#### WCAG 2.1 AA Compliance
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Proper heading hierarchy (single h1)
- [ ] Color contrast ≥ 4.5:1 (text)
- [ ] Color contrast ≥ 3:1 (UI elements)
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip links present
- [ ] Landmarks used properly
- [ ] ARIA labels where needed

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in custom controls
- [ ] Focus visible at all times

#### Screen Reader Testing
- [ ] VoiceOver (iOS Safari)
- [ ] TalkBack (Android Chrome)
- [ ] NVDA (Desktop)
- [ ] All content announces correctly
- [ ] Navigation makes sense audibly

#### Test Method
```bash
npm run test -- tests/accessibility.spec.ts
```

Or use axe DevTools browser extension.

---

### 📱 Phase 5: Mobile-Specific Features

#### Forms
- [ ] Input font-size ≥ 16px (prevents iOS zoom)
- [ ] Appropriate input types (email, tel, number)
- [ ] Autocomplete attributes set
- [ ] Virtual keyboard shows correct layout
- [ ] Validation messages visible
- [ ] Submit buttons ≥ 48px height

#### Navigation
- [ ] Mobile menu accessible
- [ ] Hamburger menu ≥ 44x44px
- [ ] Menu items ≥ 44px height
- [ ] Swipe gestures work (if implemented)
- [ ] Back navigation works
- [ ] Deep links work

#### Tables
- [ ] Convert to cards on mobile
- [ ] All data visible
- [ ] Actions easily accessible
- [ ] Sorting works (if applicable)
- [ ] Filtering works (if applicable)

#### Charts
- [ ] Render at appropriate mobile size
- [ ] Touch tooltips work
- [ ] No horizontal overflow
- [ ] Legends readable
- [ ] Axis labels readable

---

### 🔄 Phase 6: Interaction Testing

#### Touch Gestures
- [ ] Tap/click works
- [ ] Double-tap doesn't zoom (if prevented)
- [ ] Long-press doesn't trigger context menu (if prevented)
- [ ] Swipe gestures work (if implemented)
- [ ] Pinch-to-zoom works on images (if allowed)
- [ ] Pull-to-refresh works (if implemented)

#### Scrolling
- [ ] Smooth scrolling
- [ ] No janky animations
- [ ] Momentum scrolling enabled
- [ ] Scroll position restored
- [ ] Fixed headers remain fixed

#### Animations
- [ ] Smooth 60fps animations
- [ ] No motion sickness triggers
- [ ] Respects prefers-reduced-motion
- [ ] Loading states animate

---

### 🌐 Phase 7: Browser Testing

#### iOS Safari
- [ ] iPhone SE
- [ ] iPhone 12
- [ ] iPad Mini
- [ ] Touch events work
- [ ] Forms work correctly

#### Chrome (Android)
- [ ] Galaxy S21
- [ ] Pixel 5
- [ ] Touch events work
- [ ] Forms work correctly

#### Chrome (iOS)
- [ ] Basic functionality works
- [ ] Touch events work

#### Samsung Internet
- [ ] Galaxy devices
- [ ] Basic functionality works

---

### 📊 Phase 8: PWA Testing

#### Manifest
- [ ] manifest.json present and valid
- [ ] Icons provided (192x192, 512x512)
- [ ] Name and description set
- [ ] Theme color set
- [ ] Display mode set
- [ ] Start URL correct

#### Service Worker
- [ ] Registers successfully
- [ ] Caches critical assets
- [ ] Offline fallback works
- [ ] Updates properly

#### Install Prompt
- [ ] Shows on eligible devices
- [ ] Install works correctly
- [ ] App launches from home screen
- [ ] Splash screen shows

---

### 🔍 Phase 9: Edge Cases

#### Network Conditions
- [ ] Works on 3G
- [ ] Works on slow WiFi
- [ ] Handles offline gracefully
- [ ] Retries failed requests
- [ ] Shows loading states

#### Device Capabilities
- [ ] Works without JavaScript (basic)
- [ ] Works with ad blockers
- [ ] Works with reduced motion
- [ ] Works with high contrast mode
- [ ] Works with dark mode

#### Content Edge Cases
- [ ] Long names/titles
- [ ] Empty states
- [ ] Error states
- [ ] Loading states
- [ ] No data scenarios

---

### ✅ Final Validation

#### Automated Tests
```bash
# Run all tests
npm run test

# Run specific suites
npm run test -- tests/mobile-responsive.spec.ts
npm run test -- tests/accessibility.spec.ts
npm run test -- tests/performance.spec.ts
npm run test -- tests/touch-compliance.spec.ts
npm run test -- tests/horizontal-scroll.spec.ts
npm run test -- tests/visual-regression.spec.ts
```

#### Manual Testing Checklist
- [ ] Real device testing (minimum 3 devices)
- [ ] Different network speeds tested
- [ ] All user flows completed successfully
- [ ] No console errors
- [ ] No network errors
- [ ] Performance feels smooth

#### Success Criteria
- [ ] ✅ 0 accessibility violations (WCAG 2.1 AA)
- [ ] ✅ 100% touch target compliance
- [ ] ✅ 0 horizontal scroll issues
- [ ] ✅ LCP < 2.5s on 3G
- [ ] ✅ Lighthouse accessibility score > 95
- [ ] ✅ All automated tests passing
- [ ] ✅ Manual testing complete

---

## Testing Tools

### Required
- Chrome DevTools (Device Toolbar)
- Playwright (`npm run test`)
- axe DevTools (Browser extension)

### Recommended
- BrowserStack (Real device testing)
- Percy (Visual regression)
- WebPageTest (Performance)
- WAVE (Accessibility)

### Optional
- Lighthouse CI
- Chrome UX Report
- Firebase Performance Monitoring

---

## Reporting Issues

When filing a mobile bug, include:

1. **Device**: iPhone 12, Galaxy S21, etc.
2. **Browser**: Safari 15.6, Chrome 108, etc.
3. **Viewport**: 390x844
4. **Screenshot/Video**: Visual proof
5. **Steps**: How to reproduce
6. **Expected**: What should happen
7. **Actual**: What actually happens

---

## Continuous Testing

### On Every PR
- [ ] Run automated test suite
- [ ] Check no new accessibility violations
- [ ] Verify no new horizontal scroll issues
- [ ] Confirm touch targets maintained

### Weekly
- [ ] Full device matrix testing
- [ ] Performance audit
- [ ] Visual regression check

### Monthly
- [ ] Real device testing
- [ ] Full accessibility audit
- [ ] User testing session

---

## Quick Commands

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Run all tests
npm run test

# Run tests in UI mode
npm run test -- --ui

# Run specific test file
npm run test -- tests/mobile-responsive.spec.ts

# Update visual regression baselines
npm run test -- tests/visual-regression.spec.ts --update-snapshots

# View test report
npx playwright show-report
```
