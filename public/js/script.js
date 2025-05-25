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