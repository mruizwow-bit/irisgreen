# N04 live rollback test · prepared, not executed

## Safety preconditions
- explicit María/Astra authorization for private staging deploy;
- target Site ID exactly `47b06e68-ff54-4097-8ad8-336b2d71758a`;
- no `--prod`;
- `SABIK_AI_ENABLED` remains absent/false;
- smoke token supplied only through Netlify secret env / runner env and never printed;
- a previous **N04-capable** staging deploy ID/permalink is recorded as last-known-good.

## Candidate proof
1. deploy candidate privately using the exact locked toolchain;
2. record deploy ID, Function digest, corpus version/hash;
3. run `npm run smoke:live` against the immutable candidate deploy URL;
4. require mapping/read-back/hash/count/IDs/citation PASS.

## Rollback proof
The accepted strategy is deploy rollback for deploy-specific corpus. Do not use the site-wide restore endpoint if it would publish/alter production.

For the first live N04 exercise, rollback acceptance requires a previously recorded N04-capable staging deploy. The operator must:
1. return inference to fail-closed;
2. switch the **staging lane only** to the last-known-good N04 deploy using the Netlify mechanism approved for that lane;
3. run the same live smoke against the restored staging URL;
4. require previous corpus version/hash/count/IDs/citation PASS;
5. confirm production/DNS unchanged.

If the staging-only restore mechanism cannot be proven without affecting production: STOP. That is a blocker, not permission to call the production restore API.

R26 does not execute these steps.
