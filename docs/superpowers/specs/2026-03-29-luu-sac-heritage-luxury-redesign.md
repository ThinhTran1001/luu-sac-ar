# Luu Sac — Heritage Luxury UI Redesign

**Date:** 2026-03-29
**Status:** Approved
**Reference:** https://www.danghinhdisan.com

---

## 1. Concept & Vision

Luu Sac là nền tảng thương mại điện tử gốm sứ cao cấp Việt Nam với tính năng AR/3D. Design mới lấy cảm hứng từ DangHinhDisan.com — mang lại cảm giác **di sản, tôn vinh, trang nhã và có chiều sâu văn hóa**. Slate blue `#466589` được giữ làm nền tảng (brand anchor), bổ sung heritage green và gold accent từ reference để tạo cá tính mới mà không phá vỡ nhận diện hiện tại.

---

## 2. Design Language

### Color Palette

| Token | Hex | Description | Usage |
|---|---|---|---|
| `--primary` | `#466589` | Slate Blue | CTAs, nav, links (giữ nguyên) |
| `--accent-green` | `#3d6b35` | Heritage Green | Section labels, category badges, cultural feel |
| `--accent-gold` | `#c9a84c` | Gold | Dividers, hover, icons, highlights, premium accents |
| `--background` | `#f5efe6` | Cream | Main background (giữ nguyên) |
| `--foreground` | `#2c3e50` | Charcoal | Body text (giữ nguyên) |
| `--card` | `#fdfbf7` | Warm White | Card surfaces |
| `--muted` | `#e8dfd0` | Muted Tan | Muted backgrounds |
| `--border` | `#ddd4c4` | Tan | Borders (giữ nguyên) |
| `--muted-foreground` | `#5a6b7a` | Muted Text | Secondary text |

### Typography

Font hiện tại (`font-luxury` = serif) — khai thác mạnh hơn:

| Element | Style |
|---|---|
| **Section Label** | 11px, uppercase, `tracking-[0.25em]`, `--accent-green`, bold |
| **H1 (Hero)** | 3.5–5rem, serif, bold, tight tracking |
| **H2 (Section Title)** | 2.5–3.5rem, serif, bold, `--foreground` |
| **H3 (Card Title)** | 1.25rem, semibold |
| **Body** | 1rem/1.125rem, line-height 1.7 |
| **Caption / Meta** | 0.875rem, `--muted-foreground` |

### Layout & Spatial System

- **Container:** `max-w-7xl` (1280px), padding: `px-4 md:px-10 lg:px-20`
- **Section spacing:** `py-16 md:py-24` — rộng rãi, editorial
- **Card radius:** `rounded-2xl`
- **Grid gaps:** `gap-6` (cards), `gap-8` (sections)
- **Dividers:** Gold (`--accent-gold`) horizontal lines between major sections

### Motion Philosophy

Minimal, purposeful motion:
- **Hover:** `scale-1.02`, shadow lift, border chuyển sang `--accent-gold` nhẹ
- **Page transitions:** opacity fade
- **No heavy animations** — premium, restrained feel

### Visual Assets

- **Icons:** Lucide React (giữ nguyên)
- **Images:** Unsplash (hiện tại), có thể thay bằng ảnh sản phẩm thực tế
- **Decorative:** Gold `<hr>` dividers, gradient overlays (`#2c3e50` → transparent)

---

## 3. Layout & Structure

### Global Layout

- Sticky header, full-width
- Content: centered container `max-w-7xl`
- Footer: multi-column, cream-tan background

### Homepage Rhythm

```
[Hero Banner — full-bleed image + overlay H1 + 2 CTAs]
[Intro — centered, max-w-2xl, green label, serif heading]
[Divider — gold]
[About — centered text block]
[Divider — gold]
[Features — 4-column grid]
[Collections — masonry-style grid, overlay text]
[Featured Products — 4-column grid]
[AR Section — green background]
[Newsletter — card + gold CTA]
```

### Responsive Strategy

- Mobile-first approach
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Navigation: hamburger → centered nav on desktop
- Grids: 1 → 2 → 3 → 4 columns

---

## 4. Features & Interactions

### Navigation (UserHeader)

- Logo to hơn, căn giữa mobile
- Nav links: serif font, hover `--accent-gold` animated underline
- CTA buttons: `--primary` slate blue, `rounded-xl`
- Cart icon với badge
- Mobile: Sheet sidebar, gold accent line trên mỗi item
- User dropdown: avatar + menu (Account, Orders, Admin if ADMIN role)

### Homepage

- **Hero:** Full-bleed banner + overlay gradient + H1 serif lớn + tagline + 2 CTAs
- **Intro:** Centered, max-w-2xl, green uppercase label
- **Features:** 4-card grid, icon trong gold circle, hover scale
- **Collections:** Masonry grid (large + small cards), overlay gradient từ `#2c3e50`
- **Featured Products:** 4-column ProductCard grid
- **AR Section:** `--accent-green` background (thay `--primary`)
- **Newsletter:** Card background, gold submit button

### Products Page

- Page header: green label + H1 serif + breadcrumb
- Filter sidebar: collapsible, gold accents
- Product grid: 3-col desktop / 2-col tablet / 1-col mobile
- Category badges: `--accent-green` background

### Product Detail

- Breadcrumb navigation
- 2-column layout: gallery trái + info phải
- Gallery: main image + thumbnail strip, zoom on hover
- Info: H1 serif, price in `--accent-gold`, `--primary` add-to-cart
- Tabs: Description / AR Preview
- Related products: 4-column grid

### Cart Drawer

- Slide-in từ phải
- Gold subtotal highlight
- `--primary` checkout button

### Checkout Flow

- 2-column: order summary + form
- Progress stepper với gold active state
- `--primary` submit buttons

### Auth Pages

- Centered card on cream background
- Form fields với gold focus ring
- `--primary` primary actions

### About / Collection / Story Pages

- Full-width hero banner
- Rich content: pull-quotes, gold dividers
- Editorial rhythm: image + text alternating

---

## 5. Component Inventory

### Updated Components

| Component | Changes |
|---|---|
| `globals.css` | Thêm `--accent-green`, `--accent-gold` tokens |
| `UserHeader` | Nav hover gold, serif, centered layout |
| `UserFooter` | Gold dividers, green section labels |
| `HomePage` | Hero overlay, editorial rhythm, gold dividers |
| `FeaturedProducts` | Section label green, grid 4-col |
| `ProductCard` | Hover gold border, scale effect, green badge |
| `ProductList` | 3-col grid, filter sidebar |
| `ProductDetail` | 2-col, gold price, green AR section |
| `CartDrawer` | Gold subtotal, primary checkout |
| `LoginForm` / `RegisterForm` | Gold focus ring, centered card |
| `CheckoutPage` | Gold stepper, 2-col layout |

### New CSS Tokens (globals.css)

```css
:root {
  --accent-green: #3d6b35;
  --accent-gold: #c9a84c;
}
```

---

## 6. Technical Approach

### Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4 (CSS variables + `@theme`)
- **UI Components:** shadcn/ui (giữ nguyên)
- **Icons:** Lucide React (giữ nguyên)
- **Fonts:** Next/font (giữ nguyên)

### Implementation Order

1. **globals.css** — add new CSS tokens
2. **UserHeader** — nav styling
3. **HomePage** — all sections
4. **UserFooter** — styling
5. **ProductCard** — hover + badge
6. **FeaturedProducts** — section styling
7. **Products Page** — grid + filters
8. **ProductDetail** — 2-col layout
9. **CartDrawer** — gold accents
10. **CheckoutPage** — layout + stepper
11. **AuthPages** — form styling
12. **About / Collection / Story** — page layouts

### No Breaking Changes

- Keep existing component logic intact
- Only update JSX classNames and CSS variables
- No data layer or API changes
