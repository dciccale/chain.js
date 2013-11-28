/*!
 * chain.js
 * Copyright (c) 2013 Denis Ciccale (@tdecs)
 * Released under the MIT license
 * https://github.com/dciccale/chain.js/blob/master/LICENSE.txt
 */
(function (window) {

  var ArrayProto = Array.prototype;
  var push = ArrayProto.push;
  var splice = ArrayProto.splice;
  var forEach = ArrayProto.forEach;

  var document = window.document;

  var isUndefined = function (value) {
    return typeof value === 'undefined';
  };

  var isDefined = function (value) {
    return typeof value !== 'undefined';
  };

  var isString = function (value) {
    return typeof value === 'string';
  };

  var isChained = function (obj) {
    return obj instanceof Chain;
  };

  // make native js methods chainable
  var Chain = $ = function (selector) {
    if (!isChained(this)) {
      return new Chain(selector);
    }

    if (!selector) {
      return this;
    }

    if (isString(selector)) {
      return rootContext.querySelectorAll(selector);
    }

    if (selector.nodeType) {
      this[0] = selector;
      this.length = 1;
      return this;
    }

    return push.apply(this, selector);
  };

  Chain.prototype = {
    length: 0,

    splice: splice,

    forEach: function (fn) {
      forEach.call(this, fn);
      return this;
    }
  };

  var rootContext = Chain(document);

  /*
   * Native selector methods
   */
  var nativeSelectorMethods = [
    'getElementById',
    'getElementsByClassName',
    'getElementsByTagName',
    'getElementsByName',
    'querySelector',
    'querySelectorAll'
  ];

  nativeSelectorMethods.forEach(function (method) {
    Chain.prototype[method] = function (selector) {
      // no root element
      if (!this[0] || !selector) {
        return this;
      }

      return Chain(this[0][method](selector));
    }
  });

  /*
   * Native DOM event methods
   */
  var nativeMethods = ['addEventListener', 'removeEventListener'];

  nativeMethods.forEach(function (method) {
    Chain.prototype[method] = function () {
      var args = arguments;

      return this.forEach(function (el) {
        el[method].apply(el, args);
      });
    }
  });

  /*
   * Style property
   */
  Chain.prototype.style = function (key, value) {
    // no element
    if (!this[0]) {
      return undefined;
    }

    // get
    if (isDefined(key) && isUndefined(value)) {
      return this[0].style[key];

    // set
    } else {
      return this.forEach(function (el) {
        el.style[key] = value;
      });
    }
  };

  /*
   * DOM element properties
   */
  var elementProperties = [
    'innerHTML',
    'outerHTML',
    'textContent',
    'innerText',
    'outerText',
    'value'
  ];

  elementProperties.forEach(function (property) {
    Chain.prototype[property] = function (value) {
      // no element
      if (!this[0]) {
        return undefined;
      }

      // get
      if (isUndefined(value)) {
        return this[0][property];

      // set
      } else {
        return this.forEach(function (el) {
          el[property] = value;
        });
      }
    }
  });

  /*
   * DOM element properties that returns HTML collection or node
   */
  var elementQueryProperties = [
    'firstElementChild',
    'lastElementChild',
    'nextElementChild',
    'previousElementChild',
    'children'
  ];

  elementQueryProperties.forEach(function (property) {
    Chain.prototype[property] = function () {
      // no element
      if (!this[0]) {
        return this;
      }

      return Chain(this[0][property]);
    }
  });

  window.Chain = window.$ = Chain;

}(window));
