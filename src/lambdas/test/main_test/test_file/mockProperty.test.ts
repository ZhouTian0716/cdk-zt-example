import data from "../test_data/testing-data.json"
import { propertyHandler } from "../../../index"
import { APIGatewayProxyEvent, LambdaEvent } from "../../../common/common"
import { stringify } from "querystring"
import { Construct } from "constructs"

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

  it("test05: delete items by id", async () => {
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
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(0)
  })

  it("test07: add 2 new properties and search them from the mock data", async () => {
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
      body: JSON.stringify(data.property.Property02),
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }

    const event_3: APIGatewayProxyEvent = {
      ...data.request.add,
      body: JSON.stringify(data.property.Property03),
      pathParameters: null,
      queryStringParameters: null,
      multiValueQueryStringParameters: null,
      stageVariables: null,
    }

    await propertyHandler(event_1)
    await propertyHandler(event_2)
    await propertyHandler(event_3)
    const output = await propertyHandler(data.request.list as unknown as APIGatewayProxyEvent)
    expect(output.statusCode).toEqual(200)
    const properties = JSON.parse(output.body)
    expect(properties.length).toEqual(3)
  })

  it("test08: search - return correct attribute and item number", async () => {
    // agent
    const event01: APIGatewayProxyEvent = {
      ...data.request.query,
      body: null,
      pathParameters: null,
      queryStringParameters: { keyword: "Douglas" },
      stageVariables: null,
    }
    // postcode
    const event02: APIGatewayProxyEvent = {
      ...data.request.query,
      body: null,
      pathParameters: null,
      queryStringParameters: { keyword: "111" },
      stageVariables: null,
    }
    // address
    const event03: APIGatewayProxyEvent = {
      ...data.request.query,
      body: null,
      pathParameters: null,
      queryStringParameters: { keyword: "236 Bourke Street" },
      stageVariables: null,
    }
    // description
    const event04: APIGatewayProxyEvent = {
      ...data.request.query,
      body: null,
      pathParameters: null,
      queryStringParameters: { keyword: "good property" },
      stageVariables: null,
    }
    // suburb
    const event05: APIGatewayProxyEvent = {
      ...data.request.query,
      body: null,
      pathParameters: null,
      queryStringParameters: { keyword: "Darlinghurst" },
      stageVariables: null,
    }
    const output01 = await propertyHandler(event01)
    const output02 = await propertyHandler(event02)
    const output03 = await propertyHandler(event03)
    const output04 = await propertyHandler(event04)
    const output05 = await propertyHandler(event05)

    expect(output01.statusCode).toEqual(200)
    expect(output02.statusCode).toEqual(200)
    expect(output03.statusCode).toEqual(200)
    expect(output04.statusCode).toEqual(200)
    expect(output05.statusCode).toEqual(200)

    expect(JSON.parse(output01.body).length).toEqual(2)
    expect(JSON.parse(output02.body).length).toEqual(2)
    expect(JSON.parse(output03.body).length).toEqual(2)
    expect(JSON.parse(output04.body).length).toEqual(2)
    expect(JSON.parse(output05.body).length).toEqual(2)

    const properties01_agent01 = JSON.parse(output01.body)[0].agent
    const properties01_agent02 = JSON.parse(output01.body)[1].agent
    const properties02_postcode01 = JSON.parse(output02.body)[0].postcode
    const peoperties02_postcode02 = JSON.parse(output02.body)[1].postcode
    const properties03_address01 = JSON.parse(output03.body)[0].address
    const properties03_address02 = JSON.parse(output03.body)[1].address
    const properties04_description01 = JSON.parse(output04.body)[0].description
    const properties04_description02 = JSON.parse(output04.body)[1].description
    const properties05_suburb01 = JSON.parse(output05.body)[0].suburb
    const properties05_suburb02 = JSON.parse(output05.body)[1].suburb

    expect(properties01_agent01).toEqual("Douglas")
    expect(properties01_agent02).toEqual("Douglas")
    expect(properties02_postcode01).toEqual("111")
    expect(peoperties02_postcode02).toEqual("111")
    expect(properties03_address01).toEqual("236 Bourke Street")
    expect(properties03_address02).toEqual("236 Bourke Street")
    expect(properties04_description01).toEqual("good property")
    expect(properties04_description02).toEqual("good property")
    expect(properties05_suburb01).toEqual("Darlinghurst")
    expect(properties05_suburb02).toEqual("Darlinghurst")
  })
})
