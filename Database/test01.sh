#!/bin/bash

# assuming the items are stored in a file called 'items.json'
items=$(cat items.json | jq -c '.[]')

for item in ${items[@]}; do
  echo "Putting item: $item"
  aws dynamodb put-item \
    --table-name Properties \
    --item "$item" \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
done