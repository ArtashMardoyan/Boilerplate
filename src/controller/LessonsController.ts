'use strict';

import * as _ from 'underscore';
import {Request, Response} from 'express';

import MagicResponse from '../framework/rest/magicResponse';
import Lessons from './../models/Lessons';

class LessonController {

    public actionIndex(req: Request, res: Response): any {
        try {
            Lessons.paginate({}, {
                page: req.query.page,
                limit: req.query.limit

            })
                .then((lessons) => MagicResponse.ok(res, lessons))
                .catch(() => MagicResponse.internalServer(res));
        } catch (ex) {
            return MagicResponse.internalServer(res);
        }
    }

    public actionCreate(req: Request, res: Response): any {
        try {
            const result = _.pick(req.body, 'title', 'overview', 'approach', 'checklist');

            return Lessons.create(result)
                .then((data) => MagicResponse.created(res, data))
                .catch((err) => MagicResponse.unprocessableEntity(res, err));
        } catch (ex) {
            return MagicResponse.internalServer(res);
        }
    }

    public actionUpdate(req: Request, res: Response): any {
        try {
            return Lessons.findById(req.params.id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return MagicResponse.notFound(res);
                    }

                    const result = _.pick(req.body,
                        'title', 'overview', 'approach', 'checklist');

                    _.assign(lesson, result);

                    return lesson.save()
                        .then((data) => MagicResponse.ok(res, data));
                })
                .catch(() => MagicResponse.internalServer(res));
        } catch (ex) {
            return MagicResponse.internalServer(res);
        }
    }

    public actionDelete(req: Request, res: Response): any {
        try {
            return Lessons.findById(req.params.id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return MagicResponse.notFound(res);
                    }

                    return lesson.remove()
                        .then(() => MagicResponse.noContent(res));
                })
                .catch(() => MagicResponse.internalServer(res));
        } catch (ex) {
            return MagicResponse.internalServer(res);
        }
    }
}

export default new LessonController();
