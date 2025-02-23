export default class Router extends EventTarget {
  get route() {
    const parts = location.pathname.split('/')
      .filter(part => !!part)
      .map(part => `/${part}`);

    return parts;
  }
}