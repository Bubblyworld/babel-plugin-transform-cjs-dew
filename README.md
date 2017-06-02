# Babel CommonJS -> ESDEW Format

ESDEW is an ES Deferred Execution Wrapper format that allows supporting CommonJS execution semantics
through an ES modules protocol.

_Modules converted in this way can only import from other modules converted to this format._

This project aims for accuracy and reliability transforming a tree of CommonJS modules into a spec-compliant tree of ES Modules.

```js
require('babel-core').transform('<source>', {
  plugins: [
    ['transform-cjs-esm', {
      define: {
        'process.env.NODE_ENV': '"development"',
        '__filename': '"custom-filename.js"',
        '__dirname': JSON.stringify('custom-dirname.js')
      },
      map (path) {
        if (path === 'process')
          return 'process-path';
        if (path === './x')
          return './x.js';
      }
    }]
  ]
});
```

Output:

```js
import { exports as _depExports, __esdew as _depExecute } from './dep.esdew.js';
export var exports = {};
var module = {
  get exports () {
    return exports;
  }
  set exports (_exports) {
    exports = _exports;
  }
};
export var execute = function () {
  execute = null;
  module.exports = function () {};
  exports.blah = 'hi';
  var a = (depExecute && depExecute() || depExports).y;
};
```

To import a CommonJS module tree converted via the above into an ES module, the following
_execution wrapper_ is required:

x.js
```js
import { exports, __esdew } from './x.esdew.js';
if (__esdew) __esdew();
export { exports as default };
```

As well as execution wrapping, the following code transformations are handled:
* Simple 'use strict' code conversion if not already strict.
* Defines the `exports` and `module` variables in module scope.
* Any use of `global` or `GLOBAL` defines global in the module scope.
* Top-level `this` is replaced with an `exports` reference.
* Implicit globals of the form `globalName = ...` are rescoped for a simple strict module conversion.
* Use of `Buffer` and `process` is transformed into an import of `buffer` or `process`. This module name can be customized by the `map` configuration option.

The remaining strict conversion cases that don't convert are then just the edge cases of loose -> strict mode conversion:
* Any use of `with` statements will throw
* Multiple duplicate function parameters
* Relying on dynamic arguments
* Assigning to reserved names
* Using eval to define variables
* Expecting `this` being the global as the default context for function calls

The above should comprehensively cover the failure cases.

## License

MIT