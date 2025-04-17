# AzPort Supply Website

## Static Assets & Images

### Image Handling

All static assets such as images should be placed in the `public/images/` directory. 

When referencing these images in your code, use the path format `/images/filename.png` (starting with a forward slash).

Example:
```jsx
<img src="/images/logo.png" alt="Logo" />
```

For background images in CSS:
```jsx
<div style={{ backgroundImage: 'url("/images/background.webp")' }}></div>
```

### Why This Works

Vite treats the `public` directory as a static asset directory. During development, files inside this directory are served as-is at the root path. During production build, assets in the `public` directory are copied to the build output directory untouched.

### Image Deployment Notes

- Local image paths like `/src/img/logo.png` will not work in production builds
- Always use `/images/...` paths that reference the public directory
- For dynamic images or user-uploaded content, consider using a CDN or external image hosting service

## Development

To run the development server:

```bash
npm run dev
```

## Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory, ready for deployment. 