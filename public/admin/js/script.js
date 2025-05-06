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