# Collection Showcase Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a collection showcase page displaying CSE-prefixed product images organized by category (Vases, Tableware, Decor) with story/context about each product type.

**Architecture:** Static page with client-side components, organized into category sections with product cards. Uses existing CSS variables and UI components for visual consistency.

**Tech Stack:** Next.js (App Router), Tailwind CSS, existing UI components (Button, Card)

---

## File Structure

```
apps/web/src/
├── app/(user)/
│   └── collection/
│       └── page.tsx          # New: Main collection page
├── components/
│   └── layout/
│       └── UserHeader.tsx    # Modify: Add nav link
└── constants/
    └── routes.ts             # Modify: Add COLLECTION route
```

---

## Chunk 1: Route & Navigation Setup

### Task 1: Add COLLECTION route to routes.ts

**Files:**
- Modify: `apps/web/src/constants/routes.ts`

- [ ] **Step 1: Add COLLECTION route**

Edit file `apps/web/src/constants/routes.ts`, add to ROUTES object:

```typescript
COLLECTION: '/collection',
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/constants/routes.ts
git commit -m "feat: add COLLECTION route"
```

---

### Task 2: Add navigation link to UserHeader

**Files:**
- Modify: `apps/web/src/components/layout/UserHeader.tsx:55-67`

- [ ] **Step 1: Add Collection link to nav**

Add this Link after the existing nav links (after "Về Chúng Tôi"):

```tsx
<Link
  href={ROUTES.COLLECTION}
  className="text-base md:text-lg font-semibold text-[var(--foreground)]/80 hover:text-[var(--primary)] transition-colors"
>
  Bộ Sưu Tập
</Link>
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/layout/UserHeader.tsx
git commit -m "feat: add Collection nav link to header"
```

---

## Chunk 2: Collection Page Implementation

### Task 3: Create Collection Page

**Files:**
- Create: `apps/web/src/app/(user)/collection/page.tsx`

- [ ] **Step 1: Write collection page component**

Create file `apps/web/src/app/(user)/collection/page.tsx`:

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';

// CSE image data organized by category
const collectionData = {
  vases: {
    title: 'Bình Hoa',
    description: 'Những tác phẩm gốm sứ độc đáo, mang hình dáng tinh tế và thanh lịch. Mỗi chiếc bình là một điểm nhấn nghệ thuật cho không gian sống của bạn.',
    images: [
      { src: '/images/CSE01687.jpg', name: 'Bình Hoa CDT 01' },
      { src: '/images/CSE01690.jpg', name: 'Bình Hoa CDT 02' },
      { src: '/images/CSE01691.jpg', name: 'Bình Hoa CDT 03' },
      { src: '/images/CSE01692.jpg', name: 'Bình Hoa CDT 04' },
      { src: '/images/CSE01693.jpg', name: 'Bình Hoa CDT 05' },
    ],
  },
  tableware: {
    title: 'Đồ Ăn',
    description: 'Bộ đồ ăn gốm sứ cao cấp được chế tác thủ công, hoàn hảo cho những bữa ăn gia đình hoặc tiệc quan trọng.',
    images: [
      { src: '/images/CSE01695.jpg', name: 'Đĩa Tròn CDT 01' },
      { src: '/images/CSE01697.jpg', name: 'Đĩa Tròn CDT 02' },
      { src: '/images/CSE01702.jpg', name: 'Bộ Đồ Ăn CDT 01' },
      { src: '/images/CSE01706.jpg', name: 'Bộ Đồ Ăn CDT 02' },
      { src: '/images/CSE01709.jpg', name: 'Bộ Đồ Ăn CDT 03' },
      { src: '/images/CSE01711.jpg', name: 'Bộ Đồ Ăn CDT 04' },
    ],
  },
  decor: {
    title: 'Trang Trí',
    description: 'Những tác phẩm nghệ thuật gốm sứ mang đậm dấu ấn thủ công Việt Nam, là điểm nhấn hoàn hảo cho không gian của bạn.',
    images: [
      { src: '/images/CSE01714.jpg', name: 'Tác Phẩm Nghệ Thuật 01' },
      { src: '/images/CSE01715.jpg', name: 'Tác Phẩm Nghệ Thuật 02' },
      { src: '/images/CSE01718.jpg', name: 'Tác Phẩm Nghệ Thuật 03' },
      { src: '/images/CSE01725.jpg', name: 'Tác Phẩm Nghệ Thuật 04' },
      { src: '/images/CSE01727.jpg', name: 'Tác Phẩm Nghệ Thuật 05' },
      { src: '/images/CSE01729.jpg', name: 'Tác Phẩm Nghệ Thuật 06' },
      { src: '/images/CSE01731.jpg', name: 'Tác Phẩm Nghệ Thuật 07' },
      { src: '/images/CSE01735.jpg', name: 'Tác Phẩm Nghệ Thuật 08' },
      { src: '/images/CSE01737.jpg', name: 'Tác Phẩm Nghệ Thuật 09' },
      { src: '/images/CSE01738.jpg', name: 'Tác Phẩm Nghệ Thuật 10' },
      { src: '/images/CSE01740.jpg', name: 'Tác Phẩm Nghệ Thuật 11' },
      { src: '/images/CSE01741.jpg', name: 'Tác Phẩm Nghệ Thuật 12' },
      { src: '/images/CSE01742.jpg', name: 'Tác Phẩm Nghệ Thuật 13' },
      { src: '/images/CSE01743.jpg', name: 'Tác Phẩm Nghệ Thuật 14' },
      { src: '/images/CSE01744.jpg', name: 'Tác Phẩm Nghệ Thuật 15' },
      { src: '/images/CSE01747.jpg', name: 'Tác Phẩm Nghệ Thuật 16' },
      { src: '/images/CSE01751.jpg', name: 'Tác Phẩm Nghệ Thuật 17' },
      { src: '/images/CSE01752.jpg', name: 'Tác Phẩm Nghệ Thuật 18' },
    ],
  },
};

function ProductCard({ image, index }: { image: { src: string; name: string }; index: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--foreground)] text-lg line-clamp-1">
          {image.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
          Tác phẩm gốm sứ thủ công cao cấp, mang đậm nghệ thuật truyền thống Việt Nam.
        </p>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  data,
  index,
}: {
  category: keyof typeof collectionData;
  data: (typeof collectionData)[category];
  index: number;
}) {
  return (
    <section
      id={category}
      className="py-16 md:py-20 border-t border-[var(--border)]"
    >
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
            {index + 1} / 3
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            {data.title}
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.images.map((image, imgIndex) => (
            <ProductCard key={imgIndex} image={image} index={imgIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CollectionPage() {
  const categories = Object.entries(collectionData) as [
    keyof typeof collectionData,
    (typeof collectionData)[keyof typeof collectionData]
  ][];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <Image
          src="/images/luusac-banner.png"
          alt="Bộ sưu tập Lưu Sắc"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/80 via-[#2c3e50]/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Bộ Sưu Tập
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
            Khám phá những tác phẩm gốm sứ thủ công độc đáo, được chế tác tỉ mỉ bởi các nghệ nhân tài ba.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <nav className="sticky top-24 z-40 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)] py-4">
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            {categories.map(([key, data]) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sm md:text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
              >
                {data.title}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Category Sections */}
      {categories.map(([key, data], index) => (
        <CategorySection key={key} category={key} data={data} index={index} />
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="container mx-auto px-4 md:px-10 lg:px-20 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Khám phá thêm nhiều tác phẩm
          </h2>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn về các sản phẩm gốm sứ cao cấp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-12 px-6 rounded-xl font-semibold bg-white text-[var(--primary)] hover:bg-white/90">
              <Link href={ROUTES.PRODUCTS.BASE}>
                Xem tất cả sản phẩm <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-xl font-semibold border-white text-white hover:bg-white hover:text-[var(--primary)]">
              <Link href={ROUTES.ABOUT}>
                Về chúng tôi <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/\(user\)/collection/page.tsx
git commit -m "feat: add collection showcase page with CSE images"
```

---

## Chunk 3: Verification

### Task 4: Verify Implementation

**Files:**
- None (verification only)

- [ ] **Step 1: Check build**

Run: `npm run build -- --filter=web`
Expected: Build completes without errors

- [ ] **Step 2: Verify page renders**

Navigate to `/collection` and verify:
- Hero section displays with title
- 3 category sections visible (Bình Hoa, Đồ Ăn, Trang Trí)
- Product cards display with images
- Navigation links work
- Design matches existing styling

- [ ] **Step 3: Final commit if changes needed**

```bash
git add . && git commit -m "fix: collection page adjustments"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add COLLECTION route | routes.ts |
| 2 | Add nav link to header | UserHeader.tsx |
| 3 | Create collection page | collection/page.tsx |
| 4 | Verify implementation | - |
