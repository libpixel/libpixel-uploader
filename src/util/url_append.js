module.exports = function (url, str) {
  return url + (/\?/.test(url) ? "&" : "?") + str;
};
