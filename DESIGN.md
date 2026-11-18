---
name: Tu Guía Inteligente · Buenaventura
description: Guía turística de Buenaventura impresa como un cartel serigrafiado vivo del Pacífico.
colors:
  mar: "#0f2f57"
  mar-hondo: "#0a2140"
  ola: "#2a6fa8"
  sol: "#f2b51d"
  achiote: "#bf3519"
  manglar: "#14663f"
  papel: "#f4ecdc"
  tinta-suave: "#4a6384"
  papel-suave: "#c9c3b4"
typography:
  display:
    fontFamily: "Anybody, 'Arial Narrow', sans-serif"
    fontSize: "clamp(4.5rem, 15.5vw, 15rem)"
    fontWeight: 900
    lineHeight: 0.8
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 52"
  headline:
    fontFamily: "Anybody, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Anybody, 'Arial Narrow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 900
    lineHeight: 0.95
    fontVariation: "'wdth' 62"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 750
    letterSpacing: "0.12em"
rounded:
  pill: "999px"
  card: "14px"
  sheet: "20px"
  field: "12px"
spacing:
  gutter: "clamp(16px, 3.2vw, 44px)"
  section: "clamp(72px, 10vw, 140px)"
  container: "1320px"
components:
  button-achiote:
    backgroundColor: "{colors.achiote}"
    textColor: "{colors.papel}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  button-sol:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.mar}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  chip:
    textColor: "{colors.mar}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "42px"
  chip-activo:
    backgroundColor: "{colors.sol}"
    textColor: "{colors.mar}"
    rounded: "{rounded.pill}"
  afiche:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.mar}"
    rounded: "{rounded.card}"
  celda-programa-activa:
    backgroundColor: "{colors.achiote}"
    textColor: "{colors.papel}"
    height: "64px"
---

# Design System: Tu Guía Inteligente · Buenaventura

## Overview

**Creative North Star: "Cartel del Pacífico"**

The page is a silkscreened festival poster that happens to work: Buenaventura billed like a music festival of the Pacific, with the humpback whale as the headliner. Every section is a full field of one flat ink (deep sea blue, sun yellow, achiote red, mangrove green or raw paper), and type is set the way a poster printer sets a bill: compressed, heavy, uppercase, stacked tight.

Depth comes from print, not from screens: a half-tone dot screen, a slight second-ink misregistration under the headline that snaps into register on hover, photographs reprinted as two-ink duotones, a turbante-pattern border strip between bands, and rubber stamps that mark whatever the visitor saves. The 3D whale is shaded in three posterized inks with a half-tone screen so it reads as printed, not rendered.

Density alternates like a well-paced program: a loud poster opening, a dense yellow strip of live sea data, a quiet paper catalog of places, a dark band of draggable route posters, a red directory, a green planner, and a closing bill.

**Key Characteristics:**
- Flat ink fields own whole sections; no gradients on surfaces.
- Anybody at narrow widths (52–80 %) for every display voice; Figtree for reading.
- Print devices with a job: half-tone for shading, duotone for photos, stamps for saved state, a border strip between bands.
- Floating panels ("volantes") are paper handbills that can be dragged and tilt with velocity.

## Colors

A committed five-ink palette, each ink used as a full field somewhere on the page.

### Primary
- **Mar del Pacífico** (mar): the page ground, the program band, the hero field, the closing bill and every ink line drawn on paper.
- **Sol de Bahía** (sol): the sun disc, the live-data strip, active chips, the planner poster and primary actions on dark fields.

### Secondary
- **Achiote** (achiote): the active program cell, the main call to action, stamps and the misregistration plate. Darkened so paper-colored text passes AA (4.78:1).
- **Manglar** (manglar): the planner field and the hero planner cell; duotone shadow for nature photos.

### Tertiary
- **Ola** (ola): the back wave, the second plate under VENTURA and the mid tone of the half-tone whale.
- **Mar Hondo** (mar-hondo): the front wave, scrollbar track and deepest whale shadow.

### Neutral
- **Papel crudo** (papel): paper fields, card stock, text on dark inks.
- **Tinta suave** (tinta-suave): secondary text on paper (5.24:1).
- **Papel suave** (papel-suave): secondary text on sea blue (7.64:1).

### Named Rules
**The Full Field Rule.** An ink is either a whole section ground or a functional mark (chip, button, stamp, line). Never a scattered accent on a neutral page.

**The Tinted Secondary Rule.** Secondary text is tinted from its own field (`tinta-suave` on paper, `papel-suave` on sea, translucent sea on sun), never a neutral gray.

## Typography

**Display Font:** Anybody (variable width 50–150, with Arial Narrow fallback)
**Body Font:** Figtree (with system-ui fallback)

**Character:** A poster face squeezed to half width and set at full weight, against a friendly, open sans for everything people actually read.

### Hierarchy
- **Display** (900, clamp(4.5rem, 15.5vw, 15rem), 0.8, width 52 %): the two-line BUENA / VENTURA bill and the closing line only.
- **Headline** (850, clamp(2.5rem, 6vw, 5.5rem), 0.92, width 62 %, uppercase): section titles, max 16ch.
- **Title** (900, 1.5–3.5rem, 0.95, width 56–72 %, uppercase): card names, route names, directory names, day titles.
- **Body** (400–500, 1rem–1.3rem, 1.45–1.6): descriptions and intros, 58–62ch.
- **Label** (750, 0.75rem, tracking 0.12em, uppercase): data labels sitting over values (Zona, Época, Oleaje).

### Named Rules
**The Numbers in Ink Rule.** Live values (temperature, waves, sunset, times) are set in the display face with tabular figures; their labels stay small in Figtree.

**The No Kicker Rule.** No small label above a heading. Context lines go under the title (place type and zone, route days, plan dates).

## Layout

Single scrolling page of full-bleed ink bands. Content sits in a 1320px container with a fluid gutter (16–44px) and a fluid section rhythm (72–140px top and bottom). Grids are asymmetric: two-column headers (title left, intro right), a dense auto-fill poster grid where every fifth card spans two columns and two rows, list rows instead of card grids for lodging, food and businesses, and a sticky form beside the planner poster on desktop.

Breakpoints observed: 1180px (hero data band wraps the planner cell), 1080px (program cells collapse to a menu), 900px (two-column layouts stack), 760px (hero switches to its tall phone composition), 620px (floating panels become bottom sheets).

## Elevation & Depth

Mostly flat print. Depth is conveyed by layering inks, the 3D whale between the two headline lines (BUENA behind, VENTURA in front), half-tone screens and a few soft, offset shadows under objects that physically lift off the page: cards, route posters, the planner poster, floating panels and sheets.

### Shadow Vocabulary
- **Card lift** (`0 0 0 2px mar, 0 18px 30px -22px rgba(10,33,64,.55)`): poster cards at rest; deeper on hover.
- **Handbill** (`0 0 0 2px mar, 0 30px 60px -24px rgba(10,33,64,.75)`): draggable panels.
- **Sheet** (`-24px 0 60px -30px rgba(10,33,64,.8)`): the place detail drawer.

### Named Rules
**The Misregistration Rule.** The only offset second color is a print plate under display type (0.016em), and it registers to zero on hover. It is never a box shadow.

## Shapes

Pills for every control (chips, buttons, tags, the program's action buttons). Cards and posters use a 14px radius; sheets 20px on phones; fields 12px. Ink lines are 2px for row dividers and 3–4px for section rules that open a block. The turbante border strip (triangles and diamonds in all five inks) separates major bands.

## Components

### Buttons
- **Shape:** full pill (999px), min height 48px, Anybody 800 at 82 % width, uppercase.
- **Primary:** achiote with paper text on light and green fields; sun with sea text on dark fields.
- **Hover / Focus / Press:** darker ink on hover (pointer devices only), 3px sun focus ring (achiote on paper and sun fields), scale(0.97) on press in 160ms.
- **Outline:** inset 2px currentColor ring, tinted 12 % on hover.

### Chips
- **Style:** inset 2px ring in the field's line color, Figtree 650.
- **State:** pressed chips flood with the field's active ink (sun on dark, sea on paper); aria-pressed drives the style.

### Cards / Containers
- **Afiche (place poster):** paper stock, 14px radius, 2px sea outline plus card lift. Photo printed in two inks by category (sea/sun for beaches, mangrove/paper for nature, achiote/sun for culture, sea/paper for town) with a half-tone overlay; on hover the true-color photo wipes up from the bottom while the card tilts up to 6° toward the pointer. Every card carries the same data band: zone, best season, cost.
- **Route poster:** a full ink field per route, cyanotype photo, numbered stop line; lives in a draggable horizontal strip.

### Inputs / Fields
- **Style:** paper fill, 12px radius, 2px inset line; focus switches the line to sea.

### Navigation
- **Program band:** sticky 64px sea band with a 3px sun rule; section cells divided by sun hairlines; the cell for the section in view floods achiote. Below 1080px the cells become a full-screen sun menu with display-size links.

### Volante (signature)
Floating paper handbill (chat guide, saved list): dragged by its sea header with momentum, tilting up to 7° with horizontal velocity; becomes a bottom sheet under 620px.

### Sello (signature)
A circular rubber stamp in achiote, multiplied over the card at -12°, reading GUARDADO · TU GUÍA. It presses in from 1.35× in 240ms and stays as long as the item is saved.

## Do's and Don'ts

### Do:
- **Do** give every new section one full ink field from the five-ink palette.
- **Do** set titles in Anybody at 52–72 % width, uppercase, with the context line underneath.
- **Do** reprint photographs as two-ink duotones with the half-tone overlay, and show the true color on hover or in detail views.
- **Do** mark saved or chosen things with the stamp, not a color swap alone.
- **Do** use the turbante strip only between major bands.

### Don't:
- **Don't** put a kicker or small label above a heading.
- **Don't** use gradients, glass or blur as decoration on surfaces.
- **Don't** use hard zero-blur box shadows; the only offset color is the registration plate under display type.
- **Don't** use gray for secondary text; tint it from the field.
- **Don't** use emoji or glyphs as icons; icons are Lucide at 2.2–2.6 stroke.
