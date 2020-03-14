'use strict';

import * as _ from 'underscore';
import {Response} from 'express';

import * as HttpStatus from './../http/enums/HttpStatus';

class MagicResponse {

    public send(res: Response, httpStatus: any, data: any, message: any): any {
        return res.status(httpStatus.code)
            .json(_.pick({
                status: httpStatus.code,
                name: httpStatus.name,
                message,
                data
            }, (value) => _.isNumber(value) || !_.isNull(value)));
    }

    public ok(res: Response, data: any, message: string = null): any {
        return this.send(res, HttpStatus.OK, data, message);
    }

    public created(res: Response, data: any, message: string = null): any {
        return this.send(res, HttpStatus.CREATED, data, message);
    }

    public accepted(res: Response, data: any, message: string = null): any {
        return this.send(res, HttpStatus.ACCEPTED, data, message);
    }

    public noContent(res: Response, message: string = null): any {
        return this.send(res, HttpStatus.NO_CONTENT, null, message);
    }

    public unauthorized(res: Response, data: any, message: string = null): any {
        return this.send(res, HttpStatus.UNAUTHORIZED, data, message);
    }

    public forbidden(res: Response, message: string = null): any {
        return this.send(res, HttpStatus.FORBIDDEN, null, message);
    }

    public badRequest(res: Response, message: string = null): any {
        return this.send(res, HttpStatus.BAD_REQUEST, null, message);
    }

    public notFound(res: Response, message: string = null): any {
        return this.send(res, HttpStatus.NOT_FOUND, null, message);
    }

    public unprocessableEntity(res: Response, error: any, message: string = null): any {
        if (error instanceof Error && error.hasOwnProperty('name') &&
            error.name === 'ValidationError') {
            const errors = [];

            try {
                const data: any = {
                    error
                };

                if (error.hasOwnProperty('errors')) {
                    for (const field in data.error.errors) {
                        if (data.error.errors.hasOwnProperty(field)) {
                            const err = data.error.errors[field];
                            const message = err.kind === 'user defined' ? err.message : err.kind;

                            errors.push(_.pick({
                                field: err.path,
                                message: `err ${message.toLowerCase()}`,
                                alert: `err ${err.path}.${message.toLowerCase()}`,
                                value: _.isArray(err.value) ? null : err.value
                            }, (value) => !_.isEmpty(value)));
                        }
                    }
                }
            } catch (ex) {
                return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
            }

            return this.send(res, HttpStatus.UNPROCESSABLE_ENTITY, {
                error: _.isEmpty(errors) ? error : errors
            }, message || 'Validation failed');
        }

        return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
    }

    public internalServer(res: any, message: string = null): object {
        return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
    }
}

export default new MagicResponse();
