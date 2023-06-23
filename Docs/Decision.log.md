#

Table name: Properties

Partition key: String = PROJECT

Sort key: id: number - UUID

Attributes:
address: String - Property address
suburb: String - Property suburb
postcode: String - Property postcode
state: String - Property State
cityCouncil: String - Property CityCouncil
yearBuilt: Number - Property built year
coordinates: Map - The coordinates(latitude and longitude) of the Property shown in the map
agent: String - The username who creates the item
bathrooms: Number - The number of bathrooms
bedrooms: Number - The number of Bedrooms
carSpaces: Number - The number of CarSpaces
propertyType: String - Property Type(townhouse, house, unit, apartment)
propertyArea: Number - The Area of the Property
landPrice:Number - The land price of the Property
housePrice:Number - The house price of the property
POI: MapList - record name(string), coordinates(Map), address(string) in each POI
sourceType: String - Property service type(Established, new, off the plan)
settlementTime: Map (year(number), month(string)) - if off the plan, must have
files: Map  - FilesId (NumberList)， isCoverPage(boolean), isPublic(boolean), tags: stringList


Table name: FILES

Partition key: String = FILE

Sort key: id: number - UUID

Attributes:
url: String - the path of image stored in s3 bucket
tags: stringList
createdBy: string - username who create the item
createAt: string - create time
