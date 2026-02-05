#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building shared package..."
npm run build:shared

echo "🗄️  Generating Prisma Client..."
cd apps/api
npx prisma generate

echo "🔧 Building API..."
npm run build

echo "🚀 Running database migrations..."
npx prisma migrate deploy

echo "✅ API build complete!"
