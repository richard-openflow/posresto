export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const stringifyJSON = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return null;
  }
};

export const rowToObject = (row, jsonFields = []) => {
  const obj = {};
  for (let key in row) {
    if (jsonFields.includes(key)) {
      obj[key] = parseJSON(row[key]);
    } else {
      obj[key] = row[key];
    }
  }
  return obj;
};

export const resultsToArray = (results, jsonFields = []) => {
  const items = [];
  for (let i = 0; i < results.rows.length; i++) {
    const row = results.rows.item(i);
    items.push(rowToObject(row, jsonFields));
  }
  return items;
};
