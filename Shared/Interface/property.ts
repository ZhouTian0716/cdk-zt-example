export interface Coordinates {
  lat: number
  lng: number
}

export interface SettlementTime {
  year: number
  month: string
}

export interface File {
  url: string
  isCover: boolean
  isPublic: boolean
}

export interface POI {
  name: string
  coordinates: Coordinates
  address: string
}

export interface propertyRequestBody {
  address: string
  suburb: string
  postcode: string
  state: string
  cityCouncil: string
  yearBuilt: number
  coordinates: Coordinates
  agent: string
  bathrooms: number
  bedrooms: number
  carSpaces: number
  propertyType: string
  propertyArea: number
  landPrice: number
  housePrice: number
  sourceType: string
  settlementTime: SettlementTime
  files: File[]
  POIs: POI[]
}
