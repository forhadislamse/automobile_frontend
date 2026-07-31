<div align="center">
  <img src="https://automobile-frontend-six.vercel.app/r_logo.png" alt="SmartAutoTech Logo" width="120" />

  <br/>
  <br/>

  # SmartAutoTech - Frontend Interface

  **An AI-Powered Diagnostic & Shop Management Platform**

  <p>
    <a href="https://automobile-frontend-six.vercel.app" target="_blank">View Live Website</a>
    ·
    <a href="https://automobile-server-orcin.vercel.app" target="_blank">API Base URL</a>
    .
    <a href="https://documenter.getpostman.com/view/34968572/2sBY4TpHwc" target="_blank">Postman Documentation</a>
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)
  ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux)
</div>

<br />

> **Welcome to the SmartAutoTech frontend repository!** This project serves as the digital front door for auto shop owners, technicians, and administrators. It focuses on providing a clean, efficient, and AI-driven environment for managing shop workflows, diagnostics, and subscriptions.

---

## Interface & User Experience

The application is heavily optimized for a fluid and highly interactive user experience without compromising performance:

- **Framer Motion Integration:** Staggered fade-ins, floating hero elements, and scroll-reveals that make the UI feel alive.
- **Modern Tailwind CSS Architecture:** Clean glassmorphism, soft shadows, sleek dark mode transitions, and tailored custom color palettes.
- **Radix UI & Accessible Components:** Built with headless UI primitives ensuring high accessibility and pristine custom styling (shadcn/ui).
- **Next.js 16 App Router:** Lightning-fast page transitions, Server-Side Rendering (SSR), and advanced caching for a seamless web experience.

## Technology Stack

| Category | Technologies Used |
|----------|------------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling & UI** | Tailwind CSS, Radix UI, Lucide React, shadcn/ui |
| **Animations** | Framer Motion |
| **State Management** | Redux Toolkit (RTK), RTK Query |
| **Forms & Validation** | React Hook Form, Zod |
| **Authentication** | NextAuth.js / Custom JWT Auth |
| **Payments** | Stripe Checkout Integration (`@stripe/react-stripe-js`) |

## Getting Started

### 1. Clone & Install
Ensure you have **Node.js (v18+)** installed.

```bash
git clone https://github.com/forhadislamse/automobile_frontend.git
cd automobile_frontend

# Install dependencies using npm
npm install
```

### 2. Environment Variables
You will need to set up the environment variables to connect to the backend and Stripe.

1. Locate the `.env.example` file in the root directory.
2. Create a new file named `.env` (or `.env.local`) and copy the contents over.
3. Fill in the required keys (e.g., `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

```
├── public/                # Static assets (images, logos, SVGs)
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts, API Routes)
│   ├── redux/             # Redux store, RTK Query API slices, and hooks
│   └── components/        # Shared components, UI primitives (shadcn)
├── components/            # Reusable UI modules (Auth, Payment, etc.)
├── .env.example           # Example environment variables
└── package.json           # Dependencies and scripts
```

## Key Features

- **Role-Based Dashboards:** Dedicated and secure portals for Admins, Shop Owners, and Technicians.
- **Shop Onboarding & Management:** Intuitive setup flows for new shops to easily select plans and integrate their operations.
- **Seamless Checkout:** Stripe-powered subscription plans integrated directly into the UI with secure intent-based checkout and trial support.
- **Secure Authentication:** Protected routes allowing users to verify email (OTP), update profiles, change passwords, and manage subscriptions safely.
- **Fully Responsive:** Carefully crafted mobile and tablet experiences ensuring workflow consistency on shop floors and desktops alike.

---

<p align="center">
  <i>Designed and built for excellence.</i>
</p>
