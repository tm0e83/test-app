import Component from '../core/component.js';
import Sidebar from '../sidebar.js';
import Header from '../header.js';
import Main from '../main.js';
// import Footer from '../footer.js';

export default class PageDefault extends Component {
  constructor() {
    super();

    this.render();
  }

  addEvents() {
    this.header.addEventListener('toggleMenu', _ => this.sidebar.render())
  }

  render() {
    this.element = document.createElement('div');
    this.element.classList.add('main');
    this.element.innerHTML = this.template;

    this.css`
      .main {
        width: 100%;
        height: 100%;

        &>div {
          display: flex;
          flex: 1;
        }
      }
    `

    this.sidebar = new Sidebar(this.element.querySelector('aside'));
    this.header = new Header(this.element.querySelector('header'));
    new Main(this.element.querySelector('main'));
    // new Footer(this.element.querySelector('footer'));

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <header></header>
      <div>
        <aside></aside>
        <main></main>
      </div>
    `;
    // <footer></footer>
  }
}