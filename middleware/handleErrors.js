const ERROR_HANDLERS = {
  CastError: (res) => res.status(400).send({ error: "ID used is malformed" }),
  ValidationError: (res, error) =>
    res.status(409).send({
      error: error.message,
    }),
  JsonWebTokerError: (res) =>
    res.status(401)({
      error: "Token missing or invalid",
    }),
  TokenExpirerError: (res) => res.status(401).json({ error: "Token expired" }),
  defaultError: (res) => res.status(500).end(),
};

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLERS(error.name) || ERROR_HANDLERS.defaultError;
  handler(response, error);
};
