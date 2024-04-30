# Northcoders News API

Backend hosted [here](https://northcoders-news-backend.vercel.app/api).

Frontend hosted [here](https://northcoders-news-frontend.vercel.app/) and the repo is [here](https://github.com/orchard0/northcoders-news-frontend).

This is an API for the retrieving articles, comments, and related information. Check out the link above for full api routes.

## Getting started

Requirements: Node 18+, PostgreSQL 15+

Run the following commands:

1. `git clone https://github.com/orchard0/myserver.git`
2. `cd myserver`
3. `npm i`
4. `npm run setup-dbs`
5. `npm run seed`
6. `npm test`

### Create .env files

You will need to create two .env files for your project: `.env.test` and `.env.development`.

Into `.env.test` add `PGDATABASE=nc_news_test` and into `.env.development` add `PGDATABASE=nc_news`.
