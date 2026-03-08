# VIAH Frontend

VIAH – India's AI Learning Platform

A modern, professional e-learning platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🌐 **Bilingual Support**: English and Hindi (हिंदी)
- 🎨 **Brand Guidelines**: Follows VIAH brand colors and typography
- ⚡ **Turbopack**: Fast development with Next.js Turbopack
- 📱 **Responsive Design**: Mobile-first, fully responsive
- 🎭 **Modern UI**: Beautiful animations and transitions
- 🔤 **Typography**: Montserrat for headings, Inter for body text

## Brand Colors

- Primary: `#3496E2`
- Primary Dark: `#164780`
- Primary Light: `#98D8F3`

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── [locale]/          # Locale-specific routes
│   │   ├── layout.tsx     # Locale layout with i18n provider
│   │   └── page.tsx       # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Root redirect
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Features section
│   ├── Navigation.tsx    # Navigation bar
│   └── Footer.tsx        # Footer
├── messages/             # Translation files
│   ├── en.json          # English translations
│   └── hi.json          # Hindi translations
└── i18n.ts              # i18n configuration
```

## Languages

- English (`/en`)
- Hindi (`/hi`)

Default locale is English. The middleware automatically handles locale routing.

## License

© 2024 VIAH. All rights reserved.
