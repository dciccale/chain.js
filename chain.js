// make native js methods chainable
var chain = $ = function (el) {
  return new chain.prototype.init(el);
},
  document = document;

chain.prototype = {
  length: 0,

  init: function (el) {
    if (!el) {
      return this;
    }
    this.push.apply(this, el);
  },

  push: [].push,
  splice: [].splice,
  forEach: function (fn) {
    [].forEach.call(this, fn);
    return this;
  }
};

chain.prototype.init.prototype = chain.prototype;

var nativeSelectorMethods = ['getElementById', 'getElementsByClassName', 'getElementsByTagName', 'getElementsByName', 'querySelector', 'querySelectorAll'];

nativeSelectorMethods.forEach(function (method) {
  chain.prototype[method] = function (selector) {
    var instance = $();
    var elements = document[method](selector);
    instance.push.apply(instance, (!elements.length ? [elements] : elements));
    return instance;
  }
});

var nativeMethods = ['addEventListener', 'removeEventListener'];

nativeMethods.forEach(function (method) {
  chain.prototype[method] = function () {
    var args = arguments;
    return this.forEach(function (el) {
      el[method].apply(el, args);
    });
  }
});


var nativeProperties = ['style', 'value'];

nativeProperties.forEach(function (property) {
  chain.prototype[property] = function (key, value) {
    if (key == null && value == null) {
      return this[0][property];
    }
    return this.forEach(function (el) {
      if (value == null) {
        el[property] = key;
      } else {
        el[property][key] = value;
      }
    });
  }
});

var elementProperties = ['innerHTML', 'outerHTML', 'textContent', 'innerText', 'outerText'];

elementProperties.forEach(function (property) {
  chain.prototype[property] = function (value) {
    if (value == null) {
      return this[0][property];
    } else {
      return this.forEach(function (el) {
        el[property] = value;
      });
    }
  }
});

// elementProperties that returns HTML collection or node
var elementQueryProperties = ['firstElementChild', 'lastElementChild', 'nextElementChild', 'previousElementChild', 'children'];
elementQueryProperties.forEach(function (property) {
  chain.prototype[property] = function (value) {
    var instance = $();
    this.forEach(function (el) {
      var elements = el[property];
      instance.push.apply(instance, (!elements.length ? [elements] : elements));
    });
    return instance;
  }
});
