import { IConfig } from "../../src/config"
import { LogLevel } from "./logger"

/** The App environment */
export type Environment = "dev" | "prod"

export const APP_ENV: Environment = process.env.CRM_ENV === "prod" ? "prod" : "dev"

export const isProd = process.env.CRM_ENV === "prod" ? true : false

export const LOG_LEVEL: LogLevel = process.env.CRM_DEBUG === "true" ? "debug" : APP_ENV === "prod" ? "warn" : "info"

// export function getEnvVar(app:any , key: string): string {
//   const config: IConfig =  app.node.tryGetContext("config");

//   if (["douglas", "Olivia", "Libby", "prod"].includes(config.environment)) {
//     console.log(`you are using environment - ${config.environment}`)
//   }else {
//     throw new Error("Please provide a valid environment name");
//   }

//   const envVars:any = require("../../src/constants.${config.environment}");
//   if (key == "WEB_BUCKET_NAME"){
//     return envVars.WEB_BUCKET_NAME;
//   }else if (key == "IAMGE_BUCKET_NAME"){
//     return envVars.IAMGE_BUCKET_NAME;
//     }else if (key == "DDB_TABLE_NAME"){
//     return envVars.DDB_TABLE_NAME;
//     }else if (key == "REGION"){
//     return envVars.REGION;
//     }else{
//     throw new Error("Please provide a valid key");
//     }
// }
