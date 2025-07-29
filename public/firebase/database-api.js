// @ts-ignore
import { get, getDatabase, limitToLast, off, orderByChild, query, ref, runTransaction , set } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class DatabaseAPI {
  static async getLeaderboardEntries(timeFrame = 'alltime', gameName = 'global') {
    const db = getDatabase();

    // Pfad zum All-Time-Leaderboard
    const leaderboardRef = ref(db, `leaderboard/${timeFrame}/${gameName}`);

    // Erstelle die Query: nach Punktzahl sortiert, Top 10 holen
    const topLeadersQuery = query(
      leaderboardRef,
      orderByChild('score'),
      limitToLast(10)  // höchste Werte
    );

    // Führe die Abfrage aus
    const snapshot = await get(topLeadersQuery);

    if (snapshot.exists()) {
      // Snapshot-Daten in ein Array umwandeln und nach Score absteigend sortieren
      const entries = Object.entries(snapshot.val()).map(([uid, data]) => ({
        uid,
        username: data.username,
        score: data.score
      }));

      return entries;
    } else {
      return [];
      // console.log('Keine Daten gefunden');
    }
  }

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
   * This method updates the user's statistics and leaderboard entries for various time frames.
   * It uses a transaction handler to ensure atomic updates across multiple references.
   * @param {*} userId
   * @param {string} userName
   * @param {string} gameName
   * @param {number} value
   * @return {Promise<void[]>} A promise that resolves when all transactions are complete.
   */
  static async updateStatistics(userId, userName, gameName, value) {
    const db = getDatabase();

    const statsRef = ref(db, `users/${userId}/totalWins`);

    const leaderboardAllTimeGlobalRef = ref(db, `leaderboard/alltime/global/${userId}`);
    const leaderboardAllTimeGameRef = ref(db, `leaderboard/alltime/${gameName}/${userId}`);

    // const leaderboardMonthlyGlobalRef = ref(db, `users/leaderboard/monthly/global/${userId}`);
    // const leaderboardMonthlyGameRef = ref(db, `users/leaderboard/monthly/${gameName}/${userId}`);

    // const leaderboardWeeklyGlobalRef = ref(db, `users/leaderboard/weekly/global/${userId}`);
    // const leaderboardWeeklyGameRef = ref(db, `users/leaderboard/weekly/${gameName}/${userId}`);

    // const leaderboardDailyGlobalRef = ref(db, `users/leaderboard/daily/global/${userId}`);
    // const leaderboardDailyGameRef = ref(db, `users/leaderboard/daily/${gameName}/${userId}`);

    return Promise.all([
      runTransaction(statsRef, (currentStats) => {
        return (currentStats ?? 0) + value;
      }),

      runTransaction(leaderboardAllTimeGlobalRef, (currentStats) => {
        // return (currentStats ?? 0) + value;

      // return (currentStats ?? 0) + totalWinAmount;
        const currentScore = (currentStats && currentStats.score) ?? 0;

        return {
          username: userName,
          score: currentScore + value
        };
      }),

      runTransaction(leaderboardAllTimeGameRef, (currentStats) => {
        // return (currentStats ?? 0) + value;

      // return (currentStats ?? 0) + totalWinAmount;
        const currentScore = (currentStats && currentStats.score) ?? 0;

        return {
          username: userName,
          score: currentScore + value
        };
      }),

      // runTransaction(leaderboardMonthlyGlobalRef, /** @type {TransactionHandler} */ transactionHandler),
      // runTransaction(leaderboardMonthlyGameRef, /** @type {TransactionHandler} */ transactionHandler),

      // runTransaction(leaderboardWeeklyGlobalRef, /** @type {TransactionHandler} */ transactionHandler),
      // runTransaction(leaderboardWeeklyGameRef, /** @type {TransactionHandler} */ transactionHandler),

      // runTransaction(leaderboardDailyGlobalRef, /** @type {TransactionHandler} */ transactionHandler),
      // runTransaction(leaderboardDailyGameRef, /** @type {TransactionHandler} */ transactionHandler),
    ]);
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
    off(userRef);
  }

  /**
   * Retrieves the user from the database.
   * @param {*} userId
   * @returns {Promise<import("/core/store.js").User | null>}
   */
  static async getUser(userId) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    off(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  }

  /**
   * Sets the user's language preference in the database.
   * @param {*} userId
   * @param {string} language
   */
  static async setUserLanguage(userId, language) {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}/language`);
    await set(userRef, language);
    off(userRef);
  }

  /**
   * Initializes the Firebase API.
   * This method can be used to set up any necessary configurations or listeners.
   */
  static init() {
    // Initialize Firebase or any other setup needed
  }
}
