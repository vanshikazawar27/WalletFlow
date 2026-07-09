---
name: WalletFlow AI
colors:
  surface: '#031427'
  surface-dim: '#031427'
  surface-bright: '#2a3a4f'
  surface-container-lowest: '#000f21'
  surface-container-low: '#0b1c30'
  surface-container: '#102034'
  surface-container-high: '#1b2b3f'
  surface-container-highest: '#26364a'
  on-surface: '#d3e4fe'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d3e4fe'
  inverse-on-surface: '#213145'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#adc6ff'
  on-tertiary: '#002e6a'
  tertiary-container: '#71a1ff'
  on-tertiary-container: '#00367a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#031427'
  on-background: '#d3e4fe'
  surface-variant: '#26364a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  card-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding-mobile: 16px
  container-padding-desktop: 48px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system embodies a "Precision Elegance" philosophy, merging the high-trust requirements of fintech with the fluid intelligence of AI. The aesthetic is a hybrid of **Minimalism** and **Glassmorphism**, prioritizing clarity, depth, and a high-end polished feel reminiscent of luxury digital banking.

The target audience is tech-savvy professionals who value speed and sophisticated data visualization. The UI should evoke a sense of calm control, security, and forward-thinking innovation. Key visual traits include expansive whitespace, subtle blurred backdrops, and crisp, intentional accents of emerald light.

## Colors
The palette is rooted in a deep "Midnight Navy" to establish institutional trust, contrasted with a vibrant "Emerald Green" that symbolizes growth and AI vitality. 

- **Primary Emerald:** Used for key actions, growth indicators, and AI-driven insights.
- **Accent Blue:** Reserved for interactive elements that denote secondary utility or informative links.
- **Surface Strategy:** In Dark Mode, use varying opacities of white (5% to 12%) over the navy background to create "Glass" containers. In Light Mode, use subtle shadows and borders to define hierarchy against the cool grey-white background.

## Typography
This design system utilizes **Inter** for all primary interfaces to maintain a systematic, neutral, and highly readable environment. **JetBrains Mono** is introduced as a secondary label font for transaction IDs, currency codes, and data points, reinforcing the "AI/Technical" nature of the product.

Headings should use tight letter-spacing to feel "locked-in" and authoritative. Card titles are set to Medium weight to differentiate from body text without overwhelming the layout. Use `display-lg` sparingly for balance totals and hero statements.

## Layout & Spacing
The layout follows a **fluid 12-column grid** for desktop and a **4-column grid** for mobile. Spacing is built on a 4px baseline, but defaults to 16px (`stack-md`) for most component groupings to maintain a "breathable" premium feel.

- **Margins:** Desktop margins are generous (48px) to push content toward the center for better focus.
- **AI Insights:** Use asymmetric spacing or unique padding for AI-generated cards to visually separate them from standard transactional lists.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Ambient Shadows**.

1.  **Level 0 (Base):** Primary background color.
2.  **Level 1 (Cards):** In dark mode, use a 1px border (white at 10% opacity) and a background of `white` at 5% opacity with a 20px backdrop blur. In light mode, use a soft `0 10px 30px rgba(15, 23, 42, 0.05)` shadow.
3.  **Level 2 (Modals/Popovers):** Higher blur radius (40px) and a slightly thicker border to simulate proximity to the user.

Gradients should be used behind glass layers to create "blobs" of light (Emerald and Blue) that suggest activity and energy.

## Shapes
The shape language is modern and "Soft-Tech." Standard components use a **16px radius** (`rounded-lg`), while main feature cards and hero sections utilize a **24px radius** (`rounded-xl`). 

Interactive elements like buttons and chips should never be fully sharp; even at their smallest, they maintain a 4px minimum radius. Form inputs follow the standard 12px-16px radius to match the card containers they inhabit.

## Components

- **Buttons:** 
  - *Primary:* Emerald Green background with white text. High-saturation, 16px height-padding.
  - *Ghost:* Transparent with a 1px border. On hover, a subtle 10% fill of the brand color.
- **Cards:** The core of the UI. Must feature a `20px` backdrop-blur and a subtle top-down linear gradient border to catch "light" from the top of the screen.
- **Lists:** Transaction items should have no borders between them; use `16px` vertical padding and hover states with a 2% background tint.
- **Inputs:** Use a "filled" style with a bottom-only active border (Emerald). Labels should be small, uppercase, and use the mono font.
- **Chips:** For status (e.g., "Pending," "Completed"). Use high-contrast pill shapes with 10% opacity backgrounds of the semantic color and 100% opacity text.
- **AI Highlight:** Any AI-suggested action should have a subtle 1px "glow" border using the Primary Emerald to Accent Blue gradient.