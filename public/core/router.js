import { getQueryParams } from './functions.js';

/**
 * @typedef {Object} RouteConfig
 * @property {string} path - The path of the route.
 * @property {string} layout - The layout associated with the route.
 * @property {string} title - The title of the route.
 * @property {string} component - The component to be loaded for the route.
 */

class Router extends EventTarget {
  /** @type {RouteConfig[]} */
  routes = [
    { path: 'styleguide', layout: 'standard', title: "styleguide", component: '/components/pages/styleguide/page-styleguide' },
    { path: 'dashboard', layout: 'standard', title: "dashboard", component: '/components/pages/dashboard/page-dashboard' },
    { path: 'login', layout: 'blank', title: "login", component: '/components/pages/login/page-login' },
    { path: 'register', layout: 'blank', title: "register", component: '/components/pages/registration/page-registration' },
    { path: 'reset-password', layout: 'blank', title: "resetPassword", component: '/components/pages/reset-password/page-reset-password' },
    { path: 'verify-email', layout: 'blank', title: "verifyEmail", component: '/components/pages/verify-email/page-verify-email' },
    { path: 'settings', layout: 'standard', title: "settings", component: '/components/pages/settings/page-settings' },
    { path: 'games/limbo', layout: 'standard', title: "Limbo", component: '/components/pages/games/limbo/page-limbo-game' },
    { path: 'games/mines', layout: 'standard', title: "Mines", component: '/components/pages/games/mines/page-mines-game' },
  ];

  constructor() {
    super();

    this.addEvents();
  }

  addEvents() {
    window.addEventListener('popstate', (event) => {
      this.dispatchEvent(new CustomEvent('routeChange', { detail: event.state.path }));
    });

    document.addEventListener('click', event => {
      const eventTarget = /** @type {HTMLAnchorElement} */ (event.target);

      if (eventTarget.matches('[data-link]')) {
        event.preventDefault();
        if (!eventTarget.href || eventTarget.href === '#') return;
        this.navigate(eventTarget.href);
      }
    });
  }

  /**
   * @param {string} path
   */
  navigate(path) {
    history.pushState({ path }, null, path);
    this.dispatchEvent(new CustomEvent('routeChange', { detail: path }));
  }

  get routeHierarchy() {
    const path = this.route?.config?.path ?? '';

    function findObjectHierarchy(objects, startPath) {
      const result = [];
      const pathToObjectMap = new Map();

      // Erstelle eine Map für schnelleren Zugriff auf Objekte per "path"
      objects.forEach(obj => pathToObjectMap.set(obj.path, obj));

      let currentPath = startPath;

      while (currentPath) {
          const obj = pathToObjectMap.get(currentPath);
          if (!obj) break; // Beende, falls kein weiteres Objekt gefunden wird

          result.unshift(obj);
          currentPath = obj.parent || null; // Nächstes Objekt anhand "parent" suchen
      }

      return result;
    }

    return findObjectHierarchy(this.routes, path);
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

const router = new Router();

export default router;