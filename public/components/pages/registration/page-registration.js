import { i18n } from '/i18n/i18n.js';
import router from '/core/router.js';
import Component from '/core/component.js';
import '/core/icons/icon-user-plus.js';
import '/core/icons/icon-playspot.js';

// @ts-ignore
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
// @ts-ignore
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';

export default class PageRegistration extends Component {
  cssFilePath = 'components/pages/registration/page-registration.css';
  errorCode = '';

  constructor() {
    super();
  }

  addEvents() {
    this.querySelector('form')?.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  /**
   * @param {Event} event
   */
  async onFormSubmit(event) {
    event.preventDefault();

    const eventTarget = /** @type {HTMLFormElement} */ (event.target);

    if (!eventTarget.reportValidity()) {
      return false;
    }

    const email = /** @type {HTMLInputElement} */ (this.querySelector('input[name="email"]')).value ?? '';
    const password = /** @type {HTMLInputElement} */ (this.querySelector('input[name="password"]')).value ?? '';

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      console.log('send email verification to', user.email);
      await auth.signOut();
      router.navigate('/verify-email');
      const db = getDatabase();
      console.log('create new user in db');

      set(ref(db, 'users/' + user.uid), {
        balance: 1000,
        role: 'user',
        email: user.email,
        language: 'de',
        uid: user.uid,
        totalWinnings: 0,
        gamesPlayed: {
          limbo: 0,
          mines: 0
        },
        winningsHistory: []
      });

    } catch (/** @type {any} */ error) {
      this.errorCode = error.code;
      this.render();
    }
  }

  render() {
    super.render();
    this.addEvents();
  }

  get errorTemplate() {
    let errorText = ''

    switch(this.errorCode) {
      case 'auth/email-already-in-use':
        errorText = i18n.t('emailAlreadyInUse');
        break
      case 'auth/invalid-email':
        errorText = i18n.t('invalidEmail');
        break
      case 'auth/weak-password':
        errorText = i18n.t('weakPassword');
        break
      default:
        errorText = i18n.t('unknownError', { errorCode: this.errorCode });
    }

    return /*html*/ `
      <div class="alert alert-danger d-flex align-items-center gap-4" role="alert">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div>${errorText}</div>
      </div>
    `;
  }

  get template() {
    return /*html*/ `
      <div class="max-w-sm">
        <icon-playspot></icon-playspot>
        <div class="card p-4">
          <div class="card-header">
            <h1 class="mb-4 d-flex gap-4 align-items-center">
              <icon-user-plus></icon-user-plus>
              <span>${i18n.t('register')}</span>
            </h1>
          </div>
          <div class="card-body">
            ${this.errorCode ? this.errorTemplate : ''}
            <form>
              <input
                type="email"
                name="email"
                placeholder="${i18n.t('email')}"
                autocomplete="email"
                class="form-control mb-4"
                required
              >
              <input
                type="password"
                name="password"
                placeholder="${i18n.t('password')}"
                autocomplete="current-password"
                class="form-control mb-4"
                required
              >
              <button class="btn primary w-100" type="submit">${i18n.t('toRegister')}</button>
            </form>
            <br>
            <br>
            <div class="text-center">
              <strong>${i18n.t('alreadyRegistered')}</strong> <a href="/login" data-link>${i18n.t('loginHere')}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-registration', PageRegistration);