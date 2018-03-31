'use strict';

import HttpException from './HttpException';
import HttpStatus from '../enums/HttpStatus';

/*
 * NotFoundHttpException represents a "Not Found" HTTP exception with status code 404.
 */
export default class NotFoundHttpException extends HttpException {
    constructor(message) {
        super(HttpStatus.NOT_FOUND['code'], message || "Not found.", errors);
    }
}
