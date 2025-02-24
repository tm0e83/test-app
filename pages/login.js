import Component from '../core/component.js';

export default class PageLogin extends Component {
  constructor() {
    super();

    this.render();
  }

  addEvents() {
    this.element.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = this.element.querySelector('input[name="username"]').value;
      const password = this.element.querySelector('input[name="password"]').value;

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
        window.router.dispatchEvent(new CustomEvent('login', {
          detail: json
        }));

        window.state.token = json.token;
        localStorage.setItem('token', json.token);
        window.router.goTo('/invoices');
      }
      catch (e) {
        alert(e);
      }
    });
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="container pt-4">
        <div class="row justify-content-center">
          <div class="col-4">
            <div class="card p-4">
              <h2 class="mb-4">Login</h2>
              <form>
                <input type="text" name="username" placeholder="Username" class="form-control mb-4" value="admin">
                <input type="password" name="password" placeholder="Password" class="form-control mb-4" value="pw">
                <button class="btn btn-primary" type="submit">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}