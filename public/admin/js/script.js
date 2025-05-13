// [------------------- Xử lý phía FE -------------------] //
// --------- Có thể dùng chung cho nhiều trang --------- //
/* Button Status ( Phần Bộ Lọc ) */
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


/* Form Search ( Phần Tìm Kiếm ) */
const formSearch = document.querySelector("#form-search");
if(formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // ngăn chặn sự kiện mặc định khi submit form (tránh load lại trang) | -> kết hợp với bộ lọc để tìm kiếm
    const keyword = e.target.elements.keyword.value; // lấy keyword người dùng nhập vào

    if(keyword) {
      url.searchParams.set("keyword", keyword); // searchParams là phần sau dấu "?"
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}
/* End Form Search */


/* Button Pagination ( Phần Phân Trang ) */
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      
      
      url.searchParams.set("page", page);
      window.location.href = url.href;
    })
  })
}
/* End Button Pagination */


/* --------- Thay đổi trạng thái nhiều sản phẩm --------- */
/* Checkbox Multi */
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  // Tick / bỏ tick tất cả
  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked == true){
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      });
    }
  });

  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length; // Đếm số ô đã Tick
      // console.log(countChecked);
      // console.log(inputsId.length);
      if(countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
/* End Checkbox Multi */

/* Form Change Multi */
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn hành động mặc định (load lại trang)
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

/* Thêm phần Xóa tất cả */
    const typeChange = e.target.elements.type.value;
    if(typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa những sản phẩm này không?");
      if(!isConfirm) { // Nếu người dùng nhấn hủy
        return;
      }
    }


    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      
      inputsChecked.forEach(input => {
        const id = input.value;

        if(typeChange == "change-position") {
          const position = input.closest("tr")
            .querySelector("input[name='position']").value; // từ ô tick đi ra ngoài thẻ tr, xong đi vào ô vị trí để lấy value mới
          
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", "); // chuyển sang string

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi");
    }
  
  });
}
/* End Form Change Multi */
/* --------- End Thay đổi trạng thái nhiều sản phẩm --------- */


/* Show Alert ( Hiển thị thông báo ) */
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  
  setTimeout(() =>{
    showAlert.classList.add("alert-hidden"); // đợi 5s tự ẩn
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden"); // click vào ẩn ngay
  });
}
/* End Show Alert ( Hiển thị thông báo ) */


/* Upload Image & Preview */
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => { // uploadImageInput cx chính là e.target
    const file = e.target.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
/* End Upload Image & Preview */


/* Sort SP theo các tiêu chí */
const sort = document.querySelector("[sort]");
if(sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  // Sắp xếp theo position, price, title
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href; //chuyển hướng sẽ load lại web
  });

  // Clear
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  // Thêm selected=true cho option (Nếu không chọn thì mặc định sẽ chọn option đầu tiên)
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if(sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected = true;
  }
}
/* End Sort SP theo các tiêu chí */