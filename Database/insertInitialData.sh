echo "Adding intial items ..."

aws dynamodb put-item \
    --table-name Properties \
    --item file://initialProperties.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
    

# aws dynamodb put-item \
#     --table-name Files \
#     --item file://initialFiles.json \  
#     --return-consumed-capacity TOTAL

echo "Done"