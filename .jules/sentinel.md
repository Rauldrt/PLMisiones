## 2024-05-24 - Unrestricted File Upload Vulnerability in Gallery Action
**Vulnerability:** The `uploadPublicFilesAction` server action in `src/actions/gallery.ts` did not validate file extensions before saving uploaded files to the `public` directory.
**Learning:** Even if the directory is `public` and meant for static assets, allowing unrestricted file extensions is a critical security risk. Attackers could potentially upload malicious scripts (e.g., HTML with embedded JS, SVG with scripts) or executables, and if the web server executes them or serves them with an improper Content-Type, it could lead to Stored XSS or other exploits.
**Prevention:** Implement a strict allowlist of file extensions and enforce it on the server-side before writing the file to disk.
