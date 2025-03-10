import { getQueryParams } from '/core/functions.js';

export default class Router extends EventTarget {
  routes = [
    { path: 'login', layout: 'empty'},
    { path: 'settings', layout: 'standard'},
    { path: 'invoice/overview', layout: 'standard'},
    { path: 'invoice/details/:id', layout: 'standard' },
    { path: 'invoice/edit/:id', layout: 'standard' }
  ];

  constructor() {
    super();

    this.addEvents();
  }

  addEvents() {
    window.addEventListener('popstate', (event) => {
      this.dispatchEvent(new CustomEvent('routeChange', { detail: event.state.path }));
    });
  }

  /**
   * @param {string} path
   */
  goTo(path) {
    history.pushState({ path }, null, path);
    this.dispatchEvent(new CustomEvent('routeChange', { detail: path }));
  }

  get route() {
    const pathSegments = location.pathname.split('/').filter(segment => !!segment);

    const returnObj = {
      config: null,
      queryParams: null,
      routeParams: null,
      params: null,
      segments: [],
      path: location.pathname,
    }

    this.routes.forEach(route => {
      const patternSegments = route.path.split('/').filter(segment => !!segment);

      const pattern = patternSegments.reduce((p, segment) => {
        if (segment[0] == ':') {
          p.push('[0-9a-zA-Z-]+');
        } else {
          p.push(`${segment}`);
        }
        return p;
      }, []).join('/');

      if (location.pathname.match(pattern) !== null) {
        returnObj.config = route;

        patternSegments.forEach((segment, index) => {
          if (segment[0] == ':') {
            if (returnObj.routeParams === null) returnObj.routeParams = {};
            returnObj.routeParams[segment.substring(1)] = pathSegments[index];
          } else {
            returnObj.segments.push(pathSegments[index]);
          }
        });
      }
    });

    returnObj.queryParams = getQueryParams(location.search);
    returnObj.params = Object.assign(returnObj.queryParams, returnObj.routeParams);

    return returnObj;
  }
}
