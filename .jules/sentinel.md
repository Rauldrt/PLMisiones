## 2024-05-24 - Unsanitized input used in dangerouslySetInnerHTML
**Vulnerability:** Several components render raw HTML user input without sanitization using `dangerouslySetInnerHTML`. Specifically, `article.content`, `item.content`, `proposal.content` and `item.embedCode` are rendered as is, opening up Cross-Site Scripting (XSS) attacks.
**Learning:** In Next.js applications, `dangerouslySetInnerHTML` is commonly used to render rich text. However, when the content is from an untrusted source or user input, it poses a significant XSS risk if not sanitized properly on the client and server.
**Prevention:** Always sanitize HTML input using a library like `dompurify` (or `isomorphic-dompurify` for SSR/Server Components) before passing it to `dangerouslySetInnerHTML`. Ensure that both client-side sanitization and server-side validation/sanitization are implemented as defense-in-depth measures. Whitelist necessary tags like `iframe` for video embeds securely.
## 2024-03-18 - [Fix Missing HTML Sanitization]
**Vulnerability:** Found `dangerouslySetInnerHTML` being used without `clientSanitize` in `src/components/Banner.tsx` and `src/components/NewsCard.tsx`.
**Learning:** Even internal content from a CMS should be sanitized before rendering on the client to prevent XSS.
**Prevention:** Always use `clientSanitize` (from `@/lib/client-sanitize`) when using `dangerouslySetInnerHTML` in client components.
## 2024-03-20 - Unrestricted SSRF via AI URL Fetcher
**Vulnerability:** The Genkit flow `generateNewsContent` allows fetching the contents of any arbitrary URL without checking if it resolves to a private or local IP address, leading to a Server-Side Request Forgery (SSRF) vulnerability. This could allow internal network mapping or reading sensitive metadata.
**Learning:** Tools used by AI flows, especially those accepting raw URLs to fetch content, must have strict network boundary protections to prevent SSRF just like any traditional proxy or webhook endpoint.
**Prevention:** Implement strict IP boundary checks and protocol validation using the `URL` API. Use boundary-matched regular expressions (e.g., `/^10\.\d+\.\d+\.\d+$/`) instead of prefix matching to accurately identify private ranges without accidentally blocking legitimate subdomains.

## 2026-05-23 - DNS Rebinding SSRF via Native Fetch
**Vulnerability:** Even when resolving a hostname to an IP address to check if it's private, calling native `fetch()` subsequently performs another DNS resolution, leaving the application vulnerable to DNS rebinding SSRF attacks. Also, swapping the hostname in the URL for the validated IP breaks SNI validation for HTTPS requests.
**Learning:** Native `fetch` cannot securely pin an IP address without breaking TLS SNI validation. Native Node.js HTTP/HTTPS modules offer a `lookup` override to bypass DNS resolution securely.
**Prevention:** Replace native `fetch()` with `http.request` or `https.request` and provide a custom `lookup` function that directly returns the previously validated IP address, ensuring protection against DNS rebinding while preserving SNI.
