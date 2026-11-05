# Saad PS2 Ultimate — Real Test Lab

**Standalone Windows test application** for validating PS2/PS1 game-library workflows, OPL artwork, USB storage operations, catalog integrity, and emulator integration.

This repository is the dedicated home for the independent Test Lab. It is separate from the Saad PS2 website and its other application repositories. It does not embed into or modify those projects.

## Initial project scope

- Windows desktop application built with Electron.
- Real, evidence-based test results: PASS, FAIL, BLOCKED, and NOT_RUN.
- Safe USB folder write/read/compare/cleanup test using a temporary file only.
- Game library inventory and basic file/serial checks.
- OPL ART filename validation.
- Read-only inspection of a user-selected project folder.
- Emulator executable detection. Launch/ROM execution will require a later explicit, user-controlled integration step.
- JSON test report export.
- Windows CI build and automated unit tests.

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

The initial scaffold only checks the selected emulator executable's presence and metadata. It does not yet launch PCSX2/DuckStation or load a game. That behavior will be implemented only with explicit user selection of an emulator and user-owned game image, with logs and exit status captured. No success is inferred from file existence.

A successful software test run does not certify USB hardware, the physical PS2 console, OPL compatibility, or a particular game. Those require separate manual hardware QA.
