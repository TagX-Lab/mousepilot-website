# 🛡️ MousePilot Security & Threat Defense Policy

> **TAGX Labs™ Cyber Defense Standards**  
> We take software security, binary integrity, and client safety with utmost seriousness. This document outlines our threat model, defensive design, integrity verification, and responsible disclosure protocols.

---

## 1. Supported Versions

We provide active security patches and updates for the following versions:

| Version | Supported | Status | Security Posture |
| :--- | :---: | :--- | :--- |
| `1.0.x` | ✅ | **Current Stable** | Cryptographically signed, SHA-256 verified |
| `< 1.0.0` | ❌ | Deprecated / Beta | Unsupported |

---

## 2. Core Security & Threat Model

MousePilot is engineered according to a strict **Zero-Trust, Zero-Click** architecture:

1. **100% Zero Synthetic Clicks Guarantee**:
   - The application *never* dispatches mouse clicks (`mouse_event`, `SendInput` with `MOUSEEVENTF_LEFTDOWN`, etc.) or keyboard presses.
   - It executes pure coordinate translation via Win32 `SetCursorPos`.
   - **Defense Rationale**: Completely eliminates the threat of phantom clicks triggering unauthorized actions, malicious UI overlay interaction, or unintentional file operations.

2. **Air-Gapped Local-Only Execution**:
   - Zero network transmission, zero analytics pings, zero telemetry beacons, and zero outbound network sockets.
   - All runtime configurations and session logs reside strictly on local machine storage (`%LOCALAPPDATA%\MousePilot`).

3. **Instant Human Takeover Yield**:
   - High-frequency hardware sampling detects physical mouse movement immediately.
   - If manual user velocity exceeds the kinematic threshold, autopilot instantly surrenders control for 3.0 seconds, preventing cursor hijacking or contention.

4. **Kernel Power Lock without Admin Privileges**:
   - Display and system idle lockouts are managed via Win32 `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED)`.
   - No UAC privilege escalation or elevated system drivers are required, preserving standard user-mode isolation.

---

## 3. Cryptographic Verification & Anti-Tamper Protocol

To protect users against supply chain tampering, unauthorized mirrors, and malicious injection, every official release binary is published with an authoritative SHA-256 checksum:

| Artifact | Version | SHA-256 Checksum |
| :--- | :--- | :--- |
| `MousePilot-Setup-v1.0.0.exe` | `1.0.0` | `b97a07fe9004999addf53edef3515fdc8b27c5533dc9578982b1f7c2b410daec` |
| `MousePilot-v1.0.0-Portable.zip` | `1.0.0` | `7f9e14124f94ba4bc997f5c4dc1984cbd160d60fa414701879cf5c6b6ef68f4a` |

### How to Verify Locally:

#### Windows PowerShell:
```powershell
Get-FileHash -Path "MousePilot-Setup-v1.0.0.exe" -Algorithm SHA256
```

#### Linux / macOS Terminal:
```bash
sha256sum MousePilot-Setup-v1.0.0.exe
```

#### On the Live Website:
Visitors can also use the integrated **Web Crypto API Hash Verifier** on our [live download page](https://tagx-lab.github.io/mousepilot-website/#releases) to compute and compare the SHA-256 checksum in-browser with zero upload.

---

## 4. Website Hardening & Client-Side Defenses

Our web portal incorporates multi-layered defense-in-depth:
- **Strict Content Security Policy (CSP)**: Restricts script, style, and font execution to authorized sources.
- **Anti-Clickjacking**: `X-Frame-Options: DENY`, `frame-ancestors: 'none'`, and active client-side JavaScript Framebuster breaks unauthorized iframe embeds.
- **MIME Sniffing Prevention**: `X-Content-Type-Options: nosniff`.
- **Referrer Privacy**: `Referrer-Policy: strict-origin-when-cross-origin`.
- **Permissions Lockdown**: Hardware APIs (camera, microphone, geolocation, USB, Bluetooth) explicitly disabled via `Permissions-Policy`.
- **Anti-Reverse Tabnabbing**: All external hyperlinks enforce `rel="noopener noreferrer"`.
- **Self-XSS Console Shield**: In-browser devtools warning alerts users against social engineering attacks.

---

## 5. Reporting a Security Vulnerability

If you discover a security vulnerability in MousePilot or our web infrastructure, please follow our **Responsible Disclosure Policy**:

1. **Email Contact**: Send a detailed report directly to:  
   📧 **[enbaraj.roovechander@karanodaka.com](mailto:enbaraj.roovechander@karanodaka.com)** (or `security@tagx-labs.com`)
2. **Report Information**:
   - Summary of the vulnerability and attack vector
   - Step-by-step reproduction steps or Proof-of-Concept (PoC)
   - Affected version(s) and operating system environment
   - Potential impact assessment
3. **Response Timelines**:
   - Initial Acknowledgement: **Within 24 hours**
   - Severity Assessment & Triage: **Within 48 hours**
   - Patch Deployment & Advisory: Prioritized based on CVSS score

> **Please Note**: Please do NOT report security vulnerabilities via public GitHub issues. Always contact our security team privately first to give us time to investigate and resolve the issue before public disclosure.

---

## 6. Hall of Fame & Acknowledgments

We express our gratitude to white-hat security researchers who responsibly report vulnerabilities in accordance with this policy. Confirmed disclosures will be publicly credited in this repository's security advisory records.
