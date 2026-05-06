# Research Workflow & Publication Management System — Theme Guide

## Theme Identity

**Name:** ResearchFlow  
**Tagline:** *Streamline your research. Publish with confidence.*

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary.9` | `#1A365D` | Deep Navy — Primary brand, headers, sidebar background |
| `primary.7` | `#2B4C7E` | Navy Blue — Active nav items, primary buttons |
| `primary.5` | `#4A7BBF` | Steel Blue — Hover states, links |
| `primary.3` | `#7BAFD4` | Sky Blue — Secondary accents |
| `primary.1` | `#D6E8F5` | Pale Blue — Backgrounds, subtle fills |

### Accent / Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#2D6A4F` | Green — Completed stages, success states |
| `info` | `#1971C2` | Blue — Active/In-Progress stages |
| `warning` | `#E67700` | Amber — Review Required, pending deadlines |
| `danger` | `#C92A2A` | Red — Delayed/Rejected/Overdue |
| `neutral` | `#868E96` | Gray — Pending/inactive stages |

### Stage Color Coding (as per workflow spec)
| Stage Status | Color | Hex |
|-------------|-------|-----|
| Completed | `green` | `#2D6A4F` |
| Active / In Progress | `blue` | `#1971C2` |
| Review Required | `yellow` | `#E67700` |
| Delayed / Rework | `red` | `#C92A2A` |
| Pending | `gray` | `#868E96` |

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Hero | Inter | 700 | 2rem–3rem |
| Page Title | Inter | 600 | 1.5rem |
| Section Heading | Inter | 600 | 1.125rem |
| Body Text | Inter | 400 | 0.875rem–1rem |
| Caption / Meta | Inter | 400 | 0.75rem |
| Code / Monospace | JetBrains Mono | 400 | 0.875rem |

---

## Design Principles

1. **Academic & Professional** — Clean, minimal design that respects the scholarly nature of research work.
2. **Information Dense but Clear** — Show lots of data without feeling cluttered. Use cards, badges, and dividers.
3. **Stage-Centric UI** — Workflow stages are the star of the show. Progress bars and timelines are prominent.
4. **Collaborative Identity** — Avatars, assignment chips, and team indicators make collaboration visible.
5. **Status at a Glance** — Color coding is consistent and meaningful throughout the entire application.

---

## Component Style Tokens

```typescript
// theme.ts (Mantine theme override)
export const themeConfig = {
  primaryColor: 'blue',
  primaryShade: 7,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, monospace',
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'md',
  colors: {
    brand: [
      '#EFF6FF', // 0
      '#DBEAFE', // 1
      '#BFDBFE', // 2
      '#93C5FD', // 3
      '#60A5FA', // 4
      '#3B82F6', // 5
      '#2563EB', // 6
      '#1D4ED8', // 7 — primary
      '#1E40AF', // 8
      '#1E3A8A', // 9
    ],
  },
};
```

---

## Sidebar Navigation

- **Background:** Deep Navy (`#1A365D`)
- **Active Item:** White text + `#2B4C7E` highlight fill
- **Hover:** `rgba(255,255,255,0.08)` overlay
- **Icons:** Lucide React icons, 20px
- **Logo area:** White logo on navy background
- **Width:** 240px (collapsed: 64px icon-only mode)

---

## Cards & Panels

- **Background:** White (`#FFFFFF`) / Dark mode: `#1A1A2E`
- **Border:** `1px solid #E2E8F0`
- **Radius:** `12px`
- **Shadow:** `0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)`
- **Padding:** `24px`

---

## Assignment Type Badge Colors

| Assignment Type | Color |
|----------------|-------|
| Conference Paper | Blue |
| Journal Paper | Violet |
| Book Chapter | Grape |
| Patent | Orange |
| Copyright | Teal |
| Research Proposal | Cyan |
| Project | Indigo |
| Review Article | Pink |
| Survey Paper | Lime |
| Thesis Work | Yellow |
| Other | Gray |

---

## Priority Level Colors

| Priority | Color |
|----------|-------|
| Critical | Red |
| High | Orange |
| Medium | Yellow |
| Low | Green |

---

## Dark Mode

The application supports a **dark mode** toggle.

- **Background:** `#0F172A` (deep slate)
- **Surface:** `#1E293B`
- **Border:** `#334155`
- **Text:** `#F1F5F9`
- **Muted Text:** `#94A3B8`

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Collapsed sidebar, stacked cards |
| Tablet | 768px–1024px | Narrow sidebar, 2-col grid |
| Desktop | > 1024px | Full sidebar, 3–4 col grid |

---

## Iconography

- **Icon Library:** Lucide React (`lucide-react`)
- **Size:** 16px (inline), 20px (nav), 24px (actions)
- **Style:** Stroke-based, consistent weight (1.5px)

---

## Animation & Motion

- **Page transitions:** Fade-in 150ms ease
- **Stage unlock:** Slide-right + green flash 300ms
- **Progress bars:** Count-up animation on mount
- **Notifications:** Slide-in from top-right 200ms
- **Hover states:** `transition: all 150ms ease`
