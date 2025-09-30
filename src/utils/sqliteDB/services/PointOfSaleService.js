import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray, stringifyJSON, parseJSON } from '../helpers';

const PointOfSaleService = {};

PointOfSaleService.create = async (posData) => {
  try {
    const db = getDatabase();

    if (!posData._id) posData._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO PointOfSale (
        _id, name, address, phone, email, data
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        posData._id,
        posData.name,
        posData.address,
        posData.phone,
        posData.email,
        stringifyJSON(posData)
      ]
    );

    return posData;
  } catch (error) {
    console.error('PointOfSale create error:', error);
    throw error;
  }
};

PointOfSaleService.findById = async (posId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM PointOfSale WHERE _id = ?`,
      [posId]
    );

    if (result.rows.length > 0) {
      const pos = resultsToArray(result, ['data'])[0];
      return pos;
    }
    return null;
  } catch (error) {
    console.error('PointOfSale find by id error:', error);
    throw error;
  }
};

PointOfSaleService.findAll = async () => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(`SELECT * FROM PointOfSale`);
    return resultsToArray(result, ['data']);
  } catch (error) {
    console.error('PointOfSale find all error:', error);
    throw error;
  }
};

PointOfSaleService.delete = async (posId) => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM PointOfSale WHERE _id = ?`, [posId]);
  } catch (error) {
    console.error('PointOfSale delete error:', error);
    throw error;
  }
};

export default PointOfSaleService;
