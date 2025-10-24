# 🎨 PaletteCraft AI

An AI-powered color palette generator. Instantly create beautiful, cohesive color schemes from a text prompt or an image, designed for creatives, designers, and developers.


## ✨ Features

- **AI Palette Generation**: Describe a theme (e.g., "Cyberpunk Cityscape") to get a 5-color palette with creative, descriptive names.
- **Extract from Image**: Upload any image and automatically extract a harmonious color palette.
- **Interactive Palette**:
    - **One-Click Copy**: Easily copy hex codes to your clipboard.
    - **Color Picker**: Fine-tune any color in the palette with an integrated color picker.
- **Accessibility First**: A built-in contrast grid automatically checks for WCAG (AA/AAA) compliance between every color pair.
- **Live Theme Preview**: Instantly visualize how your generated palette looks as a UI theme with example components.
- **Export for Devs**: Export palettes as ready-to-use CSS variables, SCSS variables, or a JSON object.
- **Save Favorites**: Save your best palettes to your browser's local storage for later use.
- **Beautiful UI**: A carefully crafted interface with both light and dark modes, built with Tailwind CSS.
- **PWA Ready**: Installable on your desktop or mobile device for a native, app-like experience with offline support.

## 🚀 Tech Stack

- **Frontend**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **PWA**: Standard Web Manifest & Service Worker

## 🛠️ Setup and Running Locally

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18 or later) and a package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

### 1. Clone the Repository

Clone this project to your local machine.

```bash
git clone https://github.com/your-username/palettecraft.git
cd palettecraft
```

### 2. Install Dependencies

Install the necessary project dependencies.

```bash
npm install
```

### 3. Set Up Environment Variables

The application requires a Google Gemini API key to function and now uses environment variables only (no in-app key entry).

Create a new file named `.env.local` in the root of your project and add your API key to it. Any of the following variables will work; `GEMINI_API_KEY` is recommended:

```
# Preferred
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Also supported
API_KEY=YOUR_GEMINI_API_KEY_HERE
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 4. Run the Development Server

Start the local development server.

```bash
npm run dev
```

The application should now be running on `http://localhost:5173` (or a similar port).

# (Deployment)

This application is ready to deploy on vercel or netlify

**Crucial Step:** You must add your Gemini API key as an environment variable in your deployment platform's project settings. Set one of: `GEMINI_API_KEY` (preferred), `API_KEY`, or `VITE_GEMINI_API_KEY`.

1. Navigate to your project's settings on the deployment platform (e.g., Vercel).
2. Find the Environment Variables section.
3. Add `GEMINI_API_KEY` with your key as the value (or `API_KEY`).
4. Redeploy your application for the changes to take effect.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.