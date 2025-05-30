// Random ra Token ngẫu nhiên
module.exports.generateRandomString = (length) => {
  const characters = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  
  for(let i = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}


// Random ra mã OTP (chỉ bao gồm số) ngẫu nhiên
module.exports.generateRandomNumber = (length) => {
  const characters = "0123456789";
  
  let result = "";
  
  for(let i = 0; i < length; i++){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}