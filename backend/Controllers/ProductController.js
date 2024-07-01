const Product = require("../Models/ProductModel");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, cost, description, discount } = req.body; // Extract discount from request body

    // Create a new product instance
    const newProduct = new Product({
      name,
      price,
      cost,
      description,
      discount,
      isDeleted: false, // Default value for new products
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Retrieve all list of products
exports.getAllProductsList = async (req, res) => {
  try {
    // Fetch all product details from the database
    const products = await Product.find();

    console.log(products)
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "An error occurred while fetching product details" });
  }
};

// Retrieve product details by ID
exports.getProductDetails = async (req, res) => {
  try {
    const productId = req.params.id;

    // Fetch product details from the database, excluding soft-deleted products
    const product = await Product.findOne({ _id: productId, isDeleted: false });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve list of products
exports.getProductsList = async (req, res) => {
  try {
    // Fetch product details from the database, excluding soft-deleted products
    const products = await Product.find({ isDeleted: false });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product information by ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body; // New data for updating

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct || updatedProduct.isDeleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a product by ID (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Mark the product as deleted by setting isDeleted to true
    const deletedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product marked as deleted successfully" });
  } catch (error) {
    console.error("Error marking product as deleted:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get total product count, excluding soft-deleted products
exports.getTotalProductCount = async (req, res) => {
  try {
    const totalProductCount = await Product.countDocuments({ isDeleted: false });
    res.status(200).json(totalProductCount);
  } catch (error) {
    console.error("Error getting total product count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

