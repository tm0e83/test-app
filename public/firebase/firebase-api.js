// @ts-ignore
import { get, getDatabase, ref, runTransaction, set } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class FirebaseAPI {
  /**
   * Retrieves the user balance from the database.
   * @param {*} userId
   * @returns
   */
  static async getUserBalance(userId) {
    const db = getDatabase();
    const balanceRef = ref(db, `users/${userId}/balance`);
    const snapshot = await get(balanceRef);
    return snapshot.val();
  }

  /**
   * Updates the user balance in the database using a transaction.
   * This allows for atomic updates and handles concurrent modifications.
   * @param {*} userId
   * @param {TransactionHandler} transactionHandler
   */
  static async updateUserBalance(userId, transactionHandler) {
    const db = getDatabase();
    const balanceRef = ref(db, `users/${userId}/balance`);

    runTransaction(
      balanceRef,
      /** @type {TransactionHandler} */
      transactionHandler
    );
  }

  /**
   * Updates the user settings in the database.
   * @param {*} userId
   * @param {Object} settings
   */
  static async updateUserSettings(userId, settings) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    await set(userRef, settings);
  }

  /**
   * Retrieves the user settings from the database.
   * @param {*} userId
   * @returns
   */
  static async getUserSettings(userId) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  static async setUserLanguage(userId, language) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/language`);
    await set(userRef, language);
  }

  /**
   * Initializes the Firebase API.
   * This method can be used to set up any necessary configurations or listeners.
   */
  static init() {
    // Initialize Firebase or any other setup needed
  }
}
