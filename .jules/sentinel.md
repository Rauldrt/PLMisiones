## 2024-05-24 - Unrestricted File Upload in Gallery Action
**Vulnerability:** The Server Action `uploadPublicFilesAction` allowed arbitrary base64 file data to be written to the `public/` directory without validating the file extension, leading to a potential Unrestricted File Upload vulnerability (e.g., uploading `.html` or `.js` files for XSS).
**Learning:** Even if a file name is sanitized against path traversal (`path.basename`), the file extension must still be validated against a strict whitelist to ensure only expected file types (like images and videos) can be uploaded and served from public directories.
**Prevention:** Always validate file extensions against a whitelist of safe types before writing any user-uploaded content to the filesystem.
