## 2024-05-24 - Unsanitized input used in dangerouslySetInnerHTML
**Vulnerability:** Several components render raw HTML user input without sanitization using `dangerouslySetInnerHTML`. Specifically, `article.content`, `item.content`, `proposal.content` and `item.embedCode` are rendered as is, opening up Cross-Site Scripting (XSS) attacks.
**Learning:** In Next.js applications, `dangerouslySetInnerHTML` is commonly used to render rich text. However, when the content is from an untrusted source or user input, it poses a significant XSS risk if not sanitized properly on the client and server.
**Prevention:** Always sanitize HTML input using a library like `dompurify` (or `isomorphic-dompurify` for SSR/Server Components) before passing it to `dangerouslySetInnerHTML`. Ensure that both client-side sanitization and server-side validation/sanitization are implemented as defense-in-depth measures. Whitelist necessary tags like `iframe` for video embeds securely.
## 2024-03-18 - [Fix Missing HTML Sanitization]
**Vulnerability:** Found `dangerouslySetInnerHTML` being used without `clientSanitize` in `src/components/Banner.tsx` and `src/components/NewsCard.tsx`.
**Learning:** Even internal content from a CMS should be sanitized before rendering on the client to prevent XSS.
**Prevention:** Always use `clientSanitize` (from `@/lib/client-sanitize`) when using `dangerouslySetInnerHTML` in client components.
## 2026-03-19 - Prevent Server-Side Request Forgery (SSRF) in AI Flows
**Vulnerability:** AI tools that fetch content from user-provided URLs (like `fetchAndParseUrl` in Genkit flows) could be exploited to make requests to internal network services, private IP ranges, or localhost (SSRF).
**Learning:** When building tools that use `fetch` with external inputs, it's critical to parse the URL and validate the hostname. Simply accepting any valid URL allows attackers to scan internal infrastructure or interact with internal APIs.
**Prevention:** Always parse user-provided URLs using `new URL(url)` and validate the `hostname`. explicitly block `localhost`, loopback addresses (e.g., `127.0.0.1`, `[::1]`), private IP ranges (e.g., `10.x.x.x`, `192.168.x.x`), and internal TLDs (`.local`, `.internal`) before making the request.
