import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('walletflow.db');

export const runMigrations = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      iconName TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      iconName TEXT NOT NULL,
      color TEXT NOT NULL,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      month TEXT NOT NULL,
      amount REAL NOT NULL,
      categoryId TEXT
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      avatarUri TEXT,
      biometricLogin INTEGER DEFAULT 0,
      pushNotifications INTEGER DEFAULT 1
    );
  `);
};
