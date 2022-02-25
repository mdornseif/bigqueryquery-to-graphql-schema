/*
 * bigquery2graphqlschema.ts - takes a BigQuery SQL query and generates a GraphQL schema for the result.
 *
 * Created by Dr. Maximillian Dornseif 2022-02-21
 * Copyright (c) 2022 Maximillian Dornseif
 */

import fs from 'fs';
import path from 'path';

import { BigQuery, BigQueryOptions, Query } from '@google-cloud/bigquery';
import { assertIsString } from 'assertate-debug';

const BQ2GQL_FIELDS = {
  BOOLEAN: 'Boolean',
  FLOAT: 'Float',
  INTEGER: 'Int',
  STRING: 'String',
  TIMESTAMP: 'DateTime',
};

export async function queryToSchema(
  sqlstring: string,
  name: string,
  bqoptions: BigQueryOptions = {},
  joboptions: Query = {},
  typeprefix = 'Bq'
): Promise<string> {
  const bigquery = new BigQuery(bqoptions);
  const [job] = await bigquery.createQueryJob({
    ...joboptions,
    query: sqlstring,
  });
  const dataset = bigquery.dataset(
    job.metadata.configuration.query.destinationTable.datasetId
  );
  const [table] = await dataset
    .table(job.metadata.configuration.query.destinationTable.tableId)
    .get();

  const output = [`type ${typeprefix}${name} {`];
  for (const field of table.metadata.schema.fields) {
    assertIsString(BQ2GQL_FIELDS[field.type], `BQ2GQL_FIELDS[${field.type}]`);
    if (field.mode === 'REPEATED') {
      output.push(
        `  ${field.name}: [${BQ2GQL_FIELDS[field.type]}] \t# ${JSON.stringify(
          field
        )} `
      );
    } else {
      output.push(
        `  ${field.name}: ${BQ2GQL_FIELDS[field.type]} \t# ${JSON.stringify(
          field
        )} `
      );
    }
  }
  output.push(`}\n
type ${typeprefix}${name}Result {
  rows: [${typeprefix}${name}]
  meta: BqJobMeta
}`);
  return output.join('\n');
}

export async function queryFileToSchema(
  sqlfile: string,
  name?: string,
  bqoptions: BigQueryOptions = {},
  joboptions: Query = {},
  typeprefix = 'Bq'
): Promise<string> {
  const finfo = path.parse(sqlfile);
  const sqlstring = await fs.promises.readFile(sqlfile, {
    encoding: 'utf8',
  });
  return (
    `# generated from ${sqlfile} \n` +
    (await queryToSchema(
      sqlstring,
      name || finfo.name,
      bqoptions,
      joboptions,
      typeprefix
    ))
  );
}

// async function main() {
//   console.log(
//     await queryFileToSchema(
//       '/Users/md/github/huWaWi3-backend/sql/Intrastat.sql'
//     )
//   );
// }
// main().then(console.log);
