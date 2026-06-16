# MoMorph Design Specifications Report

Project: Sun Asterisk - Kudos & Awards System
File Key: 9ypp4enmFmdK3YAFJLIu6C
Report Date: 2026-06-12
Last Updated: 2026-06-15
Total Screens: 7

---

## Executive Summary

Fetched complete design specifications for 7 key screens from MoMorph MCP.
All 7 screens implemented as of 2026-06-15.

### Status Overview

| Screen | Design | Spec | Dev | Components |
|--------|--------|------|-----|------------|
| Login | DONE | DONE | DONE | 11 |
| Homepage SAA | DONE | DONE | DONE | 46 |
| Awards System | DONE | DONE | DONE | 22 |
| Live Board | DONE | DONE | DONE | 64 |
| Write Kudo | DONE | DONE | DONE | 26 |
| Language Dropdown | DONE | DONE | DONE | 3 |
| Profile Dropdown | DONE | DONE | DONE | 3 |

---

## Screen Descriptions

### 1. LOGIN (GzbNeVGJHz)
- 11 components: Header, Key Visual, Login Form, Footer
- Interactive: Google OAuth button, Language switcher
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:**
  - Header: SAA logo + functional LanguageSwitcher (VI/EN cookie-based toggle)
  - Key Visual: radial gradient dark background (#00101a)
  - Login Form: Google OAuth button with SVG icon → Supabase server action
  - Footer: copyright left + event tagline right
- **Files:** `src/components/features/login-hero.tsx`, `app/(auth)/login/page.tsx`

### 2. HOMEPAGE SAA (i87tDx10uM)
- 46 components: Dashboard layout with buttons and menu
- Key sections: Awards overview, Kudos feed, Navigation
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:**
  - Hero: "ROOT FURTHER" title, countdown timer (days/hours/minutes/seconds + tick animation), CTA buttons
  - Awards grid section
  - Kudos promo block
  - Sponsors section (6-partner grid)
  - WidgetButton (floating write kudo)
- **Files:** `app/(main)/page.tsx`, `src/components/features/sponsors-section.tsx`, `src/components/features/countdown-timer.tsx`

### 3. AWARDS SYSTEM (zFYDgyj_pD)
- 22 components: Title, Menu filters, Award list, Rankings
- Interactive: Category filters, Award details
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:**
  - Hero section + page title
  - Left nav (anchor links per award category, hidden on mobile)
  - Award sections (6 categories from static data)
  - Top Kudos Talent ranking (top 5 from Supabase `profiles` ordered by `kudos_received_count`)
  - Kudos promo block
- **Files:** `app/(main)/awards/page.tsx`, `src/components/features/award-section.tsx`, `src/components/features/awards-left-nav.tsx`

### 4. LIVE BOARD (MaZUn5xHXZ)
- 64 components: Recognition button, Highlights, Feed, Hashtags
- Interactive: Write Kudo, Hashtag filters, Department filters, Like buttons
- Real-time updates
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:**
  - Hero section
  - KudosHighlightCarousel (top 5 most recent, horizontal snap scroll)
  - KudosTabs: "All Kudos" feed tab + Spotlight Board tab
  - KudosFilters: HashtagFilterDropdown + DepartmentDropdown
  - KudosFeed: infinite scroll (IntersectionObserver), realtime INSERT notification banner
  - KudoCard: sender→receiver avatars, content, hashtags, copy-link, view-detail
  - HeartButton: optimistic like/unlike, heart-pop CSS animation, realtime count sync via Supabase channel
  - KudosSidebar: personal stats grid (received/sent/hearts/boxes), open gift button
  - WidgetButton: fixed floating "Write Kudo" button
- **Bugs fixed (2026-06-15):**
  - New-kudo banner: duplicate count display (`{newCount} {t("newKudos")}` → `{t("newKudos")}` since message already includes `{count}`)
  - Department filter: `departmentId` was declared but never applied; implemented client-side filter post-fetch + added `department_id` to sender select
  - i18n: replaced hardcoded "Đang tải..." → `t("loading")` and "Của bạn" → `t("yourStats")`; added both keys to `vi.json` + `en.json`
- **Files:** `app/(main)/kudos/page.tsx`, `src/components/features/kudos/kudos-feed.tsx`, `src/components/features/kudos/heart-button.tsx`, `src/components/features/kudos/kudos-sidebar.tsx`, `src/components/features/kudos/kudos-highlight-carousel.tsx`, `src/components/features/kudos/kudos-tabs.tsx`, `src/components/features/kudos/kudos-filters.tsx`, `src/components/features/kudos/kudo-card.tsx`

### 5. WRITE KUDO (ihQ26W78P2)
- 26 components: Form with recipient picker, message area
- Form elements: Search, Anonymous toggle, Submit button
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:**
  - RecipientSelector: search profiles, display avatar + name
  - Content textarea with mention hint
  - HashtagChipInput (up to 5 chips)
  - KudoImagePicker: up to 5 images, preview grid, object URL cleanup
  - Anonymous toggle + display-name input
  - Inline validation (shows errors on submit attempt before fields filled)
  - Image upload to Supabase Storage `kudo-images` bucket
  - Submit via server action `submitKudo`
- **Files:** `app/(main)/kudos/write/page.tsx`, `src/components/features/kudos/write-kudo-form.tsx`, `src/components/features/kudos/kudo-image-picker.tsx`

### 6. LANGUAGE DROPDOWN (hUyaaugye2)
- 3 components: Vietnamese, English options
- Behavior: Select language, update UI, close dropdown
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:** LanguageSwitcher pill component — sets `locale` cookie, calls `router.refresh()`. Used in main nav header + login page header.
- **Files:** `src/components/ui/language-switcher.tsx`

### 7. PROFILE DROPDOWN (z4sCl3_Qtk)
- 3 components: Profile, Logout options
- Behavior: Click profile/logout, close dropdown
- Status: Design DONE, Spec DONE, Dev DONE
- **Implemented:** ProfileDropdown in main nav — shows avatar/name, links to profile page, sign out action.
- **Files:** `src/components/ui/profile-dropdown.tsx`
