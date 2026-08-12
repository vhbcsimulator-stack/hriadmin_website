# Vendored copy of `shared/content`

These files are a committed copy of the repo root's `shared/content/`, which the
public site also consumes. The admin app deploys as a standalone folder, so it
cannot import across the repo root — it reads this copy instead.

**Edit `shared/content/` at the repo root, not these files.** Then run:

```
npm run sync:shared
```

which overwrites this directory from upstream and warns about files that no
longer exist there. Edits made directly here are silently discarded by the next
sync.

The modules import their data source through the `@content-backend` specifier,
aliased in `admin/vite.config.js` to `src/lib/contentStore.js` (read/write). The
public site aliases the same specifier to its own read-only store.
