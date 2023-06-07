import { LambdaEvent, UnauthorizedError, Response, UnexpectedError } from "../common/common"
import { logger } from "../../../Shared/Utils/logger"
import jwt_decode from "jwt-decode"
// import { CRM_TABLE_NAME } from "../../constants"

//-------------------------------------------------------------------------------------
export async function handler(event: LambdaEvent) {
  try {
    logger.info("Event: ", event)

    const token = event.pathParameters.token
    const decoded = jwt_decode(token) as any
    logger.info("decoded: ", decoded)
    logger.info("email: ", decoded.email)

    return Response(200)
  } catch (err) {
    console.error("Error: ", err)
    return Promise.resolve(new UnexpectedError("Something went wrong").response())
  }
}
