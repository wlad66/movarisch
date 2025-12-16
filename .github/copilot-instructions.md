Purpose: Give AI agents immediate context and actionable patterns when working in the MoVaRisCh repo.

High level architecture
- **Frontend**: Vite + React (root `package.json`) - built with `npm run build` to produce `dist/` served by the backend. Dev server: `npm run dev`.
- **Backend**: Node.js + Express (server folder). Uses CommonJS requires, `server/server.js` is the entry. Backend uses `pg` and Postgres in production; `server/config/database.js` initialises schema on startup.
- **Data**: PPE database JSON at `src/data/ppe_database.json` generated from CSVs using scripts in the repo (`generate_database.cjs`, `import_ppe*.js`, `create_new_database.cjs`).

Important locations
- API entry: `server/server.js` (routes, middleware, SPA fallback). Also check `server/config/database.js` for DB initialization.
- Models: `server/models/*.js` — each exposes create/read/update/delete functions using `pool.query()` (parameterized queries).
- Controllers: `server/controllers/*.js` — validate input, call model methods, use `req.user` (JWT) for scoping.
- Middleware: `server/middleware/auth.js` — `verifyToken` middleware; `JWT_SECRET` matters for tests and running.
- Frontend: `src/components` (risk matrices, PPE optimizer, PPEDatabaseManager); `src/data` for static datasets like `hCodes.js` and PPE DB.

Dev and debug workflows
- Run frontend dev: `npm run dev` (root). It proxies `/api` to `http://localhost:3000` via `vite.config.js`.
- Run backend dev: `cd server && npm run dev` (uses `nodemon`). For production: `cd server && npm start`.
- Build frontend: `npm run build` (root), which writes `dist/` that is served by the backend at `/assets` and `dist/index.html` as SPA fallback.
- Docker: `docker-compose.yml` for local; `docker-compose.vps.yml` for VPS production. Use `docker-compose -f docker-compose.vps.yml up -d --build` to deploy.
- Postgres: either external or Docker; local quickstart in README uses Postgres container for dev. `server/.env` (copy from `server/.env.example`) contains DB/JWT config.

Data import and PPE DB
- PPE DB lives at `src/data/ppe_database.json`. Regenerate with scripts:
  - `node generate_database.cjs` — reads block CSVs and outputs updated database JSON.
  - `node import_ppe_v2.js` / `node import_ppe.js` — convert CSV -> JSON (different input formats and dedup rules).
  - `node create_new_database.cjs` — rebuilds from `block*.csv` files. Keep backups — these scripts create a backup before overwriting.

Key conventions & patterns for contributors/agents
- `server` code uses CommonJS (`require/module.exports`); root scripts use ESM (`import/export`). Keep this when adding files; match `package.json` `type` (root uses `module`).
- DB code uses `pg` pool and parameterized SQL with `$1, $2` placeholders. Avoid raw SQL string interpolation; prefer `pool.query(sql, [params])`.
- Models are thin wrappers around SQL — put business logic into controllers / service functions; keep models focused on DB mapping (column name -> camelCase mapping).
- Controllers must validate presence of `req.user` (set by `verifyToken`) before reading `user_id` scope.
- SPA fallback: server serves `dist/index.html` on `GET *` and aggressively disables caching in production. Don't change this without considering cache headers.

Requests to avoid/common gotchas
- When editing DB schema or seed scripts, note `server/config/database.js` runs `initDb()` on server start. Avoid destructive DDL changes without migrations.
- Watch the module type mismatch (ES module vs CommonJS) — adding `import` into `server/` may require switching package type.
- PPE importer scripts assume CSV shapes; inspect `import_ppe_v2.js` for how it dedupes by CAS+Percentage.

Testing and validation (what agents should do)
- Manual test: start backend (`server/npm start`) and frontend (`npm run dev`) and check endpoints via `curl` or browser devtools. Example: `curl http://localhost:3000/api/workplaces -H 'Authorization: Bearer <token>'`.
- For data updates, re-run `node generate_database.cjs` and visually confirm `src/data/ppe_database.json` changed; run frontend build or reload dev server.
- For JWT/authorization tests, use `server/middleware/auth.js` logs and ensure `JWT_SECRET` environment variable is set.

PR and review guidance (how to be helpful)
- Make small, focused PRs. Keep `server` and `frontend` changes separate where possible.
- Update README snippets and `server/.env.example` if you add config env vars.
- When changing DB tables, add a short note in `CHANGELOG.md` and adjust `server/config/database.js` accordingly.

References for human reviewers
- `server/server.js` — main API entry and caching policy
- `server/config/database.js` — schema initializer (look here for table shape)
- `src/data/ppe_database.json` — canonical PPE reference
- `generate_database.cjs`, `import_ppe_v2.js`, `create_new_database.cjs` — import/generator scripts
- `src/components/RiskMatrices.jsx` and `src/components/PPEOptimizer.jsx` — UI and algorithm points of interest

If anything in this file is ambiguous, ask for sample run output or which script the developer uses (e.g., `import_ppe_v2.js` vs `create_new_database.cjs`).
