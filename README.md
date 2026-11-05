# Saad PS2 Ultimate — Real Test Lab

**Standalone Windows test application** for validating PS2/PS1 game-library workflows, OPL artwork, USB storage operations, catalog integrity, and emulator integration.

This repository is the dedicated home for the independent Test Lab. It is separate from the Saad PS2 website and its other application repositories. It does not embed into or modify those projects.


## Safety guarantees

1. Never format or repartition storage.
2. Never erase, rename, move, or overwrite game files.
3. Temporary storage probes use a unique filename, verify bytes after read-back, then attempt cleanup.
4. No game images are downloaded by the Test Lab.
5. A test is PASS only if it actually ran and its assertions passed.
6. Missing prerequisites are BLOCKED, not PASS.
7. The default workspace should be a disposable test folder. Testing a real USB is an explicit user action.

## Planned architecture

```text
Saadapk-PS2/
├── electron/
│   ├── main.cjs
│   └── preload.cjs
├── src/
│   ├── main/
│   │   ├── runner.cjs
│   │   ├── checks/
│   │   └── reports/
│   ├── renderer/
│   └── shared/
├── tests/
├── scripts/
└── .github/workflows/
```

## Development

Requires Node.js 22 LTS or compatible.

```bash
npm ci
npm run lint
npm test
npm start
```

Build the Windows installer:

```bash
npm run dist:win
```

The installer is unsigned unless an Authenticode certificate is configured securely in CI. Never commit signing certificates or passwords.

## Emulator integration status

The Windows desktop app can launch PCSX2 after the user explicitly selects the local PCSX2 executable and a local ISO/CHD/ZSO/CSO file they own. The lab captures process output, exit code, and a local log path. A process launch is not proof of full game compatibility or correct rendering.

A successful software test run does not certify USB hardware, the physical PS2 console, OPL compatibility, or a particular game. Those require separate manual hardware QA.
