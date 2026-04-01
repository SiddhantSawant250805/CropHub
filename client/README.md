# CropHub Client (Frontend)

The frontend of CropHub is a modern, responsive React application built with TypeScript and Vite. It serves as the primary interface for users to interact with the soil analysis tools, crop planning dashboards, and market data.

## ✨ Features

- **Emerald Ledger Aesthetic**: A premium, dark-themed design system optimized for modern displays.
- **Interactive Dashboards**: Real-time visualization of soil health and crop allocations.
- **Responsive Layout**: Optimized for both desktop and mobile agricultural use.
- **Component-Driven**: Built with `shadcn-ui` and Tailwind CSS for maximum maintainability.

## 🛠️ Technologies

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0 or higher
- **npm** or **bun**

### Installation & Development

1.  **Navigate to the client directory**:
    ```sh
    cd client
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    # OR
    bun install
    ```

3.  **Start the development server**:
    ```sh
    npm run dev
    # OR
    bun run dev
    ```

The application will be available at `http://localhost:8080` (or the port specified by Vite).

## 🎨 Design System: Emerald Ledger

The UI follows the **Emerald Ledger** design logic, a custom specification optimized for low-light agricultural environments and industrial displays.

### 🧩 Tokens & Utilities
- **Atomic Surfaces**: High-spec dark charcoal (`#0a0f0d`) and forest layers.
- **Glassmorphism**: 1px white-alpha borders with variable backdrop blurs.
- **Typography Matrix**:
  - `font-black`: For high-impact headers.
  - `font-mono`: For real-time telemetry and profit margins.
  - `uppercase tracking-widest`: For secondary system labels.
- **Micro-Animations**: Extensive use of `framer-motion` for physics-based layout transitions.

---

## 📁 Detailed Project Structure

```text
client/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── components/
│   │   ├── ui/             # Atomic shadcn components
│   │   └── AppSidebar.tsx  # Global navigation component
│   ├── context/
│   │   └── AuthContext.tsx # Global authentication state logic
│   ├── hooks/              # Custom reactive patterns
│   └── pages/
│       ├── Landing.tsx     # 3D-driven entry point
│       ├── Dashboard.tsx   # Glassmorphic overview
│       ├── TerraLayer.tsx  # Soil Vision diagnostics
│       ├── FathomLayer.tsx # Financial optimization
│       └── Logistics.tsx   # Arbitrage & Synthesis
├── tailwind.config.js      # Custom theming and animations
└── vite.config.ts          # Build optimization & proxy logic
```

---

## 🛠️ Advanced Build & Optimization

- **Vite-Optimized Bundling**: To reduce load times on low-bandwidth rural connections, components are lazily loaded.
- **Tailwind JIT**: For lean CSS footprints.
- **Asset Ingestion**: All SVGs are optimized for inline delivery to minimize HTTP handshakes.

---

## 📄 License
MIT — Optimized for the Future of Farming.
