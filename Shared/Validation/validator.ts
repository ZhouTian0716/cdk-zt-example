import { Validator } from "jsonschema"

const v = new Validator()

export class JsonError extends Error {}

export const propertySchema = {
  id: "/Property",
  type: "object",
  properties: {
    address: { type: "string" },
    suburb: { type: "string" },
    postcode: { type: "string" },
    state: { type: "string" },
    cityCouncil: { type: "string" },
    yearBuilt: { type: "number" },
    coordinates: {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
      },
      required: ["lat", "lng"],
    },
    agent: { type: "string" },
    bathrooms: { type: "number" },
    bedrooms: { type: "number" },
    carSpaces: { type: "number" },
    propertyType: { type: "string" },
    propertyArea: { type: "number" },
    landPrice: { type: "number" },
    housePrice: { type: "number" },
    sourceType: { type: "string" },
    settlementTime: {
      type: "object",
      properties: {
        year: { type: "number" },
        month: { type: "string" },
      },
      required: ["year", "month"],
    },
    files: {
      type: "array",
      items: {
        type: "string",
      },
    },
    POIs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" },
            },
            required: ["lat", "lng"],
          },
          address: { type: "string" },
        },
        required: ["name", "coordinates", "address"],
      },
    },
  },
  required: ["address", "suburb", "postcode", "state", "cityCouncil", "yearBuilt", "bathrooms", "bedrooms", "carSpaces", "housePrice", "files"],
}

v.addSchema(propertySchema, "/Property")
