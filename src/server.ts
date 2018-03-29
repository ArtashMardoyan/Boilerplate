import * as cors from 'cors';
import * as path from 'path';
import * as _ from 'underscore';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as autoRoute from 'express-autoroute';

import config from './config';

interface Response {
    code: number;
    name: string;
    message: any;
    trace: any;
}

class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {

        const MONGO_URI: string = 'mongodb://localhost:27017/boilerplate';
        mongoose.connect(MONGO_URI || process.env.MONGODB_URI);

        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(logger('dev'));
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(cors());

        // cors
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,' +
                ' Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });

    }

    public routes(): void {
        autoRoute(this.app, {
            routesDir: path.join(__dirname, 'routes')
        });
    }

    public errorResolver(): any {
        this.app.use((err, req, res, next) => {
            const statusCode: number = err.statusCode || 500;
            const statusName: string = err.statusName || 'INTERNAL_SERVER_ERROR';

            const response: Response = {
                code: statusCode,
                name: statusName,
                message: err.name === 'HttpException' ? err.message : null,
                trace: null
            };

            if (config.get('NODE_ENV') === 'development') {
                response.trace = _.omit(err, ['name', 'message', 'statusCode', 'statusName']);
                response.trace = _.pick(response.trace, (value) => !_.isEmpty(value));
            }

            return res.status(statusCode).json(
                _.pick(response, (value) => _.isNumber(value) || !_.isEmpty(value))
            );

        });
    }
}

export default new Server().app;
