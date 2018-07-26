(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var document = require('global/document')
var hyperx = require('hyperx')
var onload = require('on-load')

var SVGNS = 'http://www.w3.org/2000/svg'
var XLINKNS = 'http://www.w3.org/1999/xlink'

var BOOL_PROPS = {
  autofocus: 1,
  checked: 1,
  defaultchecked: 1,
  disabled: 1,
  formnovalidate: 1,
  indeterminate: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  willvalidate: 1
}
var COMMENT_TAG = '!--'
var SVG_TAGS = [
  'svg',
  'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile',
  'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face',
  'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri',
  'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
  'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath',
  'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect',
  'set', 'stop', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref',
  'tspan', 'use', 'view', 'vkern'
]

function belCreateElement (tag, props, children) {
  var el

  // If an svg tag, it needs a namespace
  if (SVG_TAGS.indexOf(tag) !== -1) {
    props.namespace = SVGNS
  }

  // If we are using a namespace
  var ns = false
  if (props.namespace) {
    ns = props.namespace
    delete props.namespace
  }

  // Create the element
  if (ns) {
    el = document.createElementNS(ns, tag)
  } else if (tag === COMMENT_TAG) {
    return document.createComment(props.comment)
  } else {
    el = document.createElement(tag)
  }

  // If adding onload events
  if (props.onload || props.onunload) {
    var load = props.onload || function () {}
    var unload = props.onunload || function () {}
    onload(el, function belOnload () {
      load(el)
    }, function belOnunload () {
      unload(el)
    },
    // We have to use non-standard `caller` to find who invokes `belCreateElement`
    belCreateElement.caller.caller.caller)
    delete props.onload
    delete props.onunload
  }

  // Create the properties
  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      var key = p.toLowerCase()
      var val = props[p]
      // Normalize className
      if (key === 'classname') {
        key = 'class'
        p = 'class'
      }
      // The for attribute gets transformed to htmlFor, but we just set as for
      if (p === 'htmlFor') {
        p = 'for'
      }
      // If a property is boolean, set itself to the key
      if (BOOL_PROPS[key]) {
        if (val === 'true') val = key
        else if (val === 'false') continue
      }
      // If a property prefers being set directly vs setAttribute
      if (key.slice(0, 2) === 'on') {
        el[p] = val
      } else {
        if (ns) {
          if (p === 'xlink:href') {
            el.setAttributeNS(XLINKNS, p, val)
          } else if (/^xmlns($|:)/i.test(p)) {
            // skip xmlns definitions
          } else {
            el.setAttributeNS(null, p, val)
          }
        } else {
          el.setAttribute(p, val)
        }
      }
    }
  }

  function appendChild (childs) {
    if (!Array.isArray(childs)) return
    for (var i = 0; i < childs.length; i++) {
      var node = childs[i]
      if (Array.isArray(node)) {
        appendChild(node)
        continue
      }

      if (typeof node === 'number' ||
        typeof node === 'boolean' ||
        typeof node === 'function' ||
        node instanceof Date ||
        node instanceof RegExp) {
        node = node.toString()
      }

      if (typeof node === 'string') {
        if (el.lastChild && el.lastChild.nodeName === '#text') {
          el.lastChild.nodeValue += node
          continue
        }
        node = document.createTextNode(node)
      }

      if (node && node.nodeType) {
        el.appendChild(node)
      }
    }
  }
  appendChild(children)

  return el
}

module.exports = hyperx(belCreateElement, {comments: true})
module.exports.default = module.exports
module.exports.createElement = belCreateElement

},{"global/document":4,"hyperx":7,"on-load":10}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/* global HTMLElement */

'use strict'

module.exports = function emptyElement (element) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError('Expected an element')
  }

  var node
  while ((node = element.lastChild)) element.removeChild(node)
  return element
}

},{}],4:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],5:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}

},{}],7:[function(require,module,exports){
var attrToProp = require('hyperscript-attribute-to-property')

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([ OPEN, '/', arg ])
            reg = ''
          } else {
            p.push([ OPEN, arg ])
          }
        } else {
          p.push([ VAR, xstate, arg ])
        }
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && c === '/' && reg.length) {
          // no-op, self closing tag without a space <br/>
        } else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg])
          }
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }

},{"hyperscript-attribute-to-property":6}],8:[function(require,module,exports){
'use strict';

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;

var testEl = doc ?
    doc.body || doc.createElement('div') :
    {};

// Fixes <https://github.com/patrick-steele-idem/morphdom/issues/32>
// (IE7+ support) <=IE7 does not support el.hasAttribute(name)
var actualHasAttributeNS;

if (testEl.hasAttributeNS) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttributeNS(namespaceURI, name);
    };
} else if (testEl.hasAttribute) {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.hasAttribute(name);
    };
} else {
    actualHasAttributeNS = function(el, namespaceURI, name) {
        return el.getAttributeNode(namespaceURI, name) != null;
    };
}

var hasAttributeNS = actualHasAttributeNS;


function toElement(str) {
    if (!range && doc.createRange) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment;
    if (range && range.createContextualFragment) {
        fragment = range.createContextualFragment(str);
    } else {
        fragment = doc.createElement('body');
        fragment.innerHTML = str;
    }
    return fragment.childNodes[0];
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;

    if (fromNodeName === toNodeName) {
        return true;
    }

    if (toEl.actualize &&
        fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
        toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
        // If the target element is a virtual DOM node then we may need to normalize the tag name
        // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
        // are converted to upper case
        return fromNodeName === toNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function morphAttrs(fromNode, toNode) {
    var attrs = toNode.attributes;
    var i;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    attrs = fromNode.attributes;

    for (i = attrs.length - 1; i >= 0; --i) {
        attr = attrs[i];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;

                if (!hasAttributeNS(toNode, attrNamespaceURI, attrName)) {
                    fromNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!hasAttributeNS(toNode, null, attrName)) {
                    fromNode.removeAttribute(attrName);
                }
            }
        }
    }
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name, '');
        }
    }
}

var specialElHandlers = {
    /**
     * Needed for IE. Apparently IE doesn't think that "selected" is an
     * attribute when reading over the attributes using selectEl.attributes
     */
    OPTION: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!hasAttributeNS(toEl, null, 'value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!hasAttributeNS(toEl, null, 'multiple')) {
            var selectedIndex = -1;
            var i = 0;
            var curChild = toEl.firstChild;
            while(curChild) {
                var nodeName = curChild.nodeName;
                if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                    if (hasAttributeNS(curChild, null, 'selected')) {
                        selectedIndex = i;
                        break;
                    }
                    i++;
                }
                curChild = curChild.nextSibling;
            }

            fromEl.selectedIndex = i;
        }
    }
};

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
    return node.id;
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = {};
        var keyedRemovalList;

        function addKeyedRemoval(key) {
            if (keyedRemovalList) {
                keyedRemovalList.push(key);
            } else {
                keyedRemovalList = [key];
            }
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    }
                }

                handleNodeAdded(curChild);
                curChild = nextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);
            var curFromNodeKey;

            if (toElKey) {
                // If an element with an ID is being morphed then it is will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (toNode.isSameNode && toNode.isSameNode(fromNode)) {
                return;
            }

            if (!childrenOnly) {
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                morphAttrs(fromEl, toEl);
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
                var curToNodeChild = toEl.firstChild;
                var curFromNodeChild = fromEl.firstChild;
                var curToNodeKey;

                var fromNextSibling;
                var toNextSibling;
                var matchingFromEl;

                outer: while (curToNodeChild) {
                    toNextSibling = curToNodeChild.nextSibling;
                    curToNodeKey = getNodeKey(curToNodeChild);

                    while (curFromNodeChild) {
                        fromNextSibling = curFromNodeChild.nextSibling;

                        if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        curFromNodeKey = getNodeKey(curFromNodeChild);

                        var curFromNodeType = curFromNodeChild.nodeType;

                        var isCompatible = undefined;

                        if (curFromNodeType === curToNodeChild.nodeType) {
                            if (curFromNodeType === ELEMENT_NODE) {
                                // Both nodes being compared are Element nodes

                                if (curToNodeKey) {
                                    // The target node has a key so we want to match it up with the correct element
                                    // in the original DOM tree
                                    if (curToNodeKey !== curFromNodeKey) {
                                        // The current element in the original DOM tree does not have a matching key so
                                        // let's check our lookup to see if there is a matching element in the original
                                        // DOM tree
                                        if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                            if (curFromNodeChild.nextSibling === matchingFromEl) {
                                                // Special case for single element removals. To avoid removing the original
                                                // DOM node out of the tree (since that can break CSS transitions, etc.),
                                                // we will instead discard the current node and wait until the next
                                                // iteration to properly match up the keyed target element with its matching
                                                // element in the original tree
                                                isCompatible = false;
                                            } else {
                                                // We found a matching keyed element somewhere in the original DOM tree.
                                                // Let's moving the original DOM node into the current position and morph
                                                // it.

                                                // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                                // the `removeNode()` function for the node that is being discarded so that
                                                // all lifecycle hooks are correctly invoked
                                                fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                                fromNextSibling = curFromNodeChild.nextSibling;

                                                if (curFromNodeKey) {
                                                    // Since the node is keyed it might be matched up later so we defer
                                                    // the actual removal to later
                                                    addKeyedRemoval(curFromNodeKey);
                                                } else {
                                                    // NOTE: we skip nested keyed nodes from being removed since there is
                                                    //       still a chance they will be matched up later
                                                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                                }

                                                curFromNodeChild = matchingFromEl;
                                            }
                                        } else {
                                            // The nodes are not compatible since the "to" node has a key and there
                                            // is no matching keyed node in the source tree
                                            isCompatible = false;
                                        }
                                    }
                                } else if (curFromNodeKey) {
                                    // The original has a key
                                    isCompatible = false;
                                }

                                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                                if (isCompatible) {
                                    // We found compatible DOM elements so transform
                                    // the current "from" node to match the current
                                    // target DOM node.
                                    morphEl(curFromNodeChild, curToNodeChild);
                                }

                            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                                // Both nodes being compared are Text or Comment nodes
                                isCompatible = true;
                                // Simply update nodeValue on the original node to
                                // change the text value
                                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                                }

                            }
                        }

                        if (isCompatible) {
                            // Advance both the "to" child and the "from" child since we found a match
                            curToNodeChild = toNextSibling;
                            curFromNodeChild = fromNextSibling;
                            continue outer;
                        }

                        // No compatible match so remove the old node from the DOM and continue trying to find a
                        // match in the original DOM. However, we only do this if the from node is not keyed
                        // since it is possible that a keyed node might match up with a node somewhere else in the
                        // target tree and we don't want to discard it just yet since it still might find a
                        // home in the final DOM tree. After everything is done we will remove any keyed nodes
                        // that didn't find a home
                        if (curFromNodeKey) {
                            // Since the node is keyed it might be matched up later so we defer
                            // the actual removal to later
                            addKeyedRemoval(curFromNodeKey);
                        } else {
                            // NOTE: we skip nested keyed nodes from being removed since there is
                            //       still a chance they will be matched up later
                            removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                        }

                        curFromNodeChild = fromNextSibling;
                    }

                    // If we got this far then we did not find a candidate match for
                    // our "to node" and we exhausted all of the children "from"
                    // nodes. Therefore, we will just append the current "to" node
                    // to the end
                    if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                        fromEl.appendChild(matchingFromEl);
                        morphEl(matchingFromEl, curToNodeChild);
                    } else {
                        var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                        if (onBeforeNodeAddedResult !== false) {
                            if (onBeforeNodeAddedResult) {
                                curToNodeChild = onBeforeNodeAddedResult;
                            }

                            if (curToNodeChild.actualize) {
                                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                            }
                            fromEl.appendChild(curToNodeChild);
                            handleNodeAdded(curToNodeChild);
                        }
                    }

                    curToNodeChild = toNextSibling;
                    curFromNodeChild = fromNextSibling;
                }

                // We have processed all of the "to nodes". If curFromNodeChild is
                // non-null then we still have some from nodes left over that need
                // to be removed
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;
                    if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }
                    curFromNodeChild = fromNextSibling;
                }
            }

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphEl(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

module.exports = morphdom;

},{}],9:[function(require,module,exports){
assert.notEqual = notEqual
assert.notOk = notOk
assert.equal = equal
assert.ok = assert

module.exports = assert

function equal (a, b, m) {
  assert(a == b, m) // eslint-disable-line eqeqeq
}

function notEqual (a, b, m) {
  assert(a != b, m) // eslint-disable-line eqeqeq
}

function notOk (t, m) {
  assert(!t, m)
}

function assert (t, m) {
  if (!t) throw new Error(m || 'AssertionError')
}

},{}],10:[function(require,module,exports){
/* global MutationObserver */
var document = require('global/document')
var window = require('global/window')
var assert = require('assert')
var watch = Object.create(null)
var KEY_ID = 'onloadid' + (new Date() % 9e6).toString(36)
var KEY_ATTR = 'data-' + KEY_ID
var INDEX = 0

if (window && window.MutationObserver) {
  var observer = new MutationObserver(function (mutations) {
    if (Object.keys(watch).length < 1) return
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === KEY_ATTR) {
        eachAttr(mutations[i], turnon, turnoff)
        continue
      }
      eachMutation(mutations[i].removedNodes, turnoff)
      eachMutation(mutations[i].addedNodes, turnon)
    }
  })
  if (document.body) {
    beginObserve(observer)
  } else {
    document.addEventListener('DOMContentLoaded', function (event) {
      beginObserve(observer)
    })
  }
}

function beginObserve (observer) {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [KEY_ATTR]
  })
}

module.exports = function onload (el, on, off, caller) {
  assert(document.body, 'on-load: will not work prior to DOMContentLoaded')
  on = on || function () {}
  off = off || function () {}
  el.setAttribute(KEY_ATTR, 'o' + INDEX)
  watch['o' + INDEX] = [on, off, 0, caller || onload.caller]
  INDEX += 1
  return el
}

module.exports.KEY_ATTR = KEY_ATTR
module.exports.KEY_ID = KEY_ID

function turnon (index, el) {
  if (watch[index][0] && watch[index][2] === 0) {
    watch[index][0](el)
    watch[index][2] = 1
  }
}

function turnoff (index, el) {
  if (watch[index][1] && watch[index][2] === 1) {
    watch[index][1](el)
    watch[index][2] = 0
  }
}

function eachAttr (mutation, on, off) {
  var newValue = mutation.target.getAttribute(KEY_ATTR)
  if (sameOrigin(mutation.oldValue, newValue)) {
    watch[newValue] = watch[mutation.oldValue]
    return
  }
  if (watch[mutation.oldValue]) {
    off(mutation.oldValue, mutation.target)
  }
  if (watch[newValue]) {
    on(newValue, mutation.target)
  }
}

function sameOrigin (oldValue, newValue) {
  if (!oldValue || !newValue) return false
  return watch[oldValue][3] === watch[newValue][3]
}

function eachMutation (nodes, fn) {
  var keys = Object.keys(watch)
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].getAttribute && nodes[i].getAttribute(KEY_ATTR)) {
      var onloadid = nodes[i].getAttribute(KEY_ATTR)
      keys.forEach(function (k) {
        if (onloadid === k) {
          fn(k, nodes[i])
        }
      })
    }
    if (nodes[i].childNodes.length > 0) {
      eachMutation(nodes[i].childNodes, fn)
    }
  }
}

},{"assert":9,"global/document":4,"global/window":5}],11:[function(require,module,exports){
(function (process){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.page = factory());
}(this, (function () { 'use strict';

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
function parse (str) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var suffix = res[6];
    var asterisk = res[7];

    var repeat = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';
    var delimiter = prefix || '/';
    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      pattern: escapeGroup(pattern)
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
function compile (str) {
  return tokensToFunction(parse(str))
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^' + tokens[i].pattern + '$');
    }
  }

  return function (obj) {
    var path = '';
    var data = obj || {};

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encodeURIComponent(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = encodeURIComponent(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {String} str
 * @return {String}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {String}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {RegExp} path
 * @param  {Array}  keys
 * @return {RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {Array}  path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {String} path
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function stringToRegexp (path, keys, options) {
  var tokens = parse(path);
  var re = tokensToRegExp(tokens, options);

  // Attach keys back to the regexp.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] !== 'string') {
      keys.push(tokens[i]);
    }
  }

  return attachKeys(re, keys)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function tokensToRegExp (tokens, options) {
  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';
  var lastToken = tokens[tokens.length - 1];
  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = token.pattern;

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (prefix) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return new RegExp('^' + route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 [keys]
 * @param  {Object}                [options]
 * @return {RegExp}
 */
function pathToRegexp (path, keys, options) {
  keys = keys || [];

  if (!isarray(keys)) {
    options = keys;
    keys = [];
  } else if (!options) {
    options = {};
  }

  if (path instanceof RegExp) {
    return regexpToRegexp(path, keys, options)
  }

  if (isarray(path)) {
    return arrayToRegexp(path, keys, options)
  }

  return stringToRegexp(path, keys, options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/**
   * Module dependencies.
   */

  

  /**
   * Module exports.
   */

  var page_js = page;
  page.default = page;
  page.Context = Context;
  page.Route = Route;
  page.sameOrigin = sameOrigin;

  /**
   * Short-cuts for global-object checks
   */

  var hasDocument = ('undefined' !== typeof document);
  var hasWindow = ('undefined' !== typeof window);
  var hasHistory = ('undefined' !== typeof history);
  var hasProcess = typeof process !== 'undefined';

  /**
   * Detect click event
   */
  var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var isLocation = hasWindow && !!(window.history.location || window.location);

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;


  /**
   * Decode URL components (query string, pathname, hash).
   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
   */
  var decodeURLComponents = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Strict path matching.
   */

  var strict = false;

  /**
   * Running flag.
   */

  var running;

  /**
   * HashBang option
   */

  var hashbang = false;

  /**
   * Previous context, for capturing
   * page exit events.
   */

  var prevContext;

  /**
   * The window for which this `page` is running
   */
  var pageWindow;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or redirection,
   * or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page('/from', '/to')
   *   page();
   *
   * @param {string|!Function|!Object} path
   * @param {Function=} fn
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(/** @type {string} */ (path));
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
      // show <path> with [state]
    } else if ('string' === typeof path) {
      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
      // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];
  page.exits = [];

  /**
   * Current path being processed
   * @type {string}
   */
  page.current = '';

  /**
   * Number of pages navigated to.
   * @type {number}
   *
   *     page.len == 0;
   *     page('/login');
   *     page.len == 1;
   */

  page.len = 0;

  /**
   * Get or set basepath to `path`.
   *
   * @param {string} path
   * @api public
   */

  page.base = function(path) {
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Get or set strict path matching to `enable`
   *
   * @param {boolean} enable
   * @api public
   */

  page.strict = function(enable) {
    if (0 === arguments.length) return strict;
    strict = enable;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options) {
    options = options || {};
    if (running) return;
    running = true;
    pageWindow = options.window || (hasWindow && window);
    if (false === options.dispatch) dispatch = false;
    if (false === options.decodeURLComponents) decodeURLComponents = false;
    if (false !== options.popstate && hasWindow) pageWindow.addEventListener('popstate', onpopstate, false);
    if (false !== options.click && hasDocument) {
      pageWindow.document.addEventListener(clickEvent, onclick, false);
    }
    hashbang = !!options.hashbang;
    if(hashbang && hasWindow && !hasHistory) {
      pageWindow.addEventListener('hashchange', onpopstate, false);
    }
    if (!dispatch) return;

    var url;
    if(isLocation) {
      var loc = pageWindow.location;

      if(hashbang && ~loc.hash.indexOf('#!')) {
        url = loc.hash.substr(2) + loc.search;
      } else if (hashbang) {
        url = loc.search + loc.hash;
      } else {
        url = loc.pathname + loc.search + loc.hash;
      }
    }

    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function() {
    if (!running) return;
    page.current = '';
    page.len = 0;
    running = false;
    hasDocument && pageWindow.document.removeEventListener(clickEvent, onclick, false);
    hasWindow && pageWindow.removeEventListener('popstate', onpopstate, false);
    hasWindow && pageWindow.removeEventListener('hashchange', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} dispatch
   * @param {boolean=} push
   * @return {!Context}
   * @api public
   */

  page.show = function(path, state, dispatch, push) {
    var ctx = new Context(path, state),
      prev = prevContext;
    prevContext = ctx;
    page.current = ctx.path;
    if (false !== dispatch) page.dispatch(ctx, prev);
    if (false !== ctx.handled && false !== push) ctx.pushState();
    return ctx;
  };

  /**
   * Goes back in the history
   * Back should always let the current route push state and then go back.
   *
   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
   * @param {Object=} state
   * @api public
   */

  page.back = function(path, state) {
    if (page.len > 0) {
      // this may need more testing to see if all browsers
      // wait for the next tick to go back in history
      hasHistory && pageWindow.history.back();
      page.len--;
    } else if (path) {
      setTimeout(function() {
        page.show(path, state);
      });
    }else{
      setTimeout(function() {
        page.show(getBase(), state);
      });
    }
  };


  /**
   * Register route to redirect from one path to other
   * or just redirect to another route
   *
   * @param {string} from - if param 'to' is undefined redirects to 'from'
   * @param {string=} to
   * @api public
   */
  page.redirect = function(from, to) {
    // Define route from a path to another
    if ('string' === typeof from && 'string' === typeof to) {
      page(from, function(e) {
        setTimeout(function() {
          page.replace(/** @type {!string} */ (to));
        }, 0);
      });
    }

    // Wait for the push state and replace it with another
    if ('string' === typeof from && 'undefined' === typeof to) {
      setTimeout(function() {
        page.replace(from);
      }, 0);
    }
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {string} path
   * @param {Object=} state
   * @param {boolean=} init
   * @param {boolean=} dispatch
   * @return {!Context}
   * @api public
   */


  page.replace = function(path, state, init, dispatch) {
    var ctx = new Context(path, state),
      prev = prevContext;
    prevContext = ctx;
    page.current = ctx.path;
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx, prev);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Context} ctx
   * @api private
   */

  page.dispatch = function(ctx, prev) {
    var i = 0,
      j = 0;

    function nextExit() {
      var fn = page.exits[j++];
      if (!fn) return nextEnter();
      fn(prev, nextExit);
    }

    function nextEnter() {
      var fn = page.callbacks[i++];

      if (ctx.path !== page.current) {
        ctx.handled = false;
        return;
      }
      if (!fn) return unhandled(ctx);
      fn(ctx, nextEnter);
    }

    if (prev) {
      nextExit();
    } else {
      nextEnter();
    }
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */
  function unhandled(ctx) {
    if (ctx.handled) return;
    var current;

    if (hashbang) {
      current = isLocation && getBase() + pageWindow.location.hash.replace('#!', '');
    } else {
      current = isLocation && pageWindow.location.pathname + pageWindow.location.search;
    }

    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    isLocation && (pageWindow.location.href = ctx.canonicalPath);
  }

  /**
   * Register an exit route on `path` with
   * callback `fn()`, which will be called
   * on the previous context when a new
   * page is visited.
   */
  page.exit = function(path, fn) {
    if (typeof path === 'function') {
      return page.exit('*', path);
    }

    var route = new Route(path);
    for (var i = 1; i < arguments.length; ++i) {
      page.exits.push(route.middleware(arguments[i]));
    }
  };

  /**
   * Remove URL encoding from the given `str`.
   * Accommodates whitespace in both x-www-form-urlencoded
   * and regular percent-encoded form.
   *
   * @param {string} val - URL component to decode
   */
  function decodeURLEncodedURIComponent(val) {
    if (typeof val !== 'string') { return val; }
    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @constructor
   * @param {string} path
   * @param {Object=} state
   * @api public
   */

  function Context(path, state) {
    var pageBase = getBase();
    if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(pageBase, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = (hasDocument && pageWindow.document.title);
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      var parts = this.path.split('#');
      this.path = this.pathname = parts[0];
      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function() {
    page.len++;
    if (hasHistory) {
        pageWindow.history.pushState(this.state, this.title,
          hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function() {
    if (hasHistory && pageWindow.location.protocol !== 'file:') {
        pageWindow.history.replaceState(this.state, this.title,
          hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
    }
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @constructor
   * @param {string} path
   * @param {Object=} options
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    options.strict = options.strict || strict;
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathToRegexp_1(this.path,
      this.keys = [],
      options);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn) {
    var self = this;
    return function(ctx, next) {
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {string} path
   * @param {Object} params
   * @return {boolean}
   * @api private
   */

  Route.prototype.match = function(path, params) {
    var keys = this.keys,
      qsIndex = path.indexOf('?'),
      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
      m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];
      var val = decodeURLEncodedURIComponent(m[i]);
      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
        params[key.name] = val;
      }
    }

    return true;
  };


  /**
   * Handle "populate" events.
   */

  var onpopstate = (function () {
    var loaded = false;
    if ( ! hasWindow ) {
      return;
    }
    if (hasDocument && document.readyState === 'complete') {
      loaded = true;
    } else {
      window.addEventListener('load', function() {
        setTimeout(function() {
          loaded = true;
        }, 0);
      });
    }
    return function onpopstate(e) {
      if (!loaded) return;
      if (e.state) {
        var path = e.state.path;
        page.replace(path, e.state);
      } else if (isLocation) {
        var loc = pageWindow.location;
        page.show(loc.pathname + loc.hash, undefined, undefined, false);
      }
    };
  })();
  /**
   * Handle "click" events.
   */

  /* jshint +W054 */
  function onclick(e) {
    if (1 !== which(e)) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    // use shadow dom when available if not, fall back to composedPath() for browsers that only have shady
    var el = e.target;
    var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

    if(eventPath) {
      for (var i = 0; i < eventPath.length; i++) {
        if (!eventPath[i].nodeName) continue;
        if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
        if (!eventPath[i].href) continue;

        el = eventPath[i];
        break;
      }
    }
    // continue ensure link
    // el.nodeName for svg links are 'a' instead of 'A'
    while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
    if (!el || 'A' !== el.nodeName.toUpperCase()) return;

    // check if link is inside an svg
    // in this case, both href and target are always inside an object
    var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

    // Ignore if tag has
    // 1. "download" attribute
    // 2. rel="external" attribute
    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if(!hashbang && samePath(el) && (el.hash || '#' === link)) return;

    // Check for mailto: in the href
    if (link && link.indexOf('mailto:') > -1) return;

    // check target
    // svg target is an object and its desired value is in .baseVal property
    if (svg ? el.target.baseVal : el.target) return;

    // x-origin
    // note: svg links that are not relative don't call click events (and skip page.js)
    // consequently, all svg links tested inside page.js are relative and in the same origin
    if (!svg && !sameOrigin(el.href)) return;

    // rebuild path
    // There aren't .pathname and .search properties in svg links, so we use href
    // Also, svg href is an object and its desired value is in .baseVal property
    var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

    path = path[0] !== '/' ? '/' + path : path;

    // strip leading "/[drive letter]:" on NW.js on Windows
    if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
      path = path.replace(/^\/[a-zA-Z]:\//, '/');
    }

    // same page
    var orig = path;
    var pageBase = getBase();

    if (path.indexOf(pageBase) === 0) {
      path = path.substr(base.length);
    }

    if (hashbang) path = path.replace('#!', '');

    if (pageBase && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || (hasWindow && window.event);
    return null == e.which ? e.button : e.which;
  }

  /**
   * Convert to a URL object
   */
  function toURL(href) {
    if(typeof URL === 'function' && isLocation) {
      return new URL(href, location.toString());
    } else if (hasDocument) {
      var anc = document.createElement('a');
      anc.href = href;
      return anc;
    }
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    if(!href || !isLocation) return false;
    var url = toURL(href);

    var loc = pageWindow.location;
    return loc.protocol === url.protocol &&
      loc.hostname === url.hostname &&
      loc.port === url.port;
  }

  function samePath(url) {
    if(!isLocation) return false;
    var loc = pageWindow.location;
    return url.pathname === loc.pathname &&
      url.search === loc.search;
  }

  /**
   * Gets the `base`, which depends on whether we are using History or
   * hashbang routing.
   */
  function getBase() {
    if(!!base) return base;
    var loc = hasWindow && pageWindow && pageWindow.location;
    return (hasWindow && hashbang && loc && loc.protocol === 'file:') ? loc.pathname : base;
  }

  page.sameOrigin = sameOrigin;

return page_js;

})));

}).call(this,require('_process'))
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
var bel = require('bel') // turns template tag into DOM elements
var morphdom = require('morphdom') // efficiently diffs + morphs two DOM elements
var defaultEvents = require('./update-events.js') // default events to be copied when dom elements update

module.exports = bel

// TODO move this + defaultEvents to a new module once we receive more feedback
module.exports.update = function (fromNode, toNode, opts) {
  if (!opts) opts = {}
  if (opts.events !== false) {
    if (!opts.onBeforeElUpdated) opts.onBeforeElUpdated = copier
  }

  return morphdom(fromNode, toNode, opts)

  // morphdom only copies attributes. we decided we also wanted to copy events
  // that can be set via attributes
  function copier (f, t) {
    // copy events:
    var events = opts.events || defaultEvents
    for (var i = 0; i < events.length; i++) {
      var ev = events[i]
      if (t[ev]) { // if new element has a whitelisted attribute
        f[ev] = t[ev] // update existing element
      } else if (f[ev]) { // if existing element has it and new one doesnt
        f[ev] = undefined // remove it from existing element
      }
    }
    var oldValue = f.value
    var newValue = t.value
    // copy values for form elements
    if ((f.nodeName === 'INPUT' && f.type !== 'file') || f.nodeName === 'SELECT') {
      if (!newValue && !t.hasAttribute('value')) {
        t.value = f.value
      } else if (newValue !== oldValue) {
        f.value = newValue
      }
    } else if (f.nodeName === 'TEXTAREA') {
      if (t.getAttribute('value') === null) f.value = t.value
    }
  }
}

},{"./update-events.js":14,"bel":1,"morphdom":8}],14:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],15:[function(require,module,exports){
'use strict';

var page = require('page');

page('/*', function (ctx, next) {
  page.redirect('/');
});

},{"page":11}],16:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDPorAprobar = "";
var urlBDAprobada = "";
var urlBDRechazada = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/aprobadas";

page('/aprobadas', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDPorAprobar = "registroConcursante/pensionado/hombre/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/hombre/rechazado";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDPorAprobar = "registroConcursante/pensionado/mujer/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/mujer/rechazado";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/45/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/45/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/25/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/25/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/40/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/40/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/20/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/20/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "kidHombre15") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "kidHombre10") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/10/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/10/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "kidMujer15") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else if (category == "kidMujer6") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/6/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/6/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Imágenes Aprobadas';

      load();
    } else {

      page.redirect('/home');
    }
  } else {
    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {
      //alert("bottom! ok");
      console.log("bottom! ok");
      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
    }
  });

  $('.dropdown-button').dropdown();
}

function btnActios() {

  $('.btnDelete').click(function () {
    rechazar($(this));
  });
  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","desktopHd.png","tablet.png"));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDAprobada).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDAprobada).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardAprobadas');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function rechazar(thisObj) {
  var key = thisObj.attr('id');
  var idCard = key + "card";
  console.log("idCard:", idCard);

  var updateRefFB = firebase.database().ref().child(urlBDAprobada + '/' + key);
  updateRefFB.once("value", function (snapshot) {
    var datos = snapshot.val();
    if (datos == null) {
      console.log('error en codigo y tabla');
    } else {
      var updateRefFB2 = firebase.database().ref().child(urlBDRechazada + '/' + key);
      console.log('ok ref2: ', updateRefFB2);
      //console.log('datos:',datos);
      //console.log('name:',datos.name);
      updateRefFB2.set({
        name: datos.name,
        lastName: datos.lastName,
        rut: datos.rut,
        email: datos.email,
        phone: datos.phone,
        nameImagen: datos.nameImagen,
        urlImagen: datos.urlImagen,
        urlImagen_thumb: datos.urlImagen_thumb,
        category: "false",
        status: "false",
        score: "0"
      });
    }
    updateRefFB.remove();

    var a = document.getElementById(idCard);
    a.remove();
  });
  console.log("codigo:", key);
}

},{"../card/cardAprobadas":17,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],17:[function(require,module,exports){
"use strict";

var _templateObject = _taggedTemplateLiteral(["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"], ["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb) {
  var aux3 = key + "card";
  return yo(_templateObject, aux3, urlImage, urlImageThumb, key, rut, key);
};

},{"yo-yo":13}],18:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\t        <div class="col s6 m4 curso" id= ', ' >\n              <div class="card hoverable">\n                <div class="card-image "> \n                  <a >  \n                    <img style="min-height=300px;" src=', '>\n                  </a>\n               \n                </div>\n                <div class="card-content">\n                  <div class="divId" >\n                    <span class="card-title center" >', '</span>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t'], ['\n\t        <div class="col s6 m4 curso" id= ', ' >\n              <div class="card hoverable">\n                <div class="card-image "> \n                  <a >  \n                    <img style="min-height=300px;" src=', '>\n                  </a>\n               \n                </div>\n                <div class="card-content">\n                  <div class="divId" >\n                    <span class="card-title center" >', '</span>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function card(category, urlImageThumb, btnId) {

  return yo(_templateObject, btnId, urlImageThumb, category);
};

},{"yo-yo":13}],19:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n        <div class="col s6 m4 curso"  id=', '>\n            <div class="card hoverable">\n              <div class="card-image "> \n                <a target="_blank" href=', '>  \n                  <img style="min-height=300px;" src=', '>\n                </a>\n                <a class="btn-floating halfway-fab waves-effect waves-light red">\n                  <i id=', ' class="btnDelete material-icons">clear</i>\n                </a>     \n              </div>\n               ', '\n              <div class="card-reveal">\n                  <span class="card-title grey-text text-darken-4">Datos<i class="material-icons right">close</i></span>\n                  <p>NOMBRE:</p>\n                  <p class="name" >', '</p>\n                  <p>E-MAIL:</p>\n                  <p class="email">', '</p>\n                  <p>RUT:</p>\n                  <p class="rut">', '</p>\n              </div>\n              <div class="card-action">\n                  <a href=', ' data-mail="max" target="_top" >Enviar Correo</a>\n                 \n              </div>\n            </div>\n\n          </div>\n  '], ['\n        <div class="col s6 m4 curso"  id=', '>\n            <div class="card hoverable">\n              <div class="card-image "> \n                <a target="_blank" href=', '>  \n                  <img style="min-height=300px;" src=', '>\n                </a>\n                <a class="btn-floating halfway-fab waves-effect waves-light red">\n                  <i id=', ' class="btnDelete material-icons">clear</i>\n                </a>     \n              </div>\n               ', '\n              <div class="card-reveal">\n                  <span class="card-title grey-text text-darken-4">Datos<i class="material-icons right">close</i></span>\n                  <p>NOMBRE:</p>\n                  <p class="name" >', '</p>\n                  <p>E-MAIL:</p>\n                  <p class="email">', '</p>\n                  <p>RUT:</p>\n                  <p class="rut">', '</p>\n              </div>\n              <div class="card-action">\n                  <a href=', ' data-mail="max" target="_top" >Enviar Correo</a>\n                 \n              </div>\n            </div>\n\n          </div>\n  ']),
    _templateObject2 = _taggedTemplateLiteral(['\n      <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n\n    '], ['\n      <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n\n    ']),
    _templateObject3 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n    </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n    </div>\n    ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject6 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder; " class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder; " class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject7 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <span class="card-title activator grey-text text-darken-4">Ganador<i  class="tool material-icons right">info</i></span>\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n        </div>\n      </div>\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');
var yo2 = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb, status, score, name, email) {
  var estrellas = starLoad(Number(score), key, rut);
  console.log('score: ', score);
  var numberEstrellas = score;
  var aux = key + "btnDelete";
  var aux3 = key + "card";
  var mailAddress = 'mailto:' + email + '?subject=Ganador%20Casting%20';

  return yo(_templateObject, aux3, urlImage, urlImageThumb, aux, estrellas, name, email, rut, mailAddress);
};

function starLoad(numero, key, rut) {
  var star1 = key + "star1";
  var star2 = key + "star2";
  var star3 = key + "star3";
  var star4 = key + "star4";
  var star5 = key + "star5";
  var resultado = "";
  if (numero == 0) {
    return yo2(_templateObject2, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 1) {
    return yo2(_templateObject3, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 2) {
    return yo2(_templateObject4, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 3) {
    return yo2(_templateObject5, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 4) {
    return yo2(_templateObject6, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 5) {
    return yo2(_templateObject7, rut, key, star1, star2, star3, star4, star5);
  }
}

},{"yo-yo":13}],20:[function(require,module,exports){
"use strict";

var _templateObject = _taggedTemplateLiteral(["\n            <div class=\"col s6 m3 curso\"  id=", " >\n                <div class=\"card hoverable\">\n                  <div class=\"card-image \"> \n                    <a target=\"_blank\" href=", ">  \n                      <img style=\"min-height=300px;\" src=", ">\n                    </a>\n                    <a class=\"btn-floating halfway-fab waves-effect waves-light orange\" style=\"right: 5px;\">\n                      <i id=", " class=\"btnFavorite material-icons\">favorite</i>\n                    </a>\n                  </div>\n                  <div class=\"card-content\">\n                    <div class=\"divId\" >\n                      <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                      <p class=\"rut\" style=\"text-align:center\">", "</p>\n                      <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                      <p class=\"key1\" style=\"text-align:center\">", "</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n      "], ["\n            <div class=\"col s6 m3 curso\"  id=", " >\n                <div class=\"card hoverable\">\n                  <div class=\"card-image \"> \n                    <a target=\"_blank\" href=", ">  \n                      <img style=\"min-height=300px;\" src=", ">\n                    </a>\n                    <a class=\"btn-floating halfway-fab waves-effect waves-light orange\" style=\"right: 5px;\">\n                      <i id=", " class=\"btnFavorite material-icons\">favorite</i>\n                    </a>\n                  </div>\n                  <div class=\"card-content\">\n                    <div class=\"divId\" >\n                      <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                      <p class=\"rut\" style=\"text-align:center\">", "</p>\n                      <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                      <p class=\"key1\" style=\"text-align:center\">", "</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n      "]),
    _templateObject2 = _taggedTemplateLiteral(["\n            <div class=\"col s6 m3 curso\"  id=", " >\n                <div class=\"card hoverable\">\n                  <div class=\"card-image \"> \n                    <a target=\"_blank\" href=", ">  \n                      <img style=\"min-height=300px;\" src=", ">\n                    </a>\n                    <a class=\"btn-floating halfway-fab waves-effect waves-light orange\" style=\"right: 5px;\">\n                      <i id=", " class=\"btnFavorite material-icons\">favorite_border</i>\n                    </a>\n                  </div>\n                  <div class=\"card-content\">\n                    <div class=\"divId\" >\n                      <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                      <p class=\"rut\" style=\"text-align:center\">", "</p>\n                      <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                      <p class=\"key1\" style=\"text-align:center\">", "</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n      "], ["\n            <div class=\"col s6 m3 curso\"  id=", " >\n                <div class=\"card hoverable\">\n                  <div class=\"card-image \"> \n                    <a target=\"_blank\" href=", ">  \n                      <img style=\"min-height=300px;\" src=", ">\n                    </a>\n                    <a class=\"btn-floating halfway-fab waves-effect waves-light orange\" style=\"right: 5px;\">\n                      <i id=", " class=\"btnFavorite material-icons\">favorite_border</i>\n                    </a>\n                  </div>\n                  <div class=\"card-content\">\n                    <div class=\"divId\" >\n                      <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                      <p class=\"rut\" style=\"text-align:center\">", "</p>\n                      <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                      <p class=\"key1\" style=\"text-align:center\">", "</p>\n                    </div>\n                  </div>\n                </div>\n              </div>\n      "]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb, category) {
  var aux = key + "favorite";
  var aux2 = key + "favorite_border";

  var aux3 = key + "card";

  if (category == "cat_1") {
    return yo(_templateObject, aux3, urlImage, urlImageThumb, aux, rut, key);
  } else if (category == "false") {
    return yo(_templateObject2, aux3, urlImage, urlImageThumb, aux2, rut, key);
  }
};

},{"yo-yo":13}],21:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n            <div class="col s6 m3 curso" id=', ' >\n                <div class="card hoverable">\n                  <div class="card-image "> \n                    <a target="_blank" href=', '>  \n                      <img style="min-height=300px;" src=', '>\n                    </a>\n                    <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">\n                      <i id=', ' class="btnDelete material-icons">clear</i>\n                    </a>\n                     <a class="btn-floating halfway-fab waves-effect waves-light orange">\n                      <i id=', ' class="btnWinner material-icons">star</i>\n                    </a>\n                    \n                  </div>\n                   ', '\n                </div>\n              </div>\n      '], ['\n            <div class="col s6 m3 curso" id=', ' >\n                <div class="card hoverable">\n                  <div class="card-image "> \n                    <a target="_blank" href=', '>  \n                      <img style="min-height=300px;" src=', '>\n                    </a>\n                    <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">\n                      <i id=', ' class="btnDelete material-icons">clear</i>\n                    </a>\n                     <a class="btn-floating halfway-fab waves-effect waves-light orange">\n                      <i id=', ' class="btnWinner material-icons">star</i>\n                    </a>\n                    \n                  </div>\n                   ', '\n                </div>\n              </div>\n      ']),
    _templateObject2 = _taggedTemplateLiteral(['\n            <div class="col s6 m3 curso" id=', ' >\n                <div class="card hoverable">\n                  <div class="card-image "> \n                    <a target="_blank" href=', '>  \n                      <img style="min-height=300px;" src=', '>\n                    </a>\n                     <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">\n                        <i id=', ' class="btnDelete material-icons">clear</i>\n                      </a>\n                      <a class="btn-floating halfway-fab waves-effect waves-light orange">\n                        <i id=', ' class="btnWinner material-icons">star_border</i>\n                      </a>\n                  </div>\n                   ', '\n                </div>\n              </div>\n      '], ['\n            <div class="col s6 m3 curso" id=', ' >\n                <div class="card hoverable">\n                  <div class="card-image "> \n                    <a target="_blank" href=', '>  \n                      <img style="min-height=300px;" src=', '>\n                    </a>\n                     <a class="btn-floating halfway-fab waves-effect waves-light red" style="left: 24px; right: 0px;">\n                        <i id=', ' class="btnDelete material-icons">clear</i>\n                      </a>\n                      <a class="btn-floating halfway-fab waves-effect waves-light orange">\n                        <i id=', ' class="btnWinner material-icons">star_border</i>\n                      </a>\n                  </div>\n                   ', '\n                </div>\n              </div>\n      ']),
    _templateObject3 = _taggedTemplateLiteral(['\n      <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n\n    '], ['\n      <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n\n    ']),
    _templateObject4 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n    </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n    </div>\n    ']),
    _templateObject6 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject7 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;"class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star_border</i>\n        </div>\n      </div>\n    ']),
    _templateObject8 = _taggedTemplateLiteral(['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;" class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n        </div>\n      </div>\n    '], ['\n    <div class="card-content card-preseleccionado">\n        <div class="divId" >\n          <p style="text-align:left; font-weight:bolder;">RUT</p>\n          <p class="rut" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;">C\xD3DIGO</p>\n          <p class="key1" style="text-align:center">', '</p>\n          <p style="text-align:left; font-weight:bolder;" class="puntajeStar">Puntaci\xF3n</p>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i> \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>  \n          <i id=', ' class="favoriteBtnStart  material-icons" style="color:orange">star</i>\n        </div>\n      </div>\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');
var yo2 = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb, status, score) {
  var estrellas = starLoad(Number(score), key, rut);
  console.log('score: ', score);
  var numberEstrellas = score;
  var aux = key + "btnDelete";
  var aux2 = key + "btnStar";
  var aux3 = key + "card";

  if (status == "winner") {
    return yo(_templateObject, aux3, urlImage, urlImageThumb, aux, aux2, estrellas);
  } else if (status == "false") {
    return yo(_templateObject2, aux3, urlImage, urlImageThumb, aux, aux2, estrellas);
  }
};

function starLoad(numero, key, rut) {
  var star1 = key + "star1";
  var star2 = key + "star2";
  var star3 = key + "star3";
  var star4 = key + "star4";
  var star5 = key + "star5";
  var resultado = "";
  if (numero == 0) {
    return yo2(_templateObject3, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 1) {
    return yo2(_templateObject4, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 2) {
    return yo2(_templateObject5, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 3) {
    return yo2(_templateObject6, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 4) {
    return yo2(_templateObject7, rut, key, star1, star2, star3, star4, star5);
  } else if (numero == 5) {
    return yo2(_templateObject8, rut, key, star1, star2, star3, star4, star5);
  }
}

},{"yo-yo":13}],22:[function(require,module,exports){
"use strict";

var _templateObject = _taggedTemplateLiteral(["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"], ["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb) {
  var aux3 = key + "card";

  return yo(_templateObject, aux3, urlImage, urlImageThumb, key, rut, key);
};

},{"yo-yo":13}],23:[function(require,module,exports){
"use strict";

var _templateObject = _taggedTemplateLiteral(["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light blue\" style=\"right: 50px;\">\n                    <i id=", " class=\"btnCheck material-icons\">check</i>\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"], ["\n\t        <div class=\"col s6 m3 curso\" id=", ">\n              <div class=\"card hoverable\">\n                <div class=\"card-image \"> \n                  <a target=\"_blank\" href=", ">  \n                    <img style=\"min-height=300px;\" src=", ">\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light blue\" style=\"right: 50px;\">\n                    <i id=", " class=\"btnCheck material-icons\">check</i>\n                  </a>\n                  <a class=\"btn-floating halfway-fab waves-effect waves-light red\" style=\"right: 5px;\">\n                    <i id=", " class=\"btnDelete material-icons\">clear</i>\n                  </a>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"divId\" >\n                    <p style=\"text-align:left; font-weight:bolder;\">RUT</p>\n                    <p class=\"rut\" style=\"text-align:center\">", "</p>\n                    <p style=\"text-align:left; font-weight:bolder;\">C\xD3DIGO</p>\n                    <p class=\"key1\" style=\"text-align:center\">", "</p>\n                  </div>\n                </div>\n              </div>\n            </div>\n\t\t"]);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function card(key, rut, codigo, urlImage, urlImageThumb) {

  var aux3 = key + "card";

  var aux1 = key + "btnCheck";
  var aux2 = key + "btnDelete";

  return yo(_templateObject, aux3, urlImage, urlImageThumb, aux1, aux2, rut, key);
};

},{"yo-yo":13}],24:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    \t\t\t<h3 style="padding: 10px;" > No hay cursos disponibles</h3>\n'], ['\n    \t\t\t<h3 style="padding: 10px;" > No hay cursos disponibles</h3>\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

var login = yo(_templateObject);

module.exports = login;

},{"yo-yo":13}],25:[function(require,module,exports){
"use strict";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA7tIl_GDV9ab-XqpJ8VZPOckU3KOlDYeQ",
  authDomain: "casting-679ad.firebaseapp.com",
  databaseURL: "https://casting-679ad.firebaseio.com",
  projectId: "casting-679ad",
  storageBucket: "casting-679ad.appspot.com",
  messagingSenderId: "90191088480"
};

firebase.initializeApp(config);
console.log("ready! Firebase");

},{}],26:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n  \t\t<footer class=" footerRow page-footer">\n\t\t<div class="footer-copyright ">\n\t      <div class="container">\n\t      <p style="text-align: center;">La Araucana 2018, Todos los Derechos Reservados</p>\n\t      </div>\n\t    </div> \n\t\t</footer>\n\t\t'], ['\n  \t\t<footer class=" footerRow page-footer">\n\t\t<div class="footer-copyright ">\n\t      <div class="container">\n\t      <p style="text-align: center;">La Araucana 2018, Todos los Derechos Reservados</p>\n\t      </div>\n\t    </div> \n\t\t</footer>\n\t\t']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = yo(_templateObject);

},{"yo-yo":13}],27:[function(require,module,exports){
'use strict';

var page = require('page');

var imagesFBRef = firebase.database().ref().child('registroConcursante/porAprobar');

var imagenName = "";
var downloadURL = "";
var envio = false;
var file = null;

var edadAux = false;
var categoriaTipo = null;

page('/formulario', function (ctx, next) {
  load();
});

function load(ctx, next) {
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  paginaUno();
  btnSexo();
  $('select').material_select();
  $('.dropdown-button').dropdown(); // dropdown abrir
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/headerLogin');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  var sliderTemplate = require('../slider/slider');
  var slider = document.getElementById('slider-container');
  empty(slider).appendChild(sliderTemplate('mobile.png', 'tablet.png', 'desktopHd.png'));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate('Ingresa tus Datos', 'Casting La Araucana'));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = require('./template');
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function paginaUno() {

  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('exampleFileUpload');

  // Listen for file selection

  fileButton.addEventListener('change', function (e) {

    // get file

    file = e.target.files[0];

    var nameRand = Math.floor(Math.random() * 100000000 + 1);

    imagenName = nameRand + '_' + file.name;
    console.log('file', file);
    console.log('image', imagenName);
  });

  $('#fieldGood').find('#close-modal').click(function (event) {
    event.preventDefault();
    location.reload();
    console.log('hola');
  });

  $('#btnSend').click(function () {

    var name = $('#name').val();
    var lastName = $('#lastName').val();
    var rut = $('#rut').val();
    var email = $('#email').val();
    var phone = $('#phone').val();

    var id = Math.floor(Math.random() * 100000000 + 1);

    if (file == null) {
      $('#fotoNone').modal('open');
    } else if (file != null) {

      console.log("DATA ");
      console.log("name: ", name);
      console.log("lastName: ", lastName);
      console.log("rut: ", rut);
      console.log("email: ", email);
      console.log("phone: ", phone);
      categoriaTipo = getCategoria();

      if (name == "" || lastName == "" || rut == "" || email == "" || phone == "" || categoriaTipo == null) {
        console.log("vacio ");
        // alert("Debes Completar los campos pedidos");
        $('#fotoNone').modal('open');
      } else {

        var aux = $.rut.formatear(rut);
        var es_valido = $.rut.validar(aux);
        var es_mail = validateEmail(email);

        if (es_valido && es_mail) {
          //alert('rut  y email valido');

          //console.log("rut  y email valido");

          checkRutBaseDatos(name, lastName, rut, email, phone, imagenName, downloadURL, categoriaTipo);
        } else if (es_valido && !es_mail) {
          $('#fieldMailMalo').modal('open');
        } else if (!es_valido && es_mail) {
          $('#fieldRutMalo').modal('open');
        } else if (!es_valido && !es_mail) {
          $('#fieldRutMailMalo').modal('open');
        }
      }
    }
  });

  $(document).on($.modal.CLOSE, function () {
    console.log('cerrar modal');
    if (envio) {
      location.reload(true);
    }
  });

  function checkRut(rut) {
    // Despejar Puntos
    var valor = rut.value.replace('.', '');
    // Despejar Guión
    valor = valor.replace('-', '');

    // Aislar Cuerpo y Dígito Verificador
    cuerpo = valor.slice(0, -1);
    dv = valor.slice(-1).toUpperCase();

    // Formatear RUN
    rut.value = cuerpo + '-' + dv;

    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpo.length < 7) {
      rut.setCustomValidity("RUT Incompleto");return false;
    }

    // Calcular Dígito Verificador
    suma = 0;
    multiplo = 2;

    // Para cada dígito del Cuerpo
    for (i = 1; i <= cuerpo.length; i++) {

      // Obtener su Producto con el Múltiplo Correspondiente
      index = multiplo * valor.charAt(cuerpo.length - i);

      // Sumar al Contador General
      suma = suma + index;

      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }

    // Calcular Dígito Verificador en base al Módulo 11
    dvEsperado = 11 - suma % 11;

    // Casos Especiales (0 y K)
    dv = dv == 'K' ? 10 : dv;
    dv = dv == 0 ? 11 : dv;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado != dv) {
      rut.setCustomValidity("RUT Inválido");return false;
    }

    // Si todo sale bien, eliminar errores (decretar que es válido)
    rut.setCustomValidity('');
    return true;
  }

  function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
  }

  function guardarInfoImagenes(name, lastName, rut, email, phone, imagenName, downloadURL, categoriaTipo) {
    imagesFBRef.push({
      name: name,
      lastName: lastName,
      rut: rut,
      email: email,
      phone: phone,
      nameImagen: imagenName,
      urlImagen: "null",
      urlImagen_thumb: "null",
      score: "0",
      category: categoriaTipo
    });

    //. aqui kede hay k agregar subir imagen y luego ir a programar el servidor
    var storageRef = firebase.storage().ref('fotos/' + categoriaTipo + '/' + imagenName);

    // upload file

    var task = storageRef.put(file);

    task.on('state_changed', function progress(snapshot) {
      var porcentaje = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      uploader.value = porcentaje;
    }, function error(err) {}, function complete() {
      envio = true;
      console.log("envio:", envio);
      $('#fieldGood').modal('open');
    });
  }
  function checkRutBaseDatos(name, lastName, rut, email, phone, imagenName, downloadURL, categoriaTipo) {
    rut = rut.replace('-', '');
    var path = "registroConcursante/" + categoriaTipo + "/aprobada/participantes";
    var aux = firebase.database().ref().child(path).orderByChild("rut").equalTo(rut);
    var datos;
    aux.once("value", function (snapshot) {
      datos = snapshot.val();
      if (datos != null) {
        for (var key in datos) {
          console.log('rut Exite name', datos[key].name);
        }
        $('#fieldRutMailDoble').modal('open');

        return true;
      } else {
        console.log('rut no Exite ');
        path = "registroConcursante/" + categoriaTipo + "/porAprobar";
        imagesFBRef = firebase.database().ref().child(path);
        guardarInfoImagenes(name, lastName, rut, email, phone, imagenName, downloadURL, categoriaTipo);
        return false;
      }
    });
    return true;
  }
}

function cleanBoxEdad() {
  $('#edad').find('option').remove().end().append('<option value="" disabled selected>Edad</option>').val('');
  $('select').material_select();
}

function btnSexo() {
  $('#sexo').on('change', function () {
    var sexo = $("#sexo option:selected").text();
    var cat = $("#cat option:selected").text();

    console.log(cat);
    console.log(sexo);

    if (cat == "Pensionado" && (sexo == "Hombre" || sexo == "Mujer")) {
      pensionadoHombreMujer();
    } else if (cat == "Trabajador" && sexo == "Hombre") {
      trabajadorHombre();
    } else if (cat == "Trabajador" && sexo == "Mujer") {
      trabajadorMujer();
    } else if (cat == "Niños" && sexo == "Hombre") {
      kidHombre();
    } else if (cat == "Niños" && sexo == "Mujer") {
      kidMujer();
    }
  });
}

function getCategoria() {
  var sexo = $("#sexo option:selected").text();
  var cat = $("#cat option:selected").text();
  var edad = $("#edad option:selected").text();

  if (cat == "Pensionado" && sexo == "Hombre") {
    categoriaTipo = "pensionado/hombre";
  } else if (cat == "Pensionado" && sexo == "Mujer") {
    categoriaTipo = "pensionado/mujer";
  } else if (cat == "Trabajador" && sexo == "Hombre" && edad == "45 Años") {
    categoriaTipo = "trabajador/hombre/45";
  } else if (cat == "Trabajador" && sexo == "Hombre" && edad == "25 Años") {
    categoriaTipo = "trabajador/hombre/25";
  } else if (cat == "Trabajador" && sexo == "Mujer" && edad == "40 Años") {
    categoriaTipo = "trabajador/mujer/40";
  } else if (cat == "Trabajador" && sexo == "Mujer" && edad == "20 Años") {
    categoriaTipo = "trabajador/mujer/20";
  } else if (cat == "Niños" && sexo == "Hombre" && edad == "15 Años") {
    categoriaTipo = "kid/hombre/15";
  } else if (cat == "Niños" && sexo == "Hombre" && edad == "10 Años") {
    categoriaTipo = "kid/hombre/10";
  } else if (cat == "Niños" && sexo == "Mujer" && edad == "15 Años") {
    categoriaTipo = "kid/mujer/15";
  } else if (cat == "Niños" && sexo == "Mujer" && edad == "6 Años") {
    categoriaTipo = "kid/mujer/6";
  }
  console.log(categoriaTipo);
  return categoriaTipo;
}

function pensionadoHombreMujer() {
  $('#edadParent').hide();
  edadAux = true;
}

function trabajadorHombre() {

  if (edadAux) {
    $('#edadParent').show();
  }

  $('#edad').find('option').remove().end().append('<option value="" disabled selected>Edad</option>').val('').append('<option value="1" selected>25 Años</option>').val('').append('<option value="2" selected>45 Años</option>').val('');
  $('select').material_select();
}
function trabajadorMujer() {

  if (edadAux) {
    $('#edadParent').show();
  }
  $('#edad').find('option').remove().end().append('<option value="" disabled selected>Edad</option>').val('').append('<option value="1" selected>20 Años</option>').val('').append('<option value="2" selected>40 Años</option>').val('');
  $('select').material_select();
}

function kidMujer() {

  if (edadAux) {
    $('#edadParent').show();
  }

  $('#edad').find('option').remove().end().append('<option value="" disabled selected>Edad</option>').val('').append('<option value="1" selected>6 Años</option>').val('').append('<option value="2" selected>15 Años</option>').val('');
  $('select').material_select();
}
function kidHombre() {

  if (edadAux) {
    $('#edadParent').show();
  }
  $('#edad').find('option').remove().end().append('<option value="" disabled selected>Edad</option>').val('').append('<option value="1" selected>10 Años</option>').val('').append('<option value="2" selected>15 Años</option>').val('');
  $('select').material_select();
}

},{"../footer/footer":26,"../header/headerLogin":32,"../slider/slider":41,"../title/title":42,"./template":28,"empty-element":3,"page":11}],28:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n<div class="container" >\n \n          <div class="row" id="addPhoto" >\n  \n              <div class="row">\n              <form class="col s12">\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">account_circle</i>\n                    <input id="name" type="text" class="validate">\n                    <label for="name">Nombres</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">account_circle</i>\n                    <input id="lastName" type="text" class="validate">\n                    <label for="lastName">Apellidos</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">folder_shared</i>\n                    <input id="rut" type="text" class="validate">\n                    <label for="rut">Rut</label>\n                </div>  \n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">mail</i>\n                    <input id="email" type="email" class="validate">\n                    <label for="email">E-mail</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">phone</i>\n                    <input id="phone" type="tel" class="validate">\n                    <label for="phone">Telephone</label>\n                </div>\n\n                <div class="input-field col s4">\n                  <select id="cat">\n                    <option value="" disabled selected>Categor\xEDa</option>\n                    <option value="1">Pensionado</option>\n                    <option value="2">Trabajador</option>\n                    <option value="3">Ni\xF1os</option>\n                  </select>\n                </div>\n                <div class="input-field col s4">\n                  <select id="sexo">\n                    <option value="" disabled selected>Sexo</option>\n                    <option value="1">Hombre</option>\n                    <option value="2">Mujer</option>\n                  </select>\n                </div>\n                <div class="input-field col s4" id="edadParent">\n                  <select id="edad">\n                    <option value="" disabled selected>Edad</option>\n                    <option value="1">10 a\xF1os</option>\n                    <option value="2">12 a\xF1os</option>\n                  </select>\n                </div>\n\n              </form> \n              <div id="fieldNone" class="modal">\n                  <p style="text-align: center;">Estimado Debes Ingresar Todos los Campos.</p>\n              </div>\n              <div id="fotoNone" class="modal">\n                  <p style="text-align: center;">Estimado Debes Adjuntar una Foto.</p>\n              </div>\n              <div id="fieldGood" class="modal">\n                  <p style="font-weight: bolder; text-align: center;">Gracias por Participar. <br></p>\n                  <p style="font-weight: bolder; text-align: center;">Tu foto ser\xE1 revisada antes de publicarse. <br></p>\n                  <p style="font-weight: bolder; text-align: center;">Mira las Fotos que est\xE1n participan en el Sitio</p>\n              </div>\n              <div id="fieldRutMalo" class="modal">\n                  <p >Ingrese un rut v\xE1lido</p>\n              </div>\n\n              <div id="fieldMailMalo" class="modal">\n                  <p >Ingrese un mail v\xE1lido.</p>\n              </div>\n              <div id="fieldRutMailMalo" class="modal">\n                  <p >Ingrese un rut y un mail v\xE1lidos</p>\n              </div> \n              <div id="fieldRutMailDoble" class="modal">\n                  <p >Solo puedes participar una vez. :)</p>\n              </div>\n\n            <div class="col s12 center-align">\n\n            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  \n                <label id="buttonFotosInside" for="exampleFileUpload" class="btn hoverable" style="height: auto; width: 100% ">SUBIR FOTO</label>\n                <input type="file" id="exampleFileUpload" class="hide">\n            </div> \n          \n            <div id="butonCol" class="col s12  text-center center-align" style="margin-bottom: 20px; " >  \n                  <label id="btnSend"  class="btn hoverable" style="width: 120px; font-size:22px; font-family: \'Open Sans\', sans-serif;color: white">Participar</label>\n            </div>\n\n            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  \n                <progress value="0" max="100" id="uploader">0% </progress>\n            </div>\n\n            <div class="row">\n                <div class="col s12 m4" style=" text-align: center;">\n                    <img src="logoBienestar.png" style="max-width: 200px; min-width: 150px">\n                </div>\n\n                <div class="col s12 m4"  style=" text-align: center;">\n                    <a >\n                    <h6 style="color:#315594; padding: 40px;font-family: \'Lato\', sans-serif;font-weight:700; text-transform: uppercase;"><span style="font-weight:400"></span> Bases del Concurso </h6>\n                  </a>\n                </div>\n                <div class="col s12 m4 "  style=" text-align: center; ">\n                    <img src="logoCorbela.png" style="max-width: 200px; min-width: 150px">\n                </div>\n            </div>\n\n\n\n\n          </div>\n      \n    </div> \n</div>\n\n'], ['\n<div class="container" >\n \n          <div class="row" id="addPhoto" >\n  \n              <div class="row">\n              <form class="col s12">\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">account_circle</i>\n                    <input id="name" type="text" class="validate">\n                    <label for="name">Nombres</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">account_circle</i>\n                    <input id="lastName" type="text" class="validate">\n                    <label for="lastName">Apellidos</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">folder_shared</i>\n                    <input id="rut" type="text" class="validate">\n                    <label for="rut">Rut</label>\n                </div>  \n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">mail</i>\n                    <input id="email" type="email" class="validate">\n                    <label for="email">E-mail</label>\n                </div>\n                <div class="input-field col s12">\n                    <i class="material-icons prefix iconFormulario">phone</i>\n                    <input id="phone" type="tel" class="validate">\n                    <label for="phone">Telephone</label>\n                </div>\n\n                <div class="input-field col s4">\n                  <select id="cat">\n                    <option value="" disabled selected>Categor\xEDa</option>\n                    <option value="1">Pensionado</option>\n                    <option value="2">Trabajador</option>\n                    <option value="3">Ni\xF1os</option>\n                  </select>\n                </div>\n                <div class="input-field col s4">\n                  <select id="sexo">\n                    <option value="" disabled selected>Sexo</option>\n                    <option value="1">Hombre</option>\n                    <option value="2">Mujer</option>\n                  </select>\n                </div>\n                <div class="input-field col s4" id="edadParent">\n                  <select id="edad">\n                    <option value="" disabled selected>Edad</option>\n                    <option value="1">10 a\xF1os</option>\n                    <option value="2">12 a\xF1os</option>\n                  </select>\n                </div>\n\n              </form> \n              <div id="fieldNone" class="modal">\n                  <p style="text-align: center;">Estimado Debes Ingresar Todos los Campos.</p>\n              </div>\n              <div id="fotoNone" class="modal">\n                  <p style="text-align: center;">Estimado Debes Adjuntar una Foto.</p>\n              </div>\n              <div id="fieldGood" class="modal">\n                  <p style="font-weight: bolder; text-align: center;">Gracias por Participar. <br></p>\n                  <p style="font-weight: bolder; text-align: center;">Tu foto ser\xE1 revisada antes de publicarse. <br></p>\n                  <p style="font-weight: bolder; text-align: center;">Mira las Fotos que est\xE1n participan en el Sitio</p>\n              </div>\n              <div id="fieldRutMalo" class="modal">\n                  <p >Ingrese un rut v\xE1lido</p>\n              </div>\n\n              <div id="fieldMailMalo" class="modal">\n                  <p >Ingrese un mail v\xE1lido.</p>\n              </div>\n              <div id="fieldRutMailMalo" class="modal">\n                  <p >Ingrese un rut y un mail v\xE1lidos</p>\n              </div> \n              <div id="fieldRutMailDoble" class="modal">\n                  <p >Solo puedes participar una vez. :)</p>\n              </div>\n\n            <div class="col s12 center-align">\n\n            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  \n                <label id="buttonFotosInside" for="exampleFileUpload" class="btn hoverable" style="height: auto; width: 100% ">SUBIR FOTO</label>\n                <input type="file" id="exampleFileUpload" class="hide">\n            </div> \n          \n            <div id="butonCol" class="col s12  text-center center-align" style="margin-bottom: 20px; " >  \n                  <label id="btnSend"  class="btn hoverable" style="width: 120px; font-size:22px; font-family: \'Open Sans\', sans-serif;color: white">Participar</label>\n            </div>\n\n            <div id="columnsInfo" class="col s12  text-center center-align"  style="height: auto; width: 100% ">  \n                <progress value="0" max="100" id="uploader">0% </progress>\n            </div>\n\n            <div class="row">\n                <div class="col s12 m4" style=" text-align: center;">\n                    <img src="logoBienestar.png" style="max-width: 200px; min-width: 150px">\n                </div>\n\n                <div class="col s12 m4"  style=" text-align: center;">\n                    <a >\n                    <h6 style="color:#315594; padding: 40px;font-family: \'Lato\', sans-serif;font-weight:700; text-transform: uppercase;"><span style="font-weight:400"></span> Bases del Concurso </h6>\n                  </a>\n                </div>\n                <div class="col s12 m4 "  style=" text-align: center; ">\n                    <img src="logoCorbela.png" style="max-width: 200px; min-width: 150px">\n                </div>\n            </div>\n\n\n\n\n          </div>\n      \n    </div> \n</div>\n\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

var login = yo(_templateObject);

module.exports = login;

},{"yo-yo":13}],29:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDParticipantes = "";
var urlBDpreSeleccionado1 = "";
var urlBDGanador1 = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/ganadores";

page('/ganadores', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDParticipantes = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/hombre/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/hombre/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDParticipantes = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/mujer/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/mujer/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/45/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/45/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/25/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/25/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/40/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/40/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/20/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/20/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "kidHombre15") {
      urlBDParticipantes = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "kidHombre10") {
      urlBDParticipantes = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/10/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/10/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "kidMujer15") {
      urlBDParticipantes = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Ganadores';

      load();
    } else if (category == "kidMujer6") {
      urlBDParticipantes = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/6/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/6/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Ganadores';

      load();
    } else {

      page.redirect('/home');
    }
  } else {

    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {
      //alert("bottom! ok");
      console.log("bottom! ok");
      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
    }
  });

  $('.dropdown-button').dropdown();
}

function btnActios() {
  console.log("btnActios");
  $('.btnWinner').click(function () {
    winner($(this));
  });
  $('.btnDelete').click(function () {
    rechazar($(this));
  });
  $('.favoriteBtnStart').click(function () {
    starts($(this));
  });
  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","desktopHd.png","tablet.png"));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDGanador1).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDGanador1).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardGanadores');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb, datos[key].status, datos[key].score, datos[key].name, datos[key].email));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function winner(thisObj) {
  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key = "";
  var updateRefFB;
  var updateRefFB2;
  var updateRefFB3;

  if (thisObj.text() == "star_border") {
    key = codigoTotal.replace("btnStar", "");
    console.log("codigo:", key);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star');

    updateRefFB.update({ status: "winner" });
    updateRefFB2.update({ status: "winner" });
    updateRefFB2.once("value", function (snapshot) {
      var datos = snapshot.val();
      if (datos == null) {
        console.log('error en codigo y tabla');
      } else {
        updateRefFB3.set({
          name: datos.name,
          lastName: datos.lastName,
          rut: datos.rut,
          email: datos.email,
          phone: datos.phone,
          nameImagen: datos.nameImagen,
          urlImagen: datos.urlImagen,
          urlImagen_thumb: datos.urlImagen_thumb,
          category: datos.category,
          status: datos.status,
          score: datos.score
        });
      }
    });
  } else {
    key = codigoTotal.replace("btnStar", "");

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star_border');

    updateRefFB.update({ status: "false" });
    updateRefFB2.update({ status: "false" });

    updateRefFB3.remove();
  }
  console.log("codigo:", key);
}

function starts(thisObj) {
  var key = thisObj.attr('id');
  var auxAlt = "";

  var updateRefFB;
  var updateRefFB2;
  var updateRefFB3;

  var starContent = thisObj.text();

  if (key.includes("star1")) {
    key = key.replace("star1", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "1" });
      updateRefFB2.update({ score: "1" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "1" });
      }

      var p2 = "#" + key + "star2";
      $(p2).text('star_border');
      var p3 = "#" + key + "star3";
      $(p3).text('star_border');
      var p4 = "#" + key + "star4";
      $(p4).text('star_border');
      var p5 = "#" + key + "star5";
      $(p5).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p = "#" + key + "star2";
      $(_p).text('star_border');
      var _p2 = "#" + key + "star3";
      $(_p2).text('star_border');
      var _p3 = "#" + key + "star4";
      $(_p3).text('star_border');
      var _p4 = "#" + key + "star5";
      $(_p4).text('star_border');
    }
  } else if (key.includes("star2")) {
    key = key.replace("star2", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "2" });
      updateRefFB2.update({ score: "2" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "2" });
      }

      var p1 = "#" + key + "star1";
      $(p1).text('star');
      var _p5 = "#" + key + "star3";
      $(_p5).text('star_border');
      var _p6 = "#" + key + "star4";
      $(_p6).text('star_border');
      var _p7 = "#" + key + "star5";
      $(_p7).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p8 = "#" + key + "star1";
      $(_p8).text('star_border');
      var _p9 = "#" + key + "star3";
      $(_p9).text('star_border');
      var _p10 = "#" + key + "star4";
      $(_p10).text('star_border');
      var _p11 = "#" + key + "star5";
      $(_p11).text('star_border');
    }
  } else if (key.includes("star3")) {
    key = key.replace("star3", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "3" });
      updateRefFB2.update({ score: "3" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "3" });
      }

      var _p12 = "#" + key + "star1";
      $(_p12).text('star');
      var _p13 = "#" + key + "star2";
      $(_p13).text('star');
      var _p14 = "#" + key + "star4";
      $(_p14).text('star_border');
      var _p15 = "#" + key + "star5";
      $(_p15).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p16 = "#" + key + "star1";
      $(_p16).text('star_border');
      var _p17 = "#" + key + "star2";
      $(_p17).text('star_border');
      var _p18 = "#" + key + "star4";
      $(_p18).text('star_border');
      var _p19 = "#" + key + "star5";
      $(_p19).text('star_border');
    }
  } else if (key.includes("star4")) {
    key = key.replace("star4", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "4" });
      updateRefFB2.update({ score: "4" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "4" });
      }

      var _p20 = "#" + key + "star1";
      $(_p20).text('star');
      var _p21 = "#" + key + "star2";
      $(_p21).text('star');
      var _p22 = "#" + key + "star3";
      $(_p22).text('star');
      var _p23 = "#" + key + "star5";
      $(_p23).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p24 = "#" + key + "star1";
      $(_p24).text('star_border');
      var _p25 = "#" + key + "star2";
      $(_p25).text('star_border');
      var _p26 = "#" + key + "star3";
      $(_p26).text('star_border');
      var _p27 = "#" + key + "star5";
      $(_p27).text('star_border');
    }
  } else if (key.includes("star5")) {
    key = key.replace("star5", "");

    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "5" });
      updateRefFB2.update({ score: "5" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "5" });
      }

      var _p28 = "#" + key + "star1";
      $(_p28).text('star');
      var _p29 = "#" + key + "star2";
      $(_p29).text('star');
      var _p30 = "#" + key + "star3";
      $(_p30).text('star');
      var _p31 = "#" + key + "star4";
      $(_p31).text('star');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p32 = "#" + key + "star1";
      $(_p32).text('star_border');
      var _p33 = "#" + key + "star2";
      $(_p33).text('star_border');
      var _p34 = "#" + key + "star3";
      $(_p34).text('star_border');
      var _p35 = "#" + key + "star4";
      $(_p35).text('star_border');
    }
  }
  console.log("codigo:", key);
}

function rechazar(thisObj) {
  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key = codigoTotal.replace("btnDelete", "");
  var idBtnDelete = "#" + key + "btnDelete";
  var idCard = "#" + key + "card";

  var updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
  var updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
  var updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

  updateRefFB3.remove();
  updateRefFB2.update({ category: "cat_1", status: "false", score: "0" });
  updateRefFB.update({ category: "cat_1", status: "false", score: "0" });
  $(idCard).remove();
}

},{"../card/cardGanadores":19,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],30:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\n    <div class="">\n\t   \t<nav class="navbar-fixed">\n\t   \t\t<div  class="header row hide-on-large-only">\n\t\t        <a href="#" data-activates="slide-out" class="button-collapse right"><i class="material-icons">menu</i></a>\n\t\t\t    <a  href="/home" class="brand-logo left">\n\t\t\t        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t\t    </a>  \n\t      \t</div>\n\t\t    <div class="header nav-wrapper hide-on-med-and-down">   \n\t\t\t  <a  href="/home" class="brand-logo left">\n\t\t        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t      </a>\n\t\t      <div class="hide-on-med-and-down">\n\t\t\t      <ul id="dropdown1" class="dropdown-content">\n\t\t\t        <li><a id="btnPensionadosHombre">Pensionados Hombre</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnPensionadosMujer">Pensionados Mujer</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorHombre45">Trabajador Hombre 45 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorHombre25">Trabajador Hombre 25 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorMujer40">Trabajador Mujer 40 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorMujer20">Trabajador Mujer 20 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidHombre15">Ni\xF1o 15 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidHombre10">Ni\xF1o 10 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidMujer15">Ni\xF1a 15 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidMujer6">Ni\xF1a 6 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t      </ul>\n\t\t\t      <ul id="dropdown2" class="dropdown-content ">\n\t\t\t        <li><a id="btnporAprobar"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnAprobar"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnRechazar"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a></li>\n\t\t\t      </ul>\n\t\t\t      <!-- Dropdown Structure -->\n\t\t\t      <ul id="dropdown3" class="dropdown-content">\n\t\t\t        <li><a id="btnParticipantes"><i class="material-icons" style="color: orange">people</i>Participantes</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnSeleccionadas"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnGanadores"><i class="material-icons" style="color: orange">star</i>Ganadores</a></li>\n\t\t\t      </ul>\n\t\t\t      <ul id="nav-mobile" class="right hide-on-med-and-down">\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown1">Categor\xEDas<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown2">Selecci\xF3n<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown3">Buscar Ganador<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t      \t<li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>\n\t\t\t      </ul>\n\t\t\t  </div>\n\t\t    </div>\t    \n\t  \t</nav>\n\n\t  \t  <ul id="slide-out" class="side-nav">  \n\t\t      <li>\n\t\t        <div class="userView">  \n\t\t          <img src="trabajadorHombre25.jpg" style="width:100% !important" >\n\t\t        </div>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a  id="itemMenuCategorias" class="menuLateral"><i class="material-icons" style="color:  yellow">dashboard</i>CATEGORIAS</a>\n\t\t      </li>\n\n\t\t      <li>\n\t\t        <a id="itemMenuPorAprobar" class="menuLateralLittle"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuAprobar" class="menuLateralLittle"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuRechazadas" class="menuLateralLittle"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuParticipantes" class="menuLateralLittle"><i class="material-icons" style="color: orange">people</i>Participantes</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuSeleccionadas" class="menuLateralLittle"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuGanadores" class="menuLateralLittle"><i class="material-icons" style="color: orange">star</i>Ganadores</a>\n\t\t      </li>  \n\t\t      <li>\n\t\t      \t<a id="itemMenulogOut" style="color:white; height: auto !important; line-height: 48px;font-weight:bolder" ><i class="material-icons">power_settings_new</i>SALIR</a>\n\t\t      </li>  \n\t\t    </ul>  \n\t  </div>\t\n    '], ['\n\n    <div class="">\n\t   \t<nav class="navbar-fixed">\n\t   \t\t<div  class="header row hide-on-large-only">\n\t\t        <a href="#" data-activates="slide-out" class="button-collapse right"><i class="material-icons">menu</i></a>\n\t\t\t    <a  href="/home" class="brand-logo left">\n\t\t\t        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t\t    </a>  \n\t      \t</div>\n\t\t    <div class="header nav-wrapper hide-on-med-and-down">   \n\t\t\t  <a  href="/home" class="brand-logo left">\n\t\t        <img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t      </a>\n\t\t      <div class="hide-on-med-and-down">\n\t\t\t      <ul id="dropdown1" class="dropdown-content">\n\t\t\t        <li><a id="btnPensionadosHombre">Pensionados Hombre</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnPensionadosMujer">Pensionados Mujer</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorHombre45">Trabajador Hombre 45 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorHombre25">Trabajador Hombre 25 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorMujer40">Trabajador Mujer 40 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnTrabajadorMujer20">Trabajador Mujer 20 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidHombre15">Ni\xF1o 15 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidHombre10">Ni\xF1o 10 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidMujer15">Ni\xF1a 15 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnKidMujer6">Ni\xF1a 6 a\xF1os</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t      </ul>\n\t\t\t      <ul id="dropdown2" class="dropdown-content ">\n\t\t\t        <li><a id="btnporAprobar"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnAprobar"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnRechazar"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a></li>\n\t\t\t      </ul>\n\t\t\t      <!-- Dropdown Structure -->\n\t\t\t      <ul id="dropdown3" class="dropdown-content">\n\t\t\t        <li><a id="btnParticipantes"><i class="material-icons" style="color: orange">people</i>Participantes</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnSeleccionadas"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a></li>\n\t\t\t        <li class="divider"></li>\n\t\t\t        <li><a id="btnGanadores"><i class="material-icons" style="color: orange">star</i>Ganadores</a></li>\n\t\t\t      </ul>\n\t\t\t      <ul id="nav-mobile" class="right hide-on-med-and-down">\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown1">Categor\xEDas<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown2">Selecci\xF3n<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t        <li><a class="dropdown-button" data-activates="dropdown3">Buscar Ganador<i class="material-icons right">arrow_drop_down</i></a></li>\n\t\t\t      \t<li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>\n\t\t\t      </ul>\n\t\t\t  </div>\n\t\t    </div>\t    \n\t  \t</nav>\n\n\t  \t  <ul id="slide-out" class="side-nav">  \n\t\t      <li>\n\t\t        <div class="userView">  \n\t\t          <img src="trabajadorHombre25.jpg" style="width:100% !important" >\n\t\t        </div>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a  id="itemMenuCategorias" class="menuLateral"><i class="material-icons" style="color:  yellow">dashboard</i>CATEGORIAS</a>\n\t\t      </li>\n\n\t\t      <li>\n\t\t        <a id="itemMenuPorAprobar" class="menuLateralLittle"><i class="material-icons" style="color: blue">thumbs_up_down</i>Por Aprobar</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuAprobar" class="menuLateralLittle"><i class="material-icons" style="color: green">thumb_up</i>Aprobar</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuRechazadas" class="menuLateralLittle"><i class="material-icons" style="color: red">thumb_down</i>Rechazadas</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuParticipantes" class="menuLateralLittle"><i class="material-icons" style="color: orange">people</i>Participantes</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuSeleccionadas" class="menuLateralLittle"><i class="material-icons" style="color: orange">favorite</i>Seleccionadas</a>\n\t\t      </li>\n\t\t      <li>\n\t\t        <a id="itemMenuGanadores" class="menuLateralLittle"><i class="material-icons" style="color: orange">star</i>Ganadores</a>\n\t\t      </li>  \n\t\t      <li>\n\t\t      \t<a id="itemMenulogOut" style="color:white; height: auto !important; line-height: 48px;font-weight:bolder" ><i class="material-icons">power_settings_new</i>SALIR</a>\n\t\t      </li>  \n\t\t    </ul>  \n\t  </div>\t\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function header() {
	return yo(_templateObject);
};

},{"yo-yo":13}],31:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\t  <div class="navbar-fixed">\n\t   \t<nav>\n\t\t    <div class="header nav-wrapper ">    \n\t\t\t\t<a  href="/home" class="brand-logo left">\n\t\t        \t<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t     \t</a>\n\n\t\t      <ul id="nav-mobile" class="right ">\n\t\t       <li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>\n\t\t      </ul>\n\t\t    </div>\t    \n\t  \t</nav>\n\t  </div>\t\n    '], ['\n\t  <div class="navbar-fixed">\n\t   \t<nav>\n\t\t    <div class="header nav-wrapper ">    \n\t\t\t\t<a  href="/home" class="brand-logo left">\n\t\t        \t<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t     \t</a>\n\n\t\t      <ul id="nav-mobile" class="right ">\n\t\t       <li><a class="dropdown-button " id="logOut" ><i class="material-icons">exit_to_app</i></a></li>\n\t\t      </ul>\n\t\t    </div>\t    \n\t  \t</nav>\n\t  </div>\t\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function header() {
	return yo(_templateObject);
};

},{"yo-yo":13}],32:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\t  <div class="navbar-fixed">\n\t   \t<nav>\n\t\t    <div class="header nav-wrapper ">    \n\t\t\t\t<a  href="/home" class="brand-logo left">\n\t\t        \t<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t     \t</a>\n\t\t    </div>\t    \n\t  \t</nav>\n\t  </div>\t\n    '], ['\n\t  <div class="navbar-fixed">\n\t   \t<nav>\n\t\t    <div class="header nav-wrapper ">    \n\t\t\t\t<a  href="/home" class="brand-logo left">\n\t\t        \t<img src="logo.svg" width="200px" height="auto" style="padding-left: 20px;">\n\t\t     \t</a>\n\t\t    </div>\t    \n\t  \t</nav>\n\t  </div>\t\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function header() {
	return yo(_templateObject);
};

},{"yo-yo":13}],33:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var lblTitle1 = 'Elige tu Categoría';
var lblTitle2 = 'Casting La Araucana';

var datos = [{ category: 'Pensionado Hombre', img: 'pensionadoHombre.jpg', id: 'btnCategory1' }, { category: 'Pensionado Mujer', img: 'pensionadoMujer.jpg', id: 'btnCategory2' }, { category: 'Trabajador Hombre 45 ', img: 'trabajadorHombre45.jpg', id: 'btnCategory3' }, { category: 'Trabajador Hombre 25 ', img: 'trabajadorHombre25.jpg', id: 'btnCategory4' }, { category: 'Trabajador Mujer 40 ', img: 'trabajadorMujer40.jpg', id: 'btnCategory5' }, { category: 'Trabajador Mujer 20 ', img: 'trabajadorMujer20.jpg', id: 'btnCategory6' }, { category: 'Niño 15 ', img: 'kidHombre15.jpg', id: 'btnCategory7' }, { category: 'Niño 10 ', img: 'kidHombre10.jpg', id: 'btnCategory8' }, { category: 'Niña 15 ', img: 'kidMujer15.jpg', id: 'btnCategory9' }, { category: 'Niña 6 ', img: 'kidMujer6.jpg', id: 'btnCategory10' }];
page('/home', function (ctx, next) {
  load();
});

function load(ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    console.log('----------Home page--------');
    loadHeader();
    loadPage();

    loadFooter();
    loadImages();
    btnActios();
    $('.dropdown-button').dropdown(); // iniciar menu escuchador
  } else {
    page.redirect('/');
  }
}

function btnActios() {
  $('#btnCategory1').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "pensionadoHombre");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory2').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "pensionadoMujer");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory3').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "trabajadorHombre45");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory4').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "trabajadorHombre25");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory5').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "trabajadorMujer40");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory6').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "trabajadorMujer20");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory7').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "kidHombre15");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory8').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "kidHombre10");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#btnCategory9').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "kidMujer15");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnCategory10').click(function () {
    console.log('btnCategory1');
    sessionStorage.setItem("category", "kidMujer6");
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });
  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/headerHome');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","tablet.png","desktopHd.png"));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages() {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardCategory');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(datos[key].category, datos[key].img, datos[key].id));
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

},{"../card/cardCategory":18,"../footer/footer":26,"../header/headerHome":31,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],34:[function(require,module,exports){
'use strict';

var page = require('page');

require('./firebase');

require('./login');

require('./porAprobar');
require('./rechazadas');
require('./aprobadas');
require('./formulario');
require('./participantes');
require('./seleccionadas');
require('./ganadores');
require('./home');
require('./404');

page();

},{"./404":15,"./aprobadas":16,"./firebase":25,"./formulario":27,"./ganadores":29,"./home":33,"./login":35,"./participantes":37,"./porAprobar":38,"./rechazadas":39,"./seleccionadas":40,"page":11}],35:[function(require,module,exports){
'use strict';

var page = require('page');

var yo = require('yo-yo');
var empty = require('empty-element');
var templateEmpty = require('./templateEmpty');

var imagesFBRef = firebase.database().ref().child('curso').orderByKey();
var paginaActual = 1;

page('/', function (ctx, next) {
	load();
});

function load() {
	var main = document.getElementById('main-container');
	empty(main).appendChild(templateEmpty);
	var headerTemplate = require('../header/headerLogin');
	var header = document.getElementById('header-container');
	empty(header).appendChild(headerTemplate());

	var footer = document.getElementById('footer-container');
	var footerTemplate = require('../footer/footer');
	empty(footer).appendChild(footerTemplate);

	var titleTemplate = require('../title/title');
	var title = document.getElementById('title-container');
	empty(title);

	$('#btnLogin').click(function () {
		var txtEmail = $('#txtEmail').val();
		var txtPassword = $('#txtPassword').val();
		console.log("Enviar:", txtPassword, txtEmail);
		var auth = firebase.auth();
		var promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword);
		promise.catch(function (e) {
			return console.log(e.message);
		});
	});

	firebase.auth().onAuthStateChanged(function (firebaseUser) {
		if (firebaseUser) {
			console.log(firebaseUser);
			console.log('Ha sucedido');

			page.redirect('/home');
		} else {
			console.log('Not logged in');
		}
	});

	$("#txtPassword").keypress(function (event) {
		if (event.which == 13) {
			$('#btnLogin').click(function () {
				var txtEmail = $('#txtEmail').val();
				var txtPassword = $('#txtPassword').val();
				console.log("Enviar:", txtPassword, txtEmail);
				var auth = firebase.auth();
				var promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword);
				promise.catch(function (e) {
					return console.log(e.message);
				});
			});
		}
	});

	console.log("login page");
}

},{"../footer/footer":26,"../header/headerLogin":32,"../title/title":42,"./templateEmpty":36,"empty-element":3,"page":11,"yo-yo":13}],36:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\n<div class="valign-wrapper" id="loginBody">\n  <div class="row">\n    \n      <form class="col s12 ">\n        <div class="row center-align">\n          <img src="mobile.png" width="100%" height="auto">\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <input id="txtEmail" type="text" class="validate" autocomplete="off">\n            <label for="txtEmail">Email</label>\n          </div>\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <input id="txtPassword" type="password" class="validate" autocomplete="off">\n            <label for="txtPassword">Password</label>\n          </div>\n        </div>\n        <div class="row">\n            <a id="btnLogin" class="waves-effect waves-light btn">Entrar</a>\n        </div>\n      </form>\n  </div>\n</div>  \n\n'], ['\n\n<div class="valign-wrapper" id="loginBody">\n  <div class="row">\n    \n      <form class="col s12 ">\n        <div class="row center-align">\n          <img src="mobile.png" width="100%" height="auto">\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <input id="txtEmail" type="text" class="validate" autocomplete="off">\n            <label for="txtEmail">Email</label>\n          </div>\n        </div>\n        <div class="row">\n          <div class="input-field col s12">\n            <input id="txtPassword" type="password" class="validate" autocomplete="off">\n            <label for="txtPassword">Password</label>\n          </div>\n        </div>\n        <div class="row">\n            <a id="btnLogin" class="waves-effect waves-light btn">Entrar</a>\n        </div>\n      </form>\n  </div>\n</div>  \n\n']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

var login = yo(_templateObject);

module.exports = login;

},{"yo-yo":13}],37:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDParticipantes = "";
var urlBDpreSeleccionado1 = "";
var urlBDGanador1 = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/participantes";

page('/participantes', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDParticipantes = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/hombre/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/hombre/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDParticipantes = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/mujer/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/mujer/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/45/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/45/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/25/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/25/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/40/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/40/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/20/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/20/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "kidHombre15") {
      urlBDParticipantes = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "kidHombre10") {
      urlBDParticipantes = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/10/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/10/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "kidMujer15") {
      urlBDParticipantes = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Participantes';

      load();
    } else if (category == "kidMujer6") {
      urlBDParticipantes = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/6/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/6/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Participantes';

      load();
    } else {
      page.redirect('/home');
    }
  } else {
    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {

      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
      console.log("bottom! ok");
      console.log("key!:", sessionStorage.getItem("key"));
    }
  });
  $('.dropdown-button').dropdown();
}

function btnActios() {
  console.log("btnActios");
  $('.btnFavorite').click(function () {
    favorito($(this));
  });
  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","desktopHd.png","tablet.png"));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDParticipantes).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDParticipantes).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardParticipantes');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb, datos[key].category));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function favorito(thisObj) {
  var idCard = thisObj.attr('id');
  var key = "";
  if (idCard.includes("favorite_border")) {
    key = idCard.replace("favorite_border", "");
    console.log("codigo:", key);
    thisObj.text('favorite');
    idCard = idCard.replace("favorite_border", "favorite");
    thisObj.attr('id', idCard);
    var updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB.update({
      category: "cat_1",
      status: "false"
    });
    updateRefFB.once("value", function (snapshot) {
      var datos = snapshot.val();
      if (datos == null) {
        console.log('error en codigo y tabla');
      } else {
        var updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
        updateRefFB2.set({
          name: datos.name,
          lastName: datos.lastName,
          rut: datos.rut,
          email: datos.email,
          phone: datos.phone,
          nameImagen: datos.nameImagen,
          urlImagen: datos.urlImagen,
          urlImagen_thumb: datos.urlImagen_thumb,
          category: datos.category,
          status: datos.status,
          score: "0"
        });
      }
    });
  } else {
    key = idCard.replace("favorite", "");
    thisObj.text('favorite_border');
    idCard = idCard.replace("favorite", "favorite_border");
    thisObj.attr('id', idCard);
    var updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB.update({ category: "false" });
    updateRefFB.update({ status: "false" });
    var updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    var updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
    updateRefFB3.remove();
    updateRefFB2.remove();
  }
  console.log("codigo:", key);
}

},{"../card/cardParticipantes":20,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],38:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDPorAprobar = "";
var urlBDAprobada = "";
var urlBDRechazada = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/porAprobar";

page('/porAprobar', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDPorAprobar = "registroConcursante/pensionado/hombre/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/hombre/rechazado";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDPorAprobar = "registroConcursante/pensionado/mujer/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/mujer/rechazado";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/45/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/45/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/25/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/25/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/40/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/40/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/20/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/20/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "kidHombre15") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "kidHombre10") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/10/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/10/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "kidMujer15") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else if (category == "kidMujer6") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/6/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/6/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Imágenes por Aprobar';

      load();
    } else {

      page.redirect('/home');
    }
  } else {
    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {
      //alert("bottom! ok");
      console.log("bottom! ok");
      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
    }
  });

  $('.dropdown-button').dropdown(); // dropdown abrir
  $(".button-collapse").sideNav(); //menu slide
}

function btnActios() {

  $('.btnCheck').click(function () {
    aprobar($(this));
  });

  $('.btnDelete').click(function () {
    rechazar($(this));
  });

  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  var sliderTemplate = require('../slider/slider');
  var slider = document.getElementById('slider-container');
  empty(slider);

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDPorAprobar).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDPorAprobar).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardporAprobar');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function aprobar(thisObj) {
  var key = thisObj.attr('id');
  var idCard = key.replace("btnCheck", "card");
  console.log("idCard:", idCard);
  key = key.replace("btnCheck", "");

  var updateRefFB = firebase.database().ref().child(urlBDPorAprobar + '/' + key);
  console.log('path:', urlBDPorAprobar + '/' + key);
  updateRefFB.once("value", function (snapshot) {
    var datos = snapshot.val();
    if (datos == null) {
      console.log('error en codigo y tabla');
    } else {
      var updateRefFB2 = firebase.database().ref().child(urlBDAprobada + '/' + key);
      var updateRefFB3 = firebase.database().ref().child(urlBDAprobada).orderByChild("rut").equalTo(datos.rut);
      updateRefFB3.once("value", function (snapshot) {
        var datos2 = snapshot.val();
        if (datos2 == null) {
          console.log('No hay doble participacion puede ser aprobada');
          console.log('ok ref2: ', updateRefFB2);
          //console.log('datos:',datos);
          //console.log('name:',datos.name);
          updateRefFB2.set({
            name: datos.name,
            lastName: datos.lastName,
            rut: datos.rut,
            email: datos.email,
            phone: datos.phone,
            nameImagen: datos.nameImagen,
            urlImagen: datos.urlImagen,
            urlImagen_thumb: datos.urlImagen_thumb,
            category: "false",
            status: "false",
            score: "0"
          });
          updateRefFB.remove();
          var a = document.getElementById(idCard);
          a.remove();
        } else {
          console.log('Hay doble participacion No puede ser aprobada');
          console.log('datos2: ', datos2);
          alert("Hay doble participacion No puede ser aprobada: \nRUT:" + datos.rut + "\nCODIGO:\n" + Object.keys(datos2));
        }
      });
    }
  });

  console.log("codigo:", key);
}

function rechazar(thisObj) {
  var key = thisObj.attr('id');
  var idCard = key.replace("btnDelete", "card");

  key = key.replace("btnDelete", "");

  var updateRefFB = firebase.database().ref().child(urlBDPorAprobar + '/' + key);
  updateRefFB.once("value", function (snapshot) {
    var datos = snapshot.val();
    if (datos == null) {
      console.log('error en codigo y tabla');
    } else {
      var updateRefFB2 = firebase.database().ref().child(urlBDRechazada + '/' + key);
      console.log('ok ref2: ', updateRefFB2);
      //console.log('datos:',datos);
      //console.log('name:',datos.name);
      updateRefFB2.set({
        name: datos.name,
        lastName: datos.lastName,
        rut: datos.rut,
        email: datos.email,
        phone: datos.phone,
        nameImagen: datos.nameImagen,
        urlImagen: datos.urlImagen,
        urlImagen_thumb: datos.urlImagen_thumb,
        category: "false",
        status: "false",
        score: "0"
      });
    }
    updateRefFB.remove();

    var a = document.getElementById(idCard);
    a.remove();
  });
  console.log("codigo:", key);
}

},{"../card/cardporAprobar":23,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../slider/slider":41,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],39:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDPorAprobar = "";
var urlBDAprobada = "";
var urlBDRechazada = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/rechazadas";

page('/rechazadas', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDPorAprobar = "registroConcursante/pensionado/hombre/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/hombre/rechazado";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDPorAprobar = "registroConcursante/pensionado/mujer/porAprobar";
      urlBDAprobada = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/pensionado/mujer/rechazado";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/45/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/45/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDPorAprobar = "registroConcursante/trabajador/hombre/25/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/hombre/25/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/40/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/40/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDPorAprobar = "registroConcursante/trabajador/mujer/20/porAprobar";
      urlBDAprobada = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/trabajador/mujer/20/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "kidHombre15") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "kidHombre10") {
      urlBDPorAprobar = "registroConcursante/kid/hombre/10/porAprobar";
      urlBDAprobada = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/hombre/10/rechazado";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "kidMujer15") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/15/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/15/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else if (category == "kidMujer6") {
      urlBDPorAprobar = "registroConcursante/kid/mujer/6/porAprobar";
      urlBDAprobada = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDRechazada = "registroConcursante/kid/mujer/6/rechazado";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Imágenes Rechazadas';

      load();
    } else {

      page.redirect('/home');
    }
  } else {
    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {
      //alert("bottom! ok");
      console.log("bottom! ok");
      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
    }
  });

  $('.dropdown-button').dropdown();
}

function btnActios() {

  $('.btnDelete').click(function () {
    rechazar($(this));
  });
  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}
function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  var sliderTemplate = require('../slider/slider');
  var slider = document.getElementById('slider-container');
  empty(slider);

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDRechazada).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDRechazada).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardRechazadas');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function rechazar(thisObj) {
  var key = thisObj.attr('id');
  var idCard = key + "card";
  console.log("idCard:", idCard);

  var updateRefFB = firebase.database().ref().child(urlBDRechazada + '/' + key);
  updateRefFB.once("value", function (snapshot) {
    var datos = snapshot.val();
    if (datos == null) {
      console.log('error en codigo y tabla');
    } else {
      var updateRefFB2 = firebase.database().ref().child(urlBDAprobada + '/' + key);
      console.log('ok ref2: ', updateRefFB2);
      //console.log('datos:',datos);
      //console.log('name:',datos.name);
      updateRefFB2.set({
        name: datos.name,
        lastName: datos.lastName,
        rut: datos.rut,
        email: datos.email,
        phone: datos.phone,
        nameImagen: datos.nameImagen,
        urlImagen: datos.urlImagen,
        urlImagen_thumb: datos.urlImagen_thumb,
        category: "false",
        status: "false",
        score: "0"
      });
    }
    updateRefFB.remove();
    var a = document.getElementById(idCard);
    a.remove();
  });
  console.log("codigo:", key);
}

},{"../card/cardRechazadas":22,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../slider/slider":41,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],40:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  '], ['\n    <div class="container" >\n    <div class="row">\n          <div class="row" id="addPhoto" >\n        \n          </div>\n      </div> \n    </div>\n  ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var page = require('page');
var yo = require('yo-yo');

var itemPorPagina = 8;
var referenceToOldestKey = true;

var urlBDParticipantes = "";
var urlBDpreSeleccionado1 = "";
var urlBDGanador1 = "";

var lblTitle1 = "";
var lblTitle2 = "";

var category = "";

var pathPageLocal = "/seleccionadas";

page('/seleccionadas', function (ctx, next) {

  var user = firebase.auth().currentUser;

  if (user) {
    category = sessionStorage.getItem("category");
    console.log("category: ", category);

    if (category == "pensionadoHombre") {
      urlBDParticipantes = "registroConcursante/pensionado/hombre/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/hombre/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/hombre/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Hombre';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "pensionadoMujer") {
      urlBDParticipantes = "registroConcursante/pensionado/mujer/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/pensionado/mujer/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/pensionado/mujer/aprobada/ganador1/";

      lblTitle1 = 'Categoria Pensionados Mujer';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "trabajadorHombre45") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/45/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/45/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/45/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 45';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "trabajadorHombre25") {
      urlBDParticipantes = "registroConcursante/trabajador/hombre/25/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/hombre/25/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/hombre/25/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 25';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "trabajadorMujer40") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/40/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/40/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/40/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 40';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "trabajadorMujer20") {
      urlBDParticipantes = "registroConcursante/trabajador/mujer/20/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/trabajador/mujer/20/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/trabajador/mujer/20/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 20';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "kidHombre15") {
      urlBDParticipantes = "registroConcursante/kid/hombre/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 15';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "kidHombre10") {
      urlBDParticipantes = "registroConcursante/kid/hombre/10/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/hombre/10/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/hombre/10/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Hombre 10';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "kidMujer15") {
      urlBDParticipantes = "registroConcursante/kid/mujer/15/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/15/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/15/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 15';
      lblTitle2 = 'Seleccionadas';

      load();
    } else if (category == "kidMujer6") {
      urlBDParticipantes = "registroConcursante/kid/mujer/6/aprobada/participantes/";
      urlBDpreSeleccionado1 = "registroConcursante/kid/mujer/6/aprobada/preSeleccionados1/";
      urlBDGanador1 = "registroConcursante/kid/mujer/6/aprobada/ganador1/";

      lblTitle1 = 'Categoria Trabajador Mujer 6';
      lblTitle2 = 'Seleccionadas';

      load();
    } else {

      page.redirect('/home');
    }
  } else {
    page.redirect('/');
  }
});

function load(ctx, next) {
  referenceToOldestKey = true;
  console.log('----------Home page--------');
  loadHeader();
  loadPage();

  loadFooter();
  loadImages(itemPorPagina, referenceToOldestKey);

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= getDocHeight()) {
      //alert("bottom! ok");
      console.log("bottom! ok");
      referenceToOldestKey = sessionStorage.getItem("key");
      loadImages(itemPorPagina, referenceToOldestKey);
    }
  });
  $('.dropdown-button').dropdown();
}

function btnActios() {
  console.log("btnActios");
  $('.btnWinner').click(function () {
    winner($(this));
  });
  $('.btnDelete').click(function () {
    rechazar($(this));
  });
  $('.favoriteBtnStart').click(function () {
    starts($(this));
  });
  menubtns();
  menuLateral();
}

function menuLateral() {
  $('#itemMenuCategorias').click(function () {
    console.log('itemMenuCategorias');
    sessionStorage.setItem("key", true);
    page('/home');
  });

  $('#itemMenuParticipantes').click(function () {
    console.log('itemMenuParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#itemMenuSeleccionadas').click(function () {
    console.log('itemMenuSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#itemMenuGanadores').click(function () {
    console.log('itemMenuGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#itemMenuRechazadas').click(function () {
    console.log('itemMenuRechazadas');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#itemMenuAprobar').click(function () {
    console.log('itemMenuAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#itemMenuPorAprobar').click(function () {
    console.log('itemMenuPorAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#itemMenulogOut').click(function () {
    console.log('itemMenulogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function menubtns() {

  $('#btnParticipantes').click(function () {
    console.log('btnParticipantes');
    sessionStorage.setItem("key", true);
    page('/participantes');
  });

  $('#btnSeleccionadas').click(function () {
    console.log('btnSeleccionadas');
    sessionStorage.setItem("key", true);
    page('/seleccionadas');
  });

  $('#btnGanadores').click(function () {
    console.log('btnGanadores');
    sessionStorage.setItem("key", true);
    page('/ganadores');
  });

  $('#btnRechazar').click(function () {
    console.log('btnRechazar');
    sessionStorage.setItem("key", true);
    page('/rechazadas');
  });

  $('#btnAprobar').click(function () {
    console.log('btnAprobar');
    sessionStorage.setItem("key", true);
    page('/aprobadas');
  });

  $('#btnporAprobar').click(function () {
    console.log('btnporAprobar');
    sessionStorage.setItem("key", true);
    page('/porAprobar');
  });

  $('#btnKidMujer6').click(function () {
    if (category == "kidMujer6") {
      console.log('btnKidMujer6');
    } else {
      console.log('btnKidMujer6');
      sessionStorage.setItem("category", "kidMujer6");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidMujer15').click(function () {
    if (category == "kidMujer15") {
      console.log('btnKidMujer15');
    } else {
      console.log('btnKidMujer15');
      sessionStorage.setItem("category", "kidMujer15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre15').click(function () {
    if (category == "kidHombre15") {
      console.log('btnKidHombre15');
    } else {
      console.log('btnKidHombre15');
      sessionStorage.setItem("category", "kidHombre15");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnKidHombre10').click(function () {
    if (category == "kidHombre10") {
      console.log('btnKidHombre10');
    } else {
      console.log('btnKidHombre10');
      sessionStorage.setItem("category", "kidHombre10");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre45').click(function () {
    if (category == "trabajadorHombre45") {
      console.log('btnTrabajadorHombre45');
    } else {
      console.log('btnTrabajadorHombre45');
      sessionStorage.setItem("category", "trabajadorHombre45");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorHombre25').click(function () {
    if (category == "trabajadorHombre25") {
      console.log('btnTrabajadorHombre25');
    } else {
      console.log('btnTrabajadorHombre25');
      sessionStorage.setItem("category", "trabajadorHombre25");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer40').click(function () {
    if (category == "trabajadorMujer40") {
      console.log('btnTrabajadorMujer40');
    } else {
      console.log('btnTrabajadorMujer40');
      sessionStorage.setItem("category", "trabajadorMujer40");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnTrabajadorMujer20').click(function () {
    if (category == "trabajadorMujer20") {
      console.log('btnTrabajadorMujer20');
    } else {
      console.log('btnTrabajadorMujer20');
      sessionStorage.setItem("category", "trabajadorMujer20");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosHombre').click(function () {
    if (category == "pensionadoHombre") {
      console.log('btnPensionadosHombre');
    } else {
      console.log('btnPensionadosHombre');
      sessionStorage.setItem("category", "pensionadoHombre");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#btnPensionadosMujer').click(function () {
    if (category == "pensionadoMujer") {
      console.log('pensionadoMujer');
    } else {
      console.log('pensionadoMujer');
      sessionStorage.setItem("category", "pensionadoMujer");
      sessionStorage.setItem("key", true);
      page(pathPageLocal);
    }
  });

  $('#logOut').click(function () {
    console.log('btnLogOut');
    sessionStorage.setItem("category", "true");
    sessionStorage.setItem("key", true);
    firebase.auth().signOut();
    page('/');
  });
}

function loadFooter() {
  console.log('------------loadFooter() ------------');
  var empty = require('empty-element');
  var footer = document.getElementById('footer-container');
  var footerTemplate = require('../footer/footer');
  empty(footer).appendChild(footerTemplate);
  console.log('************loadFooter() ************');
}

function loadHeader() {
  console.log('------------loadHeader() ------------');
  var empty = require('empty-element');
  var headerTemplate = require('../header/header');
  var header = document.getElementById('header-container');
  empty(header).appendChild(headerTemplate());

  // const sliderTemplate= require('../slider/slider');
  // const slider = document.getElementById('slider-container');
  // empty(slider).appendChild(sliderTemplate("mobile.png","desktopHd.png","tablet.png"));

  var titleTemplate = require('../title/title');
  var title = document.getElementById('title-container');
  empty(title).appendChild(titleTemplate(lblTitle1, lblTitle2));

  console.log('************loadHeader() ************');
}

function loadPage() {
  console.log('------------loadPage() ------------');
  var aux = yo(_templateObject);
  var main = document.getElementById('main-container');
  var empty = require('empty-element');
  empty(main).appendChild(aux);

  console.log('************loadPage() ************');
}

function loadImages(item, referenceToOldestKey) {
  console.log('------------loadImages() ------------');
  console.log('************loadImages() ************');
  console.log("total de datos a cargar: ", item);
  console.log("referenceToOldestKey If: ", referenceToOldestKey);
  if (referenceToOldestKey == true) {
    console.log('------------load Images referenceToOldestKey == true ------------');
    return firebase.database().ref().child(urlBDpreSeleccionado1).orderByKey().limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return [null, null, null];
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });

        console.log('arrayOfKeys then1:', arrayOfKeys);
        console.log('results then1:', results);

        // storing reference
        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];

        console.log("referenceToOldestKey Inside: then1", referenceToOldestKey);
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos[0] == null) {
        empty(content).appendChild(templateEmpty);
        console.log('Datos then2:vacio');
        sessionStorage.setItem("key", "null");
      } else {

        var _referenceToOldestKey = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey);

        writeImage(datosRef, arrayOfKeys);

        sessionStorage.setItem("key", _referenceToOldestKey);
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  } else if (referenceToOldestKey == "null") {
    console.log('------------load Images !referenceToOldestKey ------------');
  } else {
    console.log('------------load Images referenceToOldestKey anothe value ------------');
    return firebase.database().ref().child(urlBDpreSeleccionado1).orderByKey().endAt(referenceToOldestKey).limitToLast(item).once('value').then(function (result) {
      var datos = result.val();
      if (datos == null) {
        console.log('No hay datos');
        btnActios();
        return null;
      } else {
        console.log('Datos then:', datos);
        var arrayOfKeys = Object.keys(datos).sort().reverse();
        // changing to reverse chronological order (latest first)
        // & removing duplicate
        var arrayOfKeys = Object.keys(datos).sort().reverse().slice(1);
        // transforming to array
        var results = arrayOfKeys.map(function (key) {
          return datos[key];
        });
        // updating reference

        // console.log('arrayOfKeys:',arrayOfKeys); 
        console.log('loadData results:', results);

        referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        datos = results;
        return [datos, arrayOfKeys, referenceToOldestKey];
      }
    }).then(function (datos) {
      var content = document.getElementById('addPhoto');
      var templateEmpty = require('../empty/templateEmpty');
      if (datos == null) {
        empty(content).appendChild(templateEmpty);
        sessionStorage.setItem("key", "null");
      } else {
        var _referenceToOldestKey2 = datos[2];
        var datosRef = datos[0];
        var arrayOfKeys = datos[1];

        console.log('Datos then2:', datosRef);
        console.log('arrayOfKeys then2:', arrayOfKeys);
        console.log('referenceToOldestKey then2:', _referenceToOldestKey2);

        if (_referenceToOldestKey2 == null) {
          sessionStorage.setItem("key", "null");
        } else {
          writeImage(datosRef, arrayOfKeys);
          sessionStorage.setItem("key", _referenceToOldestKey2);
        }
      }
    }).then(function () {
      btnActios();
    }).catch(function (err) {
      console.log('Error', err.code);
    });
  }
}

function writeImage(datos, keys) {
  var content = document.getElementById('addPhoto');
  var card = require('../card/cardPreseleccionado');
  var i = 0;
  for (var key in datos) {
    content.appendChild(card(keys[i], datos[key].rut, keys[i], datos[key].urlImagen, datos[key].urlImagen_thumb, datos[key].status, datos[key].score));
    console.log("url", keys[key]);
    i++;
  }
}

function getDocHeight() {
  var D = document;
  return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight);
}

function winner(thisObj) {
  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key = "";
  var updateRefFB;
  var updateRefFB2;
  var updateRefFB3;

  if (thisObj.text() == "star_border") {
    key = codigoTotal.replace("btnStar", "");
    console.log("codigo:", key);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star');

    updateRefFB.update({ status: "winner" });
    updateRefFB2.update({ status: "winner" });
    updateRefFB2.once("value", function (snapshot) {
      var datos = snapshot.val();
      if (datos == null) {
        console.log('error en codigo y tabla');
      } else {
        updateRefFB3.set({
          name: datos.name,
          lastName: datos.lastName,
          rut: datos.rut,
          email: datos.email,
          phone: datos.phone,
          nameImagen: datos.nameImagen,
          urlImagen: datos.urlImagen,
          urlImagen_thumb: datos.urlImagen_thumb,
          category: datos.category,
          status: datos.status,
          score: datos.score
        });
      }
    });
  } else {
    key = codigoTotal.replace("btnStar", "");

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);

    thisObj.text('star_border');

    updateRefFB.update({ status: "false" });
    updateRefFB2.update({ status: "false" });

    updateRefFB3.remove();
  }
  console.log("codigo:", key);
}

function starts(thisObj) {
  var key = thisObj.attr('id');
  var auxAlt = "";

  var updateRefFB;
  var updateRefFB2;
  var updateRefFB3;

  var starContent = thisObj.text();

  if (key.includes("star1")) {
    key = key.replace("star1", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "1" });
      updateRefFB2.update({ score: "1" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "1" });
      }

      var p2 = "#" + key + "star2";
      $(p2).text('star_border');
      var p3 = "#" + key + "star3";
      $(p3).text('star_border');
      var p4 = "#" + key + "star4";
      $(p4).text('star_border');
      var p5 = "#" + key + "star5";
      $(p5).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p = "#" + key + "star2";
      $(_p).text('star_border');
      var _p2 = "#" + key + "star3";
      $(_p2).text('star_border');
      var _p3 = "#" + key + "star4";
      $(_p3).text('star_border');
      var _p4 = "#" + key + "star5";
      $(_p4).text('star_border');
    }
  } else if (key.includes("star2")) {
    key = key.replace("star2", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "2" });
      updateRefFB2.update({ score: "2" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "2" });
      }

      var p1 = "#" + key + "star1";
      $(p1).text('star');
      var _p5 = "#" + key + "star3";
      $(_p5).text('star_border');
      var _p6 = "#" + key + "star4";
      $(_p6).text('star_border');
      var _p7 = "#" + key + "star5";
      $(_p7).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p8 = "#" + key + "star1";
      $(_p8).text('star_border');
      var _p9 = "#" + key + "star3";
      $(_p9).text('star_border');
      var _p10 = "#" + key + "star4";
      $(_p10).text('star_border');
      var _p11 = "#" + key + "star5";
      $(_p11).text('star_border');
    }
  } else if (key.includes("star3")) {
    key = key.replace("star3", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "3" });
      updateRefFB2.update({ score: "3" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "3" });
      }

      var _p12 = "#" + key + "star1";
      $(_p12).text('star');
      var _p13 = "#" + key + "star2";
      $(_p13).text('star');
      var _p14 = "#" + key + "star4";
      $(_p14).text('star_border');
      var _p15 = "#" + key + "star5";
      $(_p15).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p16 = "#" + key + "star1";
      $(_p16).text('star_border');
      var _p17 = "#" + key + "star2";
      $(_p17).text('star_border');
      var _p18 = "#" + key + "star4";
      $(_p18).text('star_border');
      var _p19 = "#" + key + "star5";
      $(_p19).text('star_border');
    }
  } else if (key.includes("star4")) {
    key = key.replace("star4", "");
    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "4" });
      updateRefFB2.update({ score: "4" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "4" });
      }

      var _p20 = "#" + key + "star1";
      $(_p20).text('star');
      var _p21 = "#" + key + "star2";
      $(_p21).text('star');
      var _p22 = "#" + key + "star3";
      $(_p22).text('star');
      var _p23 = "#" + key + "star5";
      $(_p23).text('star_border');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p24 = "#" + key + "star1";
      $(_p24).text('star_border');
      var _p25 = "#" + key + "star2";
      $(_p25).text('star_border');
      var _p26 = "#" + key + "star3";
      $(_p26).text('star_border');
      var _p27 = "#" + key + "star5";
      $(_p27).text('star_border');
    }
  } else if (key.includes("star5")) {
    key = key.replace("star5", "");

    var keyBtnStart = "#" + key + "btnStar";
    var flagBtnStar = $(keyBtnStart).text();
    console.log("keyBtnStart:", flagBtnStar);
    console.log("flagBtnStar:", flagBtnStar);

    updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
    updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);

    if (starContent == "star_border") {
      thisObj.text('star');
      updateRefFB.update({ score: "5" });
      updateRefFB2.update({ score: "5" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "5" });
      }

      var _p28 = "#" + key + "star1";
      $(_p28).text('star');
      var _p29 = "#" + key + "star2";
      $(_p29).text('star');
      var _p30 = "#" + key + "star3";
      $(_p30).text('star');
      var _p31 = "#" + key + "star4";
      $(_p31).text('star');
    } else {
      thisObj.text('star_border');
      updateRefFB.update({ score: "0" });
      updateRefFB2.update({ score: "0" });

      if (flagBtnStar == "star") {
        updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
        updateRefFB3.update({ score: "0" });
      }

      var _p32 = "#" + key + "star1";
      $(_p32).text('star_border');
      var _p33 = "#" + key + "star2";
      $(_p33).text('star_border');
      var _p34 = "#" + key + "star3";
      $(_p34).text('star_border');
      var _p35 = "#" + key + "star4";
      $(_p35).text('star_border');
    }
  }
  console.log("codigo:", key);
}

function rechazar(thisObj) {

  var codigoTotal = thisObj.attr('id');
  var auxAlt = "";
  var key = codigoTotal.replace("btnDelete", "");
  var idBtnStart = "#" + key + "btnStar";
  var idCard = "#" + key + "card";

  var updateRefFB = firebase.database().ref().child(urlBDParticipantes + key);
  var updateRefFB2 = firebase.database().ref().child(urlBDpreSeleccionado1 + key);
  var updateRefFB3;
  if ($(idBtnStart).text() == "star") {
    updateRefFB3 = firebase.database().ref().child(urlBDGanador1 + key);
    updateRefFB3.remove();
    updateRefFB2.remove();
    updateRefFB.update({ category: "false", status: "false", score: "0" });
    $(idCard).remove();
  } else {
    updateRefFB2.remove();
    updateRefFB.update({ category: "false", status: "false", score: "0" });
    $(idCard).remove();
  }
}

},{"../card/cardPreseleccionado":21,"../empty/templateEmpty":24,"../footer/footer":26,"../header/header":30,"../title/title":42,"empty-element":3,"page":11,"yo-yo":13}],41:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\t  <div>\n\t  \t<img class="responsive-img hide-on-med-and-up" src=', ' style="height: 70%vh;" alt="Space">\n        <img class="responsive-img hide-on-med-and-down" src=', ' style="height: 70%vh;" alt="Space"> \n        <img class="responsive-img hide-on-small-only hide-on-large-only" src=', ' style="height: 70%vh;" alt="Space">   \n \t  </div>\n\t \n    '], ['\n\t  <div>\n\t  \t<img class="responsive-img hide-on-med-and-up" src=', ' style="height: 70%vh;" alt="Space">\n        <img class="responsive-img hide-on-med-and-down" src=', ' style="height: 70%vh;" alt="Space"> \n        <img class="responsive-img hide-on-small-only hide-on-large-only" src=', ' style="height: 70%vh;" alt="Space">   \n \t  </div>\n\t \n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function slider(mobile, tablet, desktop) {
       // <a href="#" class="brand-logo center" style="font-weight: 700;">${name}</a>
       return yo(_templateObject, mobile, desktop, tablet);
};

},{"yo-yo":13}],42:[function(require,module,exports){
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n\t  <div class="container">\n\t  \t<div class="row">\n\t\t\t<h2 >', '</h2>\n\t        <h4 >', '</h4>  \n \t  \t</div>\n \t  </div>\n\t \n    '], ['\n\t  <div class="container">\n\t  \t<div class="row">\n\t\t\t<h2 >', '</h2>\n\t        <h4 >', '</h4>  \n \t  \t</div>\n \t  </div>\n\t \n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var yo = require('yo-yo');

module.exports = function title(t1, t2) {
		// <a href="#" class="brand-logo center" style="font-weight: 700;">${name}</a>
		return yo(_templateObject, t1, t2);
};

},{"yo-yo":13}]},{},[34]);
