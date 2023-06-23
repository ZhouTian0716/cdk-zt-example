import { File, POI, propertyRequestBody } from "../model/propertyModel"

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`)
  }
}

export class JsonError extends Error {}

export function validateAsPropertyEntry(arg: any): asserts arg is propertyRequestBody {
  const requiredFields: (keyof propertyRequestBody)[] = [
    "PROJECT",
    "ID",
    "address",
    "suburb",
    "postcode",
    "state",
    "cityCouncil",
    "yearBuilt",
    "coordinates",
    "agent",
    "bathrooms",
    "bedrooms",
    "carSpaces",
    "propertyType",
    "propertyArea",
    "landPrice",
    "housePrice",
    "sourceType",
    "settlementTime",
    "files",
    "POIs",
  ]

  for (const field of requiredFields) {
    if ((arg as propertyRequestBody)[field] == undefined) {
      throw new MissingFieldError(field)
    }
  }

  if (!("lat" in arg.coordinates && "lng" in arg.coordinates)) {
    throw new MissingFieldError("coordinates")
  }

  if (!("year" in arg.settlementTime && "month" in arg.settlementTime)) {
    throw new MissingFieldError("settlementTime")
  }

  if (!Array.isArray(arg.files) || arg.files.some((file: File) => file.url == undefined || file.isCover == undefined || file.isPublic == undefined)) {
    throw new MissingFieldError("files")
  }

  if (
    !Array.isArray(arg.POIs) ||
    arg.POIs.some((poi: POI) => poi.name == undefined || !("lat" in poi.coordinates && "lng" in poi.coordinates) || poi.address == undefined)
  ) {
    throw new MissingFieldError("POIs")
  }
}
