# TODO

- [ ] Gather context: inspect existing clock page implementation (done)
- [ ] Draft edit plan: replace YouTube iframe background with SkylineWebcams Trevi Fountain embed (done - draft plan below)
- [ ] After approval, update src/pages/2026/26-06/26-06-09/Clock.tsx to:
  - remove YouTube Iframe API loading/player init
  - add iframe to SkylineWebcams Trevi Fountain page
  - keep autoplay/muted-like behavior via iframe params where available
  - keep existing overlay clock UI
- [x] Run lint/build/tests (if available) (build: pass; tests: currently failing unrelated to this change)



