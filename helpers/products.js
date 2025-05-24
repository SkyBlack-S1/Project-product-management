// Tính giá mới của Mảng sản phẩm sau khi giảm giá
module.exports.priceNewProducts = (products) => {
  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  return newProducts;
};

// Tính giá mới của 1 sản phẩm sau khi giảm giá
module.exports.priceNewProduct = (product) => {
  const priceNew = ((product.price * (100 - product.discountPercentage)) 
  / 100).toFixed(0);
  
  return priceNew;
};