#!/bin/bash

# Save the original IFS
OIFS="$IFS"

# Set the IFS to a newline for the purposes of this script
IFS=$'\n'

# Assuming the items are stored in a file called 'items.json'
items=$(cat items.json | jq -c '.[]')

for item in ${items[@]}; do
  # Extract each attribute
  PK=$(echo $item | jq -r '.PutRequest.Item.PK.S')
  ID=$(echo $item | jq -r '.PutRequest.Item.ID.N')
  Artist=$(echo $item | jq -r '.PutRequest.Item.Artist.S')
  SongTitle=$(echo $item | jq -r '.PutRequest.Item.SongTitle.S')
  AlbumTitle=$(echo $item | jq -r '.PutRequest.Item.AlbumTitle.S')

  echo "Putting item: PK=$PK, ID=$ID, Artist=$Artist, SongTitle=$SongTitle, AlbumTitle=$AlbumTitle"

  aws dynamodb put-item \
    --table-name Properties \
    --item \
        '{
            "PK": {"S": "'"$PK"'"},
            "ID": {"N": "'"$ID"'"},
            "Artist": {"S": "'"$Artist"'"},
            "SongTitle": {"S": "'"$SongTitle"'"},
            "AlbumTitle": {"S": "'"$AlbumTitle"'"}
        }' \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
done

# Restore the original IFS
IFS="$OIFS"