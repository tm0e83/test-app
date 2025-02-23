export const isLoggedIn = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!!window.state.token || !!localStorage.getItem('token'));
    }, 200);
  });
};