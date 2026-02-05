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
echo "📁 Contents of apps/api after build:"
ls -la
echo "📁 Contents of apps/api/dist (if exists):"
ls -la dist/ || echo "dist directory not found!"
cd ../..

echo "🚀 Running database migrations..."
cd apps/api
npx prisma migrate deploy
cd ../..

echo "✅ API build complete!"
