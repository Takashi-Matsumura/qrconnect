# QRConnect

QRConnect is a Progressive Web App (PWA) that enables seamless data transfer between smartphones and PCs using QR codes. It provides a responsive design that automatically switches between QR code generation on mobile devices and QR code reading on desktop computers.

## Features

### Core Functionality
- **QR Code Generation**: Convert text to QR codes on mobile devices
- **QR Code Reading**: Scan QR codes using PC camera
- **Responsive Design**: Automatic device detection and appropriate UI display
- **PWA Support**: Install as a native app on both mobile and desktop

### Mobile Features
- QR code generation with real-time preview
- Character limit validation (2000 characters recommended)
- Test text generation for validation
- Tap-to-expand QR code modal
- Tab navigation between generator and help pages

### Desktop Features
- Camera-based QR code scanning
- Real-time QR code detection
- Clipboard integration for scanned data

### Technical Features
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **QR Generation**: `qrcode` library
- **QR Reading**: `@zxing/library`
- **PWA**: Service Worker and Web App Manifest

## Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qrconnect.git
cd qrconnect
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Mobile Usage (QR Code Generation)
1. Open the app on your smartphone
2. Enter the text you want to transfer in the text area
3. The QR code will be generated automatically
4. Tap the QR code thumbnail to expand it for better visibility
5. Use the PC camera to scan the QR code

### Desktop Usage (QR Code Reading)
1. Open the app on your PC
2. Allow camera access when prompted
3. Point your camera at the QR code generated on your mobile device
4. The scanned data will be displayed automatically

### Additional Features
- **Character Limit Validation**: The app validates text length and warns when approaching the 2000-character limit
- **Test Text Generation**: Use the "テストテキスト生成" button to generate sample text for testing
- **Help & Technical Information**: Access detailed documentation via the "ヘルプ・技術情報" tab on mobile

## Project Structure

```
qrconnect/
├── app/
│   ├── page.tsx              # Main entry point
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/
│   ├── DeviceDetector.tsx    # Device detection logic
│   ├── MobileApp.tsx         # Mobile app wrapper
│   ├── QRGenerator.tsx       # QR code generation
│   ├── QRReader.tsx          # QR code reading
│   ├── QRCodeModal.tsx       # QR code expansion modal
│   └── InfoPage.tsx          # Help and technical info
├── utils/
│   └── testTextGenerator.ts  # Test text generation utilities
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
└── next.config.ts            # Next.js configuration
```

## PWA Configuration

The app is configured as a Progressive Web App with:
- **Manifest**: Defines app metadata and installation behavior
- **Service Worker**: Enables offline functionality and caching
- **Responsive Design**: Optimized for both mobile and desktop installation

## Browser Support

- **Mobile**: iOS Safari, Android Chrome, Firefox Mobile
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Camera Access**: Required for QR code scanning on desktop

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- QR code generation powered by [qrcode](https://github.com/soldair/node-qrcode)
- QR code reading powered by [ZXing](https://github.com/zxing-js/library)
- Styled with [Tailwind CSS](https://tailwindcss.com/)