# 🏺 Luu Sac - AR 3D System
## Complete Technical Documentation

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Complete Flow Diagram](#complete-flow-diagram)
4. [Technical Stack](#technical-stack)
5. [Implementation Details](#implementation-details)
6. [Database Schema](#database-schema)
7. [API Specifications](#api-specifications)
8. [Performance Optimization](#performance-optimization)
9. [Error Handling](#error-handling)
10. [Deployment Guide](#deployment-guide)
11. [Limitations & Trade-offs](#limitations--trade-offs)
12. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

### Purpose
Hệ thống tự động chuyển đổi ảnh 2D sản phẩm gốm sứ thành mô hình 3D và hiển thị qua AR Camera, không cần file 3D có sẵn hay AI trả phí.

### Core Concept
```
Input: Ảnh 2D (có background bất kỳ)
        ↓
Process: Background Removal → Profile Extraction → 3D Generation
        ↓
Output: GLB file for AR viewing
```

### Key Features
- ✅ Tự động loại bỏ background (client-side)
- ✅ Tạo mô hình 3D từ thuật toán (server-side)
- ✅ Hiển thị AR trên iOS & Android
- ✅ Admin-friendly workflow
- ✅ Cost-effective (< $50/month)

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐ │
│  │   Admin UI   │────▶│ BG Removal   │───▶│Upload Service│ │
│  │  (Next.js)   │     │(@imgly/br)   │    │   (S3/CF)    │ │
│  └──────────────┘     └──────────────┘    └──────────────┘ │
│         │                                          │         │
│         │                                          │         │
│         ▼                                          ▼         │
└─────────────────────────────────────────────────────────────┘
          │                                          │
          │ HTTP POST                                │ Files
          │                                          │
          ▼                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER SIDE                           │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐ │
│  │   API Layer  │────▶│  AR 3D Gen   │───▶│  Cloudinary  │ │
│  │  (NestJS)    │     │  (Three.js)  │    │   Storage    │ │
│  └──────────────┘     └──────────────┘    └──────────────┘ │
│         │                     │                    │         │
│         │                     │                    │         │
│         ▼                     ▼                    ▼         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           PostgreSQL Database (Prisma)              │   │
│  │  Products: imageUrl, glbUrl, processingStatus       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          │ Response (imageUrl, glbUrl)
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                        USER SIDE                            │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────┐ │
│  │ Product Page │────▶│ Model Viewer │───▶│  AR Camera   │ │
│  │  (Next.js)   │     │   (Google)   │    │ (QuickLook/  │ │
│  │              │     │              │    │SceneViewer)  │ │
│  └──────────────┘     └──────────────┘    └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Tech Stack |
|-----------|---------------|------------|
| **Admin UI** | Upload ảnh, nhập thông tin sản phẩm | Next.js, React, TailwindCSS |
| **BG Removal** | Loại bỏ background từ ảnh | @imgly/background-removal |
| **Upload Service** | Upload files lên cloud storage | Multer, Cloudinary SDK |
| **API Layer** | Handle requests, orchestrate services | NestJS, Express |
| **AR 3D Generator** | Tạo mô hình 3D từ ảnh | Three.js, Sharp, GLTFExporter |
| **Database** | Lưu trữ metadata sản phẩm | PostgreSQL, Prisma ORM |
| **Cloud Storage** | Lưu trữ files (images, GLB) | Cloudinary / AWS S3 |
| **Model Viewer** | Hiển thị 3D & AR | @google/model-viewer |

---

## 🔄 Complete Flow Diagram

### FLOW 1: Admin Upload Product

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Admin Upload Image                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
    Admin selects image file (any background)
    + Enters product info (name, price, description)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Client-Side Background Removal                      │
└─────────────────────────────────────────────────────────────┘
    
    import removeBackground from '@imgly/background-removal';
    
    INPUT:  originalImage (File)
    
    PROCESS:
    ├─ Load ML model (~100MB, cached after first load)
    ├─ Run inference on image
    ├─ Generate alpha mask
    └─ Output PNG with transparent background
    
    OUTPUT: 
    ├─ imageOriginal: Original file (with background)
    └─ imageNoBg: PNG file (transparent background)
    
    TIME: 5-10 seconds (device dependent)
    
    UI STATE:
    └─ Show progress bar: "Đang xử lý ảnh... 45%"
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Preview & Validation                                │
└─────────────────────────────────────────────────────────────┘
    
    Display side-by-side comparison:
    ├─ Left: Original image
    └─ Right: Background removed image
    
    Admin actions:
    ├─ ✅ Approve: Continue to upload
    ├─ 🔄 Retry: Run BG removal again
    └─ ✏️ Manual Edit: Open editor (optional)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Upload to Server                                    │
└─────────────────────────────────────────────────────────────┘
    
    POST /api/admin/products/create-with-3d
    
    FormData:
    ├─ imageOriginal: File (JPEG/PNG with background)
    ├─ imageNoBg: File (PNG transparent)
    ├─ name: String
    ├─ price: Number
    └─ description: String
    
    Headers:
    └─ Content-Type: multipart/form-data
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Server Receives Files                               │
└─────────────────────────────────────────────────────────────┘
    
    NestJS Controller:
    
    @Post('create-with-3d')
    @UseInterceptors(FileFieldsInterceptor([...]))
    async createProductWith3D(files, dto) {
      // Process starts...
    }
    
    Validation:
    ├─ Check file types (image/jpeg, image/png)
    ├─ Check file sizes (< 10MB each)
    └─ Validate required fields
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6A: Upload Original Image to Cloudinary                │
└─────────────────────────────────────────────────────────────┘
    
    const imageUrl = await cloudinary.uploader.upload(
      files.imageOriginal[0].buffer,
      {
        folder: 'products/images',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      }
    );
    
    OUTPUT: 
    └─ imageUrl: "https://res.cloudinary.com/.../vase-123.jpg"
    
    PURPOSE: Display on website (marketing image)
    TIME: 2-3 seconds
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6B: Process 3D Model (Parallel with 6A)                │
└─────────────────────────────────────────────────────────────┘
    
    INPUT: files.imageNoBg[0].buffer
    
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.1: Image Preprocessing      │
    └─────────────────────────────────────────┘
    
    const processedImage = await sharp(noBgBuffer)
      .resize({ 
        height: 1024, 
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    Operations:
    ├─ Resize to standard height (1024px)
    ├─ Maintain aspect ratio
    ├─ Keep transparency
    └─ Convert to PNG format
    
    TIME: 0.5-1 second
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.2: Profile Extraction       │
    └─────────────────────────────────────────┘
    
    Algorithm: Scanline Edge Detection
    
    const { data, info } = await sharp(processedImage)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const profile: Vector2[] = [];
    
    for (let y = 0; y < height; y += 2) {
      let leftEdge = -1;
      let rightEdge = -1;
      
      // Scan horizontally to find edges
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * 4;
        const alpha = data[pixelIndex + 3];
        
        if (alpha > ALPHA_THRESHOLD) {
          leftEdge = x;
          break;
        }
      }
      
      for (let x = width - 1; x >= 0; x--) {
        const pixelIndex = (y * width + x) * 4;
        const alpha = data[pixelIndex + 3];
        
        if (alpha > ALPHA_THRESHOLD) {
          rightEdge = x;
          break;
        }
      }
      
      if (leftEdge !== -1 && rightEdge !== -1) {
        const radius = (rightEdge - leftEdge) / 2;
        const centerX = (leftEdge + rightEdge) / 2;
        
        profile.push({
          x: radius / width,      // Normalize 0-1
          y: 1.0 - y / height     // Normalize 0-1, flip Y
        });
      }
    }
    
    Constants:
    ├─ ALPHA_THRESHOLD: 200 (semi-transparent pixels ignored)
    └─ Step size: 2 (scan every 2 pixels for performance)
    
    OUTPUT: Array of Vector2 points representing vase profile
    TIME: 1-2 seconds
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.3: Profile Smoothing        │
    └─────────────────────────────────────────┘
    
    Algorithm: Moving Average / Gaussian Blur
    
    function smoothProfile(profile: Vector2[]): Vector2[] {
      const smoothed: Vector2[] = [];
      const windowSize = 5;
      
      for (let i = 0; i < profile.length; i++) {
        let sumX = 0, sumY = 0, count = 0;
        
        for (let j = -windowSize; j <= windowSize; j++) {
          const idx = i + j;
          if (idx >= 0 && idx < profile.length) {
            sumX += profile[idx].x;
            sumY += profile[idx].y;
            count++;
          }
        }
        
        smoothed.push({
          x: sumX / count,
          y: sumY / count
        });
      }
      
      return smoothed;
    }
    
    PURPOSE: Remove noise and create smooth curves
    TIME: 0.1 seconds
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.4: 3D Geometry Generation   │
    └─────────────────────────────────────────┘
    
    Using Three.js LatheGeometry:
    
    const points = profile.map(p => 
      new THREE.Vector2(p.x * 0.5, p.y)
    );
    
    const geometry = new THREE.LatheGeometry(
      points,
      64,        // Segments (smoothness)
      0,         // phiStart
      Math.PI * 2  // phiLength (full 360°)
    );
    
    What happens:
    ├─ Profile curve is rotated 360° around Y-axis
    ├─ Creates cylindrical/vase-like mesh
    ├─ UV coordinates auto-generated for texture mapping
    └─ Vertices, faces, normals computed
    
    OUTPUT: THREE.BufferGeometry
    TIME: 0.5 seconds
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.5: Texture Application      │
    └─────────────────────────────────────────┘
    
    const textureLoader = new THREE.TextureLoader();
    
    const texture = textureLoader.load(
      'data:image/png;base64,' + noBgBuffer.toString('base64')
    );
    
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,      // Ceramic surface
      metalness: 0.1,      // Slight shine
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    OUTPUT: THREE.Mesh (complete 3D model)
    TIME: 0.2 seconds
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.6: GLB Export               │
    └─────────────────────────────────────────┘
    
    const exporter = new GLTFExporter();
    
    const glbBuffer = await new Promise((resolve, reject) => {
      exporter.parse(
        mesh,
        (gltf) => {
          const buffer = Buffer.from(gltf as ArrayBuffer);
          resolve(buffer);
        },
        (error) => reject(error),
        { 
          binary: true,
          embedImages: true,
          maxTextureSize: 2048
        }
      );
    });
    
    OUTPUT: Binary GLB file (Buffer)
    SIZE: 2-8 MB (depending on texture resolution)
    TIME: 1-2 seconds
                           ↓
    ┌─────────────────────────────────────────┐
    │ SUB-STEP 6B.7: GLB Optimization         │
    └─────────────────────────────────────────┘
    
    Optional: Draco compression
    
    import { compress } from 'gltf-pipeline';
    
    const compressed = await compress(glbBuffer, {
      dracoOptions: {
        compressionLevel: 7,
        quantizePositionBits: 14,
        quantizeNormalBits: 10,
        quantizeTexcoordBits: 12
      }
    });
    
    Size reduction: ~50-70%
    TIME: 1-2 seconds
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Upload GLB to Cloudinary                            │
└─────────────────────────────────────────────────────────────┘
    
    const glbUrl = await cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${glbBuffer.toString('base64')}`,
      {
        resource_type: 'raw',
        folder: 'products/models',
        public_id: `product-${productId}`,
        format: 'glb'
      }
    );
    
    OUTPUT:
    └─ glbUrl: "https://res.cloudinary.com/.../product-123.glb"
    
    TIME: 2-3 seconds
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Save to Database                                    │
└─────────────────────────────────────────────────────────────┘
    
    const product = await prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        imageUrl: imageUrl.secure_url,
        glbUrl: glbUrl.secure_url,
        glbFileSize: glbBuffer.length,
        processingStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    Database record created:
    {
      id: "cuid_abc123",
      name: "Bình gốm sứ xanh trắng",
      imageUrl: "https://cloudinary.com/.../vase-123.jpg",
      glbUrl: "https://cloudinary.com/.../product-123.glb",
      processingStatus: "completed"
    }
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Response to Client                                  │
└─────────────────────────────────────────────────────────────┘
    
    HTTP 200 OK
    {
      "success": true,
      "product": {
        "id": "cuid_abc123",
        "name": "Bình gốm sứ xanh trắng",
        "price": 1500000,
        "imageUrl": "https://cloudinary.com/.../vase-123.jpg",
        "glbUrl": "https://cloudinary.com/.../product-123.glb",
        "processingTime": "8.5s"
      }
    }
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: Admin UI Update                                    │
└─────────────────────────────────────────────────────────────┘
    
    UI displays:
    ├─ ✅ Success message: "Sản phẩm đã được tạo thành công!"
    ├─ 📸 Product image preview
    ├─ 🔗 Link to product detail page
    └─ 📱 "Xem AR" button (test AR immediately)
    
    Admin can:
    ├─ View product in list
    ├─ Edit product details
    ├─ Test AR on mobile device
    └─ Publish product to public catalog
```

### Total Processing Time Breakdown

```
┌─────────────────────────────────────────────┐
│ Operation                    │ Time         │
├─────────────────────────────────────────────┤
│ Background Removal (client)  │ 5-10s        │
│ Upload to Server             │ 2-3s         │
│ Image Preprocessing          │ 0.5-1s       │
│ Profile Extraction           │ 1-2s         │
│ Profile Smoothing            │ 0.1s         │
│ 3D Generation                │ 0.5s         │
│ Texture Application          │ 0.2s         │
│ GLB Export                   │ 1-2s         │
│ GLB Optimization (optional)  │ 1-2s         │
│ Upload to Cloudinary         │ 2-3s         │
│ Database Save                │ 0.1s         │
├─────────────────────────────────────────────┤
│ TOTAL (without optimization) │ 13-22s       │
│ TOTAL (with optimization)    │ 14-24s       │
└─────────────────────────────────────────────┘
```

---

### FLOW 2: User Views AR

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Navigates to Product Detail Page               │
└─────────────────────────────────────────────────────────────┘
                           ↓
    GET /products/:id
    
    Frontend (Next.js) fetches product data:
    
    const product = await fetch(`/api/products/${id}`).then(r => r.json());
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Render Product Page                                 │
└─────────────────────────────────────────────────────────────┘
    
    <div className="product-page">
      <img src={product.imageUrl} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.price} VNĐ</p>
      <p>{product.description}</p>
      
      {/* AR Button */}
      <button onClick={openAR}>
        📱 Xem trong AR
      </button>
    </div>
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: User Clicks "Xem AR"                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
    Modal/Fullscreen AR viewer opens
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Load Model Viewer Component                         │
└─────────────────────────────────────────────────────────────┘
    
    <model-viewer
      src={product.glbUrl}
      alt={product.name}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      environment-image="neutral"
      loading="eager"
    >
      <button slot="ar-button" className="ar-cta">
        📱 View in Your Space
      </button>
    </model-viewer>
    
    Component initialization:
    ├─ Detect device OS (iOS/Android/Desktop)
    ├─ Check AR capability (ARKit/ARCore)
    ├─ Download GLB file from CDN
    └─ Initialize 3D renderer
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5A: iOS (Safari/Chrome) - AR QuickLook                 │
└─────────────────────────────────────────────────────────────┘
    
    Device Detection:
    if (iOS && ARKit supported) {
      // Use AR QuickLook
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'ar');
      anchor.appendChild(document.createElement('img'));
      anchor.setAttribute('href', glbUrl);
      anchor.click();
    }
    
    Process:
    ├─ Model Viewer triggers AR QuickLook
    ├─ iOS downloads GLB file
    ├─ Native ARKit launches
    ├─ Camera opens with AR overlay
    ├─ User places object in real world
    └─ User can move, rotate, scale
    
    Features:
    ├─ ✅ Native iOS experience
    ├─ ✅ Realistic lighting & shadows
    ├─ ✅ Object occlusion (iOS 14+)
    └─ ✅ Share AR screenshot
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5B: Android (Chrome) - Scene Viewer                    │
└─────────────────────────────────────────────────────────────┘
    
    Device Detection:
    if (Android && ARCore supported) {
      // Use Scene Viewer
      const intent = `intent://arvr.google.com/scene-viewer/1.0`;
      window.location.href = intent + `?file=${glbUrl}`;
    }
    
    Process:
    ├─ Model Viewer triggers Scene Viewer
    ├─ Google AR Services downloads GLB
    ├─ Scene Viewer app launches
    ├─ Camera opens with AR overlay
    ├─ User places object in real world
    └─ User can move, rotate, scale
    
    Features:
    ├─ ✅ Native Android experience
    ├─ ✅ Environmental HDR lighting
    ├─ ✅ Accurate surface detection
    └─ ✅ Screenshot & share
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5C: Desktop - 3D Viewer (Fallback)                     │
└─────────────────────────────────────────────────────────────┘
    
    if (Desktop || !AR supported) {
      // Show interactive 3D viewer
      <model-viewer
        src={glbUrl}
        camera-controls
        auto-rotate
        disable-zoom={false}
      />
    }
    
    Features:
    ├─ ✅ Mouse drag to rotate
    ├─ ✅ Scroll to zoom
    ├─ ✅ Auto-rotate when idle
    └─ ❌ No AR placement (desktop limitation)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: User Interacts with AR                              │
└─────────────────────────────────────────────────────────────┘
    
    Available interactions:
    ├─ Move: Drag object to different locations
    ├─ Rotate: Two-finger rotation gesture
    ├─ Scale: Pinch to zoom in/out
    ├─ Screenshot: Capture AR view
    └─ Close: Return to product page
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: User Closes AR                                       │
└─────────────────────────────────────────────────────────────┘
    
    ├─ AR session ends
    ├─ Camera stops
    ├─ Return to product detail page
    └─ Optional: Track analytics event
    
    Analytics tracked:
    ├─ AR session duration
    ├─ Device type
    ├─ Product ID
    └─ Screenshot taken (yes/no)
```

---

## 🛠 Technical Stack

### Frontend

```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "ui": "React 18 + TailwindCSS",
  "ar": "@google/model-viewer 3.4.0",
  "bgRemoval": "@imgly/background-removal 1.4.5",
  "imageCompression": "browser-image-compression",
  "stateManagement": "Zustand / React Query",
  "forms": "React Hook Form + Zod"
}
```

### Backend

```json
{
  "framework": "NestJS 10",
  "language": "TypeScript",
  "runtime": "Node.js 20 LTS",
  "3dProcessing": {
    "three": "^0.160.0",
    "headless-gl": "^7.0.0",
    "canvas": "^2.11.2",
    "gltf-pipeline": "^4.1.0"
  },
  "imageProcessing": "sharp ^0.33.0",
  "database": "Prisma ORM + PostgreSQL 15",
  "storage": "Cloudinary SDK / AWS S3",
  "queue": "Bull (Redis-based)",
  "validation": "class-validator + class-transformer"
}
```

### Infrastructure

```yaml
Hosting:
  Frontend: Vercel / Netlify
  Backend: Railway / Render / AWS EC2
  Database: Supabase / Railway PostgreSQL
  Storage: Cloudinary / AWS S3 + CloudFront
  Queue: Redis (Upstash / Railway)

CI/CD:
  - GitHub Actions
  - Automated testing
  - Docker containers
```

---


## ⚠️ Limitations & Trade-offs

### 1. 3D Model Quality

| Aspect | Limitation | Reason |
|--------|-----------|--------|
| **Surface Detail** | Flat texture only, no depth | LatheGeometry creates smooth surfaces |
| **Embossed Patterns** | Not 3D, just texture | No depth information from 2D image |
| **Complex Shapes** | Only rotationally symmetric objects | Algorithm assumes revolution around axis |
| **Accuracy** | ±5-10% dimension variation | Edge detection + smoothing introduce errors |

### 2. Input Requirements

**Ideal Input:**
- ✅ White or transparent background
- ✅ Straight-on view (90° angle)
- ✅ Even lighting
- ✅ High resolution (1000px+)
- ✅ Clear edges

**Problematic Input:**
- ❌ Complex backgrounds
- ❌ Angled shots
- ❌ Shadows or reflections
- ❌ Low resolution
- ❌ Blurry edges

### 3. Processing Time

```
Background Removal: 5-10s (client-side, device dependent)
3D Generation: 5-8s (server-side)
Total: 10-18s (slow for modern UX expectations)

Solutions:
- Async processing with notifications
- Progressive loading (low-poly first)
- Queue system for batch processing
```

### 4. File Size Constraints

```
Texture: 2-4 MB (2048x2048 PNG)
Geometry: 500KB-1MB (64 segments)
Total GLB: 3-8 MB

Implications:
- Slow download on 3G
- AR load time 2-5s
- Storage costs scale with product count
```

### 5. Browser Compatibility

| Feature | iOS Safari | Android Chrome | Desktop |
|---------|-----------|----------------|---------|
| Background Removal | ⚠️ Slow on old devices | ✅ Good | ✅ Excellent |
| AR QuickLook | ✅ iOS 12+ | ❌ N/A | ❌ N/A |
| Scene Viewer | ❌ N/A | ✅ ARCore devices | ❌ N/A |
| 3D Viewer | ✅ Yes | ✅ Yes | ✅ Yes |

### 6. Cost Considerations

**Monthly Costs (100 products, 100 AR views):**

```
Cloudinary:
- Storage: 100 products × 5MB = 500MB → $0 (free tier: 25GB)
- Bandwidth: 100 views × 5MB = 500MB → $0 (free tier: 25GB/month)
- Transformations: 100 uploads → $0 (free tier: 25,000/month)

Server (Railway/Render):
- 1 vCPU, 512MB RAM → $5/month (hobby tier)
- OR Railway Free Tier: $0 (với giới hạn 500 hours)

Database (Supabase):
- 500MB storage → $0 (free tier: 500MB)
- 100 products + metadata → ~50MB actual usage

Redis (Upstash):
- Cache + Queue → $0 (free tier: 10K commands/day)

Total: $0-5/month (hoàn toàn trong free tiers!)

Note: 
- Cloudinary free tier: 25GB storage + 25GB bandwidth
- Railway free tier: 500 hours/month (~$5 nếu vượt)
- 100 products + 100 views/month rất nhỏ, dùng free tier thoải mái
```

**Detailed Cost Breakdown:**

| Service | Free Tier Limit | Your Usage | Cost |
|---------|----------------|------------|------|
| **Cloudinary** | 25GB storage + 25GB bandwidth | 500MB storage + 500MB bandwidth | $0 |
| **Railway** | 500 hours/month | ~720 hours (24/7) | $5 or use sleep mode = $0 |
| **Supabase** | 500MB DB + 2GB bandwidth | 50MB DB + 100MB bandwidth | $0 |
| **Upstash Redis** | 10K commands/day | ~100-500 commands/day | $0 |
| **Vercel (Frontend)** | 100GB bandwidth | ~5GB bandwidth | $0 |
| **Domain** | N/A | 1 domain | $12/year (~$1/month) |
| **Total** | | | **$0-6/month** |

**Cost Optimization Tips:**

```typescript
// 1. Railway Sleep Mode (Free tier hack)
// App tự động sleep sau 5 phút không dùng
// Wake up khi có request (cold start ~5s)
// → Dưới 500 hours/month = FREE

// 2. Cloudinary Auto-Optimization
transformation: [
  { fetch_format: 'auto' },  // WebP cho browser hỗ trợ → giảm 30% bandwidth
  { quality: 'auto:eco' },   // Smart compression → giảm 40% storage
]

// 3. CDN Caching
Cache-Control: max-age=31536000  // 1 year
// → Repeat visitors không tải lại file

// 4. Lazy Generation
// Chỉ generate 3D khi user click "Xem AR"
// → Tiết kiệm processing cost

// 5. Image Compression trước upload
maxSizeMB: 2,  // Giảm từ 8MB → 2MB
maxWidthOrHeight: 2048  // Đủ cho AR, không cần 4K
```

**ROI Analysis:**

```
Investment: $0-6/month
Expected outcome với 100 products:
- Conversion rate increase: +15-30% (industry average for AR)
- Average order value: 1,500,000 VNĐ
- Monthly orders: 10-20 (conservative)

Revenue increase: 
10 orders × 1,500,000 × 15% = 2,250,000 VNĐ/month (~$95)

ROI: $95 revenue / $6 cost = 1,583% ROI 🚀

Breakeven: Cần 1 đơn hàng extra/month để hoàn vốn!
```

---

## 🔮 Future Enhancements

### Phase 2: Advanced Features

```typescript
// 1. AI Depth Estimation (optional upgrade)
import * as DepthEstimation from '@mediapipe/tasks-vision';

async function estimateDepth(imageBuffer: Buffer): Promise<DepthMap> {
  const estimator = await DepthEstimation.DepthEstimator.create();
  return await estimator.estimate(imageBuffer);
}

// Use depth map to create actual 3D relief
```

```typescript
// 2. Custom Order Flow
POST /api/custom-orders/preview

Body:
{
  customImage: File,
  vaseType: "preset-hulu" | "auto-detect",
  personalization: {
    text: "Happy Birthday",
    position: "center"
  }
}

Response:
{
  previewGlbUrl: "https://.../temp-xyz.glb",
  estimatedPrice: 2500000,
  processingTime: "3-5 days"
}
```

```typescript
// 3. Multi-view Support
// Combine multiple angles for better 3D reconstruction
POST /api/admin/products/multi-view

Body:
{
  images: [File, File, File], // Front, Side, Top
  autoAlign: true
}
```

### Phase 3: Premium Features

- **AR Try-On**: Virtual placement with room scanning
- **Social Sharing**: AR screenshots with branded overlays
- **360° Product Spin**: Auto-generate turntable video
- **Size Recommendation**: AI-powered size matching
- **Batch Processing**: Upload CSV with 100+ products

---

## 📚 References & Resources

### Documentation
- [Three.js LatheGeometry](https://threejs.org/docs/#api/en/geometries/LatheGeometry)
- [Model Viewer](https://modelviewer.dev/)
- [AR Quick Look](https://developer.apple.com/augmented-reality/quick-look/)
- [Scene Viewer](https://developers.google.com/ar/develop/scene-viewer)

### Libraries
- [@imgly/background-removal](https://github.com/imgly/background-removal-js)
- [sharp](https://sharp.pixelplumbing.com/)
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)

### Tutorials
- [3D from Images Tutorial](https://threejs.org/manual/#en/custom-geometry)
- [AR Web Development](https://web.dev/ar/)

---

## 🎓 Summary

This system provides a **cost-effective, automated solution** for converting 2D ceramic product images into 3D AR models.

**Strengths:**
- ✅ Fully automated workflow
- ✅ No expensive AI services
- ✅ Native AR support (iOS/Android)
- ✅ Admin-friendly interface
- ✅ Scalable architecture
- ✅ **$0-5/month cost (100 products, 100 AR views)**

**Limitations:**
- ⚠️ 3D quality is "good enough" not "perfect"
- ⚠️ Requires quality input images
- ⚠️ Processing time 10-18 seconds
- ⚠️ Only works for rotationally symmetric objects

**Perfect Scale For Your Use Case:**
- 100 products catalog
- ~100 AR views/month
- **100% within FREE TIERS** (Cloudinary, Supabase, Railway)
- Total cost: **$0/month** or max $5/month if using Railway paid

**Best For:**
- Small to medium e-commerce catalogs
- AR preview before purchase
- Handcrafted/artisan products (gốm sứ)
- MVP/startup launch
- Bootstrap projects with minimal budget

**Not Suitable For:**
- High-end 3D rendering
- Complex irregular shapes
- Professional 3D modeling
- Real-time generation
- Mass-market platforms (1000s of products)

---

**Document Version:** 1.0  
**Last Updated:** 2024-01-15  
**Author:** Technical Architecture Team  
**Status:** Production Ready
