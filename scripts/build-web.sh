#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🌐 Building Next.js application..."
cd apps/web
npm run build
cd ../..

echo "✅ Web build complete!"
