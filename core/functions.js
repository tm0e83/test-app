import store from '/core/store.js';

/**
 * test wheather user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => !!store.state.token || !!localStorage.getItem('token');

/**
 * @param {string} url
 * @returns {object}
 */
export const getQueryParams = (url = location.href) => {
  if (url.indexOf('?') == -1) return {};
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  return paramArr.reduce((params, param) => {
    const [key, val] = param.split('=');
    const value = decodeURIComponent(val);
    params[key] = isNaN(value) || !value.length  ? value : parseFloat(value);
    return params;
  }, {});
}

/**
 * @param {string} dateStr
 * @param {string} languageISO
 * @returns {string}
 */
export const formatDate = (dateStr, languageISO) => {
  return new Intl.DateTimeFormat(languageISO, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateStr));
}