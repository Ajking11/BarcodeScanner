/**
 * Barcode Scanner Application
 * Enhanced version with improved error handling, configuration options, and code organization
 */

// Configuration object for easy adjustments
const BarcodeConfig = {
    minBarcodeLength: 10,       // Minimum length to consider a valid barcode
    processingDelay: 300,       // Milliseconds to wait before processing input (adjust for scanner speed)
    enableLogging: false,       // Enable console logging for debugging
    alertDuration: 1500         // Duration for alert messages in milliseconds
};

// Main Barcode Scanner class
class BarcodeScanner {
    constructor(config = {}) {
        // Merge default config with any provided options
        this.config = { ...BarcodeConfig, ...config };
        
        // DOM elements
        this.inputElement = document.getElementById('barCodeScannerInput');
        this.listElement = document.getElementById('ulList');
        
        // Initialize state
        this.barcodes = [];
        this.currentInput = [];
        this.keystrokeCount = 0;
        this.lastKeystrokeCount = 0;
        this.processingLock = false;
        
        // Bind methods to maintain correct 'this' context
        this.handleKeydown = this.handleKeydown.bind(this);
        this.processBarcode = this.processBarcode.bind(this);
        this.resetInput = this.resetInput.bind(this);
        
        // Initialize the scanner
        this.init();
    }
    
    // Set up the scanner
    init() {
        if (!this.inputElement || !this.listElement) {
            console.error('Required DOM elements not found. Make sure elements with IDs "barCodeScannerInput" and "ulList" exist.');
            return;
        }
        
        // Set focus and add event listener
        this.inputElement.focus();
        this.inputElement.addEventListener('keydown', this.handleKeydown);
        
        // Load saved barcodes if storage is available
        this.loadSavedBarcodes();
        
        this.log('Barcode scanner initialized');
    }
    
    // Handle keydown events
    handleKeydown(event) {
        // Only process single-character keys (ignores Shift, Control, etc.)
        if (event.key.length === 1) {
            this.currentInput.push(event.key);
            this.keystrokeCount++;
            this.lastKeystrokeCount = this.keystrokeCount;
            
            // Start processing if we have at least the minimum required characters
            if (this.currentInput.length >= this.config.minBarcodeLength && !this.processingLock) {
                this.processingLock = true;
                setTimeout(this.processBarcode, this.config.processingDelay);
            }
        }
    }
    
    // Process the collected barcode after delay
    async processBarcode() {
        // Check if no new keystrokes have been received during the delay
        if (this.keystrokeCount === this.lastKeystrokeCount && this.keystrokeCount !== 0) {
            const barcode = this.currentInput.join("");
            
            // Basic validation - can be expanded for specific barcode formats
            if (!this.isValidBarcode(barcode)) {
                this.showError("Invalid barcode format");
                this.resetInput();
                return;
            }
            
            // Check for duplicates
            if (this.isDuplicate(barcode)) {
                this.showError("Barcode already scanned");
                this.resetInput();
                return;
            }
            
            // Add the new barcode
            this.addBarcode(barcode);
            this.resetInput();
        } else {
            // More keystrokes were received, release the lock
            this.processingLock = false;
        }
    }
    
    // Add a barcode to the list and display
    addBarcode(barcode) {
        // Add to the array
        this.barcodes.push(barcode);
        
        // Save to local storage if available
        this.saveBarcodes();
        
        // Create and add list item with sanitized content
        const listItem = document.createElement('li');
        listItem.className = 'barcode-item fade-in';
        
        // Create text content (avoids innerHTML for security)
        const textContent = document.createTextNode(barcode);
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'x';
        deleteButton.addEventListener('click', () => this.removeBarcode(barcode, listItem));
        
        // Add elements to the list item
        listItem.appendChild(textContent);
        listItem.appendChild(deleteButton);
        
        // Add to the list
        this.listElement.appendChild(listItem);
        
        // Show success feedback
        this.showSuccess("Barcode added");
    }
    
    // Remove a barcode from the list
    removeBarcode(barcode, listItem) {
        const index = this.barcodes.indexOf(barcode);
        if (index !== -1) {
            this.barcodes.splice(index, 1);
            this.saveBarcodes();
            
            // Animate removal
            listItem.classList.add('fade-out');
            setTimeout(() => {
                this.listElement.removeChild(listItem);
            }, 300);
        }
    }
    
    // Reset the input state
    resetInput() {
        this.inputElement.value = "";
        this.keystrokeCount = 0;
        this.lastKeystrokeCount = 0;
        this.currentInput = [];
        this.processingLock = false;
        this.inputElement.focus();
    }
    
    // Check if a barcode already exists in the array
    isDuplicate(barcode) {
        return this.barcodes.includes(barcode);
    }
    
    // Validate barcode format (can be expanded for specific formats)
    isValidBarcode(barcode) {
        // This is a basic validation - you can add specific format validation here
        // For example: UPC-A is 12 digits, EAN-13 is 13 digits, etc.
        return barcode.length >= this.config.minBarcodeLength && /^\d+$/.test(barcode);
    }
    
    // Show error message using SweetAlert
    showError(message) {
        if (typeof swal === 'function') {
            this.inputElement.setAttribute('disabled', true);
            swal({
                icon: "error",
                title: "Error",
                text: message,
                buttons: false,
                timer: this.config.alertDuration,
                closeOnClickOutside: false
            }).then(() => {
                this.inputElement.removeAttribute('disabled');
                this.inputElement.focus();
            });
        } else {
            alert(message);
            this.inputElement.focus();
        }
    }
    
    // Show success message
    showSuccess(message) {
        if (typeof swal === 'function') {
            this.inputElement.setAttribute('disabled', true);
            swal({
                icon: "success",
                title: "Success",
                text: message,
                buttons: false,
                timer: this.config.alertDuration,
                closeOnClickOutside: false
            }).then(() => {
                this.inputElement.removeAttribute('disabled');
                this.inputElement.focus();
            });
        }
        this.inputElement.focus();
    }
    
    // Save barcodes to local storage
    saveBarcodes() {
        if (window.localStorage) {
            try {
                localStorage.setItem('savedBarcodes', JSON.stringify(this.barcodes));
            } catch (e) {
                console.error('Could not save to localStorage:', e);
            }
        }
    }
    
    // Load barcodes from local storage
    loadSavedBarcodes() {
        if (window.localStorage) {
            try {
                const saved = localStorage.getItem('savedBarcodes');
                if (saved) {
                    const parsedBarcodes = JSON.parse(saved);
                    if (Array.isArray(parsedBarcodes)) {
                        this.barcodes = parsedBarcodes;
                        
                        // Display the loaded barcodes
                        this.barcodes.forEach(barcode => {
                            const listItem = document.createElement('li');
                            listItem.className = 'barcode-item';
                            
                            const textContent = document.createTextNode(barcode);
                            
                            const deleteButton = document.createElement('button');
                            deleteButton.className = 'delete-btn';
                            deleteButton.textContent = 'x';
                            deleteButton.addEventListener('click', () => this.removeBarcode(barcode, listItem));
                            
                            listItem.appendChild(textContent);
                            listItem.appendChild(deleteButton);
                            
                            this.listElement.appendChild(listItem);
                        });
                    }
                }
            } catch (e) {
                console.error('Error loading saved barcodes:', e);
            }
        }
    }
    
    // Export barcodes to CSV
    exportToCSV() {
        if (this.barcodes.length === 0) {
            this.showError("No barcodes to export");
            return;
        }
        
        const csvContent = "data:text/csv;charset=utf-8," + this.barcodes.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "barcodes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Clear all barcodes
    clearAll() {
        if (confirm("Are you sure you want to delete all barcodes?")) {
            this.barcodes = [];
            this.listElement.innerHTML = '';
            this.saveBarcodes();
        }
    }
    
    // Logging helper
    log(message) {
        if (this.config.enableLogging) {
            console.log(`[BarcodeScanner] ${message}`);
        }
    }
}

// Create and initialize the scanner when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global reference
    window.barcodeScanner = new BarcodeScanner();
    
    // Add export button functionality if it exists
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', () => window.barcodeScanner.exportToCSV());
    }
    
    // Add clear button functionality if it exists
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', () => window.barcodeScanner.clearAll());
    }
});
