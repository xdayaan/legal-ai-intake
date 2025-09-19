#!/bin/bash

# Vercel Build Hook
echo "Starting Vercel build process..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema (for Neon)
echo "Pushing database schema..."
npx prisma db push --accept-data-loss || echo "Schema push failed, continuing..."

# Build Next.js app
echo "Building Next.js application..."
npm run build

echo "Build process completed!"