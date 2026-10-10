# Automatic recipe saving

The browser sends POST /recipes to this server. The server validates the author session and saves a JSON file to Karoda1995/vkusno-doma, branch main, folder data/recipes. GitHub Pages then publishes the updated shared catalog. Existing recipes and Safari data remain intact.

A recipe is reported as saved only after GitHub confirms its creation. Failed requests leave the form intact. Repeating the same submission reuses its recipe ID and checks the existing file; it never overwrites another recipe or makes a duplicate commit.

## Cloudflare Workers deployment

Deploy worker.mjs with wrangler.jsonc. Configure these encrypted server secrets in the Workers dashboard:

- GITHUB_TOKEN: fine-grained GitHub token for only Karoda1995/vkusno-doma, with Contents: Read and write. No other repository or workflow permission is needed.
- AUTHOR_PASSWORD: a unique generated author password, at least 20 characters. The password is entered in the recipe site's author login, never published in source.
- AUTH_SECRET (optional): a separate random signing secret, at least 32 characters. If omitted, signing uses a server-only key derived from GITHUB_TOKEN. Neither key reaches the browser.

The public variables already restrict the repository, branch and browser origin. After deployment, set apiBase in ../site-config.js to the Worker HTTPS URL, then publish the frontend. Do not deploy the changed frontend with an empty apiBase: this deliberately prevents reporting local-only creation as a successful shared save.

An author session lasts up to 24 hours and is held in browser session storage. GitHub credentials remain server-side. Visitors can browse recipes without signing in. Creating recipes requires author login; repeated recipe submissions within a valid session need only the Save button.

For Vercel, use recipe-api.mjs through an HTTP adapter with the same environment variables. The deployment adapter has not been configured yet.

## Checks

node --test backend/recipe-api.test.mjs

Tests use a simulated GitHub provider and confirm authorization, rejection of other origins and malformed recipes, fixed repository paths, retry idempotency, and preservation of existing files. A real hosted save must additionally be verified after the server account and secrets are connected.

Documentation:
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents
