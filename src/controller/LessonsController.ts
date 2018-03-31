'use strict';

import * as _ from 'underscore';

import Response from '../framework/rest/Response';
import Lessons from '../models/Lessons';

class LessonController {

    public actionIndex(req: any, res: any): object {
        try {
            Lessons.count({})
                .then((count) => {
                    return Lessons.find({}, {},
                        {
                            skip: req.query.offset,
                            limit: req.query.limit
                        })
                        .then((lesson) => {
                            return Response.ok(res, {
                                lesson,
                                _meta: res.pageable(count)
                            }, null);
                        });
                })
                .catch(() => Response.internalServer(res, null));
        } catch (ex) {
            return Response.internalServer(res, null);
        }

    }

    public actionCreate(req: any, res: any): object {
        try {
            const result = _.pick(req.body, 'title', 'overview', 'approach', 'checklist');

            return Lessons.create(result)
                .then((data) => {
                    return Response.created(res, data, null);
                })
                .catch((err) => {
                    return Response.unprocessableEntity(res, err, null);
                });
        } catch (ex) {
            return Response.internalServer(res, null);
        }
    }

    public actionUpdate(req: any, res: any): object {
        try {
            const {id} = req.params;

            return Lessons.findById(id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return Response.notFound(res, null);
                    }

                    const result = _.pick(req.body,
                        'title', 'overview', 'approach', 'checklist');

                    _.assign(lesson, result);

                    return lesson.save()
                        .then((data) => {
                            return Response.ok(res, data, null);
                        });
                })
                .catch(() => {
                    return Response.internalServer(res, null);
                });
        } catch (ex) {
            return Response.internalServer(res, null);
        }
    }

    public actionDelete(req: any, res: any): object {
        try {
            const {id} = req.params;

            return Lessons.findById(id)
                .then((lesson) => {
                    if (_.isEmpty(lesson)) {
                        return Response.notFound(res, null);
                    }

                    return lesson.remove()
                        .then(() => {
                            return Response.noContent(res, null);
                        });
                })
                .catch((err) => {
                    return Response.internalServer(res, null);
                });
        } catch (ex) {
            return Response.internalServer(res, null);
        }
    }
}

export default new LessonController();
