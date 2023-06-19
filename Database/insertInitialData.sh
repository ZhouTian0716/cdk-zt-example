#!/bin/bash
echo "Adding intial items ..."

echo "Adding intial items ..."
# Define the array of file names
 Properties=("Properties01.json" "Properties02.json" "Properties03.json" "Properties04.json")
 Files=("Files01.json" "Files02.json" "Files03.json")
 
# Iterate over the file names and execute the AWS CLI command
for Property in "${Properties[@]}"
do
    aws dynamodb put-item \
        --table-name Properties \
        --item "file://initSeedData/$Property" \
        --return-consumed-capacity TOTAL \
        --return-item-collection-metrics SIZE
done
for File in "${Files[@]}"
do
    aws dynamodb put-item \
        --table-name Files \
        --item "file://initSeedData/$File" \
        --return-consumed-capacity TOTAL \
        --return-item-collection-metrics SIZE
done

echo "Done"

