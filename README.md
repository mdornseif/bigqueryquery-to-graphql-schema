# bigqueryquery-to-graphql-schema

Generate a GraphQL Schema Definition from the Result of a [Google BigQuery](https://cloud.google.com/bigquery/) SQL Query:

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
type BqIntrastatResult {
  rows: [BqIntrastat]
  meta: BqJobMeta
}
```

If you want to provide the sql query directly instead as a filename, use `queryToSchema()`

There is also a command line tool for easy access:

```
$  yarn run bigqueryquery-to-graphql-schema --help
yarn run v1.22.17
usage: bq2gqlschema.ts [-h] [--projectId PROJECTID] [--location LOCATION] sqlfile [sqlfile ...]

Convert BigQuery SQL Query to the resulting GraphQL Schema.

positional arguments:
  sqlfile               Filename with a single BigQuery SQL Query.

optional arguments:
  -h, --help            show this help message and exit
  --projectId PROJECTID
                        BigQuery project ID
  --location LOCATION   BigQuery Dataset Location

Please provide `GOOGLE_APPLICATION_CREDENTIALS` via the Environment!
```

To use the generated GraphQL you also have to add the following static types somewhere to your schema:

```graphql
scalar Date
scalar DateTime

type BqStatus {
  state: String
}

type BqStatistics {
  creationTime: String
  startTime: String
  endTime: String
  totalBytesProcessed: String
  query: BqQuery
}

type BqJobReference {
  projectId: String
  jobId: String
  location: String
}

type BqDestinationTable {
  projectId: String
  datasetId: String
  tableId: String
}

type BqQuery {
  query: String
  writeDisposition: String
  priority: String
  useLegacySql: Boolean
  destinationTable: BqDestinationTable
}

type BqConfiguration {
  jobType: String
  query: BqQuery
}

type BqJobMeta {
  kind: String
  etag: String
  id: String
  selfLink: String
  user_email: String
  status: BqStatus
  statistics: BqStatistics
  jobReference: BqJobReference
  configuration: BqConfiguration
}
```


## See also

* [json-to-simple-graphql-schema](https://github.com/walmartlabs/json-to-simple-graphql-schema)
