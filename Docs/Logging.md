# Logging

## Frontend Logging Level

We have setup the logging in the following level:

- `debug`: Debug logging (only when `CRM_DEBUG` environment variable set to "true")
- `info`: Information that good to know (only when `dev` environment)
- `warn`: Warning information, will be shown in `dev` and `prod`
- `error`: Error that something failed.

## Debug logging

You need to set `CRM_DEBUG` to `true`

```bash
export CRM_DEBUG="true"
```

## How to use

```ts
import { logger } from "../../../../Shared/Utils/logger";

logger.debug("This is debug log");
logger.info("This is info log");
logger.warn("This is logger warning log");
logger.error("This is logger error log");
```

## debug or info

When log under `debug`:

- Spam information
- Long and redundant or duplicated information that used for debugging
- Things to check when something goes wrong

When log under `info`:

- Always good to have information logged
- Action being made
- Data being received
