/**
 * Enhanced Event Monitor Utility
 * 
 * An improved utility for monitoring DOM events with performance optimizations,
 * filtering capabilities, and memory management.
 */

class EventMonitor {
    /**
     * Create a new event monitor
     * @param {HTMLElement|null} element - DOM element to monitor (default: document.body)
     * @param {Object} options - Configuration options
     */
    constructor(element = null, options = {}) {
        // Default configuration
        this.config = {
            logToConsole: true,           // Whether to log events to console
            maxLogs: 100,                 // Maximum number of logs to keep in history
            filterEvents: null,           // Array of event names to monitor (null = auto-detect common events)
            excludeEvents: ['mousemove'], // Events to exclude (high frequency events)
            includeTarget: true,          // Whether to include target element in logs
            includeTimestamp: true,       // Whether to include timestamps in logs
            groupSimilarEvents: true,     // Group similar events in console
            capturePhase: false           // Whether to capture in capture phase (vs bubbling)
        };
        
        // Merge provided options
        Object.assign(this.config, options);
        
        // Set the element to monitor
        this.element = element || document.body;
        
        // Store active listeners for cleanup
        this.activeListeners = new Map();
        
        // Event history log
        this.eventLog = [];
        
        // Bound callback to maintain context
        this.boundEventCallback = this.handleEvent.bind(this);
    }
    
    /**
     * Start monitoring events
     * @returns {EventMonitor} This instance for chaining
     */
    start() {
        // Clean up any existing listeners first
        this.stop();
        
        // Get events to monitor
        let events = this.config.filterEvents;
        
        // If no specific events provided, auto-detect common events
        if (!events) {
            events = this.detectCommonEvents();
        }
        
        // Filter out excluded events
        events = events.filter(event => !this.config.excludeEvents.includes(event));
        
        // Add listeners for each event
        events.forEach(eventName => {
            this.element.addEventListener(
                eventName, 
                this.boundEventCallback, 
                this.config.capturePhase
            );
            
            // Store for later cleanup
            this.activeListeners.set(eventName, {
                callback: this.boundEventCallback,
                capture: this.config.capturePhase
            });
        });
        
        console.log(`[EventMonitor] Started monitoring ${events.length} events on`, this.element);
        return this;
    }
    
    /**
     * Stop monitoring events
     * @returns {EventMonitor} This instance for chaining
     */
    stop() {
        // Remove all active listeners
        this.activeListeners.forEach((config, eventName) => {
            this.element.removeEventListener(
                eventName,
                config.callback,
                config.capture
            );
        });
        
        // Clear the map
        this.activeListeners.clear();
        
        console.log('[EventMonitor] Stopped monitoring events');
        return this;
    }
    
    /**
     * Handle monitored events
     * @param {Event} event - The DOM event
     * @private
     */
    handleEvent(event) {
        // Create log entry
        const logEntry = {
            type: event.type,
            timestamp: new Date(),
            event: event
        };
        
        // Add to history (with limit)
        this.eventLog.unshift(logEntry);
        if (this.eventLog.length > this.config.maxLogs) {
            this.eventLog.pop();
        }
        
        // Log to console if enabled
        if (this.config.logToConsole) {
            this.logToConsole(logEntry);
        }
    }
    
    /**
     * Log event to console with formatting
     * @param {Object} logEntry - Event log entry
     * @private
     */
    logToConsole(logEntry) {
        // Format the output
        let groupName = `Event: ${logEntry.type}`;
        let details = [];
        
        // Add timestamp if configured
        if (this.config.includeTimestamp) {
            const time = logEntry.timestamp.toISOString().split('T')[1].slice(0, -1);
            details.push(`Time: ${time}`);
        }
        
        // Add target info if configured
        if (this.config.includeTarget && logEntry.event.target) {
            const target = logEntry.event.target;
            let targetInfo = target.tagName || 'Unknown';
            
            if (target.id) {
                targetInfo += `#${target.id}`;
            } else if (target.className && typeof target.className === 'string') {
                targetInfo += `.${target.className.split(' ')[0]}`;
            }
            
            details.push(`Target: ${targetInfo}`);
        }
        
        // Group or log directly based on configuration
        if (this.config.groupSimilarEvents) {
            console.groupCollapsed(`${groupName} (${details.join(', ')})`);
            console.log('Event Object:', logEntry.event);
            console.groupEnd();
        } else {
            console.log(`${groupName} | ${details.join(' | ')}`, logEntry.event);
        }
    }
    
    /**
     * Auto-detect common events based on element type
     * @returns {Array} List of event names
     * @private
     */
    detectCommonEvents() {
        // Start with common events for all elements
        const events = [
            'click', 'dblclick', 'mousedown', 'mouseup', 
            'focus', 'blur', 'keydown', 'keyup', 'keypress'
        ];
        
        // Add element-specific events based on tag name
        if (this.element.tagName) {
            const tag = this.element.tagName.toLowerCase();
            
            // Input-specific events
            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                events.push('input', 'change');
            }
            
            // Form-specific events
            if (tag === 'form') {
                events.push('submit', 'reset');
            }
            
            // Media-specific events
            if (tag === 'video' || tag === 'audio') {
                events.push('play', 'pause', 'ended', 'volumechange');
            }
        }
        
        return events;
    }
    
    /**
     * Get the event history log
     * @returns {Array} Log of events
     */
    getLog() {
        return this.eventLog;
    }
    
    /**
     * Clear the event history log
     * @returns {EventMonitor} This instance for chaining
     */
    clearLog() {
        this.eventLog = [];
        return this;
    }
    
    /**
     * Export event log to JSON
     * @returns {string} JSON string of event log
     */
    exportLog() {
        // Create a simplified version of the log without circular references
        const exportableLog = this.eventLog.map(entry => {
            const { event, ...rest } = entry;
            const simplifiedEvent = {
                type: event.type,
                target: event.target ? {
                    tagName: event.target.tagName,
                    id: event.target.id,
                    className: event.target.className
                } : null
            };
            
            // Add event-specific properties
            if (event.key) simplifiedEvent.key = event.key;
            if (event.code) simplifiedEvent.code = event.code;
            if (event.clientX) simplifiedEvent.position = { x: event.clientX, y: event.clientY };
            
            return {
                ...rest,
                event: simplifiedEvent
            };
        });
        
        return JSON.stringify(exportableLog, null, 2);
    }
    
    /**
     * Download event log as JSON file
     */
    downloadLog() {
        const json = this.exportLog();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `event-log-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Examples of usage:

// 1. Basic monitoring of the barcode input field
const barcodeMonitor = new EventMonitor(
    document.getElementById('barCodeScannerInput')
);
barcodeMonitor.start();

// 2. Advanced monitoring with custom options
/*
const advancedMonitor = new EventMonitor(
    document.getElementById('barCodeScannerInput'), 
    {
        filterEvents: ['keydown', 'keyup', 'focus', 'blur'], // Only specific events
        groupSimilarEvents: false,                           // Don't group in console
        includeTimestamp: true                               // Include timestamps
    }
);
advancedMonitor.start();

// Stop monitoring after 30 seconds
setTimeout(() => {
    advancedMonitor.stop();
    console.log('Stopped monitoring after 30 seconds');
    
    // Export the log if needed
    advancedMonitor.downloadLog();
}, 30000);
*/
