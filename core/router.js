import { getQueryParams } from '/core/functions.js';

class Router extends EventTarget {
  routes = [
    // { path: '', layout: 'blank' },
    { path: 'dashboard', layout: 'standard', title: "dashboard", component: '/page/dashboard-component' },
    { path: 'login', layout: 'blank', title: "login", component: '/page/login-component' },
    { path: 'settings', layout: 'standard', title: "settings", component: '/page/settings-component' },
    { path: 'games/limbo', layout: 'standard', title: "Limbo", component: '/page/limbo-game' },
    { path: 'games/mines', layout: 'standard', title: "Mines", component: '/page/mines-game' },

    // { path: 'invoice/overview', layout: 'standard', title: "invoices", component: '/page/invoice-overview-component' },
    // { path: 'invoice/details/:id', layout: 'standard', parent: 'invoice/overview', title: "details", component: '/page/invoice-details-component' },
    // { path: 'invoice/edit/:id', layout: 'standard', parent: 'invoice/details/:id', title: "edit", component: '/page/edit-invoice-component' },

    // { path: 'client/overview', layout: 'standard', title: "clients", component: '/page/client-overview-component' },
    // { path: 'client/create', layout: 'standard', parent: 'client/overview', title: "create", component: '/page/create-client-component' },
    // { path: 'client/details/:id', layout: 'standard', parent: 'client/overview', title: "details", component: '/page/client-details-component' },
    // { path: 'client/edit/:id', layout: 'standard', parent: 'client/details/:id', title: "edit", component: '/page/edit-client-component' },

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
      if (event.target.matches('[data-link]')) {
        event.preventDefault();
        if (!event.target.href || event.target.href === '#') return;
        this.navigate(event.target.href);
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