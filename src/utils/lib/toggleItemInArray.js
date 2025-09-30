function toggleItemInArray(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) {
    // Item exists in the array, remove it
    array.splice(index, 1);
  } else {
    // Item does not exist in the array, add it
    array.push(item);
  }
  return [...array];
}

export {toggleItemInArray};
