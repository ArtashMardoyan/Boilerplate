'use strict';

import LessonsController from '../../../controller/LessonsController';

module.exports.autoroute = {
    get: {
        '/': [
            LessonsController.actionIndex
        ]
    },
    post: {
        '/': [
            LessonsController.actionCreate
        ]
    },
    put: {
        '/:id': [
            LessonsController.actionUpdate
        ]
    },
    delete: {
        '/:id': [
            LessonsController.actionDelete
        ]
    }
};
