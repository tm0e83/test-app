/**
 * test wheather user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => !!window.state.token || !!localStorage.getItem('token');