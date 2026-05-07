## 2024-05-07 - SSRF vulnerability in url fetch
**Vulnerability:** Native fetch() used with untrusted URL input allows SSRF and DNS rebinding attacks. The codebase checks for private IPs, but using fetch() allows an attacker to bypass it with DNS rebinding since fetch() resolves the IP again.
**Learning:** Checking the IP before using fetch() is useless against DNS rebinding.
**Prevention:** To prevent SSRF correctly, one must use http/https modules and provide a custom lookup function resolving to the pre-validated IP address, or use a battle-tested library.
