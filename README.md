# Monorepo boilerplate with Nest.js and React

- This app was created to simplify developing other apps;
- I consolidated knowledge of working with:
  - Formik
  - Material-UI
  - Reack hooks
  - Redux
  - Typescript
  - RTK
- I mastered:
  - Docker
  - Docker-compose
  - Heroku
  - TypeORM

## Demo

https://still-basin-01257.herokuapp.com/


## Developing

```
docker-compose up --build "$@"
```

## Deployment

Run deploy github action manually

# Run migrations

```
yarn migrate:run
```

# Seeding

```
yarn pretypeorm
yarn seed:config
yarn seed:run
```
