import express from "express"
import ProductModel from "../../models/products/index.js"

const { Router } = express

const productsRouter = new Router()

productsRouter.get("/", async (req, res) => {
  const products = await ProductModel.find({})
  res.status(200).send({ products })
})
productsRouter.get("/:id", async (req, res) => {
  const products = await ProductModel.findById({ _id: req.params.id })
  if (products) {
    res.send(products)
  } else {
    res.status(404).send({ message: error.message })
  }
})
productsRouter.put("/:id", async (req, res) => {
  const updatedProducts = await ProductModel.findByIdAndUpdate({
    _id: req.params.id,
  })
  if (updatedProducts) {
    res.status(203).send(updatedProducts)
  }
})
productsRouter.delete("/:id", async (req, res) => {
  const products = await ProductModel.findByIdAndDelete({ _id: req.params.id })
  res.status(204).send("succesfully deleted")
})
productsRouter.post("/", async (req, res) => {
  try {
    const { description, price } = req.body

    if (!description || !price) throw new Error("Invalid data")

    const product = new ProductModel({ description, price })
    await product.save()

    res.status(201).send(product)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
})

export default productsRouter
