module.exports = function (el, type) {
  function isMatch(el) { return el && el.nodeName.toLowerCase() === type; }
  while ((el = el.parentElement) && !isMatch(el));
  return isMatch(el) ? el : null;
};
