import express from 'express';
import {getProducts,createProduct,updateProduct,deleteProduct,getProductById,getProductsByCategory } from '../controllers/product.js';
const productRoutes = express.Router();


productRoutes.get('/products/',getProducts);
productRoutes.get('/product/:id',getProductById)
productRoutes.post('/product/', createProduct);
productRoutes.patch('/product/:id',updateProduct);
productRoutes.delete('/product/:id',deleteProduct);
productRoutes.get('/products/category',getProductsByCategory);


export default productRoutes;