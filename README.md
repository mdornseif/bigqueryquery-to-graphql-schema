# bigqueryquery-to-graphql-schema

Generate a GraphQL Schema Definition from the Result of a Google BigQuery Query:

```js
await queryFileToSchema('./sql/Intrastat.sql')
```

gets you:

```graphql
#generated from ./sql/Intrastat.sql 
type BqIntrastat {
  belegmonat: String  # {"name":"belegmonat","type":"STRING","mode":"NULLABLE"} 
  menge: Int  # {"name":"menge","type":"INTEGER","mode":"NULLABLE"} 
  items: [String]  # {"name":"items","type":"STRING","mode":"REPEATED"} 
}
```

If you want to provide the sql query directly instead as a filename, use `queryToSchema()`

There is also a command line tool for easy access:

```
$ yarn run bq2gqlschema --help 
yarn run v1.22.17
usage: bq2gqlschema.ts [-h] [--projectId PROJECTID] [--location LOCATION] sqlfile

Convert BigQuery SQL Query to the resulting GraphQL Schema.

positional arguments:
  sqlfile

optional arguments:
  -h, --help            show this help message and exit
  --projectId PROJECTID
                        BigQuery project ID
  --location LOCATION   BigQuery Dataset Location

Please provide `GOOGLE_APPLICATION_CREDENTIALS` via the Environment!
```
