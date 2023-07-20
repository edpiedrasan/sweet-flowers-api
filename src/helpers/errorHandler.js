import httpStatus from 'http-status';

// hanlde not found error
export const handleNotFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND);
  res.json({
    status: httpStatus.NOT_FOUND,
    success: false,
    payload: {
      message: 'Requested resource not found'
    }
  });
  res.end();
};

// handle errors
export const handleError = (err, req, res) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    success: false,
    payload: {
      message: err.message,
      extra: err.extra,
      errors: err
    }
  });
  res.end();
};