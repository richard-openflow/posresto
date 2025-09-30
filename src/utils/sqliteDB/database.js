import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = 'pos.db';
const database_version = '1.0';
const database_displayname = 'POS Database';
const database_size = 200000;

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    await createTables();
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

const createTables = async () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS PointOfSale (
      _id TEXT PRIMARY KEY,
      name TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      data TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS User (
      _id TEXT PRIMARY KEY,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      phone TEXT,
      pointOfSale TEXT,
      pin TEXT,
      role TEXT,
      accessibleMenu TEXT,
      accessibleZone TEXT,
      avatar TEXT,
      active INTEGER DEFAULT 0,
      connectedUser INTEGER DEFAULT 0,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Zone (
      _id TEXT PRIMARY KEY,
      enableOccasion INTEGER,
      pointOfSale TEXT,
      index_order INTEGER DEFAULT 1,
      name TEXT,
      nameSlug TEXT,
      percentage INTEGER,
      timePerBooking INTEGER,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Unit (
      _id TEXT PRIMARY KEY,
      unitName TEXT,
      x INTEGER,
      y INTEGER,
      localX INTEGER DEFAULT 0,
      localY INTEGER DEFAULT 0,
      shape TEXT,
      Disponibility INTEGER,
      Category TEXT,
      isArchived INTEGER,
      unitType TEXT,
      unitNumber INTEGER,
      seatsNumber INTEGER,
      minSize INTEGER,
      localization TEXT,
      pointOfSale TEXT,
      zone TEXT,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id),
      FOREIGN KEY (zone) REFERENCES Zone(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Menu (
      _id TEXT PRIMARY KEY,
      menuName TEXT,
      pointOfSale TEXT,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS CategoryMenu (
      _id TEXT PRIMARY KEY,
      itemsName TEXT,
      itemsSlug TEXT,
      menu TEXT,
      data TEXT,
      FOREIGN KEY (menu) REFERENCES Menu(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS CategoryItems (
      _id TEXT PRIMARY KEY,
      itemsName TEXT,
      price INTEGER,
      description TEXT,
      printOnTicket INTEGER,
      image TEXT,
      categoryMenu TEXT,
      productionTypes TEXT,
      data TEXT,
      FOREIGN KEY (categoryMenu) REFERENCES CategoryMenu(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS BoxInformation (
      _id TEXT PRIMARY KEY,
      dateOfZ INTEGER,
      esp INTEGER,
      check_amount INTEGER,
      CB INTEGER,
      bank INTEGER,
      credit INTEGER,
      room INTEGER,
      pointOfSale TEXT,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Orders (
      _id TEXT PRIMARY KEY,
      orderNumber TEXT,
      numberPeople INTEGER DEFAULT 1,
      Z TEXT,
      origin TEXT DEFAULT 'pos',
      uniqueId TEXT DEFAULT '-',
      createdBy TEXT,
      type TEXT,
      note TEXT,
      nextInKitchen INTEGER DEFAULT 0,
      createdAt INTEGER,
      paid INTEGER DEFAULT 0,
      unit TEXT,
      user TEXT,
      zone TEXT,
      archived INTEGER DEFAULT 0,
      pointOfSale TEXT,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      phone TEXT,
      addresse TEXT,
      Ice TEXT,
      Company TEXT,
      sync INTEGER DEFAULT 0,
      saved INTEGER DEFAULT 0,
      startSent INTEGER DEFAULT 0,
      wasConnectedOnCreation INTEGER DEFAULT 1,
      bookingId TEXT,
      paymentRequired INTEGER DEFAULT 0,
      payStatus TEXT,
      payAmount INTEGER DEFAULT 0,
      FOREIGN KEY (unit) REFERENCES Unit(_id),
      FOREIGN KEY (user) REFERENCES User(_id),
      FOREIGN KEY (zone) REFERENCES Zone(_id),
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id),
      FOREIGN KEY (Z) REFERENCES BoxInformation(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS CommandProduct (
      _id TEXT PRIMARY KEY,
      addOnDate INTEGER,
      clickCount INTEGER,
      dateZ INTEGER,
      sent INTEGER DEFAULT 0,
      orderClassifying REAL DEFAULT 1,
      paid INTEGER DEFAULT 0,
      status TEXT DEFAULT 'new',
      linkToFormula TEXT,
      unid TEXT,
      addablePrice INTEGER,
      product TEXT,
      note TEXT,
      order_id TEXT,
      data TEXT,
      FOREIGN KEY (order_id) REFERENCES Orders(_id),
      FOREIGN KEY (product) REFERENCES CategoryItems(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS PayHistory (
      _id TEXT PRIMARY KEY,
      payType TEXT,
      amount INTEGER,
      roomNumber TEXT,
      firstName TEXT,
      lastName TEXT,
      phone TEXT,
      email TEXT,
      products TEXT,
      offertBy TEXT,
      order_id TEXT,
      FOREIGN KEY (order_id) REFERENCES Orders(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS ProductionTypes (
      _id TEXT PRIMARY KEY,
      name TEXT,
      pointOfSale TEXT,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Printer (
      _id TEXT PRIMARY KEY,
      name TEXT,
      ip TEXT,
      port INTEGER,
      type TEXT,
      productionTypes TEXT,
      pointOfSale TEXT,
      FOREIGN KEY (pointOfSale) REFERENCES PointOfSale(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS Options (
      _id TEXT PRIMARY KEY,
      name TEXT,
      price INTEGER,
      data TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS Ingredient (
      _id TEXT PRIMARY KEY,
      name TEXT,
      price INTEGER,
      data TEXT
    )`,

    `CREATE TABLE IF NOT EXISTS ConditionsChoose (
      _id TEXT PRIMARY KEY,
      condition TEXT,
      options TEXT,
      commandProduct TEXT,
      data TEXT,
      FOREIGN KEY (commandProduct) REFERENCES CommandProduct(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS AddableIngredientsChoose (
      _id TEXT PRIMARY KEY,
      addableIngredient TEXT,
      options TEXT,
      commandProduct TEXT,
      data TEXT,
      FOREIGN KEY (commandProduct) REFERENCES CommandProduct(_id)
    )`,

    `CREATE TABLE IF NOT EXISTS RemovableIngredientsChoose (
      _id TEXT PRIMARY KEY,
      removableIngredient TEXT,
      commandProduct TEXT,
      data TEXT,
      FOREIGN KEY (commandProduct) REFERENCES CommandProduct(_id)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON Orders(orderNumber)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON Orders(createdAt)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_pointOfSale ON Orders(pointOfSale)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_user ON Orders(user)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_unit ON Orders(unit)`,
    `CREATE INDEX IF NOT EXISTS idx_commandProduct_order ON CommandProduct(order_id)`,
    `CREATE INDEX IF NOT EXISTS idx_payHistory_order ON PayHistory(order_id)`,
  ];

  for (const table of tables) {
    try {
      await db.executeSql(table);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }
};

export const closeDatabase = async () => {
  if (db) {
    await db.close();
    console.log('Database closed');
  }
};

export const executeSql = async (sql, params = []) => {
  try {
    const db = getDatabase();
    const [results] = await db.executeSql(sql, params);
    return results;
  } catch (error) {
    console.error('SQL execution error:', error);
    throw error;
  }
};
