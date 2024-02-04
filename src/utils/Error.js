export class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

export const handleError = (res, err) => {
  if (err instanceof CustomError) {
    const { status, message } = err;
    return res.status(status).json({ message, data: {}, status });
  }
  return res.status(500).json({ message: err.message, data: {}, status: 500 });
};


