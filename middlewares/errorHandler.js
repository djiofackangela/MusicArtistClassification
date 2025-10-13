module.exports = (err, _req, res, _next) => {
  console.error("[ERROR]", err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error"
  });
};
