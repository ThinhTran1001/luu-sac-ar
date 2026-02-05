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
cd ../..

echo "🚀 Running database migrations..."
cd apps/api
npx prisma migrate deploy
cd ../..

echo "✅ API build complete!"
