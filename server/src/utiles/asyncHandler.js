/**
 * asyncHandler - wraps async route handlers.
 * In Express 5, async errors are caught natively, so this is a lightweight
 * pass-through kept for backward compatibility and explicit intent.
 */
const asyncHandler = (fn) => fn;

export default asyncHandler;
