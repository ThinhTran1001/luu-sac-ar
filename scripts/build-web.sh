#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building shared package..."
cd packages/shared
npm run build
cd ../..

echo "🌐 Building Next.js application..."
cd apps/web
npm run build
cd ../..

echo "✅ Web build complete!"
