#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Generating Prisma Client..."
npx prisma generate --schema=apps/api/prisma/schema.prisma

echo "🔧 Building API..."
cd apps/api
npm run build
cd ../..

echo "🚀 Running database migrations..."
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

echo "✅ API build complete!"
