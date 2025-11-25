/**
 * middleware/errorHandler.js
 * -------------------------------------
 * Catches thrown errors and returns clean JSON responses.
 *
 * Should handle:
 *   - internal server errors
 *   - custom error messages
 */

export function errorHandler(err, req, res, next) {
    res.status(500).json({
        message: err.message || "Server Error",
    });
}
