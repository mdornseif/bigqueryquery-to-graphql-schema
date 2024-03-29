#!/usr/bin/env node
/*
 * bq2gqlschema.ts
 *
 * Created by Dr. Maximillian Dornseif 2022-02-21 in bigqueryquery-to-graphql-schema 1.0.0
 * Copyright (c) 2022 HUDORA GmbH
 */

import { ArgumentParser } from 'argparse';
import { queryFileToSchema } from '..';

const parser = new ArgumentParser({
  description: 'Convert BigQuery SQL Query to the resulting GraphQL Schema.',
  epilog:
    'Please provide `GOOGLE_APPLICATION_CREDENTIALS` via the Environment!',
  add_help: true,
});

parser.add_argument('--projectId', { help: 'BigQuery project ID.' });
parser.add_argument('--location', { help: 'BigQuery Dataset Location.' });
parser.add_argument('sqlfile', {
  nargs: '+',
  help: 'Filename with a single BigQuery SQL Query.',
});

const args = parser.parse_args();

async function main() {
  const output = [];
  for (const fname of args.sqlfile) {
    output.push(
      await queryFileToSchema(
        fname,
        undefined,
        { projectId: args.projectId },
        { location: args.location }
      )
    );
  }
  return output.join('\n');
}

main().then(console.log).catch(console.error);
