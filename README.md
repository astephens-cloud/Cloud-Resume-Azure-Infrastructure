# Cloud-Resume-Azure-Infrastructure
Assets and Dev Journal for Cloud Resume Deployment on Azure Infrastructure

# Dev Journal — Resume Project Debugging Notes

## Issue 1: HTML Not Rendering Above a Certain Line

**Problem:** Content above line 101 was not rendering in the browser at all.

**Root Cause:** A cascade of unclosed HTML tags:
- A `<li>` element was never closed, causing the parser to swallow the next `<ul>` as content
- A `<p>` tag wrapping a job title was not closed before the next `<ul>` began
- A `<section>` was never closed, causing nested sections the browser couldn't resolve

**Fix:**
- Closed all open `<li>` tags at the end of each bullet list
- Added `</p>` after each job title line before the `<ul>`
- Added `</section>` to properly close each section block

**Key Learning:** Browsers attempt to "correct" malformed HTML silently, which can cause
entire sections to disappear rather than throwing a visible error. Always validate HTML
structure with the browser DevTools Elements panel — unclosed tags are easy to spot there.

---

## Issue 2: Content Clipped at Top of Page (Nothing Above Line 84 Visible)

**Problem:** After fixing the HTML, content above line 84 still wasn't showing.

**Root Cause:** Two CSS problems in `style-2.css`:
1. Every CSS rule block was missing its closing `}` brace, so almost no styles applied correctly
2. `body` was set to `height: 100vh` with `display: flex; align-items: center` — this locked
   the page to exactly viewport height and vertically centered content, clipping anything
   that overflowed above

**Fix:**
- Added closing `}` to every rule block in the stylesheet
- Changed `height: 100vh` → `min-height: 100vh` on `body`
- Changed `align-items: center` → `align-items: flex-start`

**Key Learning:** `height: 100vh` on `body` is a common layout trap. It fixes the container
to the screen height, making the page non-scrollable and clipping overflow. Use `min-height`
instead so the page can grow with its content.

---

## Issue 3: Click-to-Reveal Spoiler Redaction Not Working

**Problem:** Clicking on redacted `.spoiler` elements did nothing.

**Root Cause:** The JavaScript that wires up the click handler was never added to `index.html`.
The CSS for the `.spoiler` and `.revealed` classes existed, but without JS toggling the
`.revealed` class, clicks had no effect.

**Fix:** Added a `<script>` block before `</body>`:
```js
document.querySelectorAll('.spoiler').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('revealed'));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.classList.toggle('revealed');
    }
  });
});
```

**Key Learning:** CSS can define *what a state looks like* but JavaScript is required to
*trigger the state change*. When an interactive feature isn't working, check whether all
three layers are present: HTML structure, CSS styling, and JS behavior.

---

## Issue 4: Blank Pages at End of Print PDF

**Problem:** `window.print()` generated 1–2 blank pages after the resume content.

**Root Cause:** `display: flex` on `body` causes the print renderer to calculate a container
height that overflows into an empty second page. Bottom margins on the last elements also
contributed extra whitespace.

**Fix:** Added to the existing `@media print` block:
```css
body {
  display: block;
  height: auto;
  min-height: unset;
  background: white;
  padding: 0;
  margin: 0;
}
.resume {
  box-shadow: none;
  padding-bottom: 0;
  margin-bottom: 0;
}
section:last-child, div:last-child, p:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
}
```

**Key Learning:** Always write a `@media print` block for any page intended to be printed
or saved as PDF. Flexbox and Grid layouts frequently cause phantom blank pages — switching
`body` to `display: block` inside the print query is a reliable fix.

---

## Issue 5: Inconsistent Font Color Between Sections

**Problem:** Text in the Technical Skills, Certifications, and Education sections appeared
darker than the rest of the resume body text.

**Root Cause:** The CSS rule `p { color: #555; }` applied the muted gray to paragraph text,
but those sections used `<li>` tags directly with no `<p>` wrapper. `<li>` had no color
set, so it fell back to the browser default near-black.

**Fix:** Extended the color rule to include `li`:
```css
p, li {
  color: #555;
}
```

**Key Learning:** CSS color is inherited but only from *direct parent rules*. When you
set a color on one element type (`p`) and use a different element type (`li`) for similar
content, the style won't carry over automatically. When sections look visually inconsistent,
check whether they use different HTML elements that may have different or missing styles.
