const { NODE_ENV } = process.env;

// override default express error handler, needs err as first param
const errorHandler = (err, req, res, next) => {
    // check if res has a status code
    const statusCode = (res.statusCode !== 200) ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        // if production, hide error stack
        stack: (NODE_ENV === 'production') ? null : err.stack
    });
};

export default errorHandler;