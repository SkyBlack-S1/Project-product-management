module.exports = (query) => {
  let objectSearch = {
    keyword: "",
  }
  if(query.keyword){
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i");
    objectSearch.regex = regex;  // tương tự add 1 key-value vào Object (Nếu có)
  }

  return objectSearch;
}