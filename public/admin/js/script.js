// Xử lý phía FE
/* Button Status */
const buttonStatus = document.querySelectorAll("[button-status]"); // thuộc tính tự định nghĩa nên cần []
if(buttonStatus.length > 0) {
  let url = new URL(window.location.href); // Để sử dụng các hàm có sẵn của URL

  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      
      if(status) {
        url.searchParams.set("status", status); // searchParams là phần sau dấu "?"
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href; // chuyển hướng sang trang khác
    });
  });
}
/* End Button Status */

/* Form Search */
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // ngăn chặn sự kiện mặc định khi submit form (tránh load lại trang) | -> kết hợp với bộ lọc để tìm kiếm
    const keyword = e.target.elements.keyword.value;

    if(keyword) {
      url.searchParams.set("keyword", keyword); // searchParams là phần sau dấu "?"
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

/* End Form Search */