import dotenv from "dotenv"
import supertest from "supertest"
import server from "../src/server"
import mongoose from "mongoose"
import ProductModel from "../src/models/products/index.js"
dotenv.config()

const request = supertest(server)

describe("Stage I - Testing the test env", () => {
  it("should test that true is true", () => {
    expect(true).toBe(true)
  })

  it("should test that false is not true", () => {
    expect(false).not.toBe(true)
  })

  it("should test that false is falsy", () => {
    expect(false).toBeFalsy()
  })

  it("should expect that the test key is 123", () => {
    console.log(process.env.TEST_KEY)
    expect(process.env.TEST_KEY).toBeDefined()
    expect(process.env.TEST_KEY).toBe("123")
  })
})

describe("Checking application main endpoints", () => {
  it("should check that the /test endpoint is working", async () => {
    const response = await request.get("/test")

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Test success!")
  })

  it("should check that the /products endpoint is working", async () => {
    const response = await request.get("/products")
    expect(response.status).toBe(200)
    expect(response.body.products).toBeDefined()
    expect(response.body.products.length).toBe(0)
  })

  const validData = {
    description: "Test product",
    price: 30,
  }

  it("should check that the /products endpoint is allowing POST requests with valid data", async () => {
    const response = await request.post("/products").send(validData)
    expect(response.status).toBe(201)
    expect(response.body._id).toBeDefined()
    expect(response.body.description).toEqual(validData.description)
  })

  const invalidData = {
    description: "Test product",
  }

  it("should check that the /products endpoint is NOT allowing POST requests with invalid data", async () => {
    const response = await request.post("/products").send(invalidData)
    expect(response.status).toBe(400)
    expect(response.body._id).not.toBeDefined()
  })
  it("should test that the /products endpoint is returning valid data after creating", async () => {
    const response = await request.post("/products").send(validData)

    expect(response.body._id).toBeDefined()

    const product = await ProductModel.findById(response.body._id)

    expect(product.createdAt).toStrictEqual(new Date(response.body.createdAt))
  })

  it("should test that the /products endpoint is returning all the products available", async () => {
    const productResponse = await request.post("/products").send(validData)

    const response = await request.get("/products")

    const included = response.body.products.some(
      (product) => product._id === productResponse.body._id
    )

    expect(included).toBe(true)
  })
})
it("should accept the requests and update the name", async () => {
  const response = await request.put("/products/:id")
  expect(response.status).toBe(203)
  expect(request.body).toBeDefined()
  expect(response.body.name).toEqual(validData.description)
  expect(response.body.name).toStrictEqual({ String })
})
it("should test whether the id of the product is matching,if so delete them", async () => {
  const response = await request.delete("/products/:id")

  expect(response.status).toBe(204)
  expect(response.body._id).toBeDefined()
})
it("should throw error if products._id doesnt exist on existing products", async () => {
  const response = await request.get("/products/:id")
  expect(response.status).toBe(404)
  expect(request._id).not.toBeDefined()
})
beforeAll((done) => {
  console.log(process.env.ATLAS_URL)
  mongoose
    .connect(process.env.ATLAS_URL + "/test", { useNewUrlParser: true })
    .then(() => {
      console.log("Successfully connected to Atlas in test.")
      done()
    })
})

afterAll((done) => {
  mongoose.connection.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
})
