# Mobile Testing Guide - Fashionistas Platform

## Quick Testing Checklist

### Visual Testing (In Lovable)
1. Click the **device icon** above the preview window
2. Test each breakpoint:
   - 📱 Mobile (375px)
   - 📱 Mobile Large (414px)
   - 📱 Tablet (768px)
   - 💻 Desktop (1024px+)

### Key Areas to Test

#### ✅ SponsorsListDashboard
**Desktop View:**
- [ ] Table displays all columns clearly
- [ ] Hover states work on rows
- [ ] Action buttons are visible
- [ ] Pagination shows all page numbers

**Mobile View:**
- [ ] Cards display instead of table
- [ ] Company logo + name + tier badge visible
- [ ] Investment amount prominently shown
- [ ] Email/phone buttons are touch-friendly (44px)
- [ ] Pagination shows "X / Y" format
- [ ] Only prev/next buttons visible

#### ✅ Touch Targets
**All Interactive Elements:**
- [ ] Buttons minimum 44x44px
- [ ] Links have adequate spacing
- [ ] No overlapping tap targets
- [ ] Easy to tap on first try

#### ✅ Typography
**Text Scaling:**
- [ ] Headings scale down on mobile
- [ ] Body text remains readable (14px+)
- [ ] No text overflow or clipping
- [ ] Line height comfortable for reading

#### ✅ Navigation
**Mobile Menu:**
- [ ] Hamburger menu works
- [ ] Sidebar collapses properly
- [ ] All links accessible
- [ ] Smooth transitions

### Testing Components

#### ResponsiveTable
```tsx
// Test cases:
1. Empty state display
2. Single row
3. Multiple rows (pagination)
4. Long text content (truncation)
5. Custom mobile card render
6. Row click navigation
```

#### ChartResponsive
```tsx
// Test cases:
1. Chart renders at mobile height (250px)
2. Touch tooltips work
3. No horizontal overflow
4. Legends remain visible
5. Axis labels readable
```

### Performance Testing

#### Load Times
- [ ] Initial page load < 2s on 3G
- [ ] Chart rendering smooth
- [ ] No layout shifts
- [ ] Images load progressively

#### Interactions
- [ ] Tap response immediate
- [ ] Scroll smooth (60fps)
- [ ] No touch delays
- [ ] Animations smooth

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all elements
- [ ] Focus indicators visible
- [ ] Skip links work
- [ ] Modal traps focus

#### Screen Reader
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] ARIA labels present
- [ ] Heading hierarchy correct

### Browser Testing Matrix

| Browser | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Safari iOS | ✅ | ✅ | N/A |
| Chrome Android | ✅ | ✅ | ✅ |
| Chrome iOS | ✅ | ✅ | N/A |
| Firefox Android | 🔄 | 🔄 | ✅ |
| Samsung Internet | ✅ | ✅ | N/A |

### Common Issues & Fixes

#### Issue: Text too small on mobile
**Fix:** Check if `.ds-*` typography classes are applied

#### Issue: Buttons too small to tap
**Fix:** Ensure `min-touch` class is applied

#### Issue: Table overflow on mobile
**Fix:** Verify ResponsiveTable is being used

#### Issue: Charts cut off
**Fix:** Wrap in ChartResponsive component

### Reporting Issues

When reporting mobile issues, include:
1. Device/browser details
2. Screenshot or video
3. Steps to reproduce
4. Expected vs actual behavior
5. Viewport size

### Quick Fixes Commands

```bash
# Run type check
npm run type-check

# View build output
npm run build

# Test mobile viewport
# In browser DevTools: Toggle device toolbar (Cmd+Shift+M)
```

### Phase 1 Completed Components

✅ **Working on Mobile:**
- SponsorsListDashboard (table → cards)
- Pagination (responsive buttons)
- Touch targets (44px minimum)
- Typography scaling
- Design system utilities

🔄 **In Progress:**
- BookingsDashboard tables
- Chart mobile optimization
- Form layouts
- Dropdown interactions

📅 **Planned:**
- PWA functionality
- Offline support
- Advanced gestures
- Performance monitoring

### Success Criteria

- ✅ All touch targets ≥ 44px
- ✅ No horizontal scroll on any page
- ✅ Text readable without zoom
- ✅ Page load < 2.5s on 3G
- ✅ WCAG 2.1 AA compliant
- ✅ Works on iPhone SE (smallest)

### Resources

- [Lovable Mobile Testing Docs](https://docs.lovable.dev/testing/mobile)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Mobile-First CSS](https://web.dev/responsive-web-design-basics/)
- [Touch-Friendly Design](https://www.lukew.com/ff/entry.asp?1085)
