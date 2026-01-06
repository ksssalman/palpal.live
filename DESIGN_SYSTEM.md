# PalPal Design System - Button & Typography Guide

## Overview

A comprehensive, consistent design system for buttons and typography across all screen sizes. This ensures a cohesive, professional UI with predictable behavior on desktop, tablet, and mobile devices.

## Table of Contents

1. [Typography System](#typography-system)
2. [Button System](#button-system)
3. [Usage Examples](#usage-examples)
4. [Responsive Behavior](#responsive-behavior)
5. [Best Practices](#best-practices)

---

## Typography System

### CSS Variables
All typography uses CSS variables for consistency:

```css
--font-size-xs: 0.75rem (12px)
--font-size-sm: 0.875rem (14px)
--font-size-base: 1rem (16px)
--font-size-lg: 1.125rem (18px)
--font-size-xl: 1.25rem (20px)
--font-size-2xl: 1.5rem (24px)
--font-size-3xl: 2.5rem (40px)
--font-size-4xl: 4rem (64px)

--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800

--line-height-tight: 1.2
--line-height-normal: 1.5
--line-height-relaxed: 1.75
```

### Typography Classes

#### Display Heading (Logo)
```html
<h1 class="display-heading">PalPal</h1>
```
- **Size**: 4rem (64px) desktop, 3rem (48px) tablet, 2.5rem (40px) mobile
- **Weight**: Extra Bold (800)
- **Color**: Gradient purple
- **Use**: Main brand logo/heading
- **Responsive**: Automatic scaling

#### Section Heading
```html
<h2 class="section-heading">Our Projects</h2>
```
- **Size**: 2.5rem (40px) desktop, 2rem (32px) mobile
- **Weight**: Bold (700)
- **Color**: Dark purple (#541342)
- **Use**: Main section titles
- **Spacing**: Margin-bottom 1rem

#### Heading 1
```html
<h3 class="heading-1">Project Title</h3>
```
- **Size**: 1.5rem (24px)
- **Weight**: Bold (700)
- **Color**: Dark purple
- **Use**: Card titles, subsections

#### Heading 2
```html
<h4 class="heading-2">Subtitle</h4>
```
- **Size**: 1.25rem (20px)
- **Weight**: Semi-bold (600)
- **Color**: Dark purple
- **Use**: Secondary headings

#### Tagline
```html
<p class="tagline">live every moment, pal</p>
```
- **Size**: 1.5rem (24px) desktop, 1rem (16px) mobile
- **Weight**: Light (300)
- **Color**: Medium purple (70% opacity)
- **Spacing**: 3rem margin-bottom
- **Letter-spacing**: Wide

#### Body Text
```html
<p class="body-text">Regular paragraph text</p>
```
- **Size**: 1rem (16px)
- **Weight**: Normal (400)
- **Color**: Dark purple
- **Line-height**: 1.75 (relaxed)
- **Use**: Main content

#### Body Text - Secondary
```html
<p class="body-text-secondary">Secondary text</p>
```
- **Size**: 1rem (16px)
- **Weight**: Normal (400)
- **Color**: Medium purple (70% opacity)
- **Use**: Supporting text

#### Description Text
```html
<p class="description-text">Longer description paragraph</p>
```
- **Size**: 1.125rem (18px)
- **Weight**: Normal (400)
- **Color**: Medium purple
- **Margin-bottom**: 2rem
- **Use**: Section introductions

#### Small Text
```html
<small class="small-text">Small supporting text</small>
```
- **Size**: 0.875rem (14px)
- **Weight**: Normal (400)
- **Color**: Light purple (60% opacity)
- **Use**: Additional info, metadata

#### Extra Small Text
```html
<span class="xs-text">Tiny text</span>
```
- **Size**: 0.75rem (12px)
- **Weight**: Normal (400)
- **Color**: Very light purple (50% opacity)
- **Use**: Captions, timestamps

#### Caption Text
```html
<span class="caption-text">Label</span>
```
- **Size**: 0.875rem (14px)
- **Weight**: Medium (500)
- **Color**: Light purple
- **Transform**: Uppercase
- **Letter-spacing**: 0.05em
- **Use**: Labels, badges

#### Link Text
```html
<a href="#" class="link-text">Click here</a>
```
- **Color**: Dark purple
- **Weight**: Semi-bold (600)
- **Hover**: Lighter purple, underlined
- **Use**: Hyperlinks

---

## Button System

### CSS Variables
```css
/* Primary Button */
--button-primary-bg: #541342
--button-primary-hover: #3d0e30
--button-primary-text: white

/* Secondary Button */
--button-secondary-bg: rgba(84, 19, 66, 0.1)
--button-secondary-hover: rgba(84, 19, 66, 0.15)
--button-secondary-text: #541342
--button-secondary-border: rgba(84, 19, 66, 0.2)

/* Ghost Button */
--button-ghost-bg: rgba(255, 255, 255, 0.2)
--button-ghost-hover: rgba(255, 255, 255, 0.3)
--button-ghost-text: white
--button-ghost-border: rgba(255, 255, 255, 0.3)

/* Sizes */
--button-sm-padding: 0.5rem 1rem
--button-md-padding: 0.75rem 1.5rem
--button-lg-padding: 1rem 2rem
--button-xl-padding: 1.25rem 3rem
```

### Button Types

#### Primary Button
```html
<button class="btn btn-primary btn-md">Primary Action</button>
<a href="#" class="btn btn-primary btn-md">Link Button</a>
```
- **Background**: Dark purple (#541342)
- **Text**: White
- **Shadow**: Medium shadow (md)
- **Hover**: Darker purple, lifted up (-2px), enhanced shadow
- **Use**: Main actions, CTAs
- **Responsive**: Padding adjusts automatically

#### Secondary Button
```html
<button class="btn btn-secondary btn-md">Secondary Action</button>
```
- **Background**: Light purple (10% opacity)
- **Text**: Dark purple
- **Border**: 1px light purple border
- **Hover**: Slightly darker background, darker border
- **Use**: Alternative actions, less emphasis
- **Responsive**: Automatically adapts

#### Ghost Button
```html
<button class="btn btn-ghost btn-md">Back</button>
```
- **Background**: Transparent white (20% opacity)
- **Text**: White
- **Border**: 2px white border
- **Hover**: Slightly more opaque, lifted
- **Use**: Secondary navigation, back buttons
- **Responsive**: Padding scales

#### Text Button
```html
<button class="btn btn-text">Simple Link</button>
```
- **Background**: None
- **Text**: Dark purple, underlined
- **Hover**: Darker purple
- **Shadow**: None
- **Use**: Minimal actions, help text

#### Icon Button
```html
<button class="btn btn-icon-primary">→</button>
<button class="btn btn-icon-secondary">+</button>
```
- **Style**: Circular button (50% border-radius)
- **Primary**: Uses primary colors
- **Secondary**: Uses secondary colors
- **Use**: Icon-only actions

### Button Sizes

All buttons have 4 predefined sizes:

#### Small (sm)
```html
<button class="btn btn-primary btn-sm">Small</button>
```
- **Padding**: 0.5rem 1rem
- **Font**: 0.875rem
- **Use**: Compact areas, inline

#### Medium (md)
```html
<button class="btn btn-primary btn-md">Medium</button>
```
- **Padding**: 0.75rem 1.5rem
- **Font**: 1rem
- **Use**: Default size, most common

#### Large (lg)
```html
<button class="btn btn-primary btn-lg">Large</button>
```
- **Padding**: 1rem 2rem
- **Font**: 1.125rem
- **Use**: Emphasis, important actions

#### Extra Large (xl)
```html
<button class="btn btn-primary btn-xl">Call to Action</button>
```
- **Padding**: 1.25rem 3rem
- **Font**: 1.25rem
- **Use**: Main CTA, hero sections

### Button Modifiers

#### Block Button (Full Width)
```html
<button class="btn btn-primary btn-block">Full Width</button>
```
- **Display**: Block (full width)
- **Text-align**: Center
- **Use**: Forms, mobile-friendly actions

#### Loading State
```html
<button class="btn btn-primary loading">Loading...</button>
```
- **State**: Visual spinner appears
- **Cursor**: Changes to wait
- **Opacity**: Reduced
- **Behavior**: Disabled interaction

#### Disabled State
```html
<button class="btn btn-primary" disabled>Disabled</button>
```
- **Opacity**: 60%
- **Cursor**: Not-allowed
- **No hover effects**: Disabled

#### Button Group
```html
<div class="btn-group">
  <button class="btn btn-primary btn-md">Option 1</button>
  <button class="btn btn-secondary btn-md">Option 2</button>
</div>
```
- **Gap**: 1rem between buttons
- **Flex**: Horizontal by default
- **Responsive**: Stacks on mobile

#### Vertical Button Group
```html
<div class="btn-group vertical">
  <button class="btn btn-primary btn-md">First</button>
  <button class="btn btn-secondary btn-md">Second</button>
</div>
```
- **Direction**: Column
- **Gap**: 0.5rem
- **Use**: Modal buttons, forms

---

## Usage Examples

### Navigation Buttons

```html
<!-- Sign In Button (Nav) -->
<a href="auth.html" class="nav-auth-btn">Sign In</a>

<!-- Mobile Version -->
<a href="auth.html" class="nav-auth-btn nav-auth-btn.mobile-block">Sign In</a>

<!-- Signed Out Button -->
<a href="javascript:void(0)" class="nav-auth-btn btn-secondary">Sign Out</a>
```

### CTA Button

```html
<!-- Desktop CTA -->
<a href="#projects" class="cta-button btn-primary btn-xl">
  Explore Projects →
</a>

<!-- Responsive: Automatically scales on tablet and mobile -->
```

### Back Button

```html
<!-- Ghost Style Back Button -->
<button class="back-button btn-ghost btn-md">
  ← Back to Home
</button>
```

### Project Cards

```html
<div class="project-card">
  <h3 class="heading-1">Work Tracker</h3>
  <p class="body-text-secondary">Project description text</p>
  <a href="#" class="btn btn-primary btn-md">View Project</a>
</div>
```

### Form Elements

```html
<form>
  <label class="caption-text">Email Address</label>
  <input type="email" placeholder="Enter email">

  <div class="btn-group">
    <button type="submit" class="btn btn-primary btn-lg">Submit</button>
    <button type="reset" class="btn btn-secondary btn-lg">Reset</button>
  </div>
</form>
```

---

## Responsive Behavior

### Tablet (max-width: 768px)
- **Display Heading**: 3rem (down from 4rem)
- **Section Heading**: 2rem (down from 2.5rem)
- **Tagline**: 1.2rem (down from 1.5rem)
- **CTA Button**: 1rem padding, 1.1rem font
- **Button Group**: Gap reduces to 0.75rem

### Mobile (max-width: 480px)
- **Display Heading**: 2.5rem
- **Section Heading**: 2rem
- **Tagline**: 1rem
- **All Buttons**: Consistent md size (padding 0.75rem 1.5rem, font 1rem)
- **CTA Button**: 0.9rem padding, 1rem font
- **Button Group**: Vertical stacking, 0.5rem gap
- **Large Buttons**: Downsize to md for mobile

### Breakpoint Strategy

**Desktop (1920px+)**
- Full typography hierarchy
- All button sizes available
- Horizontal layouts

**Tablet (768px - 1919px)**
- Slightly smaller headings
- Adjusted button padding
- Mixed layouts

**Mobile (≤480px)**
- Largest text relative to screen
- Consistent button sizes
- Vertical stacking by default
- Full-width buttons where appropriate

---

## Best Practices

### Typography Rules

✅ **DO:**
- Use semantic HTML (`<h1>`, `<h2>`, `<p>`)
- Apply class names for consistent styling
- Pair classes with semantic tags (e.g., `<h2 class="section-heading">`)
- Use CSS variables for consistency
- Maintain proper hierarchy

❌ **DON'T:**
- Mix different heading classes randomly
- Use `<div>` when you should use `<p>` or `<h*>`
- Create custom font sizes (use the system)
- Hardcode colors (use CSS variables)

### Button Rules

✅ **DO:**
- Combine base class with type and size: `btn btn-primary btn-md`
- Use semantic HTML (`<button>` for actions, `<a>` for links)
- Provide clear, action-oriented text
- Use loading state for async operations
- Group related buttons

❌ **DON'T:**
- Use inline styles on buttons
- Create custom button sizes
- Mix button types confusingly (e.g., 3 primary buttons)
- Forget disabled states
- Make buttons too small for touch (min 44px)

### Accessibility

- ✅ Use focus-visible outline for keyboard navigation
- ✅ Provide `aria-label` for icon buttons
- ✅ Ensure sufficient color contrast
- ✅ Use semantic HTML
- ✅ Support keyboard interactions

### Performance

- ✅ Use CSS variables (no runtime calculations)
- ✅ Leverage inheritance for defaults
- ✅ Minimize specificity
- ✅ Cache computed styles

---

## Migration Guide

### Old Way → New Way

#### Buttons
```html
<!-- Old -->
<a href="#" class="cta-button">Click</a>
<button class="nav-auth-btn secondary">Sign Out</button>

<!-- New -->
<a href="#" class="cta-button btn-primary btn-xl">Click</a>
<button class="nav-auth-btn btn-secondary">Sign Out</button>
```

#### Typography
```html
<!-- Old -->
<div class="logo">PalPal</div>
<div class="tagline">Tagline</div>

<!-- New -->
<h1 class="display-heading">PalPal</h1>
<p class="tagline">Tagline</p>
```

---

## Component Examples

### Header with CTA
```html
<div class="logo-container">
  <img src="logo.png" alt="Logo">
  <h1 class="display-heading">PalPal</h1>
</div>
<p class="tagline">live every moment, pal</p>
<a href="#projects" class="cta-button btn-primary btn-xl">
  Explore Projects →
</a>
```

### Project Card
```html
<div class="project-card">
  <div class="project-icon">💼</div>
  <h3 class="heading-1">Work Tracker</h3>
  <p class="body-text-secondary">Track your work sessions</p>
  <span class="project-status">🟢 Live</span>
  <a href="#" class="btn btn-primary btn-md">View</a>
</div>
```

### Modal with Buttons
```html
<div class="modal">
  <h2 class="section-heading">Confirm Action</h2>
  <p class="body-text">Are you sure?</p>
  <div class="btn-group vertical">
    <button class="btn btn-primary btn-lg">Confirm</button>
    <button class="btn btn-secondary btn-lg">Cancel</button>
  </div>
</div>
```

---

## CSS File Reference

- **typography-system.css** - All typography classes
- **button-system.css** - All button classes and states
- **buttons.css** - Legacy button styles (for backward compatibility)
- **typography.css** - Legacy typography (for backward compatibility)
- **responsive.css** - All media queries

---

## Questions & Support

For detailed module documentation: See [MODULARIZATION_GUIDE.md](MODULARIZATION_GUIDE.md)

For implementation: Check module JSDoc comments

For examples: Review this document and HTML files
