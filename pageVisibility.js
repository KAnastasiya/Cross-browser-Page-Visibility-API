let pageVisibility = {
  b: null,
  q: document,
  p: undefined,
  prefixes: ['', 'webkit', 'ms', 'moz'],
  props: ['VisibilityState', 'visibilitychange', 'Hidden'],
  m: ['focus', 'blur'],
  visibleCallbacks: [],
  hiddenCallbacks: [],
  _callbacks: [],
  onVisible: function(_callback) {
    this.visibleCallbacks.push(_callback);
  },
  onHidden: function(_callback) {
    this.hiddenCallbacks.push(_callback);
  },
  isSupported: function() {
    var self = this;
    return this.prefixes.some(function(prefix) {
      return self._supports(prefix);
    });
  },
  _supports: function(prefix) {
    return (lowerFirst(prefix + this.props[2]) in this.q);
  },
  runCallbacks: function(index) {
    if ( index ) {
      this._callbacks = (index === 1) ? this.visibleCallbacks : this.hiddenCallbacks;
      for (var i = 0; i < this._callbacks.length; i++) {
        this._callbacks[i]();
      }
    }
  },
  _visible: function() {
    pageVisibility.runCallbacks(1);
  },
  _hidden: function() {
    pageVisibility.runCallbacks(2);
  },
  _nativeSwitch: function() {
    ( (this.q[lowerFirst(this.b + this.props[2])]) === true ) ? this._hidden() : this._visible();
  },
  listen: function() {
    try {
      if (!(this.isSupported())) {
        if (document.addEventListener) {
          window.addEventListener(this.m[0], this._visible, 1);
          window.addEventListener(this.m[1], this._hidden, 1);
        } else {
          this.q.attachEvent('onfocusin', this._visible);
          this.q.attachEvent('onfocusout', this._hidden);
        }
      } else {
        var self = this;
        this.b = this.prefixes.reduce(function(memo, prefix) {
          if (memo !== false) {
            return memo;
          }
          if (self._supports(prefix)) {
            return prefix;
          }
          return memo;
        }, false);
        this.q.addEventListener(lowerFirst(this.b + this.props[1]), function() {
          pageVisibility._nativeSwitch.apply(pageVisibility, arguments);
        }, 1);
      }
    } catch (e) {}
  },
  init: function() {
    this.listen();
  }
};

pageVisibility.init();

function lowerFirst(str) {
  return str[0].toLowerCase() + str.substr(1);
}

export default pageVisibility;
