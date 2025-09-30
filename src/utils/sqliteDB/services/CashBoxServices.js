import { executeSql, getDatabase } from '../database';
import { generateId } from '../helpers';

const CashBoxServices = {};

CashBoxServices.create = async ({ dateOfZ, pointOfSale, esp, check, CB, bank, credit, room }) => {
  try {
    const db = getDatabase();
    const _id = generateId();

    await db.executeSql(
      `INSERT INTO BoxInformation (
        _id, dateOfZ, esp, check_amount, CB, bank, credit, room, pointOfSale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        _id,
        dateOfZ.getTime(),
        esp || 0,
        check || 0,
        CB || 0,
        bank || 0,
        credit || 0,
        room || 0,
        pointOfSale?._id
      ]
    );

    return {
      _id,
      dateOfZ: dateOfZ.getTime(),
      esp: esp || 0,
      check_amount: check || 0,
      CB: CB || 0,
      bank: bank || 0,
      credit: credit || 0,
      room: room || 0,
      pointOfSale: pointOfSale?._id,
      toJSON: function() {
        return {
          _id: this._id,
          dateOfZ: this.dateOfZ,
          esp: this.esp,
          check_amount: this.check_amount,
          CB: this.CB,
          bank: this.bank,
          credit: this.credit,
          room: this.room,
          pointOfSale: this.pointOfSale
        };
      }
    };
  } catch (error) {
    console.error('Create cash box error:', error);
    throw error;
  }
};

export default CashBoxServices;
