# Monitoring & Error Tracking

## Sentry Integration

We use Sentry for error tracking and performance monitoring in production.

### Configuration
- **DSN**: Defined in `VITE_SENTRY_DSN` env var.
- **Projects**:
  - `javascript-react` (Production)
  - `peptidelog` (Old/Legacy)

### Source Maps
Source maps are automatically uploaded to Sentry during the production build process using `@sentry/vite-plugin`. This allows Sentry to show readable stack traces with original file names and line numbers instead of minified code.

**Required Environment Variables:**
- `SENTRY_AUTH_TOKEN`: A Sentry auth token with `project:releases` and `org:read` scope.
- `VITE_SENTRY_DSN`: The DSN for the Sentry project.

**Build Process:**
1. `vite build` generates source maps.
2. The Sentry plugin uploads them to Sentry.
3. Source maps are deleted from the `dist` folder after upload for security.

### Debugging
To verify source maps are working:
1. Trigger an error in production (e.g., using the hidden debug tool or console).
2. Check Sentry Issues dashboard.
3. The stack trace should show `src/path/to/file.jsx` instead of `assets/index-xyz.js`.
