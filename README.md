<h1 align="center">
  NNPT - Netguru :green_heart: Node.js Project Template :star:
</h1>

<br />
<div align="center">
  :construction: :rocket: :construction:
</div>
<div align="center">
  <strong>Backend application template for building scalable node applications</strong>
</div>
<br />

## Node :nine:.:six:.:one:

## 🛠 Technology stack
- [Yarn](https://yarnpkg.com)
- [Node.js](https://nodejs.org/en/) 8 with [TypeScript](https://typescriptlang.org) (using [ts-node](https://github.com/TypeStrong/ts-node))
- [PM2](https://github.com/Unitech/pm2) (process manager)
- [Mongoose](http://mongoosejs.com/) (DB management)
- [Swagger](https://swagger.io) (API documentation)
- [MongoDB](https://www.mongodb.com/)
- [Mocha](https://mochajs.org/) (testing framework)

## ⚙️ Setup
- `./setup.sh` - for creating development and test databases and copying dotenv files
- Set database `password` in .env.development and .env.test files
- `yarn migrations` - executing migrations for changes on db schema
- `yarn start` - running app in dev mode on [http://localhost:3001](http://localhost:3001)
- api prefix: `api/`


## :tv: Tests
- Run all tests with `yarn test`
- Run tests for specific path (folder or file) `yarn test:path [path]`

## 🎾 Swagger ~ in progress
You can 🎮 with the API using Swagger UI at [http://localhost:3001/api/v1/api-docs/](http://localhost:3001/api/v1/api-docs/). Have fun and try not to break anything.
