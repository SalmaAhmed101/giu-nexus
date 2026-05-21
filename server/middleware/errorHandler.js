const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: msgs.join(', ')
    });
  }

  if (err.code === 11000) { // duplicate key
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate: ${field}`
    });
  }

  if (err.name === 'CastError') { // invalid ObjectId
    return res.status(404).json({
      success: false,
      message: `Resource not found with id: ${err.value}`,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message
  });
};

module.exports = errorHandler;