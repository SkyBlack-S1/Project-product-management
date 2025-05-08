// [------------------- Xử lý phía FE -------------------] //
/* Change Status */
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path);

  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      console.log(statusCurrent);
      console.log(id);
      console.log(statusChange);

      const action = path + `/${statusChange}/${id}?_method=PATCH`; // gửi lên là PATCH để không cho phép User chỉnh sửa
      formChangeStatus.action = action;

      formChangeStatus.submit();
    })
  });
}
/* End Change Status */