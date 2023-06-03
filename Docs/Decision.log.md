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
PriceRange: Map - The max and min price of Property
Facilities: MapList - record name(string), coordinates(Map), address(string) in each Facility
Images: MapList - record id(number), url(string), isCoverPage(Boolean, validation), tags(StringList) in each Image


