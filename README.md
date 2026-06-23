# Universitas Andalas Library Dashboard

A fullscreen information dashboard for the Universitas Andalas Library. This project is built as a frontend-only application designed for landscape displays, such as lobby monitors, laptops, or library information screens.

## Overview

The application displays an overview of library services, including today's visitor count, room facilities, upcoming events, visitor statistics, book circulation data, active borrowers, and collection summaries.

All information is sourced from locally prepared data for UI presentation purposes. The application does not connect to any API or backend service.

## Features

* Fullscreen public dashboard with a clean neobrutalist design.
* Landscape-only guard that displays a `Landscape screen only` message on portrait screens.
* Local data for quotes, weather, visitor counters, facilities, events, charts, leaderboards, and collection statistics.
* Localization support for four languages: Indonesian, English, Mandarin, and Arabic.
* Facility and event images sourced from Unsplash.
* Local administration interface for browser-side content management.
* Ready for deployment to GitHub Pages without a custom domain.

## Tech Stack

* Vite
* React
* TypeScript
* Tailwind CSS
* Recharts
* Motion
* Lucide React
* pnpm

## Important Project Structure

* `src/data/demoData.ts`: Local data source for the dashboard.
* `src/i18n/locales.ts`: Translation dictionaries for all four supported languages.
* `src/i18n/LocaleContext.tsx`: Localization provider and the `t(...)` translation helper.
* `src/components/VisitorChart.tsx`: Main visitor chart and collection statistics component.
* `src/components/Header.tsx`: Header containing service status, weather, time, and the language switcher.
* `.github/workflows/deploy-pages.yml`: GitHub Pages deployment workflow.
* `AGENT_CONTEXT_PROMPT.md`: Handoff context for the next development agent.

## Running the Project Locally

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build the application for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Deploying to GitHub Pages

The GitHub Pages deployment workflow is available in `.github/workflows/deploy-pages.yml`.

Deployment runs automatically whenever changes are pushed to the `main` branch. It can also be triggered manually from the **Actions** tab using `workflow_dispatch`.

The Vite configuration automatically determines the appropriate base path from `GITHUB_REPOSITORY` when the `GITHUB_PAGES=true` environment variable is enabled. This ensures that all assets remain accessible when the application is deployed using a repository-based GitHub Pages URL.

## Development Notes

* Do not add API calls, backend proxies, Server-Sent Events, WebSockets, or API-related environment variables unless explicitly instructed.
* Public dashboard content should be added or updated through `src/data/demoData.ts` and `src/i18n/locales.ts`.
* Use `useLocale().t(...)` for all public dashboard text to maintain support for all four languages.
* The public dashboard is designed specifically for landscape displays. Portrait mobile screens are intentionally blocked.
