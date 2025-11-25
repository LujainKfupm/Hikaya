/**
 * middleware/authMiddleware.js
 * -------------------------------------
 * Middleware to verify JWT tokens.
 *
 * Steps:
 *   - read Authorization header
 *   - extract token
 *   - verify using jwt.verify()
 *   - attach user info to req.user
 *   - call next() if valid
 *   - return 401 if invalid
 */

// TODO: implement auth checks

export const protect = () => {};
