import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray, stringifyJSON, parseJSON } from '../helpers';

const PrinterService = {};

PrinterService.create = async (printerData) => {
  try {
    const db = getDatabase();

    if (!printerData._id) printerData._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO Printer (
        _id, name, ip, port, type, productionTypes, pointOfSale
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        printerData._id,
        printerData.name,
        printerData.ip,
        printerData.port || 0,
        printerData.type,
        stringifyJSON(printerData.productionTypes || []),
        printerData.pointOfSale?._id || printerData.pointOfSale
      ]
    );

    return printerData;
  } catch (error) {
    console.error('Printer create error:', error);
    throw error;
  }
};

PrinterService.findById = async (printerId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Printer WHERE _id = ?`,
      [printerId]
    );

    if (result.rows.length > 0) {
      const printer = resultsToArray(result, ['productionTypes'])[0];
      return printer;
    }
    return null;
  } catch (error) {
    console.error('Printer find by id error:', error);
    throw error;
  }
};

PrinterService.findAll = async () => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(`SELECT * FROM Printer`);
    return resultsToArray(result, ['productionTypes']);
  } catch (error) {
    console.error('Printer find all error:', error);
    throw error;
  }
};

PrinterService.findByPointOfSale = async (pointOfSaleId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM Printer WHERE pointOfSale = ?`,
      [pointOfSaleId]
    );
    return resultsToArray(result, ['productionTypes']);
  } catch (error) {
    console.error('Printer find by point of sale error:', error);
    throw error;
  }
};

PrinterService.delete = async (printerId) => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM Printer WHERE _id = ?`, [printerId]);
  } catch (error) {
    console.error('Printer delete error:', error);
    throw error;
  }
};

export default PrinterService;
