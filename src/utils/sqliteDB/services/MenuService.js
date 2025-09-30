import { executeSql, getDatabase } from '../database';
import { generateId, resultsToArray, stringifyJSON, parseJSON } from '../helpers';

const menuController = {};

menuController.create = async (data, pointOfSale) => {
  try {
    const db = getDatabase();

    let menu = JSON.parse(JSON.stringify(data));
    if (!menu._id) menu._id = generateId();

    await db.executeSql(
      `INSERT OR REPLACE INTO Menu (_id, menuName, pointOfSale) VALUES (?, ?, ?)`,
      [menu._id, menu.menuName, pointOfSale]
    );

    if (menu.CategoryMenu && menu.CategoryMenu.length > 0) {
      for (const cat of menu.CategoryMenu) {
        if (!cat._id) cat._id = generateId();

        await db.executeSql(
          `INSERT OR REPLACE INTO CategoryMenu (_id, itemsName, itemsSlug, menu, data) VALUES (?, ?, ?, ?, ?)`,
          [cat._id, cat.itemsName, cat.itemsSlug, menu._id, stringifyJSON(cat)]
        );

        if (cat.products && cat.products.length > 0) {
          for (const prod of cat.products) {
            const product = prod.product;
            if (!product._id) product._id = generateId();

            await db.executeSql(
              `INSERT OR REPLACE INTO CategoryItems (
                _id, itemsName, price, description, printOnTicket,
                image, categoryMenu, productionTypes, data
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                product._id,
                product.itemsName,
                product.price || 0,
                product.description,
                product.printOnTicket ? 1 : 0,
                product.image ? stringifyJSON(product.image) : null,
                cat._id,
                stringifyJSON(product.productionTypes || []),
                stringifyJSON(product)
              ]
            );

            if (prod.conditions && prod.conditions.length > 0) {
              for (const cond of prod.conditions) {
                if (!cond._id) cond._id = generateId();
                await db.executeSql(
                  `INSERT OR REPLACE INTO Options (_id, name, price, data) VALUES (?, ?, ?, ?)`,
                  [cond._id, cond.name, cond.price || 0, stringifyJSON(cond)]
                );
              }
            }

            if (prod.addableIngredients && prod.addableIngredients.length > 0) {
              for (const ing of prod.addableIngredients) {
                if (ing.options && ing.options.length > 0) {
                  for (const opt of ing.options) {
                    const ingredient = opt.ingredient;
                    if (ingredient && !ingredient._id) ingredient._id = generateId();
                    if (ingredient) {
                      await db.executeSql(
                        `INSERT OR REPLACE INTO Ingredient (_id, name, price, data) VALUES (?, ?, ?, ?)`,
                        [
                          ingredient._id,
                          ingredient.name,
                          opt.price || 0,
                          stringifyJSON(ingredient)
                        ]
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return menu;
  } catch (error) {
    console.error('Menu create error:', error);
    throw error;
  }
};

menuController.delete = async (data) => {
  try {
    const db = getDatabase();

    const result = await db.executeSql(`SELECT _id FROM Menu`);
    const menus = resultsToArray(result);

    const dataIds = data.map(d => d._id);

    for (const menu of menus) {
      if (!dataIds.includes(menu._id)) {
        await db.executeSql(`DELETE FROM CategoryMenu WHERE menu = ?`, [menu._id]);
        await db.executeSql(`DELETE FROM Menu WHERE _id = ?`, [menu._id]);
      }
    }
  } catch (error) {
    console.error('Menu delete error:', error);
    throw error;
  }
};

menuController.deletaAllTheOptions = async () => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM Options`);
    await db.executeSql(`DELETE FROM Ingredient`);
  } catch (error) {
    console.error('Delete all options error:', error);
    throw error;
  }
};

menuController.deleteAll = async () => {
  try {
    const db = getDatabase();
    await db.executeSql(`DELETE FROM CategoryMenu`);
    await db.executeSql(`DELETE FROM Menu`);
  } catch (error) {
    console.error('Delete all menus error:', error);
    throw error;
  }
};

export { menuController };
