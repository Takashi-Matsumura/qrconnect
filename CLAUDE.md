# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- **Development server**: `npm run dev` - Starts the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Creates a production build of the Next.js application
- **Start production**: `npm start` - Starts the production server (must run build first)
- **Lint**: `npm run lint` - Runs ESLint to check code quality and style

## Architecture Overview

This is a **Next.js 15** application using the **App Router** architecture:

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4 with PostCSS
- **Typography**: Geist font family (Sans and Mono variants)
- **Build tool**: TypeScript with strict mode enabled
- **Linting**: ESLint with Next.js configuration

### Project Structure

- `app/` - App Router directory containing:
  - `layout.tsx` - Root layout with font configuration and global styles
  - `page.tsx` - Home page component
  - `globals.css` - Global CSS styles
- `public/` - Static assets (SVG icons, images)
- TypeScript configuration uses path aliases with `@/*` mapping to root directory

### Key Technical Details

- Uses App Router (not Pages Router) for routing
- Configured for strict TypeScript compilation
- Includes dark mode support in styling
- Font optimization with `next/font/google`
- Image optimization with `next/image`

## Communication Preferences

Based on CLAUDE.local.md, responses should be provided in Japanese (回答は日本語でください).