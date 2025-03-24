import { Request, Response } from "express";
import Product, { IProduct } from "../model/products.model.js";
import mongoose from "mongoose";

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
      res.status(400).json({ message: "All fields required" });
      return;
    }

    const product = new Product<IProduct>({ name, category, price, stock });
    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const search = req.query.search as string;
    const sort = req.query.sort as string;
    const category = req.query.category as string;

    const startIndex = (page - 1) * limit;

    const filter: any = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const sortOption: any = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      message: "Products fetched successfully",
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      limit,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const body: Partial<IProduct> = req.body;
    const productId = req.params.id;

    const updatingProduct = await Product.findById<
      IProduct & mongoose.Document
    >(productId).exec();

    if (!updatingProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (body.name) updatingProduct.name = body.name;
    if (body.category) updatingProduct.category = body.category;
    if (body.price !== undefined) updatingProduct.price = body.price;
    if (body.stock !== undefined) updatingProduct.stock = body.stock;

    await updatingProduct.save();

    res.status(200).json({
      message: "Products updated successfully",
      product: updatingProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createProduct,
  getProducts,
  updateProduct,
  getProductById,
  deleteProduct,
};
