#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))

TAGS="[{\"Key\": \"Owner\", \"Value\": \"Cyberlark\"}, {\"Key\": \"Project\", \"Value\": \"CRM\"}]"

aws dynamodb create-table --cli-input-json file://${SCRIPT_DIR}/createTable.json  --region ap-southeast-2 --tags "${TAGS}" \
    --local-secondary-indexes \
        "[{
            \"IndexName\": \"name-index\",
            \"KeySchema\":[{\"AttributeName\":\"PK\",\"KeyType\":\"HASH\"}, {\"AttributeName\":\"name\",\"KeyType\":\"RANGE\"}],
            \"Projection\":{\"ProjectionType\":\"ALL\"}
        },{

            \"IndexName\": \"email-index\",
            \"KeySchema\":[{\"AttributeName\":\"PK\",\"KeyType\":\"HASH\"}, {\"AttributeName\":\"email\",\"KeyType\":\"RANGE\"}],
            \"Projection\":{\"ProjectionType\":\"ALL\"}
        },{

            \"IndexName\": \"phone-index\",
            \"KeySchema\":[{\"AttributeName\":\"PK\",\"KeyType\":\"HASH\"}, {\"AttributeName\":\"phone\",\"KeyType\":\"RANGE\"}],
            \"Projection\":{\"ProjectionType\":\"ALL\"}
        }]" \
    --output json > tmp.json

cat tmp.json

