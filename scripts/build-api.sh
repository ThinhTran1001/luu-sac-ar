#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma Client..."
cd apps/api
npx prisma generate
cd ../..

echo "🔧 Building API..."
cd apps/api
npm run build
echo "📁 Listing dist directory structure:"
find dist -type f 2>/dev/null || ls -R dist/ 2>/dev/null || echo "No dist found"
cd ../..

echo "🚀 Running database migrations..."
cd apps/api
npx prisma migrate deploy
cd ../..

echo "✅ API build complete!"
