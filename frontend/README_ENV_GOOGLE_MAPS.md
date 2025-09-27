# Environment Variables for Google Maps API

To use the Google Maps API key securely, follow these steps:

1. Create a `.env` file in your `frontend` directory (next to `package.json`).
2. Add the following line to your `.env` file:

VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here

3. In your code, reference the key using `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` (for JavaScript/TypeScript files) or `%VITE_GOOGLE_MAPS_API_KEY%` in `index.html` (Vite will replace this at build time).

**Never commit your real API key to version control.**

---

## Example `.env` file:

VITE_GOOGLE_MAPS_API_KEY=AIza...yourkey...

---

After updating the `.env` file, restart your dev server for changes to take effect.
