# Collection Showcase Page - Design Specification

**Date:** 2026-03-13
**Project:** Lưu Sắc - Ceramic & Pottery E-commerce

---

## Overview

A page that displays CSE-prefixed product images as a gallery with story/context about each product category. Follows the existing beige/slate design language (#466589 primary, #f5efe6 background).

---

## UI/UX Specification

### Layout Structure

**1. Hero Section**
- Full-width banner image (using one of the CSE images or hero.png)
- Overlay with collection title
- Brief introduction text (2-3 sentences)

**2. Category Sections**
Three categories with CSE images distributed:

| Category | Vietnamese | CSE Images | Description |
|----------|------------|------------|-------------|
| Vases | Bình Hoa | CSE01687, CSE01690, CSE01691, CSE01692, CSE01693 | Decorative ceramic vases in various shapes |
| Tableware | Đồ Ăn | CSE01695, CSE01697, CSE01702, CSE01706, CSE01709, CSE01711 | Plates, bowls, cups for dining |
| Decor | Trang Trí | CSE01714, CSE01715, CSE01718, CSE01725, CSE01727, CSE01729, CSE01731, CSE01735, CSE01737, CSE01738, CSE01740, CSE01741, CSE01742, CSE01743, CSE01744, CSE01747, CSE01751, CSE01752 | Artistic pieces and sculptures |

**3. Product Cards**
- Image thumbnail (aspect-ratio 4:3)
- Product name
- Short description (1-2 sentences)
- Price or "Liên hệ"
- Hover effect: slight scale + shadow increase

### Responsive Breakpoints

- **Mobile:** 1 column grid
- **Tablet:** 2 column grid
- **Desktop:** 3 column grid

### Visual Design

**Color Palette** (existing CSS variables):
- Background: #f5efe6
- Card: #fdfbf7
- Primary: #466589
- Primary foreground: #fdfbf7
- Border: #ddd4c4
- Muted foreground: #5a6b7a

**Typography:**
- Headings: font-bold, tracking-tight
- Body: text-[var(--muted-foreground)] for descriptions
- Vietnamese text throughout

**Components:**
- Cards: rounded-2xl, border border-[var(--border)], hover:shadow-lg
- Buttons: rounded-xl, primary color
- Section headers: uppercase tracking-[0.2em], text-xs font-bold

### Animations & Interactions

- Card hover: transform scale-105, shadow-lg transition-all duration-300
- Image hover: subtle scale transition
- Smooth scroll between sections

---

## Functionality Specification

### Core Features

1. **Static Gallery Display**
   - Display all CSE images organized by category
   - Each image shows as a product card

2. **Category Navigation**
   - Quick jump links to each category section
   - Sticky behavior on desktop

3. **Product Card Actions**
   - Click card to view product detail (future: link to product page)
   - Add to cart button (where applicable)

### Data Handling

- Static image data (no API calls needed)
- Image paths: `/images/CSE*.jpg`
- Product names derived from category + index

### Edge Cases

- Images that fail to load: show placeholder
- Long descriptions: truncate with ellipsis

---

## Acceptance Criteria

1. Page displays all 31 CSE images organized into 3 categories
2. Hero section with title and introduction is visible
3. Category sections are clearly separated with headers
4. Product cards display image, name, and description
5. Hover effects work on product cards
6. Page is responsive across mobile/tablet/desktop
7. Design matches existing project styling (colors, typography, spacing)
8. Navigation to this page is added in header

---

## File Changes

### New Files
- `apps/web/src/app/(user)/collection/page.tsx` - Main collection page

### Modified Files
- `apps/web/src/constants/routes.ts` - Add COLLECTION route
- `apps/web/src/components/layout/UserHeader.tsx` - Add nav link

---

## Implementation Notes

- Use existing CSS variables for consistency
- Follow component patterns from home page
- Reuse Button, Card components from UI library
- Use next/image for optimized images
