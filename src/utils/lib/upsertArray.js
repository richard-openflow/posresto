function upsertArray(arr, newObjs, key) {
  const map = new Map();

  // Fill the map with existing array objects
  arr.forEach(obj => {
    map.set(obj[key], obj);
  });

  // Upsert new objects into the map
  newObjs.forEach(newObj => {
    map.set(newObj[key], newObj);
  });

  // Convert map values back to an array
  const result =  Array.from(map.values());

  // console.error("#######", result)

  return result
}

export {upsertArray};
