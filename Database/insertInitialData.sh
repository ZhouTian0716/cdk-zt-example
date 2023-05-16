echo "Adding intial items ..."

aws dynamodb put-item --table-name CRM --item '{"PK":{"S":"User"},"id":{"S":"1"},"email":{"S":"dave@cyberlark.com.au"},"phone":{"S":"0412173226"}}'

echo "Done"