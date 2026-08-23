---
name: Cron Expression Helper Plate
description: A print plate for composing and reading five-field cron marks.
colors:
  stock: "#f5f4f0"
  ink: "#17191b"
  muted: "#737474"
  line: "#c9c7c1"
  seal: "#dcdcf0"
  orange: "#d47739"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(62px, 11vw, 150px)"
    fontWeight: 400
    lineHeight: 0.82
  body:
    fontFamily: "Georgia, serif"
    fontSize: "17px"
    lineHeight: 1.45
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.17em"
rounded:
  none: "0"
spacing:
  plate: "26px 48px 20px"
  row: "16px 0"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
---

# Design System: Cron Expression Helper Plate

## Overview

**Creative North Star: "A design annual's notation plate."**

Cron is treated as something printed, registered, and inspected. The expression sits in a framed plate; its five fields are captioned underneath, presets form a horizontal proof strip, and the plain-English interpretation reads like a large editorial impression.

**Key Characteristics:**
- Near-white uncoated stock and black ink.
- Orange proofing accent with a single periwinkle seal.
- Registration marks and thin rules make the utility feel deliberate.

## Colors

The palette is mostly paper and ink. Orange is reserved for proof marks and action; periwinkle appears as the selected plate and round seal.

### Primary
- **Proof orange** (#d47739): title emphasis, validation details, and active time label.

### Secondary
- **Plate periwinkle** (#dcdcf0): selected preset and utility stamp.

### Neutral
- **Uncoated stock** (#f5f4f0): page and plate ground.
- **Print ink** (#17191b): type and primary controls.
- **Registration line** (#c9c7c1): dividers and field structure.

## Typography

**Display Font:** Arial, Helvetica, sans-serif
**Body Font:** Georgia, serif
**Label/Mono Font:** ui-monospace, monospace

**Character:** An oversized grotesk headline contrasts with a literary explanation and tabular expression marks.

### Hierarchy
- **Display** (400, clamp 62–150px, .82): opening thesis.
- **Headline** (400, clamp 36–72px, .92): interpretation.
- **Body** (400, 14–17px, 1.45–1.55): explanatory copy.
- **Label** (700, 10px, .17em, uppercase): field captions and plate metadata.

## Layout

The 1180px shell opens with a tall three-column plate header. The expression plate is a framed focus area. Results split into interpretation and next-run columns, collapsing to one column below 720px. Presets stay as a scrollable strip on narrow screens.

## Elevation & Depth

Depth is entirely structural: borders, registration crosses, and a paper-on-paper plate. No shadow vocabulary is used.

## Shapes

Square controls and hairline borders are the rule. The only rounded object is the periwinkle circular stamp, deliberately treated as a physical mark rather than a component container.

## Components

### Buttons
- **Shape:** square (`0` radius).
- **Primary:** black ink with stock text; orange hover.
- **Hover / Focus:** orange surface on hover; orange focus outline.

### Inputs / Fields
- **Style:** large monospaced expression with a black baseline; field legend below.
- **Focus:** baseline shifts to the orange proof color.

### Signature Component
- **Expression plate:** framed input, five caption cells, validity note, and small corner registration crosses.

## Do's and Don'ts

### Do:
- **Do** keep the five-field grammar visible under the expression.
- **Do** distinguish an estimate from a production cron engine in the copy.
- **Do** let presets read as printed samples.

### Don't:
- **Don't** replace the plate with a standard rounded card dashboard.
- **Don't** use a rainbow of status colors; orange and periwinkle are enough.
- **Don't** canonize the generic Arial fallback as an intentional brand face; preserve the typographic scale, not the dependency.
