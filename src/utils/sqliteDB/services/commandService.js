import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray, stringifyJSON, parseJSON } from '../helpers';
import moment from 'moment';
import { sendToEveryOne } from '../../Udp/services';
import { getSocket } from '../../socket';
import DeviceInfo from 'react-native-device-info';
import CashBoxServices from './CashBoxServices';
import { API } from '../../BaseApi';
import Snackbar from 'react-native-snackbar';
import tinyEmitter from 'tiny-emitter/instance';
import { checkIfOrderPayed } from '../../helpers';

const CommandController = {};

const changeAllIds = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => changeAllIds(item));
  } else if (typeof obj === 'object' && obj !== null) {
    let updated = { ...obj };
    for (const key in obj) {
      if (key === '_id' && !updated[key]) {
        updated[key] = generateId();
      } else if (Array.isArray(updated[key]) || (typeof updated[key] === 'object' && updated[key] !== null)) {
        updated[key] = changeAllIds(updated[key]);
      }
    }
    return updated;
  }
  return obj;
};

CommandController.create = async (orders) => {
  try {
    const db = getDatabase();

    for (const data of orders) {
      let order = JSON.parse(JSON.stringify(data));

      if (!order?._id) order._id = generateId();
      if (!order?.orderNumber) order.orderNumber = moment().valueOf() + '';
      else order.orderNumber = order.orderNumber + '';
      if (!order?.createdAt) order.createdAt = moment().valueOf();

      order = changeAllIds(order);

      const pointOfSaleId = data?.pointOfSale?._id;
      const userId = data?.user?._id;
      const unitId = data?.unit?._id;
      const zoneId = data?.zone?._id;
      const ZId = data?.Z?._id;

      const commandProducts = order.commandProduct || [];
      delete order.commandProduct;

      const paidHistory = order.paidHistory || [];
      delete order.paidHistory;

      await db.executeSql(
        `INSERT OR REPLACE INTO Orders (
          _id, orderNumber, numberPeople, Z, origin, uniqueId, createdBy,
          type, note, nextInKitchen, createdAt, paid, unit, user, zone,
          archived, pointOfSale, firstName, lastName, email, phone, addresse,
          Ice, Company, sync, saved, startSent, wasConnectedOnCreation,
          bookingId, paymentRequired, payStatus, payAmount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order._id, order.orderNumber, order.numberPeople || 1,
          ZId, order.origin || 'pos', order.uniqueId || '-',
          stringifyJSON(order.createdBy), order.type, order.note,
          order.nextInKitchen || 0, order.createdAt, order.paid ? 1 : 0,
          unitId, userId, zoneId, order.archived ? 1 : 0, pointOfSaleId,
          order.firstName, order.lastName, order.email, order.phone,
          order.addresse, order.Ice, order.Company, order.sync ? 1 : 0,
          order.saved ? 1 : 0, order.startSent ? 1 : 0,
          order.wasConnectedOnCreation ? 1 : 0, order.bookingId,
          order.paymentRequired ? 1 : 0, order.payStatus, order.payAmount || 0
        ]
      );

      for (const cp of commandProducts) {
        if (!cp._id) cp._id = generateId();
        await db.executeSql(
          `INSERT OR REPLACE INTO CommandProduct (
            _id, addOnDate, clickCount, dateZ, sent, orderClassifying,
            paid, status, linkToFormula, unid, addablePrice, product,
            note, order_id, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cp._id, cp.addOnDate, cp.clickCount, cp.dateZ, cp.sent || 0,
            cp.orderClassifying || 1, cp.paid ? 1 : 0, cp.status || 'new',
            cp.linkToFormula, cp.unid, cp.addablePrice,
            typeof cp.product === 'object' ? cp.product?._id : cp.product,
            cp.note, order._id,
            stringifyJSON({
              conditionsChoose: cp.conditionsChoose || [],
              addableIngredientsChoose: cp.addableIngredientsChoose || [],
              removableIngredientsChoose: cp.removableIngredientsChoose || []
            })
          ]
        );
      }

      for (const ph of paidHistory) {
        if (!ph._id) ph._id = generateId();
        await db.executeSql(
          `INSERT OR REPLACE INTO PayHistory (
            _id, payType, amount, roomNumber, firstName, lastName,
            phone, email, products, offertBy, order_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ph._id, ph.payType, ph.amount, ph.roomNumber, ph.firstName,
            ph.lastName, ph.phone, ph.email, stringifyJSON(ph.products),
            ph.offertBy, order._id
          ]
        );
      }

      if (!order.saved) {
        await db.executeSql(
          `UPDATE Orders SET saved = 1 WHERE _id = ?`,
          [order._id]
        );
        tinyEmitter.emit('saved-order', order._id);
      }
    }

    return orders;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

CommandController.updateCommandStatus = async (ids, useTCP = true, currentRestaurant) => {
  try {
    const db = getDatabase();

    for (const id of ids) {
      const result = await db.executeSql(
        `SELECT status FROM CommandProduct WHERE _id = ?`,
        [id]
      );

      if (result.rows.length > 0) {
        const currentStatus = result.rows.item(0).status;
        let newStatus = 'done';

        if (currentStatus === 'new') {
          newStatus = 'inprogress';
        } else if (currentStatus === 'inprogress') {
          newStatus = 'awaiting';
        } else if (currentStatus === 'awaiting') {
          newStatus = 'done';
        } else if (currentStatus === 'cancel') {
          newStatus = 'cancel';
        }

        await db.executeSql(
          `UPDATE CommandProduct SET status = ? WHERE _id = ?`,
          [newStatus, id]
        );
      }
    }

    if (useTCP) {
      sendToEveryOne({ event: 'UPDATE_COMMAND_STATUS', payload: ids });
    }

    if (currentRestaurant) {
      const DeviceId = await DeviceInfo.getDeviceId();
      getSocket().emit('update-status-kitchen', {
        _id: currentRestaurant,
        data: { ids, DeviceId }
      });
    }

    return ids;
  } catch (error) {
    console.error('Update command status error:', error);
    throw error;
  }
};

CommandController.updateCommandKitchen = async (id, type = 'sent', value, currentRestaurant, useTCP = true) => {
  try {
    const db = getDatabase();

    if (type === 'sent') {
      await db.executeSql(
        `UPDATE CommandProduct SET sent = ? WHERE _id = ?`,
        [value, id]
      );
    } else if (type === 'orderClassifying') {
      await db.executeSql(
        `UPDATE CommandProduct SET orderClassifying = ? WHERE _id = ?`,
        [value, id]
      );
    }

    if (currentRestaurant) {
      const DeviceId = await DeviceInfo.getDeviceId();
      getSocket().emit('update-command-kitchen', {
        _id: currentRestaurant,
        data: { id, type, value, DeviceId }
      });
    }

    return { id, type, value };
  } catch (error) {
    console.error('Update command kitchen error:', error);
    throw error;
  }
};

CommandController.cancelCommnadItem = async (id, useTCP = true) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE CommandProduct SET status = 'cancel' WHERE _id = ?`,
      [id]
    );

    if (useTCP) {
      sendToEveryOne({ event: 'CANCEL_COMMAND_CONTROLLER', payload: id });
    }

    return { id };
  } catch (error) {
    console.error('Cancel command item error:', error);
    throw error;
  }
};

CommandController.payCommand = async (
  id,
  payType,
  amount,
  useTCP = true,
  roomNumber,
  firstName,
  lastName,
  phone,
  email,
  products,
  currentRestaurant,
  offertBy = ''
) => {
  try {
    const db = getDatabase();
    const payHistoryId = generateId();

    await db.executeSql(
      `INSERT INTO PayHistory (
        _id, payType, amount, roomNumber, firstName, lastName,
        phone, email, products, offertBy, order_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payHistoryId, payType, amount, roomNumber, firstName, lastName,
        phone, email, stringifyJSON(products), offertBy, id
      ]
    );

    const orderResult = await db.executeSql(
      `SELECT * FROM Orders WHERE _id = ?`,
      [id]
    );

    if (orderResult.rows.length > 0) {
      const order = orderResult.rows.item(0);

      API.post('/orders/pos-create-order', JSON.parse(JSON.stringify({ ord: order, Z: order.Z })))
        .catch(e => {
          Snackbar.show({
            text: 'Verify your internet',
            duration: Snackbar.LENGTH_SHORT,
          });
        });
    }

    if (currentRestaurant) {
      const DeviceId = await DeviceInfo.getDeviceId();
      getSocket().emit('pay-command', {
        _id: currentRestaurant,
        data: {
          id, payType, amount, useTCP, roomNumber, firstName,
          lastName, phone, email, products, DeviceId
        }
      });
    }

    return { id };
  } catch (error) {
    console.error('Pay command error:', error);
    throw error;
  }
};

CommandController.noteACommand = async (orderNumber, note, useTCP = true) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE Orders SET note = ? WHERE orderNumber = ?`,
      [note, orderNumber + '']
    );

    if (useTCP) {
      sendToEveryOne({ event: 'NOTE_A_COMMAND_CONTROLLER', payload: { orderNumber, note } });
    }

    return { orderNumber, note };
  } catch (error) {
    console.error('Note a command error:', error);
    throw error;
  }
};

CommandController.sentAllCommandToKitchen = async (id, useTCP = true, callback = () => {}) => {
  try {
    const db = getDatabase();

    const result = await db.executeSql(
      `SELECT * FROM CommandProduct WHERE order_id = ?`,
      [id]
    );

    for (let i = 0; i < result.rows.length; i++) {
      const cp = result.rows.item(i);
      const newSent = cp.orderClassifying <= cp.sent ? cp.sent : cp.sent + 1;

      await db.executeSql(
        `UPDATE CommandProduct SET sent = ? WHERE _id = ?`,
        [newSent, cp._id]
      );
    }

    const orderResult = await db.executeSql(
      `SELECT nextInKitchen FROM Orders WHERE _id = ?`,
      [id]
    );

    if (orderResult.rows.length > 0) {
      const nextInKitchen = orderResult.rows.item(0).nextInKitchen;
      await db.executeSql(
        `UPDATE Orders SET startSent = 1, nextInKitchen = ? WHERE _id = ?`,
        [nextInKitchen + 1, id]
      );
    }

    callback({ _id: id });

    if (useTCP) {
      sendToEveryOne({ event: 'SENT_ALL_COMMAND_KITCHEN_CONTROLLER', payload: id });
    }

    return { id };
  } catch (error) {
    console.error('Sent all command to kitchen error:', error);
    throw error;
  }
};

CommandController.findByUnitNumber = async (orders, unitNumber) => {
  try {
    const db = getDatabase();

    const unitResult = await db.executeSql(
      `SELECT * FROM Unit WHERE unitNumber = ?`,
      [parseInt(unitNumber)]
    );

    let unit = null;
    if (unitResult.rows.length > 0) {
      unit = unitResult.rows.item(0);
    }

    let fOrders = [];
    for (const order of orders) {
      if (order?.unit?.unitNumber == parseInt(unitNumber)) {
        const cpResult = await db.executeSql(
          `SELECT * FROM CommandProduct WHERE order_id = ?`,
          [order._id]
        );

        const commandProducts = resultsToArray(cpResult, ['data']);

        const total = commandProducts.reduce((total, cp) => {
          if (cp.status === 'cancel') return total;
          const data = parseJSON(cp.data) || {};
          return total + (cp.product?.price || 0) * cp.clickCount;
        }, 0);

        const phResult = await db.executeSql(
          `SELECT * FROM PayHistory WHERE order_id = ?`,
          [order._id]
        );

        const paidHistory = resultsToArray(phResult, ['products']);
        const totalPayed = paidHistory.reduce((total, ph) => total + ph.amount, 0);

        if (total > totalPayed) {
          fOrders.push(order);
        }
      }
    }

    return { order: fOrders, unit };
  } catch (error) {
    console.error('Find by unit number error:', error);
    throw error;
  }
};

CommandController.findUnsentCommand = async () => {
  try {
    const db = getDatabase();
    let dd = moment(new Date(moment().format('YYYY-MM-DD 00:00:00')));
    let df = dd.clone().add(1, 'day');
    dd = dd.valueOf();
    df = df.valueOf();

    const result = await db.executeSql(
      `SELECT * FROM Orders WHERE createdAt >= ? AND createdAt <= ?`,
      [dd, df]
    );

    return resultsToArray(result, ['createdBy']);
  } catch (error) {
    console.error('Find unsent command error:', error);
    throw error;
  }
};

CommandController.hasBeenSynced = async (id) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE Orders SET sync = 1 WHERE _id = ?`,
      [id]
    );
    return { id };
  } catch (error) {
    console.error('Has been synced error:', error);
    throw error;
  }
};

CommandController.getUnPaidCommmand = async ({ orders, dt, unitId }) => {
  try {
    let filteredOrders = [];

    for (const order of orders) {
      if (order.type !== 'onsite') continue;

      const db = getDatabase();
      const cpResult = await db.executeSql(
        `SELECT * FROM CommandProduct WHERE order_id = ?`,
        [order._id]
      );

      const commandProducts = resultsToArray(cpResult, ['data']);

      const total = commandProducts.reduce((total, cp) => {
        if (cp.status === 'cancel') return total;
        const data = parseJSON(cp.data) || {};
        const price = cp.linkToFormula ? cp.addablePrice : (cp.product?.price || 0);
        return total + price * cp.clickCount;
      }, 0);

      const phResult = await db.executeSql(
        `SELECT * FROM PayHistory WHERE order_id = ?`,
        [order._id]
      );

      const paidHistory = resultsToArray(phResult, ['products']);
      const totalPayed = paidHistory.reduce((total, ph) => total + ph.amount, 0);

      if (totalPayed < total && total > 0) {
        filteredOrders.push(order);
      }
    }

    if (unitId) {
      filteredOrders = filteredOrders.filter(e => e?.unit === unitId);
    }

    return filteredOrders;
  } catch (error) {
    console.error('Get unpaid command error:', error);
    throw error;
  }
};

CommandController.changeUnitOfCommand = async (orders = [], id, new_unit, callback = () => {}) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE Orders SET unit = ? WHERE _id = ?`,
      [new_unit?._id, id]
    );

    const ord = orders.find(e => e?._id === id) || {};
    ord.unit = new_unit;
    callback(ord);

    return ord;
  } catch (error) {
    console.error('Change unit of command error:', error);
    throw error;
  }
};

CommandController.setDateZToCommand = async (
  {
    orders = [],
    pointOfSale,
    esp,
    check,
    CB,
    bank,
    credit,
    room,
    amountCash,
    amountCreditCard,
    amountBank,
    amountCheck,
    amountRoom,
    amountCredit,
    amountOffer,
    uniqueId,
    dbdid,
    nbrPeople
  },
  callback = () => {},
  callError = () => {}
) => {
  try {
    const db = getDatabase();
    const newDate = new Date();
    const cashBox = await CashBoxServices.create({
      dateOfZ: newDate,
      pointOfSale,
      esp,
      check,
      CB,
      bank,
      credit,
      room
    });

    const { z } = await API.post('/orders/pos-create-z', {
      ...cashBox,
      amountCash,
      amountCreditCard,
      amountBank,
      amountCheck,
      amountRoom,
      amountCredit,
      amountOffer,
      uniqueId,
      dbdid,
      nbrPeople
    });

    try {
      const posOrders = orders.filter(e => e?.origin === 'pos');
      for (let ord of posOrders) {
        if (!ord?.Z) ord.Z = JSON.parse(JSON.stringify(z));
        API.post('/orders/pos-create-order', JSON.parse(JSON.stringify({
          ord: { ...ord, pointOfSale: ord?.pointOfSale },
          Z: ord?.Z?._id
        })));
      }
    } catch (err) {
      alert('Erreur while uploading data to server');
      callError();
    } finally {
      tinyEmitter.emit('clear-order-number');
      await db.executeSql(
        `DELETE FROM Orders WHERE pointOfSale = ?`,
        [pointOfSale?._id]
      );
      callback();
    }
  } catch (error) {
    console.error('Set date Z to command error:', error);
    callError();
  }
};

CommandController.transferCommand = async ({ pointOfSale, sender, receiver }) => {
  try {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE Orders SET user = ? WHERE Z IS NULL AND user = ? AND pointOfSale = ?`,
      [receiver, sender, pointOfSale]
    );
  } catch (error) {
    console.error('Transfer command error:', error);
    throw error;
  }
};

CommandController.deleteOrders = async (ord, pointOfSale) => {
  try {
    const db = getDatabase();

    const result = await db.executeSql(
      `SELECT _id FROM Orders WHERE pointOfSale = ?`,
      [pointOfSale]
    );

    const dbOrders = resultsToArray(result);
    const ordIds = ord.map(o => o._id);

    const toDelete = dbOrders.filter(o => !ordIds.includes(o._id));

    for (const order of toDelete) {
      await db.executeSql(`DELETE FROM CommandProduct WHERE order_id = ?`, [order._id]);
      await db.executeSql(`DELETE FROM PayHistory WHERE order_id = ?`, [order._id]);
      await db.executeSql(`DELETE FROM Orders WHERE _id = ?`, [order._id]);
    }
  } catch (error) {
    console.error('Delete orders error:', error);
    throw error;
  }
};

export { CommandController };
