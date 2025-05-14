// Hàm xử lý phân cấp cho Trang danh mục & Thêm mới danh mục
let count = 0; // biến toàn cục chỉ biến mất khi tắt server ( Trình duyệt )
const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem = item;
      newItem.index = count;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

module.exports.tree = (arr, parentId = "") => {
  count = 0;
  const tree = createTree(arr, parentId = "");
  return tree;
};

/* Giải thích cho hàm createTree
arr là 1 mảng các Object
Duyệt qua từng Object (item)
Khi parent_id === parentId, tức là tồn tại A (con của danh mục có id = parentId)
Gán A vào Object (newItem), tiếp tục tìm các con của A (bằng cách truyền id của A và gọi đệ quy), sau đó gán vào mảng children
Nếu children.length > 0, tức là A có tồn tại con, thì gán mảng children (các con của A) vào Object newItem
Lúc này trong Object newItem gồm : A, các con và cháu của nó (Nếu có)
Cuối cùng push tất cả vào tree
*/