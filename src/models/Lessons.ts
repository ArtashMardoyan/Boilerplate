'use strict';

import {Schema, model} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

const lessonsSchema: Schema = new Schema({
        title: {
            type: String,
            required: true
        },
        overview: {
            type: String,
            required: true,
        },
        approach: {
            type: String,
            required: true
        },
        checklist: {
            equipment: {
                type: String
            },
            printOuts: {
                type: String
            },
            instructions: {
                type: String
            }
        }
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        }
    }
);

lessonsSchema.plugin(mongoosePaginate);

export default model('Lessons', lessonsSchema);
