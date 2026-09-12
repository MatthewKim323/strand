# Detected stack

- framework: framer
- built with Framer: yes
- framer-motion runtime: yes
- Webflow: yes
- Lenis: yes
- GSAP: no
- three.js: yes
- Spline: no

## Notes
- Built with Framer: appear ids, data-framer-name, framerusercontent modules. Use `1to1 prep` + `1to1 rip`.
- Lenis smooth scroll present: window.scrollTo may be overridden, rigs fall back to wheel events.
- 5 canvas element(s): WebGL / 2D drawing to port (find the module that draws it).
