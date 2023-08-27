import mongoose from "mongoose";

// database schema
const productSchema = mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  category: String,
  label: String,
  price: String,
  description: String,
});

// converting schema to model
const Products = mongoose.model("Products", productSchema);

//export model so that crud methods can be applied
export default Products;
