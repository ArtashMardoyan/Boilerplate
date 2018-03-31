'use strict';

import _ from 'underscore';
import _String from 'underscore.string';
import HttpStatus from '../enums/HttpStatus';

/*
 * HttpException represents an exception caused by an improper request of the end-user.
 *
 * HttpException can be differentiated via its [[statusCode]] property value which
 * keeps a standard HTTP status code (e.g. 404, 500).
 */
export default class HttpException extends Error {

    name = 'HttpException';
    statusCode;
    statusName;
    message;
    errors = [];

    constructor(httpStatus, message, errors) {
        super(message);

        let statusCode;
        let statusName;

        switch (typeof httpStatus) {
            case 'number':
                httpStatus = HttpStatus.get(httpStatus);
                if (!_.isUndefined(httpStatus)) {
                    statusCode = httpStatus.valueOf();
                    statusName = _String(httpStatus.key).humanize().value(); // eslint-disable-line
                }
                break;
            case 'object':
                statusCode = httpStatus.valueOf();
                statusName = _String(httpStatus.key).humanize().value(); // eslint-disable-line
                break;
            default:
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR.valueOf();
                statusName = _String(HttpStatus.INTERNAL_SERVER_ERROR.key).humanize().value(); // eslint-disable-line
        }

        this.statusCode = statusCode;
        this.statusName = statusName;
        this.message = message;
        this.errors = errors;
    }
}

