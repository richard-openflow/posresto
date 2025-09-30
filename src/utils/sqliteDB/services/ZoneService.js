import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray } from '../helpers';

const ZoneService = {};

ZoneService.create = async (zoneData) => {
  try {
    const db = getDatabase();

    if (!zoneData._id) zoneData._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO Zone (
        _id, enableOccasion, pointOfSale, index_order, name,
        nameSlug, percentage, timePerBooking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        zoneData._id,
        zoneData.enableOccasion ? 1 : 0,
        zoneData.pointOfSale?._id || zoneData.pointOfSale,
        zoneData.index || 1,
        zoneData.name,
        zoneData.nameSlug,
        zoneData.percentage || 0,
        zoneData.timePerBooking || 0
      ]
    );

    return zoneData;
  } catch (error) {
    console.error('Zone create error:', error);
    throw error;
  }
};

ZoneService.findById = async (zoneId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Zone WHERE _id = ?`,
      [zoneId]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Zone find by id error:', error);
    throw error;
  }
};

ZoneService.findAll = async () => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(`SELECT * FROM Zone ORDER BY index_order`);
    return resultsToArray(result);
  } catch (error) {
    console.error('Zone find all error:', error);
    throw error;
  }
};

ZoneService.findByPointOfSale = async (pointOfSaleId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Zone WHERE pointOfSale = ? ORDER BY index_order`,
      [pointOfSaleId]
    );
    return resultsToArray(result);
  } catch (error) {
    console.error('Zone find by point of sale error:', error);
    throw error;
  }
};

ZoneService.delete = async (zoneId) => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM Zone WHERE _id = ?`, [zoneId]);
  } catch (error) {
    console.error('Zone delete error:', error);
    throw error;
  }
};

export default ZoneService;
