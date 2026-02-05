#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "� Building shared package..."
cd packages/shared
npm run build
cd ../..

echo "�🗄️  Generating Prisma Client..."
cd apps/api
npx prisma generate
cd ../..

echo "🔧 Building API..."
cd apps/api
npm run build
echo "📁 Build complete. Checking directory structure..."
echo "Working directory: $(pwd)"
echo ""
echo "Contents of dist/:"
find dist -type f -name "*.js" | head -20
echo ""
echo "Looking for index.js files:"
find dist -name "index.js"
echo ""
echo "Checking if main entry exists:"
ls -la dist/index.js 2>/dev/null || echo "dist/index.js NOT FOUND"
ls -la dist/src/index.js 2>/dev/null || echo "dist/src/index.js NOT FOUND"  
ls -la dist/apps/api/src/index.js 2>/dev/null || echo "dist/apps/api/src/index.js NOT FOUND"
cd ../..

echo "🚀 Running database migrations..."
cd apps/api
npx prisma migrate deploy
cd ../..

echo "✅ API build complete!"
