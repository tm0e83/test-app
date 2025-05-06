import EventBus from './event-bus.js';

const initialState = {
  user: {
    /** @type {String} */
    name: '',
    balance: 750.50
  },

  /** @type {String} */
  token: '',

  /** @type {String} */
  layout: '',

  /** @type {String} */
  language: 'de',
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'updateBalance': {
      state.user.balance = action.payload;
    }
  }

  return state;
}

class Store extends EventBus {
  state = {
    user: {
      /** @type {String} */
      name: '',
      balance: 750.50
    },

    /** @type {String} */
    token: '',

    /** @type {String} */
    layout: '',

    /** @type {String} */
    language: 'de',
  }

  dispatch(type, payload) {
    this.state = reducer(this.state, { type, payload });
    this.publish('updateBalance', this.state);
  }

  constructor() {
    super();
  }
}

const store = new Store();

export default store;