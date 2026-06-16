# Project Constitution — SAA 2025 Web App

## Tech Stack
- Framework: Next.js 16.2.7 (App Router), React 19
- Language: TypeScript (strict, no `any`)
- Styling: TailwindCSS v4 (CSS-first config via `globals.css @theme`, no `tailwind.config.js`)
- Backend: Supabase (auth, database, realtime)
- Package manager: npm

## Design System

### Color Tokens
Define in `app/globals.css` under `@theme inline`:

```css
@theme inline {
  --color-bg:           #00101a;   /* page background — deep dark navy */
  --color-container:    #101417;   /* card / panel */
  --color-container-2:  #00070c;   /* darker container */
  --color-primary:      #ffea9e;   /* gold — headings, CTAs, emphasis */
  --color-text:         #ffffff;   /* default body text */
  --color-muted:        #999999;   /* secondary / placeholder */
  --color-border:       #998c5f;
  --color-divider:      #2e3940;
  --color-error:        #b3261e;
  --color-btn-hover:    #fff8e1;   /* primary button hover */
}
```

### Layout
- Canvas width: 1512px desktop, centered with `max-w-[1512px] mx-auto`
- Horizontal padding: `px-36` (144px) on desktop, `px-6` on mobile
- Navbar: fixed top, `h-20` (80px), `bg-[#00101a]`
- Theme: dark only — no light/dark toggle

## File Structure
```
src/
  app/
    (auth)/
      login/
        page.tsx
    (main)/
      layout.tsx           ← Navbar + providers
      page.tsx             ← Homepage SAA
      kudos/
        page.tsx           ← Sun* Kudos Live board
        write/
          page.tsx         ← Viết Kudo
      awards/
        page.tsx           ← Hệ thống giải
  components/
    ui/                    ← atomic: Button, Input, Dropdown, Badge…
    layout/                ← Navbar, PageContainer, Footer
    features/              ← domain: KudoCard, AwardCard, SecretBox…
  lib/
    supabase/
      client.ts            ← browser client
      server.ts            ← server client
      middleware.ts
    types/
      index.ts
```

## Component Conventions
- **Server Components by default** — add `"use client"` only when hooks/events needed
- Props interface: `interface XxxProps { ... }` (not `type`)
- File names: `kebab-case.tsx`
- Exports: named exports for components, default export for pages
- No inline styles — use Tailwind utility classes exclusively
- No CSS modules

## Code Style
- No `any` type; use `unknown` + type guards if needed
- Async/await over `.then()`
- Supabase: server client in Server Components, browser client in Client Components
- Error boundaries at route segment level
- i18n: Vietnamese UI text hardcoded (no i18n library for MVP)
- No comments explaining WHAT code does — only WHY if non-obvious

## DO NOT
- Do not use `styled-components`, `emotion`, or CSS modules
- Do not use `class-variance-authority` (cva) unless already installed
- Do not create new files outside the structure above without confirming
- Do not add optimistic UI unless spec explicitly requires it
- Do not add animations beyond what Figma design shows

## Screens (Web — spec_created)
| Screen | MoMorph URL |
|---|---|
| Login | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz |
| Homepage SAA | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM |
| Sun* Kudos - Live board | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ |
| Viết Kudo | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2 |
| Hệ thống giải | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD |
| Dropdown Hashtag filter | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/JWpsISMAaM |
| Dropdown list hashtag | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/p9zO-c4a4x |
| Dropdown ngôn ngữ | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2 |
| Dropdown Phòng ban | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/WXK5AYB_rG |
| Dropdown-profile | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/z4sCl3_Qtk |
| Dropdown-profile Admin | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/54rekaCHG1 |
| Open secret box (chưa mở) | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/J3-4YFIpMM |
