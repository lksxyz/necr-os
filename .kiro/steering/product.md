---
inclusion: always
---

# Product

NecrOS is a catalog of old operating systems that boot in a browser tab. Each machine runs in v86, an x86 emulator compiled to WebAssembly.

- Pages: `/` (featured machine and timeline), `/os` (catalog), `/os/:slug` (machine page), `/about`.
- The machine page fills exactly 100vw by 100dvh with no page scroll. This is a fixed owner requirement.
- Every value shown about a machine comes from `apps/web/src/lib/os.ts`. Never invent years, makers, licenses, sizes, or statistics.
- All UI copy and docs are in English.
