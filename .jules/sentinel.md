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

## 2024-05-18 - Stored XSS via Unrestricted iframe Sources
**Vulnerability:** The client and server DOMPurify sanitizers allowed `iframe` tags and their `src` attributes without validating the URL domain. This allowed an attacker to inject `javascript:` URIs or iframes pointing to malicious websites (Stored XSS).
**Learning:** Adding `ADD_TAGS: ['iframe']` and `ADD_ATTR: ['src']` to DOMPurify options broadly trusts all `src` inputs. Iframes must be strictly whitelisted to specific trusted domains to prevent arbitrary script execution or content spoofing.
**Prevention:** Always use a DOMPurify `uponSanitizeElement` hook when allowing complex tags like `iframe` to validate the source domain strictly using `new URL(src).hostname` and exact suffix matching (e.g. `hostname.endsWith('.youtube.com')`).
