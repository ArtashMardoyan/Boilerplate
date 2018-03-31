'use strict';

import * as _ from 'underscore';

import Response from '../framework/rest/Response';
import Lessons from '../models/Lessons';

class LessonController {

    public actionIndex(req: any, res: any): void {
        try {
            Lessons.count({})
                .then((count) => {
                    return Lessons.find({}, {},
                        {
                            skip: req.query.offset,
                            limit: req.query.limit
                        })
                        .then((data) => {
                            return Response.ok(res, {
                                data,
                                _meta: res.pageable(count)
                            });
                        });
                })
                .catch(() => Response.internalServer(res));
        } catch (ex) {
            return Response.internalServer(res);
        }

    }

    public actionCreate(req: any, res: any): object {
        try {
            const result = _.pick(req.body, 'title', 'overview', 'approach', 'checklist');

            return Lessons.create(result)
                .then((data) => {
                    return Response.created(res, data);
                })
                .catch((err) => {
                    return Response.unprocessableEntity(res, err);
                });
        } catch (ex) {
            return Response.internalServer(res);
        }
    }

    public actionUpdate(req: any, res: any): object {
        try {
            const {id} = req.params;

            return Lessons.findById(id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return Response.notFound(res);
                    }

                    const result = _.pick(req.body,
                        'title', 'overview', 'approach', 'checklist');

                    _.assign(lesson, result);

                    return lesson.save()
                        .then((data) => {
                            return Response.ok(res, data);
                        });
                })
                .catch(() => {
                    return Response.internalServer(res);
                });
        } catch (ex) {
            return Response.internalServer(res);
        }
    }

    public actionDelete(req: any, res: any): object {
        try {
            const {id} = req.params;

            return Lessons.findById(id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return Response.notFound(res);
                    }

                    return lesson.remove()
                        .then(() => {
                            return Response.noContent(res);
                        });
                })
                .catch((err) => {
                    return Response.internalServer(res);
                });
        } catch (ex) {
            return Response.internalServer(res);
        }
    }
}

export default new LessonController();
