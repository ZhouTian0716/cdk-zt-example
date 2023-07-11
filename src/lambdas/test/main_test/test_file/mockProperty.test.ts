import data from "../test_data/testing-data.json"
import { propertyHandler } from "../../../index"
import { APIGatewayProxyEvent, LambdaEvent } from "../../../common/common"

process.env.TABLE_NAME = "TEST_TABLE"
process.env.IS_MOCK = "true"
process.env.ENV = "test"

describe("Mock testing", () => {
  let PK: string
  let id: string

  it("list all data", async () => {
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(0)
  })

  it("add a property", async () => {
    const event: APIGatewayProxyEvent = {
      ...data.request.add,
      body: JSON.stringify(data.property.Property01),
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    const output = await propertyHandler(event)
    expect(output.statusCode).toEqual(201)
    console.log(output)
    PK = JSON.parse(output.body).properties.item[0].PROJECT
    id = JSON.parse(output.body).properties.item[0].ID
    const a = new Date()
    const createdDate = a.toString
    const b = new Date()
    const lastModifiedDate = b.toString

    expect(PK).toBe("PROJECT")
    expect(id.length).toBeGreaterThan(0)
  })

  it("list all data after add", async () => {
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    console.log(output)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(1)
  })

  // it("get a property", async () => {
  //   const event: LambdaEvent = {
  //     ...data.request.getByID,
  //     queryStringParameters: {
  //       id: id,
  //     },
  //   }
  //   const output = await propertyHandler(event)
  //   expect(output.statusCode).toEqual(200)
  //   const property = JSON.parse(output.body).properties
  //   expect(property.item.length).toEqual(1)
  // })
})
