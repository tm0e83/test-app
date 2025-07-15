import EventBus from './event-bus.js';

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} balance
 * @property {string} language
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {string} uid
 * @property {string} role
 */

/**
 * @typedef {Object} State
 * @property {User} user
 * @property {string} layout
 * @property {string} language
 */

/**
 * @param {State} state
 * @param {*} action
 * @returns {State} new state
 */
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.payload
        }
      };

    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    case 'SET_EMAIL_VERIFIED':
      return {
        ...state,
        user: {
          ...state.user,
          emailVerified: action.payload
        }
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };

    default:
      return state;
  }
}

class Store extends EventBus {

  /** @type {State} */
  state = {
    user: {
      uid: '',
      name: '',
      balance: 0,
      language: 'de',
      email: '',
      emailVerified: false,
      role: 'user', // default role
    },
    layout: '',
    language: 'de',
  }

  /**
   * @param {string} type
   * @param {*} payload
   */
  dispatch(type, payload) {
    this.state = reducer(this.state, { type, payload });
    this.publish(type, this.state);
  }

  constructor() {
    super();
  }
}

const store = new Store();

export default store;