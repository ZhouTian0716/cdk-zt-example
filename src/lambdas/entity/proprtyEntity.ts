import { v4 as uuidv4 } from "uuid"
import { propertyRequestBody } from "../model/propertyModel"

export const PropertyItem = (body: propertyRequestBody): any => {
  const item = {
    address: body.address,
    suburb: body.suburb,
    postcode: body.postcode,
    state: body.state,
    cityCouncil: body.cityCouncil,
    yearBuilt: body.yearBuilt,
    coordinates: body.coordinates,
    agent: body.agent,
    bathrooms: body.bathrooms,
    bedrooms: body.bedrooms,
    carSpaces: body.carSpaces,
    propertyType: body.propertyType,
    propertyArea: body.propertyArea,
    landPrice: body.landPrice,
    housePrice: body.housePrice,
    sourceType: body.sourceType,
    settlementTime: body.settlementTime,
    files: body.files,
  }

  return item
}
