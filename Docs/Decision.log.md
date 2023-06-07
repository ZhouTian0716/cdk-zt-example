#

Table name: Properties

Partition key: String = PROJECT

Sort key: id: number - UUID

Attributes:
Address: String - Property address
Suburb: String - Property suburb
Postcode: String - Property postcode
State: String - Property State
CityCouncil: String - Property CityCouncil
YearBuilt: Number - Property built year
Coordinates: Map - The coordinates(latitude and longitude) of the Property shown in the map
Agent: String - The username who creates the item
Bathrooms: Number - The number of bathrooms
Bedrooms: Number - The number of Bedrooms
CarSpaces: Number - The number of CarSpaces
PropertyType: String - Property Type(townhouse, house, unit, apartment)
PropertyArea: Number - The Area of the Property
PropertyAreaUnit: String - The Area units of the Property
LandPrice:Number - The land price of the Property
HousePrice:Number - The house price of the property
POI: MapList - record name(string), coordinates(Map), address(string) in each POI
ServiceType: String - Property service type(Established, new, off the plan)
SettlementTime: Map (year(string), month(string)) - if off the plan, must have
Files: Map  - ImagesId (NumberList)， isCoverPage(boolean), isPublic(boolean)

Table name: FILES

Partition key: String = FILE

Sort key: id: number - UUID

Attributes:
Url: String - the path of image stored in s3 bucket
Tags: stringList
CreatedBy: string - username who create the item
DateTime: string - create time
