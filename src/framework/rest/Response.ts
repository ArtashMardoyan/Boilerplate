'use strict';

const _ = require('underscore');

const HttpStatus = require('./../http/enums/HttpStatus');

class Response {

    public send(res: any, httpStatus: any, data: any, message: any): object {
        return res.status(httpStatus.code)
            .json(_.pick({
                status: httpStatus.code,
                name: httpStatus.name,
                message,
                data
            }, (value) => _.isNumber(value) || !_.isNull(value)));
    }

    public ok(res: any, data: any, message: any): object {
        return this.send(res, HttpStatus.OK, data, message);
    }

    public created(res: any, data: any, message: any): object {
        return this.send(res, HttpStatus.CREATED, data, message);
    }

    public accepted(res: any, data: any, message: any): object {
        return this.send(res, HttpStatus.ACCEPTED, data, message);
    }

    public noContent(res: any, message: any): object {
        return this.send(res, HttpStatus.NO_CONTENT, null, message);
    }

    public unauthorized(res: any, data: any, message: any): object {
        return this.send(res, HttpStatus.UNAUTHORIZED, data, message);
    }

    public forbidden(res: any, message: any): object {
        return this.send(res, HttpStatus.FORBIDDEN, null, message);
    }

    public badRequest(res: any, message: any): object {
        return this.send(res, HttpStatus.BAD_REQUEST, null, message);
    }

    public notFound(res: any, message: any): object {
        return this.send(res, HttpStatus.NOT_FOUND, null, message);
    }

    public unprocessableEntity(res: any, error: any, message: any): object {
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

    public internalServer(res: any, message: any) {
        return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
    }

    public pageable(req: any, res: any, count: number) {
        const _meta = {
            totalCount: count || 0,
            currentPage: req.query.page || 0,
            pageCount: Math.ceil(count / req.query.limit) || 0,
            perPage: req.query.limit || 0
        };

        res.setHeader('X-Pagination-Per-Page', _meta.perPage);
        res.setHeader('X-Pagination-Current-Page', _meta.currentPage);
        res.setHeader('X-Pagination-Total-Count', _meta.totalCount);
        res.setHeader('X-Pagination-Page-Count', _meta.pageCount);

        return _meta;
    }
}

export default new Response();
