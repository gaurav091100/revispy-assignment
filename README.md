# CodeHurdle — Landing Page

A production-ready public landing page for **CodeHurdle**, a platform that helps aspiring
software engineers prepare for technical interviews through structured practice.

Built for the CodeHurdle Frontend Engineer Hiring Assessment.

**Live deployment:** _add your Vercel URL here after deploying_

---

## Tech Stack

| Layer      | Choice                                    |
| ---------- | ----------------------------------------- |
| Framework  | Next.js (App Router)                      |
| Language   | TypeScript (strict mode)                  |
| Styling    | Tailwind CSS                              |
| Animation  | Framer Motion (scroll reveals only)       |
| Icons      | lucide-react                              |
| Fonts      | `next/font` — Inter (UI), JetBrains Mono  |


---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (next/core-web-vitals)
```

---

## Folder Structure

```
app/
  layout.tsx          Root layout: fonts, metadata, global <html>/<body>
  page.tsx            Composes all sections into the homepage
  globals.css         Tailwind layers + base rules + reduced-motion handling

components/
  layout/
    Header.tsx         Sticky nav, responsive mobile menu
    Footer.tsx          Sitemap, socials, legal row
  sections/
    Hero.tsx            Value prop, primary CTA, product visual
    ProductOverview.tsx How the product works
    Features.tsx         Key features grid
    WhyChoose.tsx        Why CodeHurdle (value props)
    Testimonials.tsx     Social proof
    FAQ.tsx              Accessible accordion
    CTA.tsx              Final call-to-action
  ui/
    Button.tsx           Single Button impl (renders <Link> or <button>)
    Badge.tsx            Eyebrow pill
    Container.tsx        Shared max-width/gutter wrapper
    SectionHeading.tsx   Shared eyebrow + title + subtitle pattern
    Reveal.tsx           Scroll-reveal wrapper (Framer Motion)

constants/
  index.ts             All landing page content / static data (single source of truth)

lib/
  types.ts             Shared content types
  utils.ts             cn() class-merging helper
```

**Why this structure:** `layout` vs `sections` vs `ui` separates three different kinds of
components — chrome that wraps every page, page-specific content blocks, and small
generic primitives reused across blocks. Content lives in `constants/index.ts` rather than
inline in JSX so that copy changes don't require touching component logic, and so a
non-engineer could plausibly edit copy without reading component code.

---

## Key Engineering Decisions

- **Server components by default.** Only components that need interactivity or browser
  APIs (`Header`, `FAQ`, `Reveal`) are marked `"use client"`. Everything else — Hero,
  Features, Testimonials, Footer — renders on the server, which keeps the client JS
  bundle smaller and content visible without waiting on hydration.
- **One `Button` component, two render targets.** Rather than a `<Button>` and a separate
  `<LinkButton>`, a single component renders a Next.js `<Link>` when `href` is passed and
  a native `<button>` otherwise. This keeps semantics correct (navigation vs. action)
  without forcing every call site to pick the right primitive manually.
- **Content/UI separation.** All copy for features, FAQs, testimonials, and nav links is
  centralized in `constants/index.ts`, typed via `lib/types.ts`. Components map over this data
  rather than hardcoding repeated JSX blocks — adding a 7th feature or FAQ item means
  editing an array, not duplicating markup.
- **Animation used to guide, not decorate.** The only motion is a one-time,
  viewport-triggered fade/lift (`Reveal`) as sections enter view, plus a hover state on
  interactive cards. Nothing loops, auto-plays, or animates on every scroll frame — and
  `prefers-reduced-motion` is respected globally in `globals.css`.
- **Design tokens over inline hex values.** Brand colors, the ink/dark palette, and the
  grid-pattern background are defined once in `tailwind.config.ts`, so the visual system
  is centralized and consistent rather than copy-pasted per component.
- **Accessibility as a default, not an add-on:** semantic landmarks (`header`, `main`,
  `nav`, `footer`), a skip-to-content link, `aria-expanded`/`aria-controls` on the FAQ
  accordion, visible focus rings on every interactive element, and `sr-only` labels
  where icon-only buttons would otherwise be ambiguous (mobile menu toggle, social icons).

## Product Thinking

The page follows a deliberate order: **Hero → How it works → Features → Why us →
Testimonials → FAQ → CTA → Footer.**

- The hero leads with the core differentiator ("tells you what to practice next") rather
  than a generic "learn to code" tagline, since the target user (someone already
  practicing on scattered problem archives) needs to immediately see what's different.
- "How it works" comes before the feature grid because a first-time visitor should
  understand the *loop* (diagnose → practice → simulate) before being handed a list of
  individual features — features make more sense once the mental model exists.
- FAQ is placed just before the final CTA deliberately: it's the last place hesitation
  gets addressed before asking for the click.
- Every CTA button routes to the same `#cta` anchor or a signup action — there's exactly
  one primary action on the page ("start practicing"), with secondary actions
  (`sign in`, `see how it works`) visually and semantically de-emphasized.

## Assumptions Made

- No real backend, auth, or payment flow exists — all buttons are wired to in-page
  anchors or placeholder `href="#"`, since the assessment scope is the landing page only.
- Testimonials, stats (42K+ users, 1,200+ problems), and FAQ content are illustrative
  placeholder copy written for a plausible ed-tech interview-prep product, not sourced
  from a real CodeHurdle dataset.
- Dark theme was chosen deliberately (common in developer-tooling products) over a light
  theme, as it fits an audience of engineers and reads as more "product," less "marketing
  site."
- Desktop nav collapses to a hamburger menu below `md` (768px); no tablet-specific nav
  variant was built since the two-state (mobile/desktop) pattern covers the realistic
  range of visitors to a landing page.

## Future Improvements

Given more time, next priorities would be:

1. Wire the CTA buttons to a real signup flow / waitlist form with client-side validation.
2. Add an OpenGraph/Twitter preview image and a proper favicon set.
3. Add unit tests for the FAQ accordion's keyboard interaction and the Button's dual
   render paths (React Testing Library).
4. Add a lightweight analytics hook on primary CTA clicks to measure conversion by
   section (e.g. did they click from the hero or after reading FAQ?).
5. Visual regression testing (Playwright + screenshot diffing) to guard the design system
   as sections are edited independently.
