const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => { 
  const getCategory = async (parentId) => { // phải viết bên trong mới dùng đệ quy được
    const subs = await ProductCategory.find({
      // Tìm danh mục con
      parent_id: parentId,
      status: "active",
      deleted: false,
    });

    let allSub = [...subs]; // Để chứa tất cả phần tử (cả cha lẫn con)

    for (const sub of subs) {
      const childs = await getCategory(sub.id); // Tìm các danh mục con của mỗi pt trong subs
      allSub = allSub.concat(childs);
    }

    return allSub;
  };

  const result = await getCategory(parentId); // gọi hàm lần đầu
  return result;
};