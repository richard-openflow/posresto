import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray } from '../helpers';

const UnitService = {};

UnitService.create = async (unitData) => {
  try {
    const db = getDatabase();

    if (!unitData._id) unitData._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO Unit (
        _id, unitName, x, y, localX, localY, shape, Disponibility,
        Category, isArchived, unitType, unitNumber, seatsNumber,
        minSize, localization, pointOfSale, zone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        unitData._id,
        unitData.unitName,
        unitData.x || 0,
        unitData.y || 0,
        unitData.localX || 0,
        unitData.localY || 0,
        unitData.shape,
        unitData.Disponibility ? 1 : 0,
        unitData.Category,
        unitData.isArchived ? 1 : 0,
        unitData.unitType,
        unitData.unitNumber || 0,
        unitData.seatsNumber || 0,
        unitData.minSize || 0,
        unitData.localization,
        unitData.pointOfSale?._id || unitData.pointOfSale,
        unitData.zone?._id || unitData.zone
      ]
    );

    return unitData;
  } catch (error) {
    console.error('Unit create error:', error);
    throw error;
  }
};

UnitService.findById = async (unitId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Unit WHERE _id = ?`,
      [unitId]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Unit find by id error:', error);
    throw error;
  }
};

UnitService.findByNumber = async (unitNumber) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Unit WHERE unitNumber = ?`,
      [unitNumber]
    );

    if (result.rows.length > 0) {
      return result.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Unit find by number error:', error);
    throw error;
  }
};

UnitService.findAll = async () => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(`SELECT * FROM Unit`);
    return resultsToArray(result);
  } catch (error) {
    console.error('Unit find all error:', error);
    throw error;
  }
};

UnitService.findByZone = async (zoneId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Unit WHERE zone = ?`,
      [zoneId]
    );
    return resultsToArray(result);
  } catch (error) {
    console.error('Unit find by zone error:', error);
    throw error;
  }
};

UnitService.updatePosition = async (unitId, x, y, localX, localY) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE Unit SET x = ?, y = ?, localX = ?, localY = ? WHERE _id = ?`,
      [x, y, localX, localY, unitId]
    );
  } catch (error) {
    console.error('Unit update position error:', error);
    throw error;
  }
};

UnitService.delete = async (unitId) => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM Unit WHERE _id = ?`, [unitId]);
  } catch (error) {
    console.error('Unit delete error:', error);
    throw error;
  }
};

export default UnitService;
