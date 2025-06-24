# Tychem LLC - Main Website

A modern, responsive website for Tychem LLC, a surplus chemical broker company.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all device sizes
- **Product Catalog**: Browse available surplus chemicals
- **Contact Forms**: Multiple contact options with email integration
- **SEO Optimized**: Structured data and meta tags for better search visibility

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **UI Components**: Radix UI with shadcn/ui
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **Email**: EmailJS integration with FormSubmit fallback
- **Build Tool**: Vite

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tychem-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Email Service**
   - Copy `.env.example` to `.env`
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create an email service and template
   - Add your credentials to `.env`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Email Configuration

The website uses EmailJS for form submissions with FormSubmit as a fallback. To set up EmailJS:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{company}}` - Company name
   - `{{phone}}` - Phone number
   - `{{message}}` - Message content
   - `{{form_type}}` - Form type (contact/offer)
   - `{{product_name}}` - Product name (for offers)
   - `{{product_cas}}` - Product CAS number (for offers)
   - `{{offer_price}}` - Offer price (for offers)

4. Copy your Service ID, Template ID, and Public Key to `.env`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── data/               # Static data and types
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
└── index.css           # Global styles
```

## Key Components

- **Hero**: Landing section with animated globe
- **About**: Company information with video
- **Features**: Service highlights
- **ChemicalList**: Product showcase
- **ContactSection**: Contact form
- **Products**: Full product catalog page
- **ProductDetail**: Individual product pages

## Deployment

The site is optimized for deployment on modern hosting platforms like Netlify, Vercel, or similar services that support static site generation.

## License

© 2025 TYCHEM LLC. All rights reserved.