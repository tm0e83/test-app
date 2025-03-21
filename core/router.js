import { getQueryParams } from '/core/functions.js';

class Router extends EventTarget {
  routes = [
    { path: 'login', layout: 'blank', title: "login" },
    { path: 'settings', layout: 'standard', title: "settings" },

    { path: 'invoice/overview', layout: 'standard', title: "invoices" },
    { path: 'invoice/details/:id', layout: 'standard', parent: 'invoice/overview', title: "details" },
    { path: 'invoice/edit/:id', layout: 'standard', parent: 'invoice/details/:id', title: "edit" },

    { path: 'client/overview', layout: 'standard', title: "clients" },
    { path: 'client/create', layout: 'standard', parent: 'client/overview', title: "create" },
    { path: 'client/details/:id', layout: 'standard', parent: 'client/overview', title: "details" },
    { path: 'client/edit/:id', layout: 'standard', parent: 'client/details/:id', title: "edit" },

    { path: 'dashboard', layout: 'standard', title: "dashboard" },
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

  /**
   * @param {HTMLAnchorElement[]} links
   */
  addLinkEvents(links) {
    links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        if (!e.currentTarget.href || e.currentTarget.href === '#') return;
        this.goTo(e.currentTarget.href);
      });
    });
  }

  get routeHierarchy() {
    const path = this.route.config.path;

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