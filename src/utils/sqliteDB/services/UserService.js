import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray, stringifyJSON, parseJSON } from '../helpers';

const UserService = {};

UserService.create = async (userData) => {
  try {
    const db = getDatabase();

    if (!userData._id) userData._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO User (
        _id, firstName, lastName, email, phone, pointOfSale, pin, role,
        accessibleMenu, accessibleZone, avatar, active, connectedUser
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData._id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phone,
        userData.pointOfSale?._id || userData.pointOfSale,
        userData.pin,
        userData.role,
        stringifyJSON(userData.accessibleMenu || []),
        stringifyJSON(userData.accessibleZone || []),
        userData.avatar ? stringifyJSON(userData.avatar) : null,
        userData.active ? 1 : 0,
        userData.connectedUser ? 1 : 0
      ]
    );

    return userData;
  } catch (error) {
    console.error('User create error:', error);
    throw error;
  }
};

UserService.findById = async (userId) => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(
      `SELECT * FROM User WHERE _id = ?`,
      [userId]
    );

    if (result.rows.length > 0) {
      const user = resultsToArray(result, ['accessibleMenu', 'accessibleZone', 'avatar'])[0];
      return user;
    }
    return null;
  } catch (error) {
    console.error('User find by id error:', error);
    throw error;
  }
};

UserService.findAll = async () => {
  try {
    const db = getDatabase();
    const result = await db.executeSql(`SELECT * FROM User`);
    return resultsToArray(result, ['accessibleMenu', 'accessibleZone', 'avatar']);
  } catch (error) {
    console.error('User find all error:', error);
    throw error;
  }
};

UserService.updateConnectedUser = async (userId, connected) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE User SET connectedUser = ? WHERE _id = ?`,
      [connected ? 1 : 0, userId]
    );
  } catch (error) {
    console.error('User update connected error:', error);
    throw error;
  }
};

UserService.delete = async (userId) => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM User WHERE _id = ?`, [userId]);
  } catch (error) {
    console.error('User delete error:', error);
    throw error;
  }
};

export default UserService;
