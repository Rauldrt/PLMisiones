## 2024-05-24 - Unrestricted File Upload in Gallery Action
**Vulnerability:** The Server Action `uploadPublicFilesAction` allowed arbitrary base64 file data to be written to the `public/` directory without validating the file extension, leading to a potential Unrestricted File Upload vulnerability (e.g., uploading `.html` or `.js` files for XSS).
**Learning:** Even if a file name is sanitized against path traversal (`path.basename`), the file extension must still be validated against a strict whitelist to ensure only expected file types (like images and videos) can be uploaded and served from public directories.
**Prevention:** Always validate file extensions against a whitelist of safe types before writing any user-uploaded content to the filesystem.
## 2025-05-24 - Server-Side Request Forgery in URL Fetching Tool
**Vulnerability:** The Server Action tool `fetchAndParseUrlTool` in `src/ai/flows/generate-news-from-url.ts` allowed the AI to fetch any URL provided by the user. An attacker could provide a URL pointing to internal services (like `localhost` or `169.254.169.254`), leading to SSRF.
**Learning:** Even when the primary use case is fetching public external content, server-side network requests driven by user input (or AI-generated input based on user input) must restrict access to private and internal network ranges.
**Prevention:** Validate parsed URLs before fetching them on the server side to ensure they do not resolve to `localhost` or private IP address spaces (e.g., `10.x.x.x`, `172.16.x.x`, `192.168.x.x`, `169.254.x.x`).
