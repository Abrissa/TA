# Graph Report - TA  (2026-08-05)

## Corpus Check
- 44 files · ~38,948 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 235 nodes · 314 edges · 24 communities (15 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a18f7363`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- mockData.ts
- What You Must Do When Invoked
- Article
- devDependencies
- dependencies
- compilerOptions
- HomeView.tsx
- package.json
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- Anti-Slop Principles & Guidelines
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- Run and deploy your AI Studio app
- Badge.tsx
- Button.tsx
- Heading.tsx
- env.ts
- AGENTS.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `Article` - 17 edges
2. `PageTab` - 16 edges
3. `compilerOptions` - 15 edges
4. `What You Must Do When Invoked` - 12 edges
5. `/graphify` - 10 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `SCHOOL_INFO` - 7 edges
8. `scripts` - 6 edges
9. `ARTICLES_DATA` - 5 edges
10. `graphify reference: query, path, explain` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ArticleCardProps` --references--> `Article`  [EXTRACTED]
  src/components/cards/ArticleCard.tsx → src/types.ts
- `HeroSectionProps` --references--> `PageTab`  [EXTRACTED]
  src/components/sections/HeroSection.tsx → src/types.ts
- `AlumniViewProps` --references--> `PageTab`  [EXTRACTED]
  src/views/AlumniView.tsx → src/types.ts
- `NewsViewProps` --references--> `Article`  [EXTRACTED]
  src/views/NewsView.tsx → src/types.ts
- `FooterProps` --references--> `PageTab`  [EXTRACTED]
  src/components/Footer.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (24 total, 9 thin omitted)

### Community 0 - "mockData.ts"
Cohesion: 0.08
Nodes (28): App(), MainLayout(), ACHIEVEMENTS_DATA, ALUMNI_DATA, HISTORICAL_MILESTONES, TEACHERS_DATA, TESTIMONIALS_DATA, Achievement (+20 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 2 - "Article"
Cohesion: 0.16
Nodes (17): StackedArticleSlider(), StackedArticleSliderProps, Footer(), FooterProps, MainLayoutProps, ArticleDetailModal(), ArticleDetailModalProps, ContactModal() (+9 more)

### Community 3 - "devDependencies"
Cohesion: 0.09
Nodes (22): autoprefixer, esbuild, vite, devDependencies, autoprefixer, esbuild, tailwindcss, tsx (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.11
Nodes (19): dotenv, express, @google/genai, lucide-react, motion, dependencies, dotenv, express (+11 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 6 - "HomeView.tsx"
Cohesion: 0.14
Nodes (13): AgendaCard(), AgendaCardProps, AnnouncementCard(), AnnouncementCardProps, ArticleCard(), ArticleCardProps, HeroSection(), HeroSectionProps (+5 more)

### Community 7 - "package.json"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, clean, dev, lint, preview (+2 more)

### Community 8 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 9 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 10 - "Anti-Slop Principles & Guidelines"
Cohesion: 0.50
Nodes (3): 1. Writing & Language Rules, 2. Code & Engineering Standards, Anti-Slop Principles & Guidelines

### Community 11 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 12 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 13 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **103 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+98 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Article` connect `Article` to `mockData.ts`, `HomeView.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _103 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mockData.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08461538461538462 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._