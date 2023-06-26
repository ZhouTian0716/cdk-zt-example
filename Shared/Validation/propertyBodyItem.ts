import { propertyRequestBody } from "../Interface/property"

export const PropertyBodyItem = (body: propertyRequestBody): any => {
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
