'use strict';

import LessonsController from '../../../controller/LessonsController';

module.exports.autoroute = {
    get: {
        '/': [
            LessonsController.actionIndex
        ],
        '/:lessonId': [
            LessonsController.actionView
        ]
    }
};
