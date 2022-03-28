import * as pg from "pg";
import { lexicographicSortSchema } from "graphql";
import { createPostGraphileSchema } from "postgraphile-core";
import { withPgClient } from "../../helpers";

export const test = (
  schemas: string[],
  options: Record<string, unknown>,
  setup?: (client: pg.PoolClient) => void
) => (): Promise<void> =>
  withPgClient(async (client) => {
    if (setup) {
      if (typeof setup === "function") {
        await setup(client);
      } else {
        await client.query(setup);
      }
    }
    const schema = await createPostGraphileSchema(client, schemas, options);
    expect(lexicographicSortSchema(schema)).toMatchSnapshot();
  });
