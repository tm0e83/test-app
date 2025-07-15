/**
 * Provides methods to retrieve information about the user's browser and operating system.
 */
export class SystemInfo {
  /**
   * Returns the name of the browser based on the user agent string.
   * @returns {string} The name of the browser (e.g., 'Firefox', 'Chrome', 'Safari', 'Edge', 'Opera').
   */
  static get browserName() {
    if (navigator.userAgent.includes('Firefox')) return 'Firefox';
    if (navigator.userAgent.includes('Chrome')) return 'Chrome';
    if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) return 'Safari';
    if (navigator.userAgent.includes('Edge')) return 'Edge';
    if (navigator.userAgent.includes('OPR') || navigator.userAgent.includes('Opera')) return 'Opera';
    return 'unknown';
  }

  /**
   * Returns the name of the operating system based on the platform string.
   * @returns {string} The name of the operating system (e.g., 'Windows', 'MacOS', 'Linux', 'Android', 'iOS').
   */
  static get OS() {
    if (navigator.platform.indexOf('Win') !== -1) return 'Windows';
    if (navigator.platform.indexOf('Mac') !== -1) return 'MacOS';
    if (navigator.platform.indexOf('Linux') !== -1) return 'Linux';
    if (navigator.platform.indexOf('Android') !== -1) return 'Android';
    if (navigator.platform.indexOf('iPhone') !== -1 || navigator.platform.indexOf('iPad') !== -1) return 'iOS';
    return 'unknown';
  }
}