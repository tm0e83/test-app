export default class Router extends EventTarget {
  goTo(path) {
    history.replaceState(null, null, path);
    this.dispatchEvent(new CustomEvent('routeChange', { detail: path }));
  }

  /**
   * @returns {array}
   */
  get routeSegments() {
    const segments = location.pathname
      .split('/')
      .filter(segment => !!segment)
      .map(segment => isNaN(segment) ? segment : parseInt(segment));

    return segments;
  }
}