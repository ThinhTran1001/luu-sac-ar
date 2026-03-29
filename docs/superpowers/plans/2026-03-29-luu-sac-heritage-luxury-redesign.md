# Luu Sac — Heritage Luxury UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all user-facing pages of the Luu Sac e-commerce platform with a Heritage Luxury design — slate blue primary + heritage green accent + gold accents — inspired by DangHinhDisan.com.

**Architecture:** CSS-first approach: add new design tokens to `globals.css`, then cascade updates to each component. No data or API changes. Each component updated in isolation using existing shadcn/ui patterns.

**Tech Stack:** Next.js 14, Tailwind CSS v4, shadcn/ui, Lucide React, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-03-29-luu-sac-heritage-luxury-redesign.md`

---

## Chunk 1: Design Tokens & Base CSS
*Files: `apps/web/src/app/globals.css`*

- [ ] **Step 1: Read current globals.css**
  Read: `apps/web/src/app/globals.css`

- [ ] **Step 2: Add new heritage CSS tokens**

  In the `:root {}` block, add after the existing `--chart-*` variables:

  ```css
  --accent-green: #3d6b35;
  --accent-green-light: #4a7d42;
  --accent-gold: #c9a84c;
  --accent-gold-light: #d4ba6a;
  ```

- [ ] **Step 3: Add gold to Tailwind theme**

  In the `@theme inline {}` block, add:

  ```css
  --color-accent-green: var(--accent-green);
  --color-accent-green-light: var(--accent-green-light);
  --color-accent-gold: var(--accent-gold);
  --color-accent-gold-light: var(--accent-gold-light);
  ```

  Note: `--accent-green-light` (#4a7d42) and `--accent-gold-light` (#d4ba6a) are used as hover state variants in Chunks 4 and 6 — without their `--color-*` counterparts in `@theme`, `hover:bg-accent-gold-light` would silently have no effect.

- [ ] **Step 4: Add gold divider utility**

  Add at end of file:

  ```css
  .gold-divider {
    border: none;
    border-top: 1px solid var(--accent-gold);
    opacity: 0.4;
  }
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/app/globals.css
  git commit -m "feat(ui): add heritage green and gold CSS tokens"
  ```

---

## Chunk 2: UserHeader — Navigation Redesign
*Files: `apps/web/src/components/layout/UserHeader.tsx`*

- [ ] **Step 1: Read current UserHeader.tsx**

- [ ] **Step 2: Update header wrapper**

  Change the `<header>` class from:
  ```tsx
  className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white shadow-sm"
  ```
  To:
  ```tsx
  className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)] backdrop-blur-sm shadow-sm"
  ```

- [ ] **Step 3: Update nav links — hover gold style**

  Change each `<Link>` in the desktop nav from:
  ```tsx
  className="text-2xl md:text-lg font-medium text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
  ```
  To:
  ```tsx
  className="text-lg font-luxury font-medium text-[var(--foreground)]/80 hover:text-[var(--accent-gold)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--accent-gold)] hover:after:w-full after:transition-all after:duration-300"
  ```

- [ ] **Step 4: Update mobile nav links**

  Change mobile nav link class from:
  ```tsx
  className="rounded-lg px-4 py-3 text-base font-medium text-[var(--foreground)]/90 hover:bg-[var(--muted)] transition-colors"
  ```
  To:
  ```tsx
  className="rounded-lg px-4 py-3 text-base font-luxury font-medium text-[var(--foreground)]/90 hover:bg-[var(--muted)] hover:border-l-2 hover:border-[var(--accent-gold)] transition-colors"
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/layout/UserHeader.tsx
  git commit -m "feat(ui): redesign UserHeader with gold hover and serif nav"
  ```

---

## Chunk 3: UserFooter — Heritage Footer
*Files: `apps/web/src/components/layout/UserFooter.tsx`*

- [ ] **Step 1: Read current UserFooter.tsx**

- [ ] **Step 2: Update footer background**

  Change footer from:
  ```tsx
  className="border-t border-[var(--border)] bg-[#e8dfd0] py-14"
  ```
  To:
  ```tsx
  className="border-t border-[var(--border)] bg-[var(--muted)] py-14"
  ```

- [ ] **Step 3: Update section heading style**

  Change each section heading from:
  ```tsx
  className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-6 after:h-[2px] after:bg-[var(--accent-gold)] after:rounded-full"
  ```

- [ ] **Step 4: Update footer links hover**

  Change footer link class from:
  ```tsx
  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
  ```
  To:
  ```tsx
  className="text-sm text-[var(--foreground)]/80 hover:text-[var(--accent-gold)] transition-colors"
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/layout/UserFooter.tsx
  git commit -m "feat(ui): redesign UserFooter with green labels and gold accents"
  ```

---

## Chunk 4: ProductCard — Hover & Badge Update
*Files: `apps/web/src/components/products/ProductCard.tsx`*

- [ ] **Step 1: Read current ProductCard.tsx**

- [ ] **Step 2: Update card hover — gold border glow**

  Change card class from:
  ```tsx
  className="group overflow-hidden transition-all hover:shadow-md rounded-2xl border-[var(--border)] bg-[var(--card)]"
  ```
  To:
  ```tsx
  className="group overflow-hidden transition-all hover:shadow-lg hover:border-[var(--accent-gold)]/40 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
  ```

- [ ] **Step 3: Update image hover scale**

  Change image class from:
  ```tsx
  className="object-cover transition-transform duration-300 group-hover:scale-105"
  ```
  To:
  ```tsx
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  ```

- [ ] **Step 4: Update badge — green background**

  Change badge class from:
  ```tsx
  className="absolute top-3 right-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] border-0"
  ```
  To:
  ```tsx
  className="absolute top-3 right-3 rounded-lg bg-[var(--accent-green)] text-white border-0 text-xs font-semibold uppercase tracking-wide"
  ```

- [ ] **Step 5: Update product name hover**

  Change name class from:
  ```tsx
  className="font-semibold text-[var(--foreground)] line-clamp-1 hover:text-[var(--primary)] transition-colors"
  ```
  To:
  ```tsx
  className="font-semibold font-luxury text-[var(--foreground)] line-clamp-1 hover:text-[var(--accent-green)] transition-colors"
  ```

- [ ] **Step 6: Update price style**

  Change price from:
  ```tsx
  className="text-xl font-bold text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-xl font-bold text-[var(--accent-gold)]"
  ```

- [ ] **Step 7: Update CTA button**

  Change button class from:
  ```tsx
  className="w-full rounded-xl font-semibold"
  ```
  To:
  ```tsx
  className="w-full rounded-xl font-semibold bg-[var(--primary)] hover:bg-[var(--primary)]/90"
  ```

- [ ] **Step 8: Commit**

  ```bash
  git add apps/web/src/components/products/ProductCard.tsx
  git commit -m "feat(ui): redesign ProductCard with green badge, gold price, gold hover"
  ```

---

## Chunk 5: FeaturedProducts — Section Label Update
*Files: `apps/web/src/components/home/FeaturedProducts.tsx`*

- [ ] **Step 1: Read current FeaturedProducts.tsx**

- [ ] **Step 2: Update section label — green uppercase**

  Change label from:
  ```tsx
  className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)]"
  ```

- [ ] **Step 3: Update section title**

  Change title from:
  ```tsx
  className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]"
  ```
  To:
  ```tsx
  className="text-2xl md:text-3xl font-bold font-luxury tracking-tight text-[var(--foreground)]"
  ```

- [ ] **Step 4: Update view-all button**

  Change button from:
  ```tsx
  className="hidden md:flex gap-2 h-auto py-2 rounded-xl border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
  ```
  To:
  ```tsx
  className="hidden md:flex gap-2 h-auto py-2 rounded-xl border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors"
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/components/home/FeaturedProducts.tsx
  git commit -m "feat(ui): update FeaturedProducts section with green label, serif title, gold CTA"
  ```

---

## Chunk 6: Homepage — Full Redesign
*Files: `apps/web/src/app/(user)/page.tsx`*

- [ ] **Step 1: Read current homepage**

- [ ] **Step 2: Update Hero — overlay + large serif H1**

  Replace the current hero section with the following complete block:
  ```tsx
  <section className="relative min-h-[80vh] md:min-h-[85vh] w-full overflow-hidden -mt-8">
    <Image
      src="/images/luusac-banner.png"
      alt="Lưu Sắc – Gốm sứ cao cấp"
      fill
      priority
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#2c3e50]/80 via-[#2c3e50]/40 to-transparent" />
    <div className="absolute inset-0 flex items-center">
      <div className="container mx-auto px-4 md:px-10 lg:px-20 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--accent-gold)] mb-4">
          Gốm Sứ Nghệ Thuật Việt Nam
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-luxury text-white leading-tight mb-6">
          Nghệ Thuật<br />Trong Từng<br />Tác Phẩm
        </h1>
        <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-md">
          Khám phá bộ sưu tập gốm sứ thủ công tinh xảo, kết hợp truyền thống với thẩm mỹ tối giản hiện đại.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="h-12 px-8 rounded-xl font-semibold bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-white border-0">
            <Link href={ROUTES.PRODUCTS.BASE} className="gap-2">
              Khám Phá <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-xl font-semibold border-white text-white hover:bg-white hover:text-[var(--foreground)]">
            <Link href={ROUTES.ABOUT}>Về Chúng Tôi</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
  ```

- [ ] **Step 3: Add gold dividers between sections**

  After each major section, add:
  ```tsx
  <hr className="gold-divider my-2 container mx-auto" />
  ```

  Add dividers after: Intro section (line ~45), About section (line ~60), Features section, Featured Products section.

- [ ] **Step 4: Update Intro section label**

  Change label from:
  ```tsx
  className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] mb-3"
  ```

- [ ] **Step 5: Update Intro H1**

  Change H1 from:
  ```tsx
  className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)] mb-4"
  ```
  To:
  ```tsx
  className="text-3xl md:text-4xl font-bold font-luxury tracking-tight text-[var(--foreground)] mb-4"
  ```

- [ ] **Step 6: Update "About" section label**

  Change section heading from:
  ```tsx
  className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-6"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] mb-6"
  ```

- [ ] **Step 7: Update About "Xem thêm" button**

  Change button from:
  ```tsx
  className="rounded-xl border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
  ```
  To:
  ```tsx
  className="rounded-xl border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-white transition-colors"
  ```

- [ ] **Step 8: Update Features section — gold icons**

  Change each feature icon container from:
  ```tsx
  className="h-12 w-12 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform"
  ```
  To:
  ```tsx
  className="h-12 w-12 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center mx-auto md:mx-0 group-hover:scale-105 transition-transform border border-[var(--accent-gold)]/20"
  ```

- [ ] **Step 9: Update Collections section label**

  Change label from:
  ```tsx
  className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)]"
  ```

- [ ] **Step 10: Update AR section — heritage green background**

  Change section from:
  ```tsx
  className="py-14 px-4 md:px-10 lg:px-20 bg-[var(--primary)] ..."
  ```
  To:
  ```tsx
  className="py-14 px-4 md:px-10 lg:px-20 bg-[var(--accent-green)] ..."
  ```

  Change inner text elements from `text-[var(--primary-foreground)]` and `text-white` to `text-white`. Update the CTA button from:
  ```tsx
  className="h-12 px-6 bg-white text-[var(--primary)] hover:bg-white/90 rounded-xl font-semibold"
  ```
  To:
  ```tsx
  className="h-12 px-6 bg-[var(--accent-gold)] text-white hover:bg-[var(--accent-gold-light)] rounded-xl font-semibold border-0"
  ```

- [ ] **Step 11: Update Newsletter — gold CTA button**

  Change submit button from:
  ```tsx
  className="h-12 px-6 rounded-xl font-semibold"
  ```
  To:
  ```tsx
  className="h-12 px-6 rounded-xl font-semibold bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-light)] text-white border-0 transition-colors"
  ```

  Change footer tagline from:
  ```tsx
  className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest"
  ```
  To:
  ```tsx
  className="text-xs text-[var(--accent-gold)] uppercase tracking-[0.2em] font-semibold"
  ```

- [ ] **Step 12: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/page.tsx
  git commit -m "feat(ui): complete homepage redesign with hero overlay, gold dividers, green sections"
  ```

---

## Chunk 7: Products Page — Grid & Filters
*Files: `apps/web/src/app/(user)/products/page.tsx`, `apps/web/src/components/products/ProductList.tsx`, `apps/web/src/components/products/ProductFilters.tsx`*

- [ ] **Step 1: Read current Products page and ProductList.tsx**

- [ ] **Step 2: Update Products page header — green label + serif**

  Find the page header section and update label from:
  ```tsx
  className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] mb-3"
  ```

  Update H1 from:
  ```tsx
  className="text-3xl md:text-4xl font-bold tracking-tight"
  ```
  To:
  ```tsx
  className="text-3xl md:text-4xl font-bold font-luxury tracking-tight"
  ```

- [ ] **Step 3: Update ProductList grid — 3-column**

  Find the grid class and ensure it uses:
  ```tsx
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  ```

- [ ] **Step 4: Update ProductFilters — gold reset button**

  Read `ProductFilters.tsx`. Find the "Clear all" or "Reset" button and change from:
  ```tsx
  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-sm text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80 underline-offset-4 hover:underline"
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/products/page.tsx apps/web/src/components/products/ProductList.tsx apps/web/src/components/products/ProductFilters.tsx
  git commit -m "feat(ui): update products page with green labels, 3-col grid, gold filter accents"
  ```

---

## Chunk 8: Product Detail — 2-Column Layout
*Files: `apps/web/src/app/(user)/products/[id]/page.tsx`, `apps/web/src/components/products/ProductGallery.tsx`, `apps/web/src/components/products/ProductDetail.tsx`*

- [ ] **Step 1: Read current ProductDetail component and page**

- [ ] **Step 2: Update breadcrumb — green label style**

  Read `apps/web/src/app/(user)/products/[id]/page.tsx` and locate the breadcrumb/navigation area. Update any category-chip or breadcrumb link text from:
  ```tsx
  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent-green)]"
  ```

- [ ] **Step 3: Update product title — serif**

  Find the product H1 and add `font-luxury`:
  ```tsx
  className="text-2xl md:text-3xl font-bold font-luxury tracking-tight text-[var(--foreground)]"
  ```

- [ ] **Step 4: Update price — gold color**

  Find the price element and change from:
  ```tsx
  className="text-2xl font-bold text-[var(--primary)]"
  ```
  To:
  ```tsx
  className="text-2xl font-bold text-[var(--accent-gold)]"
  ```

- [ ] **Step 5: Update add-to-cart button — gold CTA**

  Find the main CTA button and ensure it uses:
  ```tsx
  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-xl h-12 px-8 font-semibold"
  ```

- [ ] **Step 6: Update tabs — green active indicator**

  If using a tabs component, ensure active tab has `--accent-green` underline indicator.

- [ ] **Step 7: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/products/\[id\]/page.tsx apps/web/src/components/products/ProductGallery.tsx apps/web/src/components/products/ProductDetail.tsx
  git commit -m "feat(ui): update product detail with serif title, gold price, green tabs"
  ```

---

## Chunk 9: CartDrawer — Gold Accents
*Files: `apps/web/src/components/cart/CartDrawer.tsx`*

- [ ] **Step 1: Read current CartDrawer.tsx**

- [ ] **Step 2: Update subtotal — gold highlight**

  Find the subtotal text and change from `text-[var(--foreground)]` to:
  ```tsx
  className="text-xl font-bold text-[var(--accent-gold)]"
  ```

- [ ] **Step 3: Update checkout button — gold CTA**

  Find the checkout button and ensure it uses:
  ```tsx
  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-xl h-12 font-semibold w-full"
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/cart/CartDrawer.tsx
  git commit -m "feat(ui): update CartDrawer with gold subtotal highlight"
  ```

---

## Chunk 10: Checkout Page — Layout & Stepper
*Files: `apps/web/src/app/(user)/checkout/page.tsx`*

- [ ] **Step 1: Read current CheckoutPage**

- [ ] **Step 2: Update page heading — green label + serif**

  Read the page and find the section heading area. Update the label from:
  ```tsx
  className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] mb-3"
  ```

  Update the H1 from:
  ```tsx
  className="text-3xl md:text-4xl font-bold tracking-tight"
  ```
  To:
  ```tsx
  className="text-3xl md:text-4xl font-bold font-luxury tracking-tight"
  ```

- [ ] **Step 3: Update progress stepper — gold active state**

  Read the page and locate the stepper component. If it uses step circles/dots, update active/completed steps from:
  ```tsx
  className="... text-[var(--primary)] bg-[var(--primary)] ..."
  ```
  To:
  ```tsx
  className="... text-white bg-[var(--accent-gold)] ..."
  ```

  Update the pending/inactive step from:
  ```tsx
  className="... text-[var(--muted-foreground)] border-[var(--border)] ..."
  ```
  To:
  ```tsx
  className="... text-[var(--muted-foreground)] border-[var(--accent-gold)]/30 ..."
  ```

- [ ] **Step 4: Update order summary card — gold subtotal**

  Find the order summary total/price element and change from:
  ```tsx
  className="text-2xl font-bold text-[var(--foreground)]"
  ```
  To:
  ```tsx
  className="text-2xl font-bold text-[var(--accent-gold)]"
  ```

- [ ] **Step 5: Update form submit button**

  Find the primary submit button and change from:
  ```tsx
  className="h-12 rounded-xl font-semibold w-full"
  ```
  To:
  ```tsx
  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] h-12 rounded-xl font-semibold w-full"
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/checkout/page.tsx
  git commit -m "feat(ui): update checkout page with green label, gold stepper"
  ```

---

## Chunk 11: Auth Pages — Form Styling
*Files: `apps/web/src/app/auth/login/page.tsx`, `apps/web/src/app/auth/register/page.tsx`, `apps/web/src/app/auth/forgot-password/page.tsx`, `apps/web/src/components/auth/LoginForm.tsx`, `apps/web/src/components/auth/RegisterForm.tsx`, `apps/web/src/components/auth/ForgotPasswordForm.tsx`*

- [ ] **Step 1: Read auth pages and forms**

- [ ] **Step 2: Update page heading — green label + serif**

  Read each auth page. Find the section heading and update the label from:
  ```tsx
  className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3"
  ```
  To:
  ```tsx
  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--accent-green)] mb-3"
  ```

  Update the H1 from:
  ```tsx
  className="text-2xl font-bold"
  ```
  To:
  ```tsx
  className="text-2xl font-bold font-luxury"
  ```

- [ ] **Step 3: Update form card — warm white background**

  Find the form card container and change from:
  ```tsx
  className="w-full bg-[var(--background)] ..."
  ```
  To:
  ```tsx
  className="w-full bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm"
  ```

- [ ] **Step 4: Update primary submit button**

  Read `LoginForm.tsx`, `RegisterForm.tsx`, and `ForgotPasswordForm.tsx`. Find the `<Button type="submit">` and change from:
  ```tsx
  className="w-full"
  ```
  To:
  ```tsx
  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] rounded-xl h-11 font-semibold"
  ```

- [ ] **Step 5: Add gold focus ring to input fields**

  Read the form files. Find `<Input>` or `<FormInput>` components and add a wrapper or class override. For each input, append to the className:
  ```tsx
  focus:ring-[var(--accent-gold)] focus:border-[var(--accent-gold)]
  ```

  If inputs use a shadcn/ui `Form` component, pass the className override via the control or inputProps:
  ```tsx
  <FormControl>
    <Input
      className="focus:ring-[var(--accent-gold)] focus:border-[var(--accent-gold)] border-[var(--border)] bg-transparent rounded-xl"
      ...
    />
  </FormControl>
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/app/auth/login/page.tsx apps/web/src/app/auth/register/page.tsx apps/web/src/app/auth/forgot-password/page.tsx apps/web/src/components/auth/LoginForm.tsx apps/web/src/components/auth/RegisterForm.tsx apps/web/src/components/auth/ForgotPasswordForm.tsx
  git commit -m "feat(ui): update auth pages with card styling and gold form focus"
  ```

---

## Chunk 12: About, Collection, Story Pages
*Files: `apps/web/src/app/(user)/about/page.tsx`, `apps/web/src/app/(user)/collection/page.tsx`, `apps/web/src/app/(user)/story/page.tsx`*

- [ ] **Step 1: Read all three pages**

- [ ] **Step 2: Update hero — full-bleed with overlay (About)**

  Find hero section and apply same pattern as homepage hero: full-bleed image + gradient overlay + large serif H1 + gold label.

- [ ] **Step 3: Update section headings — green labels + serif**

  For each page: update all section labels to `--accent-green` uppercase tracking, all H2/H3 to `font-luxury`.

- [ ] **Step 4: Add gold dividers between content sections**

  Add `<hr className="gold-divider my-8" />` between major content blocks.

- [ ] **Step 5: Update CTA buttons — gold/primary consistent**

  Ensure all CTA buttons match design system (gold outline, primary filled).

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/about/page.tsx apps/web/src/app/\(user\)/collection/page.tsx apps/web/src/app/\(user\)/story/page.tsx
  git commit -m "feat(ui): update About, Collection, Story pages with hero overlays and serif headings"
  ```

---

## Chunk 13: Orders & Success/Cancel Pages
*Files: `apps/web/src/app/(user)/orders/page.tsx`, `apps/web/src/app/(user)/orders/[id]/page.tsx`, `apps/web/src/app/(user)/checkout/success/page.tsx`, `apps/web/src/app/(user)/checkout/cancel/page.tsx`*

- [ ] **Step 1: Read all order and checkout result pages**

- [ ] **Step 2: Update page headings — green labels + serif titles**

  Apply same label/title pattern as other pages.

- [ ] **Step 3: Update order status timeline — gold active state**

  If `OrderStatusTimeline` component exists, update active status to `--accent-gold`.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/app/\(user\)/orders/page.tsx apps/web/src/app/\(user\)/orders/\[id\]/page.tsx apps/web/src/app/\(user\)/checkout/success/page.tsx apps/web/src/app/\(user\)/checkout/cancel/page.tsx
  git commit -m "feat(ui): update orders and checkout result pages with heritage styling"
  ```

---

## Verification & Final Review

- [ ] **Step 1: Run dev server and verify all pages**

  ```bash
  cd apps/web && npm run dev
  ```

  Manual check: Homepage, Products, Product Detail, Cart, Checkout, Auth pages, About, Collection, Story.

- [ ] **Step 2: Verify CSS tokens are applied**

  Check DevTools: green sections, gold accents, serif headings should be visible.

- [ ] **Step 3: Run lint check**

  ```bash
  npm run check
  ```

- [ ] **Step 4: Final commit — merge worktree back**

  ```bash
  git add apps/web/src/app/globals.css \
    apps/web/src/components/layout/UserHeader.tsx \
    apps/web/src/components/layout/UserFooter.tsx \
    apps/web/src/components/products/ProductCard.tsx \
    apps/web/src/components/home/FeaturedProducts.tsx \
    "apps/web/src/app/(user)/page.tsx" \
    "apps/web/src/app/(user)/products/page.tsx" \
    "apps/web/src/app/(user)/products/[id]/page.tsx" \
    apps/web/src/components/products/ProductList.tsx \
    apps/web/src/components/products/ProductFilters.tsx \
    apps/web/src/components/products/ProductGallery.tsx \
    apps/web/src/components/products/ProductDetail.tsx \
    apps/web/src/components/cart/CartDrawer.tsx \
    "apps/web/src/app/(user)/checkout/page.tsx" \
    "apps/web/src/app/(user)/checkout/success/page.tsx" \
    "apps/web/src/app/(user)/checkout/cancel/page.tsx" \
    "apps/web/src/app/(user)/orders/page.tsx" \
    "apps/web/src/app/(user)/orders/[id]/page.tsx" \
    "apps/web/src/app/(user)/about/page.tsx" \
    "apps/web/src/app/(user)/collection/page.tsx" \
    "apps/web/src/app/(user)/story/page.tsx" \
    apps/web/src/app/auth/login/page.tsx \
    apps/web/src/app/auth/register/page.tsx \
    apps/web/src/app/auth/forgot-password/page.tsx \
    apps/web/src/components/auth/LoginForm.tsx \
    apps/web/src/components/auth/RegisterForm.tsx \
    apps/web/src/components/auth/ForgotPasswordForm.tsx \
    && git commit -m "feat(ui): complete heritage luxury redesign across all user pages

  - New CSS tokens: accent-green, accent-gold
  - Updated navigation with gold hover underlines
  - Homepage hero with full-bleed overlay + serif typography
  - Gold dividers between major sections
  - ProductCard: green badge, gold price, gold hover border
  - FeaturedProducts: green section label, serif title
  - AR section: heritage green background
  - Newsletter: gold CTA button
  - Product pages: green labels, 3-col grid
  - Product detail: serif title, gold price
  - Checkout: gold stepper, 2-col layout
  - Auth pages: gold focus rings
  - About/Collection/Story: hero overlays, editorial rhythm"
  ```
