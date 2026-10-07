# Development journal

Troubleshooting notes and lessons from building the cloud resume.

These entries preserve the original development record. They describe earlier versions of the project, so recorded fixes should not be assumed to be active in the current source. Original line numbers identify symptoms in those earlier versions.

Return to the [project overview](README.md).

## Contents

- [Issue 1: HTML content did not render](#issue-1-html-content-did-not-render)
- [Issue 2: Content was clipped at the top](#issue-2-content-was-clipped-at-the-top)
- [Issue 3: Click-to-reveal interaction did not work](#issue-3-click-to-reveal-interaction-did-not-work)
- [Issue 4: Printing produced blank pages](#issue-4-printing-produced-blank-pages)
- [Issue 5: Text colors differed between sections](#issue-5-text-colors-differed-between-sections)

## Issue 1: HTML content did not render

### Symptom

Content above line 101 was not rendering as expected in the browser.

### Recorded cause

The development notes identified several unclosed tags:

- A list item was not closed before another list began.
- A paragraph around a job title was not closed before the following list.
- A section was not closed before subsequent sections.

These errors changed how the browser parsed the document. Browsers recover from invalid markup, so the resulting DOM can differ from the structure intended in the source.

### Recorded fix

Close list items, end job-title paragraphs before their following lists, and close each section at its intended boundary.

### Lesson

Inspect the Elements panel in browser DevTools and compare the parsed DOM with the source. Validate nesting as well as closing tags. Some HTML end tags can be omitted legally; invalid nesting and the resulting DOM are the diagnostic focus.

### Current source note

The Technical Skills list in `index.html` still includes paragraph tags around list items. That markup requires a separate validation pass; this journal cleanup does not establish that the current HTML is fully valid.

## Issue 2: Content was clipped at the top

### Symptom

After the HTML fixes, content above line 84 still appeared missing.

### Recorded cause

The notes identified two issues in an earlier file named `style-2.css`:

1. Missing closing braces caused CSS rules to be parsed incorrectly.
2. A body constrained to `height: 100vh` with vertically centered flex content allowed a tall resume to extend above the visible viewport.

### Recorded fix

Add the missing closing braces and replace the fixed-height layout with:

```css
body {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}
```

This is an excerpt of the recorded layout changes, not a replacement for the full stylesheet.

### Lesson

Check CSS syntax before investigating individual styles. A minimum height lets the body grow with the document. A fixed height combined with centered overflow can make the top of a long page difficult to reach; `height: 100vh` alone does not universally disable scrolling.

### Current source note

The repository contains `style.css`, not `style-2.css`. Its body rule uses `min-height: 100vh` but retains `align-items: center`. The earlier alignment change is therefore a historical fix rather than an exact description of today's stylesheet.

## Issue 3: Click-to-reveal interaction did not work

### Symptom

Clicking redacted elements with the `.spoiler` class did nothing.

### Recorded cause

CSS defined the hidden and revealed appearances, but the JavaScript handlers had not been added to `index.html`. Nothing toggled the `.revealed` class.

### Recorded fix

Add event handlers before the closing body tag:

```javascript
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

### Lesson

CSS defines how a class appears. This implementation uses JavaScript to change the class when the user interacts with the element.

Check that the markup, styles, and event handlers are connected. For the keyboard handler to work, the target must also be focusable; a native button is often a suitable control.

### Current source note

`spoiler.js` contains these handlers but is not referenced by the current page. A similar inline script in `index.html` is commented out, and the current stylesheet does not define spoiler states. The interaction is an inactive experiment.

## Issue 4: Printing produced blank pages

### Symptom

The notes report that `window.print()` generated one or two blank pages after the resume content.

### Recorded cause

The screen flex layout and trailing spacing were identified as contributors to the print renderer's pagination.

### Recorded fix

The original notes describe adding these rules to a print media block:

```css
@media print {
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

  section:last-child,
  div:last-child,
  p:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}
```

### Lesson

Test print output separately from screen output. Print-specific layout and spacing can change pagination. Switching the body to block layout addressed the recorded case; the result should still be checked in the target browser and paper size.

### Current source note

The current `style.css` has no `@media print` block. This example preserves the recorded fix and would need to be applied and verified separately.

## Issue 5: Text colors differed between sections

### Symptom

Technical Skills, Certifications, and Education text appeared darker than the rest of the resume.

### Recorded cause

The rule `p { color: #555; }` selected paragraphs. Content in list items was not selected by that rule and did not inherit the intended color from an ancestor.

### Recorded fix

Select both paragraphs and list items:

```css
p,
li {
  color: #555;
}
```

### Lesson

A rule selecting one element type does not automatically select another. Color is inherited through ancestors unless another declaration overrides it; inheritance is not restricted to explicit rules on a direct parent.

When similar sections look different, compare their element types and computed styles.

### Current source note

The current stylesheet includes the shared `p, li` color rule.

## Recording future issues

For each new issue, record the symptom, relevant source version, diagnosis, fix, verification result, and lesson. Include the conditions needed to reproduce it, such as viewport size or print settings.

Keep historical observations separate from the current implementation so another reader can tell what was tried and what remains active.
