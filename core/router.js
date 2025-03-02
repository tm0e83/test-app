import { getQueryParams } from '/core/functions.js';

export default class Router extends EventTarget {
  routes = [
    { path: 'login', layout: 'empty'},
    { path: 'invoice/overview', layout: 'standard'},
    { path: 'calendar', layout: 'standard'},
    { path: 'download', layout: 'standard'},
    { path: 'addresses', layout: 'standard'},
    { path: 'manage-offers', layout: 'standard'},
    { path: 'manage-users', layout: 'standard'},
    { path: 'invoice/details:id', layout: 'standard' }
  ];

  constructor() {
    super();

    // window.addEventListener("popstate", (event) => {
    //   this.dispatchEvent(new CustomEvent('routeChange', { detail: window.mainRouter.routeSegments.join('/') }));
    // });
  }

  goTo(path) {
    history.pushState({ path: this.routeSegments }, null, path);
    this.dispatchEvent(new CustomEvent('routeChange', { detail: path }));
  }

  get route() {
    const pathSegments = location.pathname.split('/').filter(segment => !!segment);

    const returnObj = {
      config: null,
      queryParams: null,
      routeParams: [],
      segments: []
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
            returnObj.routeParams.push({[segment.substring(1)]: pathSegments[index]});
          } else {
            returnObj.segments.push(pathSegments[index]);
          }
        });
      }
    });

    returnObj.queryParams = getQueryParams(location.search);

    return returnObj;
  }

  /**
   * @returns {array}
   */
  get routeSegments() {
    return this.route.segments;
  }

  /**
   * @returns {object}
   */
  get routeConfig() {
    return this.route.config;
  }
}
