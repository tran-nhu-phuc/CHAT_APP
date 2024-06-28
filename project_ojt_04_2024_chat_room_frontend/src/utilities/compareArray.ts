export function compareArrays(oldArray: number[], newArray: number[]) {
  // So sánh độ dài của hai mảng
  if (newArray.length !== oldArray.length) {
    return false;
  } else {
    // So sánh từng phần tử trong hai mảng
    for (let i = 0; i < newArray.length; i++) {
      if (!oldArray.includes(newArray[i])) {
        return false;
      }
    }
  }

  // Nếu tất cả các phần tử đều giống nhau, trả về true
  return true;
}
