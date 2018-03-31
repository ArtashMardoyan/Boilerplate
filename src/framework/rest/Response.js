'use strict';

const _ = require('underscore');

const ValidationMessages = require('./../../enums/ValidationMessages');
const HttpStatus = require('./../http/enums/HttpStatus');
const Constants = require('./../../enums/Constants');

export default class Response {

    static send(res, httpStatus, data, message) {
        return res.status(httpStatus.code)
            .json(_.pick({
                status: httpStatus.code,
                name: httpStatus.name,
                message,
                data
            }, value => _.isNumber(value) || !_.isNull(value)));
    }

    static ok(res, data, message) {
        return this.send(res, HttpStatus.OK, data, message);
    }

    static created(res, data, message) {
        return this.send(res, HttpStatus.CREATED, data, message);
    }

    static accepted(res, data, message) {
        return this.send(res, HttpStatus.ACCEPTED, data, message);
    }

    static noContent(res, message) {
        return this.send(res, HttpStatus.NO_CONTENT, null, message);
    }

    static unauthorized(res, data, message) {
        return this.send(res, HttpStatus.UNAUTHORIZED, data, message);
    }

    static forbidden(res, message) {
        return this.send(res, HttpStatus.FORBIDDEN, null, message);
    }

    static badRequest(res, message) {
        return this.send(res, HttpStatus.BAD_REQUEST, null, message);
    }

    static notFound(res, message) {
        return this.send(res, HttpStatus.NOT_FOUND, null, message);
    }

    static unprocessableEntity(res, error, message) {
        if (error.hasOwnProperty('name') && ((error.name === Constants.SEQUELIZE_VALIDATION_ERROR.valueOf()) || (error.name === Constants.SEQUELIZE_UNIQUE_VALIDATION_ERROR.valueOf()))) {
            let errors = [];

            error.errors.forEach(function (error) {
                if (error.type === 'notNull Violation') {
                    error.message = ValidationMessages.notEmpty;
                } else if (error.type === 'unique violation') {
                    error.message = ValidationMessages.exist;
                }

                errors.push(_.omit(error, 'type', '__raw'));
            });

            return this.send(res, HttpStatus.UNPROCESSABLE_ENTITY, {
                errors: errors
            }, message || 'Validation  failed');
        }

        return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
    }

    static internalServer(res, message) {
        console.log(HttpStatus.INTERNAL_SERVER_ERROR);
        return this.send(res, HttpStatus.INTERNAL_SERVER_ERROR, null, message);
    }

    static pageable(req, res, count) {
        let _meta = {
            totalCount: count || 0,
            currentPage: req.query.page || 0,
            pageCount: Math.ceil(count / req.query.limit) || 0,
            perPage: req.query.limit || 0
        };

        console.info(Math.ceil(count / req.query.limit) || 0);

        res.setHeader('X-Pagination-Per-Page', _meta.perPage);
        res.setHeader('X-Pagination-Current-Page', _meta.currentPage);
        res.setHeader('X-Pagination-Total-Count', _meta.totalCount);
        res.setHeader('X-Pagination-Page-Count', _meta.pageCount);

        return _meta;
    }
}
