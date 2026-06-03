---
description: Quick start workflow for development
---

# Quick Start

> **Canonical guide:** [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md)

## Prerequisites

- Node.js 24.x LTS
- npm 10.x

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

## New clock

```bash
npm run clock:new              # scaffold only — does NOT edit clockpages.json
# Manually add { "path", "date", "title" } to src/context/clockpages.json
npm run finalize
```

## Pre-commit (matches CI)

```bash
npm run type-check && npm run lint && npm run test:run && npm run build
```

## Troubleshooting

| Issue            | Fix                              |
| ---------------- | -------------------------------- |
| Port 5173 in use | `npm run dev -- --port 3000`     |
| Type errors      | `npm run type-check`             |
| Build fails      | `npm run clean && npm run build` |
| Font issues      | `npm run audit:fonts`            |

## Docs

- [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md) — **SSOT** workflow, registry, CI
- [`src/templates/ARCHITECTURE.md`](../../src/templates/ARCHITECTURE.md) — Clock patterns
- [`README.md`](../../README.md) — Project overview
