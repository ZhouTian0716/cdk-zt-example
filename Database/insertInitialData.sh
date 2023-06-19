echo "Adding intial items ..."

aws dynamodb put-item \
    --table-name Properties \
    --item file://initSeedData/Properties01.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE 

aws dynamodb put-item \
    --table-name Properties \
    --item file://initSeedData/Properties02.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE 

aws dynamodb put-item \
    --table-name Properties \
    --item file://initSeedData/Properties03.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE 

aws dynamodb put-item \
    --table-name Properties \
    --item file://initSeedData/Properties04.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE 

aws dynamodb put-item \
    --table-name Files \
    --item file://initSeedData/Files01.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE

aws dynamodb put-item \
    --table-name Files \
    --item file://initSeedData/Files02.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE

aws dynamodb put-item \
    --table-name Files \
    --item file://initSeedData/Files03.json \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE

echo "Done"
