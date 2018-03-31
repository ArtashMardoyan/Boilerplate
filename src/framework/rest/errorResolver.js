'use strict';

const _ = require('underscore');

const HttpStatus = require('./../http/enums/HttpStatus');
const config = require('./../../config');

export default (err, req, res, next) => { // eslint-disable-line
    // console.log(err);
    let statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR.code;
    let statusName = err.statusName || HttpStatus.INTERNAL_SERVER_ERROR.name;

    let response = {
        code: statusCode,
        name: statusName,
        message: err.name === 'HttpException' ? err.message : null
    };

    if (config.get('NODE_ENV') === 'development') {
        response.trace = _.omit(err, ['name', 'message', 'statusCode', 'statusName']);
        response.trace = _.pick(response.trace, value => !_.isEmpty(value));
    }

    return res.status(statusCode).json(
        _.pick(response, value => _.isNumber(value) || !_.isEmpty(value))
    );
};
