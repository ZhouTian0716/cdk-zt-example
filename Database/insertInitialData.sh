echo "Adding intial items ..."

aws dynamodb put-item --table-name CRM --item 
#'{"PK":{"S":"User"},"id":{"S":"1"},"email":{"S":"dave@cyberlark.com.au"},"phone":{"S":"0412173226"}}'
'{
        "Address": {"S": "123 Main St"},
        "Suburb": {"S": "Woollonggabba"},
        "Postcode": {"S": "2345"},
        "State": {"S": "Queensland"},
        "CityCouncil": {"S": "Brisbane"},
        "YearBuilt": {"N": "2005"},
        "Coordinates": {"M": {"Latitude": {"N": "37.1234"}, "Longitude": {"N": "-122.5678"}}},
        "Agent": {"S": "Kevin"},
        "Bathrooms": {"N": "2"},
        "Bedrooms": {"N": "3"},
        "CarSpaces": {"N": "2"},
        "PropertyType": {"S": "house"},
        "PropertyArea": {"N": "2000"},
        "PropertyAreaUnit": {"S": "sqft"},
        "Price": {"M": {"Amount": {"N": "500000"}, "Currency": {"S": "USD"}}},
        "POI": {"L": [
          {"M": {"Name": {"S": "Park"}, "Coordinates": {"M": {"Latitude": {"N": "37.2345"}, "Longitude": {"N": "-122.6789"}}}, "Address": {"S": "Park Address"}}},
          {"M": {"Name": {"S": "School"}, "Coordinates": {"M": {"Latitude": {"N": "37.3456"}, "Longitude": {"N": "-122.7890"}}}, "Address": {"S": "School Address"}}}
        ]},
        "Images": {"L": [
          {"N": "1"},
          {"N": "2"},
          {"N": "3"}
        ]}
      }'

echo "Done"