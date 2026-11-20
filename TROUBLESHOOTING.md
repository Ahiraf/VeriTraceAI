# VeriTraceAI — Development & Server Troubleshooting Reference

This document catalogs common runtime, bundling, and deployment issues encountered in the VeriTraceAI monorepo, along with architectural fixes and preventive mechanisms.

---

## 1. Port 3000 Collision (`Error: listen EADDRINUSE :::3000`)

### Cause
When terminating a dev session or switching branches, an orphaned background Node/Next.js process (`next-server`) may continue holding the TCP socket on port 3000. When a new instance attempts to bind, it crashes with:
```text
Error: listen EADDRINUSE: address already in use :::3000
```
Additionally, web browsers loading `localhost:3000` continue receiving stale HTML/CSS from the zombie process rather than current build assets.

### Automated Prevention
A cross-platform socket management script `scripts/free-port.js` is registered across both root and workspace lifecycle hooks:

1. **Root `package.json`**:
```json
"scripts": {
  "predev": "node scripts/free-port.js",
  "dev": "turbo run dev"
}
```

2. **`apps/web/package.json`**:
```json
"scripts": {
  "predev": "node ../../scripts/free-port.js",
  "dev": "next dev"
}
```

3. **Multi-Strategy Socket Eviction (`scripts/free-port.js`)**:
The script executes a fallback eviction chain (`fuser -k 3000/tcp` followed by `lsof -ti :3000 | xargs -r kill -9`), followed by an explicit 200ms socket teardown grace period. This prevents the OS `EADDRINUSE` race condition where `next dev` attempts to call `listen()` before the previous socket completes its kernel-level teardown.

### Manual Recovery Command
```bash
fuser -k 3000/tcp || kill -9 $(lsof -t -i:3000)
```

---

## 2. PostCSS & Tailwind Utility Processing in Next.js

### Cause
When a monorepo workspace does not specify `"type": "module"` in `package.json`, Next.js operates in CommonJS module resolution. If PostCSS is configured as `postcss.config.mjs` or Tailwind as `tailwind.config.ts`, the Next.js development server may fail to load the PostCSS plugin chain, causing Tailwind utility classes to be omitted from the compiled CSS output.

### Architectural Standard
Always use standard CommonJS configuration files:
- `apps/web/postcss.config.js`:
  ```js
  module.exports = {
    plugins: {
      tailwindcss: {},
    },
  };
  ```
- `apps/web/tailwind.config.js`:
  ```js
  /** @type {import('tailwindcss').Config} */
  module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    // ...
  };
  ```
- Design tokens should be embedded directly within `apps/web/src/styles/globals.css` rather than imported via unbundled CSS `@import` declarations.

---

## 3. Route Parameter Resolution (React 18 vs. Next.js 15)

### Cause
In Next.js 15 with React 19, route parameters are provided as promises (`params: Promise<{ id: string }>`), which are unpacked using `React.use(params)`. However, when running on **React 18.3.1**, `React.use` is `undefined`, causing:
```text
TypeError: (0, react.use) is not a function
```

### Architectural Standard
In client components (`'use client'`), always use the synchronous `useParams()` hook provided by `next/navigation`:
```tsx
import { useParams } from 'next/navigation';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = (params?.caseId as string) || '';
  // ...
}
```
This is fully backwards-compatible with React 18 while operating seamlessly in Next.js 15.

---

## 4. Next.js 15 `/_not-found` Static Generation Invariant

### Cause
When static export or page collection runs, Next.js 15 requires an explicit `app/not-found.tsx` handler. If absent, the static generation worker throws:
```text
[Error: Invariant: no direct app page entry found for /_not-found]
```

### Architectural Standard
Keep a lightweight, branded `apps/web/src/app/not-found.tsx` present in the `app/` directory at all times.

---

## 5. Client Hydration Safety (`next-themes` and `@xyflow/react`)

### Cause
Components that read runtime theme states or compute DOM canvas geometry (such as React Flow) cannot determine accurate values during Server-Side Rendering (SSR). This triggers React hydration mismatch warnings.

### Architectural Standard
Implement a client-side mounting gate:
```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <Skeleton className="..." />;
}
```
