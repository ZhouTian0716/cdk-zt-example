import data from "../test_data/testing-data.json"
import { propertyHandler } from "../../../index"
import { APIGatewayProxyEvent, LambdaEvent } from "../../../common/common"
import { stringify } from "querystring"

process.env.TABLE_NAME = "TEST_TABLE"
process.env.IS_MOCK = "true"
process.env.ENV = "test"

describe("Mock testing", () => {
  let PK: string
  let id: string

  it("test00: list all data", async () => {
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(0)
  })

  it("test01: add a property", async () => {
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
    PK = JSON.parse(output.body).properties.item[0].PROJECT
    id = JSON.parse(output.body).properties.item[0].ID
    const a = new Date()
    const createdDate = a.toString
    const b = new Date()
    const lastModifiedDate = b.toString

    expect(PK).toBe("PROJECT")
    expect(id.length).toBeGreaterThan(0)
  })

  it("test02: list all data after add", async () => {
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(1)
  })

  it("test03: get a property By ID", async () => {
    const event: APIGatewayProxyEvent = {
      ...data.request.getByID,
      body: JSON.stringify(data.property.Property01),
      pathParameters: { ID: id },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    const output = await propertyHandler(event)
    expect(output.statusCode).toEqual(200)
    const property = JSON.parse(output.body)
    expect(property.length).toEqual(1)
  })

  it("test04: update the items", async () => {
    const event: APIGatewayProxyEvent = {
      ...data.request.update,
      body: JSON.stringify(data.property.Property02),
      pathParameters: { ID: id },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    const output = await propertyHandler(event)
    expect(output.statusCode).toEqual(200)
    const property = JSON.parse(output.body).properties.item
    expect(property.length).toEqual(1)
    const propertyItem = property[0]
    expect(propertyItem.agent).toEqual("Douglas")
    expect(propertyItem.postcode).toEqual("111")
  })

  it("test05: delete items", async () => {
    const event: APIGatewayProxyEvent = {
      ...data.request.deleteByID,
      body: JSON.stringify(data.property.Property02),
      pathParameters: { ID: id },
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    const output = await propertyHandler(event)
    expect(output.statusCode).toEqual(200)
    expect(JSON.parse(output.body).message).toEqual("Item deleted successfully")
  })

  it("test06: list all data after delete", async () => {
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    console.log(output)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(0)
  })

  it("test07: add 10 new properties and search them from the mock data", async () => {
    // add property
    const event_1: APIGatewayProxyEvent = {
      ...data.request.add,
      body: JSON.stringify(data.property.Property01),
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    const event_2: APIGatewayProxyEvent = {
      ...data.request.add,
      body: JSON.stringify(data.property.Property01),
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }
    let count = 0
    while (count < 5) {
      JSON.parse(event_1.body as string).postcode = count.toString
      await propertyHandler(event_1)
      count++
    }
    count = 0
    while (count < 5) {
      JSON.parse(event_2.body as string).postcode = count.toString
      JSON.parse(event_2.body as string).agent = "David"
      await propertyHandler(event_2)
      count++
    }
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    console.log(output)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(10)
  })

  it("test08: search the data agent == David, and search the data postcode == '4' ", async () => {
    return
  })
})
