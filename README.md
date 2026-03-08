# Mera Hisab — Financial Tracker PWA

A modern, mobile-first, completely offline Progressive Web App for tracking your daily personal income and expenses.

## ✨ Features

- **100% Offline**: All your data is stored securely on your device via IndexedDB (using Dexie.js).
- **PWA Ready**: Installable on Android/iOS devices for a native app feel.
- **Dashboard**: High-level overview of balances, monthly summaries, and a category-wise spending donut chart.
- **Transactions**: Add incomes/expenses with customizable dates, notes, and categories. Filter and search the history.
- **Custom Categories**: Built-in default categories along with the ability to create unlimited custom categories with emojis.
- **Multi-Currency Support**: Choose your preferred local currency.
- **Dark Mode**: Beautiful, responsive layout with a comprehensive dark and light theme system.
- **Backup & Restore**: Easily export your whole database to JSON and import it onto any other device.

## 🛠️ Technology Stack

- **Framework**: React.js + Vite
- **Styling**: TailwindCSS
- **Database**: IndexedDB / Dexie.js
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

You need Node.js (v18 or above) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd "financial tracker"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📱 PWA Features

To install the app on a mobile device:
1. Open the hosted version of the app in Chrome (Android) or Safari (iOS).
2. Tap the "Share" or menu button.
3. Select "Add to Home Screen".

## 🔒 Privacy First
Mera Hisab does not use a backend server and does not transmit your personal financial data anywhere. Everything stays securely encrypted on your device's browser storage.
