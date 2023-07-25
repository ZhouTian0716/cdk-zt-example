import data from "../test_data/testing-data.json"
import { propertyHandler } from "../../../index"
import { APIGatewayProxyEvent } from "../../../common/common"

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

    const add01 = propertyHandler(event_1)
    const add02 = propertyHandler(event_2)
    const add03 = propertyHandler(event_3)
    await Promise.all([add01, add02, add03])
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
    // const event02: APIGatewayProxyEvent = {
    //   ...data.request.query,
    //   body: null,
    //   pathParameters: null,
    //   queryStringParameters: { keyword: "111" },
    //   stageVariables: null,
    // }
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

    const output01 = propertyHandler(event01)
    const output02 = propertyHandler(event02)
    const output03 = propertyHandler(event03)
    const output04 = propertyHandler(event04)
    const output05 = propertyHandler(event05)

    await Promise.all([output01, output02, output03, output04, output05]).then((values) => {
      values.forEach((output) => {
        expect(output.statusCode).toEqual(200)
        expect(JSON.parse(output.body).length).toEqual(2)
      })
      expect(JSON.parse(values[0].body)[0].agent).toEqual("Douglas")
      expect(JSON.parse(values[0].body)[1].agent).toEqual("Douglas")
      expect(JSON.parse(values[1].body)[0].postcode).toEqual("111")
      expect(JSON.parse(values[1].body)[1].postcode).toEqual("111")
      expect(JSON.parse(values[2].body)[0].address).toEqual("236 Bourke Street")
      expect(JSON.parse(values[2].body)[1].address).toEqual("236 Bourke Street")
      expect(JSON.parse(values[3].body)[0].description).toEqual("good property")
      expect(JSON.parse(values[3].body)[1].description).toEqual("good property")
      expect(JSON.parse(values[4].body)[0].suburb).toEqual("Darlinghurst")
      expect(JSON.parse(values[4].body)[1].suburb).toEqual("Darlinghurst")
    })
  })
})
