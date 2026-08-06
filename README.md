# ⚡ ImageResizer Studio — Free In-Browser Image Resizer & Compressor

> High-performance, 100% private, client-side batch image resizer, quality compressor, and format converter powered by **React 19**, **Vite**, **Tailwind CSS v4**, and **Web Workers**.

![Live Demo](https://img.shields.io/badge/Live_Demo-image--resizer--rhn7.onrender.com-0891b2?style=for-the-badge&logo=render)
![Privacy](https://img.shields.io/badge/Privacy-100%25_In--Browser-emerald?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06b6d4?style=for-the-badge&logo=tailwindcss)
![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa)

---

## 🌟 Key Features

- **🔒 100% In-Browser Privacy**: Zero server uploads. All downsampling, format conversion, and compression algorithms run off-thread via `OffscreenCanvas` in background Web Workers.
- **📐 Multithreaded Image Resizing**:
  - Exact Width / Height with aspect ratio locking.
  - Percentage scaling (25% → 200%).
  - One-click social media dimension presets (Instagram Post/Story, YouTube Thumb, Twitter Header, LinkedIn Banner, Facebook Cover).
- **🗜️ Dual-Pass Quality Compression**:
  - Quality presets (Low 90%, Medium 75%, High 50%, Custom slider 1%-100%).
  - **"Compress to Max File Size"**: Target specific KB/MB limits (e.g. `< 200 KB`) with automated binary-search quality matching.
- **⚡ Format Conversion**: Bulk convert between JPG, PNG, WEBP, and AVIF.
- **🔄 Transform & Effects**:
  - 90° CCW / CW Rotation and Flip H / Flip V.
  - Custom Text Watermarks with position & opacity controls.
  - Brightness, Contrast, Grayscale, and Sepia adjustments.
- **📦 Batch Queue & ZIP Export**: Process multiple files in parallel and download individual files or a single `.zip` archive.
- **📲 Progressive Web App (PWA)**: Install directly onto macOS, Windows, iOS, or Android as a desktop/mobile native app.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Concurrency**: Web Workers (`OffscreenCanvas`)
- **Archiving**: JSZip + FileSaver.js
- **Animations**: Framer Motion

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/himangshukamila/Image-Resizer.git
cd Image-Resizer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License

MIT © [Himangshu Kamila](https://github.com/himangshukamila)
