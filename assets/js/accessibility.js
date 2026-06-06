/* ══════════════════════════════════════════════════════════════════════════════
   ACCESSIBILITY MODE - JAVASCRIPT
   
   This file provides a comprehensive accessibility mode toggle feature that allows
   users to customize their experience with the following options:
   - High contrast mode: Enhanced colors and borders for better visibility
   - Larger text sizes: Increase font sizes across the entire site
   - Dyslexia-friendly font: Switch to OpenDyslexic font for better readability
   - Disable animations: Remove all animations and transitions
   - Increased line spacing: Better vertical spacing for readability
   
   Features:
   ✓ Settings are persisted to localStorage (survive page reloads)
   ✓ Screen reader announcements (aria-live regions)
   ✓ Keyboard shortcut: Alt+A (or Cmd+A on Mac)
   ✓ Click outside to close menu
   ✓ Reset button to restore defaults
   ════════════════════════════════════════════════════════════════════════════════ */

// Storage key for persisting accessibility settings in localStorage
const A11Y_STORAGE_KEY = 'hypernova_a11y_settings';

/* ──────────────────────────────────────────────────────────────────────────────
   DOM ELEMENT REFERENCES
   Get references to the accessibility toggle button, menu, and all checkboxes
   ────────────────────────────────────────────────────────────────────────────── */
const a11yToggle = document.getElementById('a11y-toggle');
const a11yMenu = document.getElementById('a11y-menu');
const a11yResetBtn = document.getElementById('a11y-reset-btn');
const a11yOptions = {
    contrast: document.getElementById('a11y-contrast'),
    largeText: document.getElementById('a11y-large-text'),
    dyslexia: document.getElementById('a11y-dyslexia'),
    noMotion: document.getElementById('a11y-no-motion'),
    spacing: document.getElementById('a11y-spacing')
};

/* ──────────────────────────────────────────────────────────────────────────────
   TOGGLE MENU VISIBILITY
   When user clicks the accessibility button, show/hide the menu
   ────────────────────────────────────────────────────────────────────────────── */
a11yToggle.addEventListener('click', () => {
    a11yMenu.classList.toggle('open');
});

/* ──────────────────────────────────────────────────────────────────────────────
   CLOSE MENU ON OUTSIDE CLICK
   Auto-close menu when user clicks anywhere outside of it
   ────────────────────────────────────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
    if (!e.target.closest('.accessibility-toggle') && !e.target.closest('.accessibility-menu')) {
        a11yMenu.classList.remove('open');
    }
});

/* ──────────────────────────────────────────────────────────────────────────────
   KEYBOARD SHORTCUT: ALT+A
   Allow users to toggle the accessibility menu using Alt+A (Cmd+A on Mac)
   ────────────────────────────────────────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
    if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        a11yMenu.classList.toggle('open');
    }
});

/* ──────────────────────────────────────────────────────────────────────────────
   LOAD SAVED SETTINGS FROM LOCALSTORAGE
   On page load, restore user's previous accessibility preferences
   ────────────────────────────────────────────────────────────────────────────── */
function loadA11ySettings() {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY);
    if (saved) {
        // Parse the saved settings JSON
        const settings = JSON.parse(saved);
        // Apply each saved setting
        Object.entries(settings).forEach(([key, value]) => {
            if (a11yOptions[key]) {
                a11yOptions[key].checked = value;
                applyA11ySetting(key, value);
            }
        });
    }
}

/* ──────────────────────────────────────────────────────────────────────────────
   APPLY ACCESSIBILITY SETTING
   Apply a specific accessibility feature (add/remove CSS class)
   Special handling for the no-motion setting (hides custom cursor)
   ────────────────────────────────────────────────────────────────────────────── */
function applyA11ySetting(setting, enabled) {
    // Map accessibility setting names to their corresponding CSS class names
    const classMap = {
        contrast: 'a11y-contrast',
        largeText: 'a11y-large-text',
        dyslexia: 'a11y-dyslexia',
        noMotion: 'a11y-no-motion',
        spacing: 'a11y-spacing'
    };

    // Add or remove the CSS class based on whether feature is enabled
    if (enabled) {
        document.body.classList.add(classMap[setting]);
    } else {
        document.body.classList.remove(classMap[setting]);
    }

    /* ─────────────────────────────────────────────────────────────────────────
       SPECIAL CASE: NO MOTION
       When animations are disabled, also hide the custom cursor and show default
       ───────────────────────────────────────────────────────────────────────── */
    if (setting === 'noMotion') {
        const cursor = document.getElementById('cdot');
        const ring = document.getElementById('cring');
        if (cursor && ring) {
            if (enabled) {
                // Hide custom cursor elements
                cursor.style.display = 'none';
                ring.style.display = 'none';
                // Show browser's default cursor
                document.body.style.cursor = 'auto';
            } else {
                // Restore custom cursor elements
                cursor.style.display = 'block';
                ring.style.display = 'block';
                // Hide default cursor (use custom one)
                document.body.style.cursor = 'none';
            }
        }
    }

    // Save the new settings and announce the change
    saveA11ySettings();
    announceChange(setting, enabled);
}

/* ──────────────────────────────────────────────────────────────────────────────
   SAVE SETTINGS TO LOCALSTORAGE
   Persist all accessibility settings so they survive page reloads
   ────────────────────────────────────────────────────────────────────────────── */
function saveA11ySettings() {
    // Create object with current state of all checkboxes
    const settings = Object.fromEntries(
        Object.entries(a11yOptions).map(([key, input]) => [key, input.checked])
    );
    // Save to localStorage as JSON
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(settings));
}

/* ──────────────────────────────────────────────────────────────────────────────
   ANNOUNCE CHANGES TO SCREEN READERS
   Use ARIA live regions to notify screen reader users of setting changes
   ────────────────────────────────────────────────────────────────────────────── */
function announceChange(setting, enabled) {
    // Portuguese labels for each accessibility feature
    const labels = {
        contrast: 'Alto contraste',
        largeText: 'Texto maior',
        dyslexia: 'Fonte dislexia-friendly',
        noMotion: 'Animações desativadas',
        spacing: 'Espaçamento aumentado'
    };

    // Build announcement message
    const status = enabled ? 'ativado' : 'desativado';
    const message = `${labels[setting]} ${status}`;
    
    // Create temporary announcement element
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove announcement after 1 second (long enough for screen reader to read it)
    setTimeout(() => announcement.remove(), 1000);
}

/* ──────────────────────────────────────────────────────────────────────────────
   RESET BUTTON: RESTORE DEFAULTS
   Uncheck all options and remove all accessibility CSS classes
   ────────────────────────────────────────────────────────────────────────────── */
a11yResetBtn.addEventListener('click', () => {
    // Uncheck all checkboxes
    Object.values(a11yOptions).forEach(input => input.checked = false);
    // Remove all accessibility CSS classes
    Object.keys(a11yOptions).forEach(key => applyA11ySetting(key, false));
    // Announce reset
    announceChange('Modo Acessibilidade', false);
});

/* ──────────────────────────────────────────────────────────────────────────────
   ATTACH EVENT LISTENERS TO CHECKBOXES
   When user toggles a checkbox, apply that accessibility setting
   ────────────────────────────────────────────────────────────────────────────── */
Object.entries(a11yOptions).forEach(([key, input]) => {
    input.addEventListener('change', () => {
        applyA11ySetting(key, input.checked);
    });
});

/* ──────────────────────────────────────────────────────────────────────────────
   INITIALIZATION ON PAGE LOAD
   Load and apply saved accessibility settings when page loads
   ────────────────────────────────────────────────────────────────────────────── */
loadA11ySettings();

/* ──────────────────────────────────────────────────────────────────────────────
   CREATE SCREEN READER ONLY CLASS
   Add CSS class for content that's hidden visually but read by screen readers
   Used for accessibility announcements and assistive technology content
   ────────────────────────────────────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
    /* SR-ONLY: Screen Reader Only content
       Hidden visually but fully accessible to assistive technology
       Used for accessibility labels, announcements, and hidden descriptions */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;
document.head.appendChild(style);
