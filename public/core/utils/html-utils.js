/**
 * This function can be used with tagged template string syntax.
 * @example: html`This is a ${exampleValue}`
 * @param {TemplateStringsArray} literals
 * @param {any[]} vars
 * @returns {string}
 */
export function html(literals, ...vars) {
  let raw = literals.raw,
    result = "",
    i = 1,
    len = arguments.length,
    str,
    variable;

  while (i < len) {
    str = raw[i - 1];
    variable = vars[i - 1];
    result += str + variable;
    i++;
  }
  result += raw[raw.length - 1];
  return result;
}

/**
 * @param {TemplateStringsArray} literals
 * @param {any[]} vars
 * @returns {Element}
 */
export function htmlAsElement(literals, ...vars) {
  const temporaryContainer = document.createElement('template');
  temporaryContainer.innerHTML = html(literals, ...vars);
  return temporaryContainer.firstElementChild ?? document.createElement('div');
}

/**
 * Takes an HTML string and returns a string with escaped HTML code
 * @param {string} str HTML string
 * @returns {string} escaped HTML string
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}