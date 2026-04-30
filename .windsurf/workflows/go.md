---
description: Quick start workflow for development
---

# Quick Start

## Prerequisites

- Node.js 24.x LTS
- npm 10.x

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

## Common Tasks

```bash
npm run clock:new              # Create today's clock
npm run type-check && npm run lint && npm run build  # Pre-commit
npm run test                   # Watch mode
npm run test:run               # CI mode
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 5173 in use | `npm run dev -- --port 3000` |
| Type errors | `npm run type-check` |
| Build fails | `npm run clean && npm run build` |
| Font issues | `npm run audit:fonts` |

## Docs

- [AGENTS.md](../../AGENTS.md) - Standards and CLI
- [ARCHITECTURE.md](../../src/templates/ARCHITECTURE.md) - Clock patterns
- [README.md](../../README.md) - Full reference
