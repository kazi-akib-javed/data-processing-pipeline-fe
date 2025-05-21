## Description

This is data processing backend system which includes stream and batch processing mechanism to see how it works in real-life. I handled the stream data using redis and used nestjs cronjob for batch processing.

So it is a daily page view analytics website where you can see the realtime page view analytics and finally it stores the each day statistics into database.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Run project
```bash
# development mode
$ yarn start:dev
```