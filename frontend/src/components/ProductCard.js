import React from "react";

const ProductCard = ({ product, onSelect }) => {
  const totalStock = product.variants
    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
    : 0;

  const firstImage = product.variants?.[0]?.image || "";

  return (
    <div className="card" onClick={() => onSelect(product)}>
      <img src={firstImage} alt={product.name} />
      <p className="name">{product.name}</p>
      <p className="price">Rp{product.price.toLocaleString()}</p>
      <p className="stock">Stok total: {totalStock}</p> {/* <-- akan berubah otomatis */}
    </div>
  );
};

export default ProductCard;
