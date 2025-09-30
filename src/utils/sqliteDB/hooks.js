import { useState, useEffect } from 'react';
import { getDatabase } from './database';
import { resultsToArray } from './helpers';

export const useSQLQuery = (tableName, jsonFields = [], dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        const result = await db.executeSql(`SELECT * FROM ${tableName}`);

        if (mounted) {
          const items = resultsToArray(result, jsonFields);
          setData(items);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error(`Error querying ${tableName}:`, err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [tableName, ...dependencies]);

  return data;
};

export const useSQLQueryWithFilter = (tableName, whereClause, params = [], jsonFields = [], dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        const sql = `SELECT * FROM ${tableName}${whereClause ? ` WHERE ${whereClause}` : ''}`;
        const result = await db.executeSql(sql, params);

        if (mounted) {
          const items = resultsToArray(result, jsonFields);
          setData(items);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error(`Error querying ${tableName}:`, err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [tableName, whereClause, ...params, ...dependencies]);

  return data;
};

export const useSQLObject = (tableName, id, jsonFields = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        const result = await db.executeSql(`SELECT * FROM ${tableName} WHERE _id = ?`, [id]);

        if (mounted) {
          if (result.rows.length > 0) {
            const items = resultsToArray(result, jsonFields);
            setData(items[0]);
          } else {
            setData(null);
          }
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          console.error(`Error querying ${tableName}:`, err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [tableName, id]);

  return data;
};
