const { Product, Category, Variant } = require("../models");
const { Op } = require("sequelize");

const generateSKU = async () => {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      // Cari SKU terakhir dari database
      const lastProduct = await Product.findOne({
        where: {
          sku_master: {
            [Op.like]: "SKU-%",
          },
        },
        order: [["sku_master", "DESC"]],
        attributes: ["sku_master"],
      });

      let nextNumber = 1;

      if (lastProduct && lastProduct.sku_master) {
        // Extract nomor dari SKU terakhir (misal: SKU-0004 -> 4)
        const lastNumber = parseInt(lastProduct.sku_master.replace("SKU-", ""));
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      // Format dengan padding zeros
      const newSKU = `SKU-${String(nextNumber).padStart(4, "0")}`;

      // Double check apakah SKU sudah ada
      const exists = await Product.findOne({
        where: { sku_master: newSKU },
      });

      if (!exists) {
        return newSKU;
      }

      // Jika masih ada, coba nomor berikutnya
      attempts++;
    } catch (error) {
      console.error("Error generating SKU:", error);
      attempts++;
    }
  }

  // Fallback jika gagal generate
  const timestamp = Date.now();
  return `SKU-${timestamp}`;
};

// ALTERNATIF: Generate SKU berdasarkan timestamp + random
const generateSKUAlternative = async () => {
  const timestamp = Date.now().toString().slice(-6); // 6 digit terakhir
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  const newSKU = `SKU-${timestamp}${random}`;

  // Check apakah sudah ada
  const exists = await Product.findOne({
    where: { sku_master: newSKU },
  });

  if (exists) {
    // Jika masih duplikat, tambah random lagi
    const extraRandom = Math.floor(Math.random() * 100);
    return `SKU-${timestamp}${random}${extraRandom}`;
  }

  return newSKU;
};

// --- Fungsi untuk Produk ---

exports.createProduct = async (req, res) => {
  const {
    name,
    sku_master,
    description,
    base_price_buy,
    base_price_sell,
    unit,
    stock,
    categoryid,
    image_url,
    variants,
  } = req.body;

  try {
    // DEBUG: LOG DATA YANG DITERIMA
    console.log("Data yang diterima:", req.body);

    const parsedCategoryId = parseInt(categoryid);
    const parsedStock = parseInt(stock) || 0;
    const parsedPriceBuy = parseFloat(base_price_buy);
    const parsedPriceSell = parseFloat(base_price_sell);

    // VALIDASI FIELD REQUIRED
    if (!name || !base_price_buy || !base_price_sell || !unit || !categoryid) {
      return res.status(400).json({
        message:
          "Nama, harga beli, harga jual, unit, dan kategori harus diisi.",
      });
    }

    // VALIDASI TIPE DATA
    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      return res.status(400).json({
        message: "Category ID harus berupa angka yang valid.",
      });
    }

    if (isNaN(parsedPriceBuy) || parsedPriceBuy <= 0) {
      return res.status(400).json({
        message: "Harga beli harus berupa angka yang valid dan lebih dari 0.",
      });
    }

    if (isNaN(parsedPriceSell) || parsedPriceSell <= 0) {
      return res.status(400).json({
        message: "Harga jual harus berupa angka yang valid dan lebih dari 0.",
      });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        message:
          "Stok harus berupa angka yang valid dan tidak boleh negatif.",
      });
    }

    // CEK APAKAH KATEGORI ADA
    const categoryExists = await Category.findByPk(parsedCategoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    // GENERATE SKU JIKA TIDAK ADA
    const finalSKU = sku_master || (await generateSKU());

    // CEK APAKAH SKU SUDAH ADA
    const existingSKU = await Product.findOne({
      where: { sku_master: finalSKU },
    });
    if (existingSKU) {
      return res.status(409).json({
        message: "SKU sudah ada. Silakan gunakan SKU yang berbeda.",
      });
    }

    // SIAPKAN DATA UNTUK DISIMPAN
    const productData = {
      name: name.trim(),
      sku_master: finalSKU,
      description: description || null,
      base_price_buy: parsedPriceBuy,
      base_price_sell: parsedPriceSell,
      unit: unit.trim(),
      stock: parsedStock,
      categoryid: parsedCategoryId,
      image_url: image_url || null,
    };

    console.log("Data yang akan disimpan:", productData);

    const product = await Product.create(productData);

    // HANDLE VARIANTS JIKA ADA
    if (variants && variants.length > 0) {
      const variantInstances = variants.map((v) => ({
        ...v,
        productId: product.id,
      }));
      await Variant.bulkCreate(variantInstances);
    }

    // AMBIL PRODUCT DENGAN RELASI
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Variant, as: "variants" },
      ],
    });

    res.status(201).json({
      message: "Produk berhasil dibuat.",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    // HANDLE SPECIFIC SEQUELIZE ERRORS
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Data sudah ada (duplikat)",
        error: error.message,
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Kategori tidak valid atau tidak ditemukan",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan server saat membuat produk.",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Variant, as: "variants" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil produk.",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Variant, as: "variants" },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil produk.",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    sku_master,
    description,
    base_price_buy,
    base_price_sell,
    unit,
    stock,
    categoryid,
    image_url,
    variants,
  } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    // PARSE DATA JIKA ADA
    const parsedCategoryId = categoryid ? parseInt(categoryid) : null;
    const parsedStock = stock !== undefined ? parseInt(stock) : null;
    const parsedPriceBuy = base_price_buy ? parseFloat(base_price_buy) : null;
    const parsedPriceSell = base_price_sell ? parseFloat(base_price_sell) : null;

    // CEK KATEGORI JIKA ADA PERUBAHAN
    if (parsedCategoryId) {
      if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
        return res.status(400).json({
          message: "Category ID harus berupa angka yang valid.",
        });
      }

      const categoryExists = await Category.findByPk(parsedCategoryId);
      if (!categoryExists) {
        return res.status(404).json({ message: "Kategori tidak ditemukan." });
      }
    }

    // VALIDASI HARGA JIKA ADA PERUBAHAN
    if (parsedPriceBuy !== null && (isNaN(parsedPriceBuy) || parsedPriceBuy <= 0)) {
      return res.status(400).json({
        message: "Harga beli harus berupa angka yang valid dan lebih dari 0.",
      });
    }

    if (parsedPriceSell !== null && (isNaN(parsedPriceSell) || parsedPriceSell <= 0)) {
      return res.status(400).json({
        message: "Harga jual harus berupa angka yang valid dan lebih dari 0.",
      });
    }

    if (parsedStock !== null && (isNaN(parsedStock) || parsedStock < 0)) {
      return res.status(400).json({
        message: "Stok harus berupa angka yang valid dan tidak boleh negatif.",
      });
    }

    // SIAPKAN DATA UPDATE
    const updateData = {
      name: name ? name.trim() : product.name,
      sku_master: sku_master ?? product.sku_master,
      description: description !== undefined ? description : product.description,
      base_price_buy: parsedPriceBuy ?? product.base_price_buy,
      base_price_sell: parsedPriceSell ?? product.base_price_sell,
      unit: unit ? unit.trim() : product.unit,
      stock: parsedStock ?? product.stock,
      categoryid: parsedCategoryId ?? product.categoryid,
      image_url: image_url !== undefined ? image_url : product.image_url,
    };

    await product.update(updateData);

    // HANDLING VARIANTS UPDATE
    if (variants) {
      const existingVariants = await Variant.findAll({
        where: { productId: id },
      });
      const existingVariantIds = existingVariants.map((v) => v.id);
      const incomingVariantIds = variants.filter((v) => v.id).map((v) => v.id);

      // Variants to delete
      const variantsToDelete = existingVariantIds.filter(
        (vId) => !incomingVariantIds.includes(vId)
      );
      if (variantsToDelete.length > 0) {
        await Variant.destroy({ where: { id: variantsToDelete } });
      }

      // Update or create variants
      for (const v of variants) {
        if (v.id) {
          const existingVariant = existingVariants.find((ev) => ev.id === v.id);
          if (existingVariant && existingVariant.productId === product.id) {
            await existingVariant.update(v);
          }
        } else {
          await Variant.create({ ...v, productId: product.id });
        }
      }
    }

    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Variant, as: "variants" },
      ],
    });

    res.status(200).json({
      message: "Produk berhasil diperbarui.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    // HANDLE SPECIFIC SEQUELIZE ERRORS
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Data sudah ada (duplikat)",
        error: error.message,
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Kategori tidak valid atau tidak ditemukan",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui produk.",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    await Variant.destroy({ where: { productId: id } });
    await product.destroy();

    res
      .status(200)
      .json({ message: "Produk dan variannya berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat menghapus produk.",
      error: error.message,
    });
  }
};

// --- Fungsi untuk Kategori ---

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Nama kategori harus diisi." });
    }
    const category = await Category.create({ name });
    res
      .status(201)
      .json({ message: "Kategori berhasil dibuat.", category });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Nama kategori sudah ada." });
    }
    res.status(500).json({
      message: "Terjadi kesalahan server saat membuat kategori.",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil kategori.",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }
    if (!name) {
      return res
        .status(400)
        .json({ message: "Nama kategori tidak boleh kosong." });
    }
    await category.update({ name });
    res
      .status(200)
      .json({ message: "Kategori berhasil diperbarui.", category });
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Nama kategori sudah ada." });
    }
    res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui kategori.",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }
    const productsInCategory = await Product.count({
      where: { categoryid: id },
    });
    if (productsInCategory > 0) {
      return res.status(400).json({
        message:
          "Tidak dapat menghapus kategori karena masih ada produk yang terkait.",
      });
    }

    await category.destroy();
    res.status(200).json({ message: "Kategori berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat menghapus kategori.",
      error: error.message,
    });
  }
};

// --- Fungsi untuk Ringkasan Kategori ---
exports.getCategorySummary = async (req, res) => {
  try {
    const summary = await Product.findAll({
      attributes: [
        "categoryid",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalBarang"],
      ],
      include: [{ model: Category, attributes: ["id", "name"] }],
      group: ["categoryid", "Category.id", "Category.name"],
      raw: true,
    });
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching category summary:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil ringkasan kategori.",
      error: error.message,
    });
  }
};