import { model, Schema } from 'mongoose';

const LessonsSchema: Schema = new Schema({
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
    });

export default model('Lessons', LessonsSchema);
