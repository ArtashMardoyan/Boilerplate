'use strict';

import * as _ from 'underscore';

import Response from '../framework/rest/Response';
import Lessons from '../models/Lessons';

class LessonController {

    public actionIndex(req: any, res: any): object {
        return Lessons.find({})
            .then((data) => {
                return Response.ok(res, data, null);
            })
            .catch(() => {
                return Response.internalServer(res);
            });
    }

    public actionCreate(req: any, res: any): object {
        const result = _.pick(req.body, 'title', 'overview', 'approach', 'checklist');

        return Lessons.create(result)
            .then((data) => {
                return res.send(data);
            })
            .catch((err) => {
                return res.send(err);
            });

    }

    public actionUpdate(req: any, res: any): object {
        const {id} = req.params;

        return Lessons.findById(id)
            .then((lesson) => {
                if (_.isEmpty(lesson)) {
                    return res.send({status: 404, message: 'not found'});
                }

                const result = _.pick(req.body,
                    'title', 'overview', 'approach', 'checklist');

                _.assign(lesson, result);

                lesson.save()
                    .then((data) => {
                        return res.send(data);
                    })
                    .catch((err) => {
                        return res.send(err);
                    });
            })
            .catch((err) => {
                return res.send(err);
            });
    }

    public actionDelete(req: any, res: any): object {
        const {id} = req.params;

        return Lessons.findById(id)
            .then((lesson) => {
                if (_.isEmpty(lesson)) {
                    return res.send({status: 404, message: 'not found'});
                }

                lesson.remove()
                    .then((data) => {
                        return res.send(data);
                    })
                    .catch((err) => {
                        return res.send(err);
                    });
            })
            .catch((err) => {
                return res.send(err);
            });
    }
}

export default new LessonController();
