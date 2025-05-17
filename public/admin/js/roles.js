// Chỉ dùng ở phần Phân quyền nên tạo file riêng
// Chỉ xoay quanh bài toán làm sao để gửi data cho BE -> Gửi qua Forms | Gửi qua API
/* Permissions */
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      
      if(name == "id") {
        inputs.forEach(input => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if(checked == true) {
            permissions[index].permissions.push(name);
          }
        });
      }        
    }); 

    if(permissions.length > 0){ // chèn vào ô input
      const formChangePermissions = document.querySelector("#form-change-permissions");
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
      inputPermissions.value = JSON.stringify(permissions); // do input lưu dưới dạng chuỗi, nên cần chuyển mảng permissions (js) thành chuỗi json
      formChangePermissions.submit();
    }
  });
}
/* End Permissions */

/* Permissions default (Vẫn hiển thị các dấu tick sau khi submit) */
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  records.forEach((record, index) => {
    const permissions = record.permissions;
    permissions.forEach(permission => { // duyệt qua từng dataname trong permissions
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`); // tìm đến hàng có data-name trùng với data-name được truyền vào, trong hàng có nhiều ô input
      const input = row.querySelectorAll("input")[index]; // tìm đến ô input có index được truyền vào, tức sẽ được tick
      input.checked = true;
    });
  });
}
/* End Permissions default (Vẫn hiển thị các dấu tick sau khi submit) */