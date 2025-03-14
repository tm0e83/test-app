import Component from '/core/component.js';
import router from '/core/router.js';

export default class Breadcrumbs extends Component {
  constructor(parent) {
    super();

    this.element = document.createElement('div');

    this.render();
  }

  render() {
    this.breadcrumbItems = router.routeHierarchy.reduce((items, item) => {
      item.fullpath = item.path;
      Object.entries(router.route.queryParams).map(([paramName, paramValue]) => {
        item.fullpath = item.path.replace(`:${paramName}`, paramValue);
        return item;
      });
      items.push(item);
      return items;
    }, [])

    this.element.innerHTML = this.template;
  }

  get template() {
    if (this.breadcrumbItems.length <= 1) return '';

    return /*html*/ `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          ${
            this.breadcrumbItems.map(item => `
              <li class="breadcrumb-item">
                ${item.path === router.route.config.path ? item.title : /*html*/ `<a href="/${item.fullpath}">${i18next.t(item.title)}</a>`}
              </li>
            `).join('')
          }
        </ol>
      </nav>
    `;
  }
}