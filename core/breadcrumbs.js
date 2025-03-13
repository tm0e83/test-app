import Component from '/core/component.js';
import router from '/core/router2.js';

export default class Breadcrumbs extends Component {
  constructor(parent) {
    super();

    this.element = document.createElement('div');

    this.render();
  }

  render() {
    const hierarchy = router.routeHierarchy;

    const breadcrumbItems = hierarchy.reduce((items, item) => {
      item.fullpath = item.path;
      Object.entries(router.route.queryParams).map(([paramName, paramValue]) => {
        item.fullpath = item.path.replace(`:${paramName}`, paramValue);
        return item;
      });
      items.push(item);
      return items;
    }, [])


    console.log('config', router.route.config);
    console.log('breadcrumbItems', breadcrumbItems);


    this.element.innerHTML = this.template;

    breadcrumbItems.map(item => {
      this.element.querySelector('ol').insertAdjacentHTML('beforeend', /*html*/ `
        <li class="breadcrumb-item">
          ${item.path === router.route.config.path ? item.title : /*html*/ `<a href="/${item.fullpath}">${item.title}</a>`}
        </li>
      `);
    });
  }

  get template() {
    return /*html*/ `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
        </ol>
      </nav>
    `;
  }
}