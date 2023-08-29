import json  from "body-parser";
import mongoose from "mongoose";
import Products from "../models/product.js";

// fetch all Products from Product database
export const getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getProductById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("No Product with that id");
  }
  try {
    const product = await Products.findById(_id);
    console.log('product',product);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new Product in Product database
export const createProduct = async (req, res) => {
  const Product = req.body;
  const newProduct = new Products(Product);
  try {
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id: _id } = req.params;
  const Product = req.body;
  //checking if the id is a valid moongoose id
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("No Product with that id");
  }

  const updatedProduct = await Products.findByIdAndUpdate(_id, Product, { new: true });

  res.json(updatedProduct);
};

// delete a specific Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Product with id: ${id}`);

  await Products.findByIdAndRemove(id);

  res.json({ message: "Product Deleted Successfully" });
};


export const getProductsByCategory = async(req, res) => {
  try {
    const groupedbycategory = await Products.aggregate([
      { $group: { _id: "$category", marks: { $sum: 1 } } }
    ])
  res.status(200).json(groupedbycategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
