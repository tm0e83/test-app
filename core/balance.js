import EventBus from './event-bus';
import store from './store';

class Balance extends EventBus {
  constructor() {
    super();
  }
}

const balance = new Balance();
export default balance;