# Realm to SQLite Migration Notes

## What Changed

This project has been migrated from Realm to SQLite for local data storage.

## Key Changes

### 1. Database Initialization
- **Before**: Used `RealmProvider` wrapper component
- **After**: Call `initDatabase()` in App.js on startup

### 2. Database Operations
- **Before**: Used Realm queries like `realm.objects('Orders').filtered('_id == $0', id)`
- **After**: Use SQL queries via `executeSql()` or service methods

### 3. ID Generation
- **Before**: `new Realm.BSON.ObjectID()`
- **After**: `generateId()` from `src/utils/sqliteDB/helpers.js`

### 4. Service Layer
All database services have been rewritten:
- `CommandController` - Order and command operations
- `menuController` - Menu management
- `UserService` - User operations
- `UnitService` - Table/unit management
- `ZoneService` - Zone management
- `PointOfSaleService` - Point of sale operations
- `PrinterService` - Printer configuration
- `CashBoxServices` - Cash box operations

### 5. Data Access Patterns
- **Before**:
  ```javascript
  const realm = useRealm();
  const orders = useQuery('Orders');
  ```
- **After**:
  ```javascript
  import { getDatabase, executeSql } from './utils/sqliteDB';
  const db = getDatabase();
  const result = await db.executeSql('SELECT * FROM Orders');
  ```

## Database Schema

All tables have been created in SQLite with the following structure:
- Orders
- CommandProduct
- PayHistory
- User
- Unit
- Zone
- Menu
- CategoryMenu
- CategoryItems
- PointOfSale
- Printer
- ProductionTypes
- BoxInformation
- Options
- Ingredient
- ConditionsChoose
- AddableIngredientsChoose
- RemovableIngredientsChoose

## Important Notes

1. **JSON Fields**: Complex data is stored as JSON strings in SQLite. Use `stringifyJSON()` and `parseJSON()` helpers.

2. **Boolean Fields**: SQLite stores booleans as integers (0 or 1). The service layer handles conversion.

3. **Relationships**: Foreign key relationships are maintained via TEXT IDs instead of ObjectIds.

4. **Transactions**: SQLite transactions are handled automatically by `executeSql()`.

5. **Indexes**: Important indexes have been created for performance on commonly queried fields.

## Migration Checklist

- ✅ Installed `react-native-sqlite-storage`
- ✅ Created database schema and initialization
- ✅ Created service layer for all models
- ✅ Updated all imports from `realmDB` to `sqliteDB`
- ✅ Replaced Realm hooks with SQLite queries
- ✅ Removed Realm dependencies from package.json
- ✅ Updated App.js to initialize SQLite
- ✅ Replaced `BSON.ObjectID` with `generateId()`

## Testing Recommendations

1. Test order creation and retrieval
2. Test payment operations
3. Test menu synchronization
4. Test user authentication
5. Test background sync operations
6. Test offline functionality
7. Test data persistence across app restarts

## Potential Issues to Watch For

1. **Data Migration**: Existing Realm data will NOT be automatically migrated. You may need to implement a one-time migration script if needed.

2. **Performance**: SQLite may perform differently than Realm for complex queries. Monitor performance and add indexes as needed.

3. **Concurrency**: SQLite has different concurrency characteristics than Realm. Be mindful of write operations from multiple threads.

4. **Type Differences**: Some type conversions may behave differently (e.g., dates stored as integers).
