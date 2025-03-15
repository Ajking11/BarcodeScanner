# Barcode Scanner Pro

A lightweight, fast, and efficient web application for scanning and managing barcodes.

## Features

- Real-time barcode scanning through keyboard input
- Support for physical barcode scanners
- Duplicate detection and validation
- Local storage for persistent data
- Export to CSV functionality
- Responsive design for mobile and desktop
- Offline support via Progressive Web App (PWA)
- Dark mode support
- Accessibility-friendly

## Installation

### Basic Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/Ajking11/BarcodeScanner.git
   cd BarcodeScanner
   ```

2. Open `index.html` in a web browser or serve the files using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server
   ```

### As a Progressive Web App

For full PWA functionality, the application needs to be served over HTTPS. You can:

1. Deploy to a hosting service that supports HTTPS (GitHub Pages, Netlify, Vercel, etc.)
2. Set up a local development server with HTTPS

Once deployed with HTTPS, users can install the app on their devices by clicking "Add to Home Screen" in their browser's menu.

## Usage

1. Open the application in a web browser
2. Focus is automatically set to the input field
3. Scan a barcode using a physical barcode scanner or manually type it in
4. The barcode will be processed after a short delay
5. View all scanned barcodes in the list below
6. Use the export button to download barcodes as a CSV file
7. Use the clear button to reset the list

## Configuration

You can adjust the scanner settings by modifying the `BarcodeConfig` object in `script.js`:

```javascript
const BarcodeConfig = {
    minBarcodeLength: 10,       // Minimum length to consider a valid barcode
    processingDelay: 300,       // Milliseconds to wait before processing
    enableLogging: false,       // Enable console logging for debugging
    alertDuration: 1500         // Duration for alert messages in milliseconds
};
```

## Development

### Structure

```
barcode-scanner/
│
├── index.html                  # Main HTML file
├── script.js                   # Main application logic
├── style.css                   # CSS styles
├── monitorEvents.js            # Optional event monitoring utility
├── service-worker.js           # Service worker for offline support
├── manifest.json               # Web app manifest for PWA support
│
├── icons/                      # Icons for PWA installation
│   └── ...                     # Various icon sizes
│
├── screenshots/                # Screenshots for documentation
│   └── ...
│
└── favicon.ico                 # Website favicon
```

### Monitoring Events

For debugging purposes, you can use the included `monitorEvents.js` utility:

1. Uncomment the script include in `index.html`
2. Open your browser's developer console
3. Events on the barcode input will be logged to the console

### Customizing Styles

The application uses Bootstrap 4 for base styling, with custom styles in `style.css`. The CSS includes:

- Light/dark mode support
- Print-friendly styles
- Responsive design adjustments
- Animations and transitions

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Opera (latest 2 versions)

Internet Explorer is not supported.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/) - UI framework
- [SweetAlert](https://sweetalert.js.org/) - Better alerts
- [Font Awesome](https://fontawesome.com/) - Icons

---

## Troubleshooting

### Barcode Not Detecting

- Ensure your scanner is configured to send a suffix (Enter/Return) after scanning
- Check the minimum barcode length configuration
- Try adjusting the processing delay if your scanner is very fast or slow

### PWA Not Installing

- Ensure you're serving the site over HTTPS
- Check that all required icons are available
- Verify the manifest.json is properly formatted

### Data Not Saving

- Check if local storage is enabled in your browser
- Clear browser cache and try again
- Ensure you have sufficient storage space available
