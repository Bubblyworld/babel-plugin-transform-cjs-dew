var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  if (define) {
    if (typeof define === "function" && define.amd) {
      define([], function () {
        return {};
      });
    }
  }

  return exports;
}