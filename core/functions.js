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
export const formatDate = (dateStr, languageISO = 'de-DE') => {
  return new Intl.DateTimeFormat(languageISO, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateStr));
}

/**
 * @param {number} value
 * @param {string} languageISO
 * @returns {string}
 */
export const formatCurrency = (value, languageISO = 'de-DE') => {
  return new Intl.NumberFormat(languageISO, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * @param {number} number
 * @returns {number}
 */
export const roundTo2Decimals = num => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Shuffle an array
 * @param {array} array
 * @returns array
 */
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};