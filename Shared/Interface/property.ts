export enum PROPERTY_TYPE {
  HOUSE = "house",
  APARTMENT = "apartment",
  UNIT = "unit",
  TOWNHOUSE = "townhouse",
}

export interface Address {
  street?: string
  suburb?: string
  state?: "NSW" | "QLD" | "VIC" | "WA" | "SA" | "TAS" | "ACT" | "NT"
}

export interface Property {
  id: string
  Name: string // Property suburb name, do we need this? as we can get this from Address -> suburb
  address: Address
  type: PROPERTY_TYPE
  date?: Date // Purchase date
  seller?: string
  solicitor?: string
  firb?: boolean // do we need this?
  status?: string // own, rent, sold
}
