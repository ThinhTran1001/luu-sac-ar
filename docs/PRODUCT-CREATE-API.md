# Product Create API – Hướng dẫn cho Web Agent

Tài liệu này mô tả API tạo sản phẩm (bao gồm AR 3D Generation) để Agent bên web có thể tích hợp đúng cách.

---

## Tổng quan

| Thuộc tính | Giá trị |
|------------|---------|
| **Endpoint** | `POST /api/products` |
| **Content-Type** | `multipart/form-data` |
| **Authentication** | Required (HTTP-only cookie, session-based) |
| **Base URL** | `process.env.NEXT_PUBLIC_API_URL` hoặc `http://localhost:3001/api` |

---

## Request

### Method & URL

```
POST {BASE_URL}/products
```

### Headers

```
Content-Type: multipart/form-data
Cookie: (session cookie - tự động gửi khi dùng withCredentials: true)
```

**Lưu ý:** Khi dùng `FormData` với axios/fetch, **không cần** set `Content-Type` thủ công – trình duyệt sẽ tự thêm boundary.

### Body (multipart/form-data)

#### 1. Form fields (text)

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `name` | string | ✅ | Tên sản phẩm |
| `description` | string | ✅ | Mô tả sản phẩm |
| `price` | number (string) | ✅ | Giá (số thực) |
| `quantity` | number (string) | ✅ | Số lượng (số nguyên) |
| `categoryId` | string (UUID) | ✅ | ID danh mục |
| `status` | string | ✅ | `ACTIVE` \| `HIDE` \| `DELETED` |

#### 2. File fields

| Field | Type | Required | Max count | Mô tả |
|-------|------|----------|-----------|-------|
| `imageUrl` | File | ✅ | 1 | Ảnh chính (jpg, png, jpeg, webp) |
| `thumbnailImage` | File | ❌ | 1 | Ảnh thumbnail |
| `galleryImages` | File[] | ❌ | 10 | Ảnh gallery (multiple) |
| `imageNoBg` | File | ❌ | 1 | **Legacy:** Ảnh đã xóa nền (PNG có alpha) – backend tự generate 3D |
| `glbUrl` | string | ❌ | — | **TripoSR:** URL GLB từ TripoSR API – dùng trực tiếp, không generate |

---

## AR 3D Generation – Luồng tích hợp (TripoSR)

### Luồng mới: TripoSR API

1. Frontend gọi **TripoSR API** `POST /generate` với ảnh gốc.
2. TripoSR trả về `glb_url` (Cloudinary).
3. Frontend append `glbUrl` vào FormData khi tạo product.
4. Backend dùng `glbUrl` trực tiếp, không generate 3D.

**TripoSR API:** `POST {NEXT_PUBLIC_TRIPOSR_API_URL}/generate`  
Xem `docs/TRIPOSR-API.md` (nếu có) hoặc tài liệu TripoSR.

### Luồng legacy: imageNoBg

- Gửi file PNG đã xóa nền → backend generate 3D bằng Three.js lathe.

### Ví dụ ghép FormData (TripoSR flow)

```typescript
// Tạo FormData
const formData = new FormData();

// Form fields
formData.append('name', 'Blue Phoenix Vase');
formData.append('description', 'Handcrafted ceramic vase...');
formData.append('price', '99.99');
formData.append('quantity', '10');
formData.append('categoryId', 'uuid-category-here');
formData.append('status', 'ACTIVE');

// Files
formData.append('imageUrl', mainImageFile);           // Required
formData.append('thumbnailImage', thumbnailFile);     // Optional
galleryFiles.forEach((file) => formData.append('galleryImages', file));  // Optional

// AR 3D - glbUrl từ TripoSR API
if (glbUrl) {
  formData.append('glbUrl', glbUrl);
}

// Gọi API
const response = await api.post('/products', formData, {
  withCredentials: true,
  // KHÔNG set Content-Type - axios tự set multipart boundary
});
```

### Ví dụ dùng productService (đã có sẵn)

```typescript
import { productService } from '@/services/product.service';

const formData = new FormData(formElement);

if (glbUrl) {
  formData.append('glbUrl', glbUrl);
}

const product = await productService.create(formData);
```

---

## Response

### Success (201)

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Blue Phoenix Vase",
    "description": "...",
    "price": 99.99,
    "quantity": 10,
    "imageUrl": "https://res.cloudinary.com/.../image.jpg",
    "thumbnailImage": "https://res.cloudinary.com/.../thumb.jpg",
    "galleryImages": ["https://..."],
    "glbUrl": "https://res.cloudinary.com/.../product-{id}.glb",
    "glbFileSize": 123456,
    "processingStatus": "COMPLETED",
    "status": "ACTIVE",
    "categoryId": "uuid",
    "createdAt": "2025-02-28T...",
    "updatedAt": "2025-02-28T..."
  }
}
```

### Các trường liên quan AR 3D

| Field | Mô tả |
|-------|-------|
| `glbUrl` | URL model 3D (GLB) trên Cloudinary. Có khi `imageNoBg` được gửi và xử lý thành công. |
| `glbFileSize` | Kích thước file GLB (bytes). |
| `processingStatus` | `PENDING` \| `PROCESSING` \| `COMPLETED` \| `FAILED` |

- Không gửi `imageNoBg`: `processingStatus` = `PENDING`, `glbUrl` = `null`.
- Gửi `imageNoBg` và thành công: `processingStatus` = `COMPLETED`, `glbUrl` có giá trị.
- Gửi `imageNoBg` nhưng lỗi: `processingStatus` = `FAILED`, product vẫn được tạo.

### Error (4xx/5xx)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": {
    "name": ["Required"],
    "categoryId": ["Invalid UUID"]
  }
}
```

---

## Validation (Zod schema)

- `name`: string, required
- `description`: string, required
- `price`: number (coerce từ string)
- `quantity`: integer (coerce từ string)
- `imageUrl`: URL string (từ Cloudinary sau khi upload)
- `thumbnailImage`: URL string, optional
- `galleryImages`: array of URL strings
- `status`: `ACTIVE` | `HIDE` | `DELETED`
- `categoryId`: UUID

---

## Luồng xử lý backend (tham khảo)

1. Nhận `multipart/form-data`.
2. Upload `imageUrl`, `thumbnailImage`, `galleryImages` lên Cloudinary.
3. Parse body và validate với `CreateProductSchema`.
4. Tạo product trong DB.
5. Nếu có `imageNoBg`:
   - Tạo mesh 3D từ ảnh (sharp + Three.js).
   - Export GLB.
   - Upload GLB lên Cloudinary.
   - Cập nhật `glbUrl`, `glbFileSize`, `processingStatus`.
6. Trả về product đã tạo.

---

## Checklist cho Web Agent

- [ ] Dùng `FormData` cho request body.
- [ ] Không set `Content-Type` thủ công khi dùng FormData.
- [ ] Gửi `withCredentials: true` để đính kèm session cookie.
- [ ] Append `glbUrl` khi có URL từ TripoSR API (hoặc `imageNoBg` cho luồng legacy).
- [ ] Đảm bảo `imageUrl` luôn có (required).
- [ ] `categoryId` phải là UUID hợp lệ.
- [ ] `status` phải là một trong: `ACTIVE`, `HIDE`, `DELETED`.
