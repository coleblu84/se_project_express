module.exports = (err, req, res, next) => {
  console.error(err); // log full error

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An internal server error has occurred" : message,
  });
};
