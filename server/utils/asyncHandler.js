const asyncHandler = (requestHandlerfn) => {
  return (req, res, next) => {
    Promise.resolve(requestHandlerfn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

export { asyncHandler };
