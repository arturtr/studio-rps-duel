# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` (runs on port 9002 with turbopack)
- **Build**: `npm run build`
- **Static export**: `npm run export` (builds and exports static files)
- **Lint**: `npm run lint`
- **Type check**: `npm run typecheck`
- **Genkit development**: `npm run genkit:dev` or `npm run genkit:watch`

## Project Architecture

This is a Next.js 15 Rock Paper Scissors game application with the following key characteristics:

### Core Structure
- **Framework**: Next.js 15 with App Router
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with localStorage persistence
- **Build Output**: Static site export configured for deployment

### Key Components
- Single-page game in `src/app/page.tsx` with complete RPS logic
- Shadcn/ui components in `src/components/ui/` for consistent design system
- Game state persisted to localStorage (scores, ties)
- Keyboard controls (R/1, P/2, S/3) with focus management

### Game Features
- User vs Computer Rock Paper Scissors gameplay
- Real-time score tracking with localStorage persistence
- Visual feedback with emojis and Lucide icons
- Responsive design with mobile-first approach
- Keyboard shortcuts with conflict avoidance for form inputs

### Firebase Integration
- Firebase Genkit AI integration configured but not actively used in game logic
- Development tools available via genkit commands

### Deployment
- Static site export configured for GitHub Pages or similar hosting
- TypeScript and ESLint errors ignored during builds for production deployment