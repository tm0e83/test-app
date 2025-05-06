import Component from '../core/component.js';
import router from '/core/router.js';
import store from '/core/store.js';

export default class Login extends Component {
  constructor() {
    super();
  }

  addEvents() {
    this.querySelector('form').addEventListener('submit', this.onFormSubmit.bind(this));
  }

  async onFormSubmit(e) {
    e.preventDefault();

    const username = this.querySelector('input[name="username"]').value;
    const password = this.querySelector('input[name="password"]').value;

    try {
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'admin' && password === 'pw') {
            resolve(
              new Response(JSON.stringify({ token: '123456789' }))
            );
          } else {
            reject('Invalid credentials');
          }
        }, 500);
      });

      const json = await response.json();
      router.dispatchEvent(new CustomEvent('login', {
        detail: json
      }));

      store.state.token = json.token;
      localStorage.setItem('token', json.token);
      router.navigate('/dashboard');
    }
    catch (e) {
      alert('ALARM!!!', e);
    }
  }

  render() {
    super.render();
    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="container pt-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card p-4">
              <h2 class="mb-4">${i18next.t('login')}</h2>
              <form>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autocomplete="username"
                  class="form-control mb-4"
                  value="admin"
                >
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autocomplete="current-password"
                  class="form-control mb-4"
                  value="pw"
                >
                <button class="btn btn-primary" type="submit">${i18next.t('login')}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('trs-login', Login);