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
Coordinates: StringList - The coordinates of the Property shown in the map
Agent: String - The username who creates the item
Bathrooms: Number - The number of bathrooms
Bedrooms: Number - The number of Bedrooms
CarSpaces: Number - The number of CarSpaces
PropertyType: String - Property Type
PropertyArea: Number - The Area(cm^2) of the Property
PriceRange: Number 
NearbySchools: MapList - record name, coordinates, address in each school
NearbyShoppingCenters: MapList -  record name, coordinates, address in each ShoppingCenter
Images: MapList - record id, url, isCoverPage, tag in each Image


