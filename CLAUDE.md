# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homix.ai — AI-powered real estate marketplace frontend. Users interact with an AI chat assistant to find, buy, sell, or rent properties. Built with Vite + React + TypeScript + Tailwind CSS v4.

## Commands

- **Dev server:** `npm run dev` (proxies `/api` to `http://0.0.0.0:8000`)
- **Build:** `npm run build` (outputs to `/dist`)
- **Preview build:** `npm run preview`
- **Deploy:** `npm run deploy` (builds + deploys to GitHub Pages)

No test runner or linter is configured.

## Architecture

### Routing

No React Router — uses state-based page navigation in `App.tsx` with a `currentPage: Page` state. All 13+ pages render conditionally. Navigation is passed as `onNavigate` callback prop.

### State Management

Lifted state in `App.tsx` — no Redux/Zustand. Key state: `currentUser`, `scheduledVisits`, `savedPropertyIds`, `ownerChats`. Props drilled to page components.

Persistence via localStorage with `homix_` prefix (e.g., `homix_current_user`, `homix_chat_session_id`).

### SSE Streaming Chat (`src/app/api/chat.ts`)

Core feature. `streamChatMessage()` uses `ReadableStream` + `TextDecoder` to parse SSE events incrementally. Event types: `thinking`, `answer`, `tool_call`, `tool_result`, `scraping`, `done`, `error`. Supports `AbortController` for cancellation.

The main chat UI is in `ConversationPageNew.tsx` (~700 lines) — handles streaming, thinking box display, property matching after responses, and dual chat views (AI general chat + owner direct messages).

### Property Matching (`src/app/utils.ts`)

`matchPropertiesFromResponse()` does keyword-based filtering (price, beds, location, type) on the AI response text to surface relevant property cards. Falls back to first 3 properties if no match.

### Auth

Mock auth system in `AuthDialog.tsx` using localStorage. User types: buyer/seller/broker. Plans: free/starter/professional/enterprise.

## Key Conventions

- **Path alias:** `@` maps to `./src`
- **Icons:** `lucide-react`
- **Toasts:** `sonner`
- **UI primitives:** Radix UI (`src/app/components/ui/`)
- **Fonts:** Plus Jakarta Sans, Darker Grotesque
- **Colors:** Purple primary `#7065f0`, Navy dark `#110229`; uses oklch in CSS custom properties (`src/styles/theme.css`)
- **Component props pattern:** Page components receive `onNavigate`, `currentUser`, `onOpenAuth`, `onSignOut`
- **AbortError:** Always handle separately from other errors in async/stream code

## Environment Variables

- `VITE_CHAT_API_URL` — Backend chat endpoint (default: `http://0.0.0.0:8000/chat`)
- `VITE_CHAT_DEBUG` — Debug mode flag

## Deployment

GitHub Pages via `gh-pages` package. Base path: `/homix-search-front/`. Triggered by push to `main`. Node 20.
