# 🏺 LUU SAC - Ceramic AR Platform

Ceramic E-commerce Platform with Augmented Reality Integration

This project provides an O2O (Online-to-Offline) shopping experience, allowing users to customize patterns on ceramic products and visualize them in their real space using AR before placing an order.

## 🛠 Tech Stack

The system is built on a Monorepo architecture to optimize code management and data sharing (Type Safety) between Frontend and Backend.

| Layer          | Technology        | Details                                             |
| -------------- | ----------------- | --------------------------------------------------- |
| Monorepo Tool  | NPM Workspaces    | Multi-package management                            |
| Frontend       | Next.js 14+       | App Router, Server Components                       |
| UI/UX          | Tailwind CSS      | Styling & Responsive Design                         |
| AR Engine      | `<model-viewer>`  | Google's Web Component for AR/3D on the web         |
| Backend        | Node.js + Express | TypeScript, RESTful API                             |
| Database       | PostgreSQL        | Relational Database                                 |
| ORM            | Prisma 7          | Schema Management, Migrations, and Type-safe Client |
| Infrastructure | Docker            | Containerization (Planned)                          |

## 🏗 Source Code Organization

The project follows a Monorepo architecture, clearly separating applications (apps) from shared libraries (packages).

```
luu-sac-ar/
├── apps/
│   ├── web/                # Frontend Application (Next.js)
│   │   ├── src/app/        # App Router Pages
│   │   └── public/models/  # Contains base 3D models (.glb)
│   │
│   └── api/                # Backend Service (Express)
│       ├── src/            # Business Logic (Controllers, Services)
│       ├── prisma/         # Database Schema & Migrations
│       └── prisma.config.ts # Prisma 7 Configuration
│
├── packages/
│   └── shared/             # Shared Types, Interfaces, DTOs
│       └── index.ts        # (e.g., IProduct, IOrder, ICustomDesign)
│
├── package.json            # Root scripts (Start all, Lint all...)
└── README.md               # Project Documentation
```

## 🌟 Key Features

### 🛒 E-commerce Core:

- View ceramic product listings (Filter by category).
- Product details (Price, Dimensions, Description).
- Cart and Checkout.

### 📱 AR Customization (Core Feature):

- Allows users to upload personal images.
- System automatically maps the image onto the 3D ceramic model.
- Preview the product in real space using AR (via mobile camera).

### ⚙️ Order Management System (OMS):

- Manage order statuses: Pending -> Processing -> Shipping -> Completed.
- Handle Hybrid Orders: Orders containing both ready-made products and custom-designed items.

### 📊 Dashboard & Statistics:

- Revenue statistics over time.
- Best-selling product statistics.

### 🏢 Company Management:

- Manage company information, contact details, and social links.

## 🔄 AR Custom Order Workflow

This is the most complex workflow, bridging the Digital experience with the Physical production process:

### Step 1: User Upload & Processing

- User selects a ceramic base template (e.g., Fortune Vase, Ceramic Plate).
- User uploads their desired pattern/image (JPG/PNG).
- Backend: Receives the image -> Performs Texture Mapping -> Generates a temporary .glb file.

### Step 2: AR Visualization

- Frontend: Displays the 3D file with the new texture.
- User activates AR View to place the virtual vase on their shelf or tea table to check for color and size suitability.

### Step 3: Ordering

When the user places an order, the system stores:

- `baseTemplateId`: The type of ceramic blank.
- `originalImageUrl`: The high-quality original image uploaded by the customer.
- Note: We do not store the heavy .glb file in the order DB to optimize performance.

### Step 4: Fulfillment (Production)

- Admin: Receives a new order tagged as "Custom Design".
- Admin downloads the originalImageUrl.
- Sends the image file and the ceramic blank request to the workshop for heat transfer printing or hand painting.

## �️ AR Viewer Flow (The User Journey)

### Product Detail Page:

- The user navigates to a specific ceramic product page.
- The 3D model is loaded in a standard "Orbit View" (user can rotate/zoom with fingers).

### Enable AR Camera:

- User taps the "View in your space" (AR) button.
- The browser requests permission to access the Camera.

### Display 3D Product on Camera:

- The device camera opens full screen.
- The system detects the floor or a flat surface.
- The 3D Ceramic Model appears overlaid on the real world (Reticle placement).
- User can drag to move or pinch to resize the vase to see how it fits their room.

## �🚀 Getting Started

### 1. Prerequisites

- Node.js >= 18 (Node 24 recommended)
- PostgreSQL
- Git

### 2. Installation

```bash
# Clone repository
git clone https://github.com/ThinhTran1001/luu-sac-ar.git
cd luu-sac-ar

# Install dependencies for the entire Monorepo
npm install
```

### 3. Database Configuration

Create a `.env` file in the `apps/api` directory:

```
DATABASE_URL="postgresql://user:password@localhost:5432/ceramic_db?schema=public"
```

Run Migrations to initialize tables:

```bash
# From the root directory or apps/api
npm run prisma:migrate # (Script needs to be configured in package.json)
# Or manually:
cd apps/api && npx prisma migrate dev --name init_db
```

### 4. Running the Project

From the root directory, use the following commands:

**Start Web (Frontend):**

```bash
npm run dev:web
```

Access: http://localhost:3000

**Start API (Backend):**

```bash
npm run dev:api
```

API Server: http://localhost:3001 (or your configured port)

## 🤝 Contribution

The project is developed with strict source code management guidelines. Please adhere to:

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`.
- **Branching Strategy**: Create feature branches `feature/feature-name` from `main`.

---

© 2026 Luu Sac Project. Built with ❤️ by ThinhTran.

## Part 2: Using Node 24 with nvm (Windows)

Since you are using Windows (based on your screenshots), you are likely using nvm-windows. Here is how to install and switch to Node 24 using PowerShell.

### 1. Check Available Versions (Optional)

To see if Node 24 is listed:

```powershell
nvm list available
```

### 2. Install Node.js 24

Run the following command to download and install the latest version of the Node 24 line:

```powershell
nvm install 24
```

(If you want a specific version, e.g., 24.0.0, use `nvm install 24.0.0`)

### 3. Activate Node 24

After installation, you must tell nvm to use this version:

```powershell
nvm use 24
```

### 4. Verify

Type the following to ensure your machine is using Node 24:

```powershell
node -v
```

(The result should look like `v24.x.x`)

### 💡 Important Note for Developers:

- **Admin Rights**: On Windows, the `nvm use` command requires Administrator privileges to update the system symlink. If you run this in a standard VS Code terminal and get an "Access denied" or "Exit status 1" error, close VS Code and reopen it as Run as Administrator.
- **Project Compatibility**: Node 24 (current/LTS in 2026) may introduce changes. after switching versions, it is recommended to delete your old `node_modules` folders and run `npm install` again to ensure libraries (especially binary ones like bcrypt or sharp) are rebuilt correctly for the new Node version.
