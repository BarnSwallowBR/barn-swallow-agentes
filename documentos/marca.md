---
titulo: 'Marca e posicionamento'
descricao: 'Bíblia da marca Barn Swallow: posicionamento, tom, paleta, tipografia e o que nunca dizer'
---
# CLAUDE.md

# Barn Swallow

> "We don't just build websites. We transform businesses through technology."

---

# Mission

Barn Swallow is a premium Digital Transformation company focused on helping businesses grow through Artificial Intelligence, Automation, Custom Software and Digital Presence.

Every solution should increase efficiency, reduce operational costs and improve the customer experience.

We are not a marketing agency.

We are not a web design agency.

We are a technology partner.

---

# Technical Stack

This Next.js install may differ from training data (breaking changes across versions).

Check `node_modules/next/dist/docs/` before writing Next.js-specific code. Heed deprecation notices.

Next.js (App Router).

React.

TypeScript.

Tailwind CSS.

Framer Motion for all animations.

Scroll reveal, stagger, layout transitions, hover and press states.

Deploy on Vercel.

Home is a single-page experience.

Dedicated service pages are allowed (e.g. `/consultoria` — CRM & Sales Consulting).

Header anchors use `/#section` so they work from any route.

---

# Language

Content in Portuguese (PT-BR).

Keep structure ready for a future EN toggle.

Not required now.

---

# Positioning

Whenever Barn Swallow is described, always use terms like:

- Digital Transformation
- Artificial Intelligence
- Business Automation
- Enterprise Technology
- Innovation
- Digital Strategy
- Business Intelligence

Never position Barn Swallow as:

❌ Marketing Agency

❌ Website Company

❌ Social Media Agency

❌ Design Studio

The perceived value must be similar to:

- Accenture
- Deloitte Digital
- IBM Consulting
- Stripe
- OpenAI
- Vercel

---

# Target Audience

Businesses that want to modernize.

Examples:

- Healthcare
- Restaurants
- Law Firms
- Real Estate
- Manufacturing
- Retail
- Service Companies
- Logistics
- Construction
- Finance

Decision makers:

- CEOs
- Business Owners
- Directors
- Managers

The website is made for executives.

Not consumers.

---

# Website Goal

The visitor should immediately understand:

• What Barn Swallow does.

• Why technology matters.

• How we solve problems.

• Why we are different.

• How to contact us.

The website should feel like a premium SaaS company.

---

# Brand Personality

Modern

Professional

Premium

Elegant

Minimal

Innovative

Confident

Technological

Never flashy.

Never childish.

Never noisy.

---

# Visual References

Apple

Stripe

Linear

Vercel

OpenAI

Anthropic

Raycast

Framer

Arc Browser

Dropbox Design

The feeling should be:

"This company looks like it builds the future."

---

# Visual Style

Lots of whitespace.

Large typography.

Minimal interface.

Smooth animations.

Soft gradients.

Rounded corners.

Glass effects only when appropriate.

Light theme by default (warm off-white) on every section, footer
included. A dark theme is
available through the header toggle (`data-theme="dark"` on `<html>`,
saved in localStorage under `tema`). Use tokens (`bg-background`,
`text-foreground`, …) and `dark:` — never hardcode a theme's colors.

Subtle lighting.

Beautiful shadows.

Perfect spacing.

Everything should breathe.

---

# Color Palette

Tokens live in `src/app/globals.css`. Light is the default; dark is the
alternative theme. `.tema-escuro` forces dark on one block if ever needed.

| Token | Light (default) | Dark |
|---|---|---|
| Primary Background | #F6F4EF | #09090B |
| Secondary Background | #EFECE5 | #111113 |
| Cards | #FFFFFF | #18181B |
| Primary Text | #0B0B0C | #FAFAFA |
| Secondary Text | #57575F | #A1A1AA |
| Borders | rgba(11,11,12,.12) | rgba(255,255,255,.08) |
| Primary Color | #2563EB | #2563EB |
| Hover | #1D4ED8 | #3B82F6 |
| Accent | #1D4ED8 | #60A5FA |

Never use many colors.

---

# Typography

Preferred fonts:

Geist

Inter

Manrope

Plus Jakarta Sans

No serif fonts.

Use strong typography hierarchy.

Large headlines.

Readable body text.

---

# Writing Style

Professional.

Short sentences.

Clear.

Direct.

Avoid marketing clichés.

Avoid exaggerated claims.

Focus on business value.

Examples:

✔ Increase productivity.

✔ Reduce operational costs.

✔ Automate repetitive work.

✔ Transform your digital presence.

Never:

"We are the best."

"We are number one."

---

# Main Services

The site is organized in **four pillars** — the single grouping used by the
menu, footer, /servicos and the home (source of truth: `src/lib/pilares.ts`).
Never introduce another grouping ("six cards", "five fronts", one section per
demo): that was the main cause of the site feeling overloaded.

| Pillar | Services (existing pages) |
|---|---|
| Atender | Inteligência Artificial |
| Vender | Automação de Vendas · CRM & Consultoria de Vendas |
| Operar | Automação Financeira · Desenvolvimento Sob Medida |
| Ser encontrado | Presença Digital (`/servicos/marketing-digital`, slug kept for SEO) |

Never label the service "Marketing Digital" — it contradicts the positioning.
The categories below describe what each area covers.

## Digital Presence

Institutional Websites

Landing Pages

SEO

Brand Positioning

Google Business

Social Media Presence

---

## Artificial Intelligence

AI Agents

Chatbots

WhatsApp AI

Customer Support AI

Sales AI

Internal AI

Knowledge Base AI

---

## Business Automation

n8n

CRM

Workflow Automation

Email Automation

WhatsApp Automation

Scheduling

Internal Processes

Integrations

---

## Custom Development

Web Applications

Dashboards

Admin Panels

Internal Systems

API Integrations

Cloud Solutions

---

## Digital Strategy

Technology Consulting

Digital Audit

Competitor Analysis

Growth Strategy

Transformation Roadmap

---

# Content Strategy

No real content yet.

Testimonials, case studies, statistics and logo are placeholders.

Use realistic placeholders for the Brazilian market.

Mark placeholders clearly in code.

Make them easy to find and replace later.

---

# Home Structure

One story, told once (about 10 blocks — don't add sections, improve them):

Hero

Problem

O que fazemos — the four pillars, one sentence each, no bullet lists

Veja funcionando — ONE section with a tab per pillar (reuses the demo visuals) + CTA

Como funciona — four steps side by side (no sticky scroll)

Resultado real — the featured case with its numbers + CTA

Por que a Barn Swallow — differentiators, facts and the technologies line merged

Pricing + FAQ

Contact

Footer

---

# Service Page Structure

`/servicos/[slug]`, `/consultoria` and `/agencia-de-ia-em-campinas` share the
same blocks (`src/components/sections/service/`). Six blocks, ~4.400–4.900 px
on desktop — was 8 blocks and ~7.400 px. Don't add sections; improve these:

1. Hero — with the pillar badge ("Pilar: Vender", `SeloPilar`, resolved by
   `pilarDaPagina()` in `pilares.ts`, links to `/servicos#<pilar>`)
2. Problema → o que fazemos — `ServiceProblemScope`, the two lists side by side
3. Demo — the page's own visual (`demoRegistry.ts`)
4. Como funciona — `ServiceProcess`: steps side by side (no vertical timeline,
   no sticky scroll) + the "Para quem é" band with the mid-page contact button
5. FAQ — `FaqAccordion layout="split"`, 5 questions, all answers in the HTML and
   in the FAQPage JSON-LD (keep the two identical)
6. Contact — `<Contact compacto />`

`/consultoria` keeps its own hero and `CRMPipelineDemo`; its content lives in
`src/lib/consultoria.ts`. The Campinas landing has no demo (5 blocks): "O que
entregamos" is grouped by the four pillars, and the old "Como implantamos" and
"Onde atendemos" were merged into the steps (`src/lib/landingLocal.ts`) — the
city list stays in the text, it carries the local SEO signal.

---

# Hero Section

Large bold headline.

Technology illustration.

Primary CTA.

Secondary CTA.

Animated dashboard.

Never use stock photos.

Never use smiling business people.

---

# Hero Animation

Create a futuristic control center.

Rotate automatically between:

AI Dashboard

Automation Flow

Analytics

CRM

Live Notifications

Charts

Every 5 seconds transition smoothly.

---

# Interactive Demonstrations

Every important section must demonstrate visually how the service works.

Do not rely only on text.

Animations should explain the product.

---

# AI Section

Display a realistic smartphone.

A WhatsApp conversation happens.

Client sends:

"Hello, I'd like a quote."

↓

AI understands.

↓

Reads company knowledge.

↓

Generates response.

↓

Schedules meeting.

↓

Updates CRM.

↓

Client receives confirmation.

Everything animated.

Typing indicators.

Thinking animation.

Message delivery.

Read receipts.

Smooth transitions.

---

# Automation Section

Inspired by n8n.

Show nodes connected together.

Example:

WhatsApp

↓

AI

↓

CRM

↓

Calendar

↓

Email

↓

ERP

Data should travel through animated lines.

Nodes glow while processing.

Completed nodes become green.

Connections pulse.

---

# Digital Presence

Show transformation.

Before:

Old Website

No SEO

Inactive Instagram

No Google Reviews

↓

Transformation

↓

After:

Modern Website

Optimized SEO

Professional Branding

Google Business

Lead Generation

Animate the transition.

---

# Development Section

Show software being built.

Frontend

↓

Backend

↓

Database

↓

API

↓

Deployment

↓

Application Online

Each step animates.

---

# Dashboard Section

Animated analytics.

Lead counter increasing.

Conversion chart growing.

Revenue chart moving.

Tasks completed.

Automation savings.

Everything updates live.

---

# Business Flow Animation

One of the most important animations.

Customer contacts company through:

Instagram

WhatsApp

Website

Facebook

Email

↓

Everything converges into:

Barn Swallow AI

↓

Automation Engine

↓

CRM

↓

Sales

↓

Finance

↓

Support

↓

Customer receives response.

This should feel like the digital brain of the company.

---

# Technology Stack Section

Display technologies with subtle animations.

OpenAI

Claude

Python

React

Next.js

TypeScript

Node.js

Docker

Cloudflare

Supabase

PostgreSQL

n8n

Google Cloud

Vercel

Icons should react on hover.

---

# Process Section

Interactive timeline.

Scroll controls progression.

Step 1

Discovery

↓

Step 2

Strategy

↓

Step 3

Implementation

↓

Step 4

Optimization

Current step highlighted.

---

# Statistics

Animated CountUp.

Projects

Clients

Automations

Hours Saved

Response Time

Only animate once.

---

# Contact / Lead Capture

Form fields (`src/components/sections/Contact.tsx`):

Name — required

Phone — required

Email — optional

Company — optional

Message — optional

Only name and phone are required: demanding the rest drove away contacts who
would have reached out on WhatsApp anyway. Validation rules live in
`src/lib/contato.ts` and are shared by the client component and the API route —
change them there, never in one side only.

Submit posts to `POST /api/contato`, which verifies Cloudflare Turnstile plus a
honeypot and an in-memory per-IP rate limit, then hands the lead to the n8n
webhook (`N8N_WEBHOOK_URL`). n8n orchestrates the welcome email, the WhatsApp
confirmation to the visitor, the WhatsApp alert to the partners, and the lead
creation in the CRM — see `N8N/site-contato.json` at the repo root.

If n8n is unreachable the route falls back to posting straight to the CRM
(`CRM_API_URL` + `CRM_API_SECRET` → `POST /api/automacoes/leads`), so an n8n
outage never costs a lead. Env keys are documented in `.env.example`;
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` is a **build arg**, not just a runtime var.

Success state shows "Obrigado, {first name}! A nossa equipe estará entrando em
contato." On failure the form stays mounted with the data intact.

---

# Cursor

Premium cursor effects.

Magnetic buttons.

Soft glow.

Hover expansion.

Smooth interpolation.

Never distracting.

---

# Hover Effects

Cards lift slightly.

Borders glow softly.

Icons animate.

Background subtly changes.

Everything feels responsive.

---

# Scroll Animations

Fade

Blur

Translate

Scale

Parallax

Mask Reveal

Stagger Animations

Animations should feel natural.

Never too fast.

Never too slow.

---

# Background Effects

Very subtle moving particles.

Animated gradients.

Grid overlays.

Light reflections.

Minimal.

No visual noise.

---

# Glass Effects

Use only where appropriate.

Low opacity.

Soft blur.

Thin borders.

Never overuse glassmorphism.

---

# Components

Every component should feel premium.

Large spacing.

Rounded corners.

Consistent shadows.

Responsive.

Accessible.

Reusable.

---

# Performance

Prioritize:

SEO

Accessibility

Core Web Vitals

Lazy Loading

Image Optimization

Code Splitting

Server Components when possible.

Avoid unnecessary JavaScript.

---

# SEO & Meta

Implemented — `src/lib/seo.ts` is the single source of truth for the canonical
URL and every JSON-LD builder. Don't hardcode `https://barnswallow.com.br`
anywhere else; import `SITE_URL` / `absoluteUrl()`.

`src/app/robots.ts` — allows `*` plus AI crawlers by name (GPTBot, ClaudeBot,
PerplexityBot, OAI-SearchBot…), which is how most of them discover the site.

`src/app/sitemap.ts` — built from `getAllServiceSlugs()`. A new route must be
added here; it will not appear on its own.

`src/app/opengraph-image.tsx` — OG image via `next/og`, inherited by all routes.

`public/llms.txt` — plain-Markdown summary for AI agents.

JSON-LD via `src/components/seo/JsonLd.tsx`: Organization + WebSite in the root
layout, Service + FAQPage + BreadcrumbList per service page, FAQPage on
`/consultoria`, ItemList on `/servicos`.

`metadataBase` + `alternates.canonical` are set on every page. `www` redirects
to the apex with a 301 in the Traefik labels (`docker-compose.yml`) — both
hosts used to serve 200 and duplicate every URL.

Two rendering traps worth keeping in mind, both already fixed:

- The FAQ uses native `<details>`/`<summary>` (`src/components/ui/FaqAccordion.tsx`)
  so every answer is in the server-rendered HTML. The previous accordion only
  mounted the open item, hiding 4 of 5 answers per page from crawlers.
- `RevealOnScroll` serializes `opacity:0` inline, including on every `<h2>`.
  A `<noscript>` style block in the root layout reveals it when JS is off.

Blog SEO (23/09/2026, plano `plano-seo-blog-barn-swallow`):

- `/blog/tag/*` is `noindex,follow` and stays **out** of the sitemap — thin
  pages that repeat cards and drained crawl budget from the posts.
- A post whose slug changes after publishing needs an entry in `SLUGS_ANTIGOS`
  (`next.config.ts`, 301). Changing the slug in the CRM alone breaks every link
  already out there.
- Posts are authored by a `Person` (the CRM user), with a page at
  `/blog/autor/[slug]` sharing the same `@id` (`personLd` in `seo.ts`).
  The Organization carries the CNPJ (`identifier`/`taxID`, from `local.ts`).
- IndexNow (`src/lib/indexnow.ts`, key file in `public/`): saving a live post in
  the editor notifies Bing/Yandex (→ DuckDuckGo, Ecosia) via `after()`.
  `scripts/indexnow-sitemap.mjs` resubmits the whole sitemap. Google ignores
  IndexNow; Brave Search has its own crawler and accepts no submissions.

Still pending (outside the code): Search Console and Bing Webmaster codes
(`NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION` in `.env`,
read at build), an official LinkedIn company URL for `PERFIS_SOCIAIS`.

---

# Accessibility

Keyboard navigation.

ARIA labels.

High contrast.

Screen reader support.

Visible focus states.

Respect reduced motion preferences.

---

# Images

Never use cliché business stock photos.

Prefer:

Dashboards

Technology

Abstract 3D

Data Visualization

Workflows

Interfaces

Automation

Servers

AI

Enterprise Software

---

# Motion Design Philosophy

Animations are not decoration.

Animations explain.

Animations educate.

Animations increase perceived value.

Animations make technology understandable.

Every animation should answer:

"What problem does this solve?"

---

# Inspiration

Apple

Stripe

Linear

OpenAI

Anthropic

Arc Browser

Raycast

Framer

Vercel

Dropbox

Nothing should look generic.

Nothing should resemble a WordPress template.

---

# Final Goal

## Blog

Artigos moram no Postgres do CRM e são escritos em `/editor` (login e IA do
CRM). Publicar é salvar — não há build nem commit no meio. O corpo é HTML já
saneado no servidor do CRM: `PostBody` injeta o campo direto, então nunca passe
por ele HTML de outra origem. A leitura pública usa ISR sobre
`src/lib/blog/api.ts`; a invalidação é `revalidateTag("blog", { expire: 0 })`
nas rotas de escrita. O build recebe as credenciais por BuildKit secret apenas
durante a primeira renderização; elas nunca entram na imagem nem no bundle.

The visitor should think:

"This company is capable of modernizing my entire business."

The website must communicate trust before selling.

The perceived value should be significantly higher than the cost of the services.

Every design decision must reinforce:

Technology.

Sophistication.

Innovation.

Efficiency.

Trust.

Premium quality.
