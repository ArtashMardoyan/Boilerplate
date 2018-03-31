'use strict';

import * as _ from 'underscore';

import Response from '../framework/rest/Response';

export default (req: any, res: any, next: any) => {
    if (_.has(req.query, 'limit')) {
        req.query.limit = parseInt(req.query.limit, 10) || 5;

        if (req.query.limit && req.query.limit <= 5) {
            req.query.limit = 5;
        }
    }

    if (_.has(req.query, 'offset')) {
        req.query.offset = parseInt(req.query.offset, 10) || 0;
    } else {
        req.query.offset = (req.query.page - 1) * req.query.limit;
    }

    res.pageable = (count) => {
        return Response.pageable(req, res, count);
    };

    next();
};
