#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🌐 Building Next.js application..."
cd apps/web
npm run build

echo "✅ Web build complete!"
