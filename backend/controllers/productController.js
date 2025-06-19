const { Product, Category, Variant } = require("../models");

// Fungsi untuk generate SKU otomatis
const generateSKU = async () => {
  const count = await Product.count();
  const padded = String(count + 1).padStart(4, '0');
  return `SKU-${padded}`;
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
    categoryid, // ← UBAH DARI categoryId KE categoryid
    image_url,
    variants,
  } = req.body;

  try {
    // DEBUG: LOG DATA YANG DITERIMA
    console.log('Data yang diterima:', req.body);

    // VALIDASI FIELD REQUIRED
    if (!name || !base_price_buy || !base_price_sell || !unit || !categoryid) {
      return res.status(400).json({
        message: "Nama, harga beli, harga jual, unit, dan kategori harus diisi.",
      });
    }

    // CEK APAKAH KATEGORI ADA
    const categoryExists = await Category.findByPk(categoryid);
    if (!categoryExists) {
      return res.status(404).json({ message: "Kategori tidak ditemukan." });
    }

    // GENERATE SKU JIKA TIDAK ADA
    const finalSKU = sku_master || await generateSKU();

    const product = await Product.create({
      name,
      sku_master: finalSKU,
      description,
      base_price_buy,
      base_price_sell,
      unit,
      categoryid, // ← UBAH DARI categoryId KE categoryid
      image_url,
    });

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
      product: createdProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
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
    categoryid, // ← UBAH DARI categoryId KE categoryid
    image_url,
    variants,
  } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    // CEK KATEGORI JIKA ADA PERUBAHAN
    if (categoryid) {
      const categoryExists = await Category.findByPk(categoryid);
      if (!categoryExists) {
        return res.status(404).json({ message: "Kategori tidak ditemukan." });
      }
    }

    await product.update({
      name: name ?? product.name,
      sku_master: sku_master ?? product.sku_master,
      description: description ?? product.description,
      base_price_buy: base_price_buy ?? product.base_price_buy,
      base_price_sell: base_price_sell ?? product.base_price_sell,
      unit: unit ?? product.unit,
      categoryid: categoryid ?? product.categoryid, // ← UBAH DARI categoryId KE categoryid
      image_url: image_url ?? product.image_url,
    });

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

    res.status(200).json({ message: "Produk dan variannya berhasil dihapus." });
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
    res.status(201).json({ message: "Kategori berhasil dibuat.", category });
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
      where: { categoryid: id }, // ← UBAH DARI categoryId KE categoryid
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
