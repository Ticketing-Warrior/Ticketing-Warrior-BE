import { CustomError } from '../errors.js';

export function errorHandler(err, req, res, next) {
  const statusCode = (err instanceof CustomError && err.statusCode) || 500;
  const message = err.message || '서버 에러';

  console.error(`[Error] ${req.method} ${req.url} - ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
}