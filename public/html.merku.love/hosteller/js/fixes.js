/**
 * Console Warnings and Errors Fixes
 * This script must be loaded BEFORE common.min.js
 */

(function() {
  'use strict';

  // ============================================================================
  // FIX 1: YouTube Cross-Origin Warning Suppressor
  // ============================================================================

  // The YouTube postMessage error is thrown from inside the YouTube iframe
  // and cannot be fully suppressed without modifying YouTube's own code.
  // However, we can filter it from appearing in the console by wrapping
  // the native error reporting mechanism.

  // Suppress console warnings about postMessage
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('postMessage') && message.includes('youtube.com')) {
      return; // Silently ignore
    }
    originalConsoleWarn.apply(console, args);
  };

  // Note: The YouTube postMessage error is a native browser DOMException
  // that appears in the console before JavaScript error handlers can catch it.
  // This is a known limitation when embedding YouTube iframes on localhost.
  // The error does not affect functionality - videos will play normally.

  // ============================================================================
  // FIX 2: Google Maps Async Loading with Callback
  // ============================================================================

  // Store the original createElement
  const originalCreateElement = document.createElement.bind(document);

  // Override createElement to intercept Google Maps script loading
  document.createElement = function(tagName) {
    const element = originalCreateElement(tagName);

    if (tagName.toLowerCase() === 'script') {
      // Intercept when src is set
      let srcValue = '';
      Object.defineProperty(element, 'src', {
        get: function() {
          return srcValue;
        },
        set: function(value) {
          // Check if this is a Google Maps API script
          if (value && value.includes('maps.googleapis.com/maps/api/js')) {
            // Add async and callback parameters
            const url = new URL(value);

            // Add callback parameter if not present
            if (!url.searchParams.has('callback')) {
              url.searchParams.set('callback', 'initGoogleMapsCallback');
            }

            // Set async attribute
            element.async = true;

            // Create global callback function
            window.initGoogleMapsCallback = function() {
              console.log('Google Maps API loaded asynchronously');

              // Fix deprecated Marker issue
              if (window.google && window.google.maps) {
                patchGoogleMapsMarker();
              }

              // Trigger any existing onload handlers
              if (element.onload) {
                element.onload();
              }
            };

            srcValue = url.toString();
          } else {
            srcValue = value;
          }
        },
        configurable: true
      });
    }

    return element;
  };

  // ============================================================================
  // FIX 3: Google Maps Marker -> AdvancedMarkerElement Migration
  // ============================================================================

  function patchGoogleMapsMarker() {
    if (!window.google || !window.google.maps) {
      return;
    }

    const originalMarker = window.google.maps.Marker;

    // Create a wrapper that uses AdvancedMarkerElement if available
    window.google.maps.Marker = function(options) {
      // Check if AdvancedMarkerElement is available
      if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
        console.log('Using AdvancedMarkerElement instead of deprecated Marker');

        const advancedOptions = {
          map: options.map,
          position: options.position,
        };

        // Handle custom icon
        if (options.icon) {
          const markerContent = document.createElement('div');
          const img = document.createElement('img');
          img.src = options.icon;
          img.style.width = '32px';
          img.style.height = '42px';
          markerContent.appendChild(img);
          advancedOptions.content = markerContent;
        }

        // Handle title
        if (options.title) {
          advancedOptions.title = options.title;
        }

        const marker = new window.google.maps.marker.AdvancedMarkerElement(advancedOptions);

        // Add compatibility methods
        marker.setMap = function(map) {
          this.map = map;
        };

        marker.getPosition = function() {
          return this.position;
        };

        return marker;
      } else {
        // Fallback to original Marker if AdvancedMarkerElement not available
        console.warn('AdvancedMarkerElement not available, using deprecated Marker');
        return new originalMarker(options);
      }
    };

    // Preserve prototype
    window.google.maps.Marker.prototype = originalMarker.prototype;
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  console.log('Console fixes loaded: YouTube warnings suppressed, Google Maps will load async');

})();
