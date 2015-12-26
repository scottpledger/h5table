/*!
 * h5table 0.0.1
 * https://h5table.github.io
 *
 * Released under the MIT license
 * https://github.com/h5table/h5table/blob/master/LICENSE.md
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 =
(function () {
  // Restore the h5table AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (jQuery && jQuery.fn && jQuery.fn.h5table && jQuery.fn.h5table.amd) {
    var S2 = jQuery.fn.h5table.amd;
  }
var S2;(function () { if (!S2 || !S2.requirejs) {
if (!S2) { S2 = {}; } else { require = S2; }
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

S2.requirejs = requirejs;S2.require = require;S2.define = define;
}
}());
S2.define("almond", function(){});

/* global jQuery:false, $:false */
S2.define('jquery',[],function () {
  var _$ = jQuery || $;

  if (_$ == null && console && console.error) {
    console.error(
      'h5table: An instance of jQuery or a jQuery-compatible library was not ' +
      'found. Make sure that you are including jQuery before h5table on your ' +
      'web page.'
    );
  }

  return _$;
});

S2.define('h5table/utils',[
  'jquery'
], function ($) {
  var Utils = {};

  Utils.Extend = function (ChildClass, SuperClass) {
    var __hasProp = {}.hasOwnProperty;

    function BaseConstructor () {
      this.constructor = ChildClass;
    }

    for (var key in SuperClass) {
      if (__hasProp.call(SuperClass, key)) {
        ChildClass[key] = SuperClass[key];
      }
    }

    BaseConstructor.prototype = SuperClass.prototype;
    ChildClass.prototype = new BaseConstructor();
    ChildClass.__super__ = SuperClass.prototype;

    return ChildClass;
  };

  function getMethods (theClass) {
    var proto = theClass.prototype;

    var methods = [];

    for (var methodName in proto) {
      var m = proto[methodName];

      if (typeof m !== 'function') {
        continue;
      }

      if (methodName === 'constructor') {
        continue;
      }

      methods.push(methodName);
    }

    return methods;
  }

  Utils.Decorate = function (SuperClass, DecoratorClass) {
    var decoratedMethods = getMethods(DecoratorClass);
    var superMethods = getMethods(SuperClass);

    function DecoratedClass () {
      var unshift = Array.prototype.unshift;

      var argCount = DecoratorClass.prototype.constructor.length;

      var calledConstructor = SuperClass.prototype.constructor;

      if (argCount > 0) {
        unshift.call(arguments, SuperClass.prototype.constructor);

        calledConstructor = DecoratorClass.prototype.constructor;
      }

      calledConstructor.apply(this, arguments);
    }

    DecoratorClass.displayName = SuperClass.displayName;

    function ctr () {
      this.constructor = DecoratedClass;
    }

    DecoratedClass.prototype = new ctr();

    for (var m = 0; m < superMethods.length; m++) {
        var superMethod = superMethods[m];

        DecoratedClass.prototype[superMethod] =
          SuperClass.prototype[superMethod];
    }

    var calledMethod = function (methodName) {
      // Stub out the original method if it's not decorating an actual method
      var originalMethod = function () {};

      if (methodName in DecoratedClass.prototype) {
        originalMethod = DecoratedClass.prototype[methodName];
      }

      var decoratedMethod = DecoratorClass.prototype[methodName];

      return function () {
        var unshift = Array.prototype.unshift;

        unshift.call(arguments, originalMethod);

        return decoratedMethod.apply(this, arguments);
      };
    };

    for (var d = 0; d < decoratedMethods.length; d++) {
      var decoratedMethod = decoratedMethods[d];

      DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
    }

    return DecoratedClass;
  };

  var Observable = function (children) {
    this.listeners = {};
  };

  Observable.prototype.on = function (event, callback) {
    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  };

  Observable.prototype.trigger = function (event) {
    var slice = Array.prototype.slice;

    this.listeners = this.listeners || {};

    if (event in this.listeners) {
      this.invoke(this.listeners[event], slice.call(arguments, 1));
    }

    if ('*' in this.listeners) {
      this.invoke(this.listeners['*'], arguments);
    }
  };

  Observable.prototype.invoke = function (listeners, params) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(this, params);
    }
  };

  Utils.Observable = Observable;

  Utils.generateChars = function (length) {
    var chars = '';

    for (var i = 0; i < length; i++) {
      var randomChar = Math.floor(Math.random() * 36);
      chars += randomChar.toString(36);
    }

    return chars;
  };

  Utils.bind = function (func, context) {
    return function () {
      func.apply(context, arguments);
    };
  };

  Utils._convertData = function (data) {
    for (var originalKey in data) {
      var keys = originalKey.split('-');

      var dataLevel = data;

      if (keys.length === 1) {
        continue;
      }

      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        // Lowercase the first letter
        // By default, dash-separated becomes camelCase
        key = key.substring(0, 1).toLowerCase() + key.substring(1);

        if (!(key in dataLevel)) {
          dataLevel[key] = {};
        }

        if (k == keys.length - 1) {
          dataLevel[key] = data[originalKey];
        }

        dataLevel = dataLevel[key];
      }

      delete data[originalKey];
    }

    return data;
  };

  Utils.hasScroll = function (index, el) {
    // Adapted from the function created by @ShadowScripter
    // and adapted by @BillBarry on the Stack Exchange Code Review website.
    // The original code can be found at
    // http://codereview.stackexchange.com/q/13338
    // and was designed to be used with the Sizzle selector engine.

    var $el = $(el);
    var overflowX = el.style.overflowX;
    var overflowY = el.style.overflowY;

    //Check both x and y declarations
    if (overflowX === overflowY &&
        (overflowY === 'hidden' || overflowY === 'visible')) {
      return false;
    }

    if (overflowX === 'scroll' || overflowY === 'scroll') {
      return true;
    }

    return ($el.innerHeight() < el.scrollHeight ||
      $el.innerWidth() < el.scrollWidth);
  };

  Utils.escapeMarkup = function (markup) {
    var replaceMap = {
      '\\': '&#92;',
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
      '/': '&#47;'
    };

    // Do not try to escape the markup if it's not a string
    if (typeof markup !== 'string') {
      return markup;
    }

    return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
      return replaceMap[match];
    });
  };

  // Append an array of jQuery nodes to a given element.
  Utils.appendMany = function ($element, $nodes) {
    // jQuery 1.7.x does not support $.fn.append() with an array
    // Fall back to a jQuery object collection using $.fn.add()
    if ($.fn.jquery.substr(0, 3) === '1.7') {
      var $jqNodes = $();

      $.map($nodes, function (node) {
        $jqNodes = $jqNodes.add(node);
      });

      $nodes = $jqNodes;
    }

    $element.append($nodes);
  };

  return Utils;
});

S2.define('h5table/translation',[
  'jquery',
  'require'
], function ($, require) {
  function Translation (dict) {
    this.dict = dict || {};
  }

  Translation.prototype.all = function () {
    return this.dict;
  };

  Translation.prototype.get = function (key) {
    return this.dict[key];
  };

  Translation.prototype.extend = function (translation) {
    this.dict = $.extend({}, translation.all(), this.dict);
  };

  // Static functions

  Translation._cache = {};

  Translation.loadPath = function (path) {
    if (!(path in Translation._cache)) {
      var translations = require(path);

      Translation._cache[path] = translations;
    }

    return new Translation(Translation._cache[path]);
  };

  return Translation;
});

S2.define('h5table/diacritics',[

], function () {
  var diacritics = {
    '\u24B6': 'A',
    '\uFF21': 'A',
    '\u00C0': 'A',
    '\u00C1': 'A',
    '\u00C2': 'A',
    '\u1EA6': 'A',
    '\u1EA4': 'A',
    '\u1EAA': 'A',
    '\u1EA8': 'A',
    '\u00C3': 'A',
    '\u0100': 'A',
    '\u0102': 'A',
    '\u1EB0': 'A',
    '\u1EAE': 'A',
    '\u1EB4': 'A',
    '\u1EB2': 'A',
    '\u0226': 'A',
    '\u01E0': 'A',
    '\u00C4': 'A',
    '\u01DE': 'A',
    '\u1EA2': 'A',
    '\u00C5': 'A',
    '\u01FA': 'A',
    '\u01CD': 'A',
    '\u0200': 'A',
    '\u0202': 'A',
    '\u1EA0': 'A',
    '\u1EAC': 'A',
    '\u1EB6': 'A',
    '\u1E00': 'A',
    '\u0104': 'A',
    '\u023A': 'A',
    '\u2C6F': 'A',
    '\uA732': 'AA',
    '\u00C6': 'AE',
    '\u01FC': 'AE',
    '\u01E2': 'AE',
    '\uA734': 'AO',
    '\uA736': 'AU',
    '\uA738': 'AV',
    '\uA73A': 'AV',
    '\uA73C': 'AY',
    '\u24B7': 'B',
    '\uFF22': 'B',
    '\u1E02': 'B',
    '\u1E04': 'B',
    '\u1E06': 'B',
    '\u0243': 'B',
    '\u0182': 'B',
    '\u0181': 'B',
    '\u24B8': 'C',
    '\uFF23': 'C',
    '\u0106': 'C',
    '\u0108': 'C',
    '\u010A': 'C',
    '\u010C': 'C',
    '\u00C7': 'C',
    '\u1E08': 'C',
    '\u0187': 'C',
    '\u023B': 'C',
    '\uA73E': 'C',
    '\u24B9': 'D',
    '\uFF24': 'D',
    '\u1E0A': 'D',
    '\u010E': 'D',
    '\u1E0C': 'D',
    '\u1E10': 'D',
    '\u1E12': 'D',
    '\u1E0E': 'D',
    '\u0110': 'D',
    '\u018B': 'D',
    '\u018A': 'D',
    '\u0189': 'D',
    '\uA779': 'D',
    '\u01F1': 'DZ',
    '\u01C4': 'DZ',
    '\u01F2': 'Dz',
    '\u01C5': 'Dz',
    '\u24BA': 'E',
    '\uFF25': 'E',
    '\u00C8': 'E',
    '\u00C9': 'E',
    '\u00CA': 'E',
    '\u1EC0': 'E',
    '\u1EBE': 'E',
    '\u1EC4': 'E',
    '\u1EC2': 'E',
    '\u1EBC': 'E',
    '\u0112': 'E',
    '\u1E14': 'E',
    '\u1E16': 'E',
    '\u0114': 'E',
    '\u0116': 'E',
    '\u00CB': 'E',
    '\u1EBA': 'E',
    '\u011A': 'E',
    '\u0204': 'E',
    '\u0206': 'E',
    '\u1EB8': 'E',
    '\u1EC6': 'E',
    '\u0228': 'E',
    '\u1E1C': 'E',
    '\u0118': 'E',
    '\u1E18': 'E',
    '\u1E1A': 'E',
    '\u0190': 'E',
    '\u018E': 'E',
    '\u24BB': 'F',
    '\uFF26': 'F',
    '\u1E1E': 'F',
    '\u0191': 'F',
    '\uA77B': 'F',
    '\u24BC': 'G',
    '\uFF27': 'G',
    '\u01F4': 'G',
    '\u011C': 'G',
    '\u1E20': 'G',
    '\u011E': 'G',
    '\u0120': 'G',
    '\u01E6': 'G',
    '\u0122': 'G',
    '\u01E4': 'G',
    '\u0193': 'G',
    '\uA7A0': 'G',
    '\uA77D': 'G',
    '\uA77E': 'G',
    '\u24BD': 'H',
    '\uFF28': 'H',
    '\u0124': 'H',
    '\u1E22': 'H',
    '\u1E26': 'H',
    '\u021E': 'H',
    '\u1E24': 'H',
    '\u1E28': 'H',
    '\u1E2A': 'H',
    '\u0126': 'H',
    '\u2C67': 'H',
    '\u2C75': 'H',
    '\uA78D': 'H',
    '\u24BE': 'I',
    '\uFF29': 'I',
    '\u00CC': 'I',
    '\u00CD': 'I',
    '\u00CE': 'I',
    '\u0128': 'I',
    '\u012A': 'I',
    '\u012C': 'I',
    '\u0130': 'I',
    '\u00CF': 'I',
    '\u1E2E': 'I',
    '\u1EC8': 'I',
    '\u01CF': 'I',
    '\u0208': 'I',
    '\u020A': 'I',
    '\u1ECA': 'I',
    '\u012E': 'I',
    '\u1E2C': 'I',
    '\u0197': 'I',
    '\u24BF': 'J',
    '\uFF2A': 'J',
    '\u0134': 'J',
    '\u0248': 'J',
    '\u24C0': 'K',
    '\uFF2B': 'K',
    '\u1E30': 'K',
    '\u01E8': 'K',
    '\u1E32': 'K',
    '\u0136': 'K',
    '\u1E34': 'K',
    '\u0198': 'K',
    '\u2C69': 'K',
    '\uA740': 'K',
    '\uA742': 'K',
    '\uA744': 'K',
    '\uA7A2': 'K',
    '\u24C1': 'L',
    '\uFF2C': 'L',
    '\u013F': 'L',
    '\u0139': 'L',
    '\u013D': 'L',
    '\u1E36': 'L',
    '\u1E38': 'L',
    '\u013B': 'L',
    '\u1E3C': 'L',
    '\u1E3A': 'L',
    '\u0141': 'L',
    '\u023D': 'L',
    '\u2C62': 'L',
    '\u2C60': 'L',
    '\uA748': 'L',
    '\uA746': 'L',
    '\uA780': 'L',
    '\u01C7': 'LJ',
    '\u01C8': 'Lj',
    '\u24C2': 'M',
    '\uFF2D': 'M',
    '\u1E3E': 'M',
    '\u1E40': 'M',
    '\u1E42': 'M',
    '\u2C6E': 'M',
    '\u019C': 'M',
    '\u24C3': 'N',
    '\uFF2E': 'N',
    '\u01F8': 'N',
    '\u0143': 'N',
    '\u00D1': 'N',
    '\u1E44': 'N',
    '\u0147': 'N',
    '\u1E46': 'N',
    '\u0145': 'N',
    '\u1E4A': 'N',
    '\u1E48': 'N',
    '\u0220': 'N',
    '\u019D': 'N',
    '\uA790': 'N',
    '\uA7A4': 'N',
    '\u01CA': 'NJ',
    '\u01CB': 'Nj',
    '\u24C4': 'O',
    '\uFF2F': 'O',
    '\u00D2': 'O',
    '\u00D3': 'O',
    '\u00D4': 'O',
    '\u1ED2': 'O',
    '\u1ED0': 'O',
    '\u1ED6': 'O',
    '\u1ED4': 'O',
    '\u00D5': 'O',
    '\u1E4C': 'O',
    '\u022C': 'O',
    '\u1E4E': 'O',
    '\u014C': 'O',
    '\u1E50': 'O',
    '\u1E52': 'O',
    '\u014E': 'O',
    '\u022E': 'O',
    '\u0230': 'O',
    '\u00D6': 'O',
    '\u022A': 'O',
    '\u1ECE': 'O',
    '\u0150': 'O',
    '\u01D1': 'O',
    '\u020C': 'O',
    '\u020E': 'O',
    '\u01A0': 'O',
    '\u1EDC': 'O',
    '\u1EDA': 'O',
    '\u1EE0': 'O',
    '\u1EDE': 'O',
    '\u1EE2': 'O',
    '\u1ECC': 'O',
    '\u1ED8': 'O',
    '\u01EA': 'O',
    '\u01EC': 'O',
    '\u00D8': 'O',
    '\u01FE': 'O',
    '\u0186': 'O',
    '\u019F': 'O',
    '\uA74A': 'O',
    '\uA74C': 'O',
    '\u01A2': 'OI',
    '\uA74E': 'OO',
    '\u0222': 'OU',
    '\u24C5': 'P',
    '\uFF30': 'P',
    '\u1E54': 'P',
    '\u1E56': 'P',
    '\u01A4': 'P',
    '\u2C63': 'P',
    '\uA750': 'P',
    '\uA752': 'P',
    '\uA754': 'P',
    '\u24C6': 'Q',
    '\uFF31': 'Q',
    '\uA756': 'Q',
    '\uA758': 'Q',
    '\u024A': 'Q',
    '\u24C7': 'R',
    '\uFF32': 'R',
    '\u0154': 'R',
    '\u1E58': 'R',
    '\u0158': 'R',
    '\u0210': 'R',
    '\u0212': 'R',
    '\u1E5A': 'R',
    '\u1E5C': 'R',
    '\u0156': 'R',
    '\u1E5E': 'R',
    '\u024C': 'R',
    '\u2C64': 'R',
    '\uA75A': 'R',
    '\uA7A6': 'R',
    '\uA782': 'R',
    '\u24C8': 'S',
    '\uFF33': 'S',
    '\u1E9E': 'S',
    '\u015A': 'S',
    '\u1E64': 'S',
    '\u015C': 'S',
    '\u1E60': 'S',
    '\u0160': 'S',
    '\u1E66': 'S',
    '\u1E62': 'S',
    '\u1E68': 'S',
    '\u0218': 'S',
    '\u015E': 'S',
    '\u2C7E': 'S',
    '\uA7A8': 'S',
    '\uA784': 'S',
    '\u24C9': 'T',
    '\uFF34': 'T',
    '\u1E6A': 'T',
    '\u0164': 'T',
    '\u1E6C': 'T',
    '\u021A': 'T',
    '\u0162': 'T',
    '\u1E70': 'T',
    '\u1E6E': 'T',
    '\u0166': 'T',
    '\u01AC': 'T',
    '\u01AE': 'T',
    '\u023E': 'T',
    '\uA786': 'T',
    '\uA728': 'TZ',
    '\u24CA': 'U',
    '\uFF35': 'U',
    '\u00D9': 'U',
    '\u00DA': 'U',
    '\u00DB': 'U',
    '\u0168': 'U',
    '\u1E78': 'U',
    '\u016A': 'U',
    '\u1E7A': 'U',
    '\u016C': 'U',
    '\u00DC': 'U',
    '\u01DB': 'U',
    '\u01D7': 'U',
    '\u01D5': 'U',
    '\u01D9': 'U',
    '\u1EE6': 'U',
    '\u016E': 'U',
    '\u0170': 'U',
    '\u01D3': 'U',
    '\u0214': 'U',
    '\u0216': 'U',
    '\u01AF': 'U',
    '\u1EEA': 'U',
    '\u1EE8': 'U',
    '\u1EEE': 'U',
    '\u1EEC': 'U',
    '\u1EF0': 'U',
    '\u1EE4': 'U',
    '\u1E72': 'U',
    '\u0172': 'U',
    '\u1E76': 'U',
    '\u1E74': 'U',
    '\u0244': 'U',
    '\u24CB': 'V',
    '\uFF36': 'V',
    '\u1E7C': 'V',
    '\u1E7E': 'V',
    '\u01B2': 'V',
    '\uA75E': 'V',
    '\u0245': 'V',
    '\uA760': 'VY',
    '\u24CC': 'W',
    '\uFF37': 'W',
    '\u1E80': 'W',
    '\u1E82': 'W',
    '\u0174': 'W',
    '\u1E86': 'W',
    '\u1E84': 'W',
    '\u1E88': 'W',
    '\u2C72': 'W',
    '\u24CD': 'X',
    '\uFF38': 'X',
    '\u1E8A': 'X',
    '\u1E8C': 'X',
    '\u24CE': 'Y',
    '\uFF39': 'Y',
    '\u1EF2': 'Y',
    '\u00DD': 'Y',
    '\u0176': 'Y',
    '\u1EF8': 'Y',
    '\u0232': 'Y',
    '\u1E8E': 'Y',
    '\u0178': 'Y',
    '\u1EF6': 'Y',
    '\u1EF4': 'Y',
    '\u01B3': 'Y',
    '\u024E': 'Y',
    '\u1EFE': 'Y',
    '\u24CF': 'Z',
    '\uFF3A': 'Z',
    '\u0179': 'Z',
    '\u1E90': 'Z',
    '\u017B': 'Z',
    '\u017D': 'Z',
    '\u1E92': 'Z',
    '\u1E94': 'Z',
    '\u01B5': 'Z',
    '\u0224': 'Z',
    '\u2C7F': 'Z',
    '\u2C6B': 'Z',
    '\uA762': 'Z',
    '\u24D0': 'a',
    '\uFF41': 'a',
    '\u1E9A': 'a',
    '\u00E0': 'a',
    '\u00E1': 'a',
    '\u00E2': 'a',
    '\u1EA7': 'a',
    '\u1EA5': 'a',
    '\u1EAB': 'a',
    '\u1EA9': 'a',
    '\u00E3': 'a',
    '\u0101': 'a',
    '\u0103': 'a',
    '\u1EB1': 'a',
    '\u1EAF': 'a',
    '\u1EB5': 'a',
    '\u1EB3': 'a',
    '\u0227': 'a',
    '\u01E1': 'a',
    '\u00E4': 'a',
    '\u01DF': 'a',
    '\u1EA3': 'a',
    '\u00E5': 'a',
    '\u01FB': 'a',
    '\u01CE': 'a',
    '\u0201': 'a',
    '\u0203': 'a',
    '\u1EA1': 'a',
    '\u1EAD': 'a',
    '\u1EB7': 'a',
    '\u1E01': 'a',
    '\u0105': 'a',
    '\u2C65': 'a',
    '\u0250': 'a',
    '\uA733': 'aa',
    '\u00E6': 'ae',
    '\u01FD': 'ae',
    '\u01E3': 'ae',
    '\uA735': 'ao',
    '\uA737': 'au',
    '\uA739': 'av',
    '\uA73B': 'av',
    '\uA73D': 'ay',
    '\u24D1': 'b',
    '\uFF42': 'b',
    '\u1E03': 'b',
    '\u1E05': 'b',
    '\u1E07': 'b',
    '\u0180': 'b',
    '\u0183': 'b',
    '\u0253': 'b',
    '\u24D2': 'c',
    '\uFF43': 'c',
    '\u0107': 'c',
    '\u0109': 'c',
    '\u010B': 'c',
    '\u010D': 'c',
    '\u00E7': 'c',
    '\u1E09': 'c',
    '\u0188': 'c',
    '\u023C': 'c',
    '\uA73F': 'c',
    '\u2184': 'c',
    '\u24D3': 'd',
    '\uFF44': 'd',
    '\u1E0B': 'd',
    '\u010F': 'd',
    '\u1E0D': 'd',
    '\u1E11': 'd',
    '\u1E13': 'd',
    '\u1E0F': 'd',
    '\u0111': 'd',
    '\u018C': 'd',
    '\u0256': 'd',
    '\u0257': 'd',
    '\uA77A': 'd',
    '\u01F3': 'dz',
    '\u01C6': 'dz',
    '\u24D4': 'e',
    '\uFF45': 'e',
    '\u00E8': 'e',
    '\u00E9': 'e',
    '\u00EA': 'e',
    '\u1EC1': 'e',
    '\u1EBF': 'e',
    '\u1EC5': 'e',
    '\u1EC3': 'e',
    '\u1EBD': 'e',
    '\u0113': 'e',
    '\u1E15': 'e',
    '\u1E17': 'e',
    '\u0115': 'e',
    '\u0117': 'e',
    '\u00EB': 'e',
    '\u1EBB': 'e',
    '\u011B': 'e',
    '\u0205': 'e',
    '\u0207': 'e',
    '\u1EB9': 'e',
    '\u1EC7': 'e',
    '\u0229': 'e',
    '\u1E1D': 'e',
    '\u0119': 'e',
    '\u1E19': 'e',
    '\u1E1B': 'e',
    '\u0247': 'e',
    '\u025B': 'e',
    '\u01DD': 'e',
    '\u24D5': 'f',
    '\uFF46': 'f',
    '\u1E1F': 'f',
    '\u0192': 'f',
    '\uA77C': 'f',
    '\u24D6': 'g',
    '\uFF47': 'g',
    '\u01F5': 'g',
    '\u011D': 'g',
    '\u1E21': 'g',
    '\u011F': 'g',
    '\u0121': 'g',
    '\u01E7': 'g',
    '\u0123': 'g',
    '\u01E5': 'g',
    '\u0260': 'g',
    '\uA7A1': 'g',
    '\u1D79': 'g',
    '\uA77F': 'g',
    '\u24D7': 'h',
    '\uFF48': 'h',
    '\u0125': 'h',
    '\u1E23': 'h',
    '\u1E27': 'h',
    '\u021F': 'h',
    '\u1E25': 'h',
    '\u1E29': 'h',
    '\u1E2B': 'h',
    '\u1E96': 'h',
    '\u0127': 'h',
    '\u2C68': 'h',
    '\u2C76': 'h',
    '\u0265': 'h',
    '\u0195': 'hv',
    '\u24D8': 'i',
    '\uFF49': 'i',
    '\u00EC': 'i',
    '\u00ED': 'i',
    '\u00EE': 'i',
    '\u0129': 'i',
    '\u012B': 'i',
    '\u012D': 'i',
    '\u00EF': 'i',
    '\u1E2F': 'i',
    '\u1EC9': 'i',
    '\u01D0': 'i',
    '\u0209': 'i',
    '\u020B': 'i',
    '\u1ECB': 'i',
    '\u012F': 'i',
    '\u1E2D': 'i',
    '\u0268': 'i',
    '\u0131': 'i',
    '\u24D9': 'j',
    '\uFF4A': 'j',
    '\u0135': 'j',
    '\u01F0': 'j',
    '\u0249': 'j',
    '\u24DA': 'k',
    '\uFF4B': 'k',
    '\u1E31': 'k',
    '\u01E9': 'k',
    '\u1E33': 'k',
    '\u0137': 'k',
    '\u1E35': 'k',
    '\u0199': 'k',
    '\u2C6A': 'k',
    '\uA741': 'k',
    '\uA743': 'k',
    '\uA745': 'k',
    '\uA7A3': 'k',
    '\u24DB': 'l',
    '\uFF4C': 'l',
    '\u0140': 'l',
    '\u013A': 'l',
    '\u013E': 'l',
    '\u1E37': 'l',
    '\u1E39': 'l',
    '\u013C': 'l',
    '\u1E3D': 'l',
    '\u1E3B': 'l',
    '\u017F': 'l',
    '\u0142': 'l',
    '\u019A': 'l',
    '\u026B': 'l',
    '\u2C61': 'l',
    '\uA749': 'l',
    '\uA781': 'l',
    '\uA747': 'l',
    '\u01C9': 'lj',
    '\u24DC': 'm',
    '\uFF4D': 'm',
    '\u1E3F': 'm',
    '\u1E41': 'm',
    '\u1E43': 'm',
    '\u0271': 'm',
    '\u026F': 'm',
    '\u24DD': 'n',
    '\uFF4E': 'n',
    '\u01F9': 'n',
    '\u0144': 'n',
    '\u00F1': 'n',
    '\u1E45': 'n',
    '\u0148': 'n',
    '\u1E47': 'n',
    '\u0146': 'n',
    '\u1E4B': 'n',
    '\u1E49': 'n',
    '\u019E': 'n',
    '\u0272': 'n',
    '\u0149': 'n',
    '\uA791': 'n',
    '\uA7A5': 'n',
    '\u01CC': 'nj',
    '\u24DE': 'o',
    '\uFF4F': 'o',
    '\u00F2': 'o',
    '\u00F3': 'o',
    '\u00F4': 'o',
    '\u1ED3': 'o',
    '\u1ED1': 'o',
    '\u1ED7': 'o',
    '\u1ED5': 'o',
    '\u00F5': 'o',
    '\u1E4D': 'o',
    '\u022D': 'o',
    '\u1E4F': 'o',
    '\u014D': 'o',
    '\u1E51': 'o',
    '\u1E53': 'o',
    '\u014F': 'o',
    '\u022F': 'o',
    '\u0231': 'o',
    '\u00F6': 'o',
    '\u022B': 'o',
    '\u1ECF': 'o',
    '\u0151': 'o',
    '\u01D2': 'o',
    '\u020D': 'o',
    '\u020F': 'o',
    '\u01A1': 'o',
    '\u1EDD': 'o',
    '\u1EDB': 'o',
    '\u1EE1': 'o',
    '\u1EDF': 'o',
    '\u1EE3': 'o',
    '\u1ECD': 'o',
    '\u1ED9': 'o',
    '\u01EB': 'o',
    '\u01ED': 'o',
    '\u00F8': 'o',
    '\u01FF': 'o',
    '\u0254': 'o',
    '\uA74B': 'o',
    '\uA74D': 'o',
    '\u0275': 'o',
    '\u01A3': 'oi',
    '\u0223': 'ou',
    '\uA74F': 'oo',
    '\u24DF': 'p',
    '\uFF50': 'p',
    '\u1E55': 'p',
    '\u1E57': 'p',
    '\u01A5': 'p',
    '\u1D7D': 'p',
    '\uA751': 'p',
    '\uA753': 'p',
    '\uA755': 'p',
    '\u24E0': 'q',
    '\uFF51': 'q',
    '\u024B': 'q',
    '\uA757': 'q',
    '\uA759': 'q',
    '\u24E1': 'r',
    '\uFF52': 'r',
    '\u0155': 'r',
    '\u1E59': 'r',
    '\u0159': 'r',
    '\u0211': 'r',
    '\u0213': 'r',
    '\u1E5B': 'r',
    '\u1E5D': 'r',
    '\u0157': 'r',
    '\u1E5F': 'r',
    '\u024D': 'r',
    '\u027D': 'r',
    '\uA75B': 'r',
    '\uA7A7': 'r',
    '\uA783': 'r',
    '\u24E2': 's',
    '\uFF53': 's',
    '\u00DF': 's',
    '\u015B': 's',
    '\u1E65': 's',
    '\u015D': 's',
    '\u1E61': 's',
    '\u0161': 's',
    '\u1E67': 's',
    '\u1E63': 's',
    '\u1E69': 's',
    '\u0219': 's',
    '\u015F': 's',
    '\u023F': 's',
    '\uA7A9': 's',
    '\uA785': 's',
    '\u1E9B': 's',
    '\u24E3': 't',
    '\uFF54': 't',
    '\u1E6B': 't',
    '\u1E97': 't',
    '\u0165': 't',
    '\u1E6D': 't',
    '\u021B': 't',
    '\u0163': 't',
    '\u1E71': 't',
    '\u1E6F': 't',
    '\u0167': 't',
    '\u01AD': 't',
    '\u0288': 't',
    '\u2C66': 't',
    '\uA787': 't',
    '\uA729': 'tz',
    '\u24E4': 'u',
    '\uFF55': 'u',
    '\u00F9': 'u',
    '\u00FA': 'u',
    '\u00FB': 'u',
    '\u0169': 'u',
    '\u1E79': 'u',
    '\u016B': 'u',
    '\u1E7B': 'u',
    '\u016D': 'u',
    '\u00FC': 'u',
    '\u01DC': 'u',
    '\u01D8': 'u',
    '\u01D6': 'u',
    '\u01DA': 'u',
    '\u1EE7': 'u',
    '\u016F': 'u',
    '\u0171': 'u',
    '\u01D4': 'u',
    '\u0215': 'u',
    '\u0217': 'u',
    '\u01B0': 'u',
    '\u1EEB': 'u',
    '\u1EE9': 'u',
    '\u1EEF': 'u',
    '\u1EED': 'u',
    '\u1EF1': 'u',
    '\u1EE5': 'u',
    '\u1E73': 'u',
    '\u0173': 'u',
    '\u1E77': 'u',
    '\u1E75': 'u',
    '\u0289': 'u',
    '\u24E5': 'v',
    '\uFF56': 'v',
    '\u1E7D': 'v',
    '\u1E7F': 'v',
    '\u028B': 'v',
    '\uA75F': 'v',
    '\u028C': 'v',
    '\uA761': 'vy',
    '\u24E6': 'w',
    '\uFF57': 'w',
    '\u1E81': 'w',
    '\u1E83': 'w',
    '\u0175': 'w',
    '\u1E87': 'w',
    '\u1E85': 'w',
    '\u1E98': 'w',
    '\u1E89': 'w',
    '\u2C73': 'w',
    '\u24E7': 'x',
    '\uFF58': 'x',
    '\u1E8B': 'x',
    '\u1E8D': 'x',
    '\u24E8': 'y',
    '\uFF59': 'y',
    '\u1EF3': 'y',
    '\u00FD': 'y',
    '\u0177': 'y',
    '\u1EF9': 'y',
    '\u0233': 'y',
    '\u1E8F': 'y',
    '\u00FF': 'y',
    '\u1EF7': 'y',
    '\u1E99': 'y',
    '\u1EF5': 'y',
    '\u01B4': 'y',
    '\u024F': 'y',
    '\u1EFF': 'y',
    '\u24E9': 'z',
    '\uFF5A': 'z',
    '\u017A': 'z',
    '\u1E91': 'z',
    '\u017C': 'z',
    '\u017E': 'z',
    '\u1E93': 'z',
    '\u1E95': 'z',
    '\u01B6': 'z',
    '\u0225': 'z',
    '\u0240': 'z',
    '\u2C6C': 'z',
    '\uA763': 'z',
    '\u0386': '\u0391',
    '\u0388': '\u0395',
    '\u0389': '\u0397',
    '\u038A': '\u0399',
    '\u03AA': '\u0399',
    '\u038C': '\u039F',
    '\u038E': '\u03A5',
    '\u03AB': '\u03A5',
    '\u038F': '\u03A9',
    '\u03AC': '\u03B1',
    '\u03AD': '\u03B5',
    '\u03AE': '\u03B7',
    '\u03AF': '\u03B9',
    '\u03CA': '\u03B9',
    '\u0390': '\u03B9',
    '\u03CC': '\u03BF',
    '\u03CD': '\u03C5',
    '\u03CB': '\u03C5',
    '\u03B0': '\u03C5',
    '\u03C9': '\u03C9',
    '\u03C2': '\u03C3'
  };

  return diacritics;
});

S2.define('h5table/types/column',[
	'jquery'
],function($){
	function Column(table, data) {
		var _data = $.extend({}, data);

		$.extend(true, this, Column.defaults, _data);

		this._table = table;
	}

	Column.defaults = {
		title: null,
		field: null,
		children: [],
		_parent: null,
		_table: null
	};

	Column.FieldRegex = /^(?:[^.\[\]]+(?:\[\s*\d+\s*\])*)(?:.[^.\[\]]+(?:\[\s*\d+\s*\])*)*$/;
	Column.FieldSegmentRegex = /^(?:([^.\[\]]+)|\[\s*(\d+)\s*\]).?/;

	var FieldSym = Symbol('field');
	Object.defineProperty(Column.prototype, 'field', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FieldSym] || this.title;
		},
		set: function(val) {
			if(!Column.FieldRegex.test(val))
				throw new Error('"'+val+'" is not a valid field name.');
			this[FieldSym] = val;
		}
	});

	var ChildSym = Symbol('children');
	Object.defineProperty(Column.prototype, 'children', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[ChildSym] || [];
		},
		set: function(val){
			val = (!val?[]:val); // Anything false-y becomes a blank array.
			if(!Array.isArray(val))
				throw new Error('Cannot set child columns to '+val);
			this[ChildSym] = val;

			var self = this;
			val.map(function(child){
				child._parent = self;
			});
		}
	});

	Column.prototype.getSpan = function() {
		var span = 1;
		if ( this.children.length>0 ) {
			span = 0;
			for (var i=0; i < this.children.length; i++) {
				span += this.children[i].getSpan();
			}
		}
		return span;
	};

	Column.prototype.addColumns = function(cols) {

		if(!$.isArray(cols)){
			cols = Array.prototype.slice.apply(arguments);
		}
		this.children = this.children.concat(cols);

	};
	Column.prototype.addColumn = Column.prototype.addColumns;

	Column.prototype.flatten = function(){
		return [this].concat(this.children.map(function(col){
			return col.flatten();
		}));
	};

	return Column;
});
S2.define('h5table/types/row',[
	'./column'
],function(Column, undefined){
	function Row(table, data) {
		this.table = table;
		this.data = data;
		this.children = [];
	}

	Row.prototype.setValue = function(column, value) {
		if(typeof column!=='string')
			column = column.field;
		if(!Column.FieldRegex.test(column))
			throw new Error('"'+column+'" is not a valid field name.')
		
		var parent = this.data,
		    i = 0,
		    fieldName = column;
		while(i < column.length){
			fieldName = column.slice(i);
			if(parent[fieldName]!=undefined){
				parent[fieldName] = value;
				return;
			}

			var fieldMatches = fieldName.match(Column.FieldSegmentRegex);
			if(fieldMatches==null)
				throw new Error('"'+column+'" is not a valid field name.  There is something wrong at position '+i+'.');

			var i1 = i+fieldMatches[0].length,
			    fieldName = fieldMatches[1] || fieldMatches[2];

			if(i1>=column.length){
				// this is last segment.  set it.
				parent[fieldName] = value;
				return;
			}
			
			if(parent[fieldName]==undefined)
				parent[fieldName] = {};
			parent = parent[fieldName];
			i=i1;

		}
		throw new Error('Could not set value '+value+' on column '+column);
	}

	Row.prototype.lookupValue = function(column) {
		if(typeof column!=='string')
			column = column.field;
		var fieldName = column;
		var fieldSegs = [];
		var obj = this.data;
		var seg = '';
		var segType = 'a property';  // 'a property' or 'an index'
		var i0 = 0;
		for (var i = 0; i<fieldName.length; i++) {
			var c = fieldName[i],
			    doLookup = true;
			switch(c) {
				case '.':
					if(segType!='a property')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the end of a property while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'a property';
					break;
				case '[':
					if(segType!='a property')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the start of an index while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'an index';
					break;
				case ']':
					if(segType!='an index')
						throw new Error('"'+fieldName+'" is not a valid field name.  Found the end of an index while looking for the end of '+segType+' at position '+i+'.');
					fieldSegs.push(seg);
					segType = 'a property';
					break;
				default:
					if(segType=='an index' && c.match(/^(\s|[0-9])$/)==null)
						throw new Error('"'+fieldName+'" is not a valid field name.  Found a non-integer and non-whitespace character in '+segType+' at position '+i+'.');
					seg += c;
					doLookup = false;
					break;
			}
			if(doLookup){
				obj = obj[seg];
				seg = '';
			}
		}
		return obj[seg];
	};

	Row.prototype.lookupValues = function(columns) {
		var row = this;
		return columns.map(function(column){
			if(typeof column!=='string')
				column = column.field;
			return row.lookupValue(column);
		});
	};

	Row.prototype.getAllValues = function(){
		return this.lookupValues(this.table.getAllColumns());
	};

	return Row;
});
S2.define('h5table/types/table',[
	'./column',
	'./row',
	'../utils'
],function(Column, Row, Utils){
	function Table() {
		this.columns = [];
		this.rows = [];
		
		Table.__super__.constructor.call(this);
	}

	Utils.Extend(Table, Utils.Observable);
	

	Table.prototype.getAllColumns = function(){
		return Array.prototype.concat.apply([], this.columns.map(function(col){
			return col.flatten();
		}));
	};

	Table.prototype.getColumnRows = function(filterFn){
		var rows = [],
		    queue = (filterFn?this.columns.filter(filterFn):this.columns).map(function(col){
		    	return {
		    		depth: 0,
		    		column: col
		    	}
		    });
		while(queue.length>0){
			var item = queue.shift();
			while(item.depth>=rows.length){
				rows.push([]);
			}
			rows[item.depth].push(item.column);
			item.column.children.forEach(function(child){
				queue.push({
					depth: item.depth+1,
					column: child
				});
			});

		}
		return rows;
	}

	return Table;
});
S2.define('h5table/data/base',[
  '../utils',
  '../types/table'
], function (Utils, Table) {
  function BaseAdapter ($element, options) {
    BaseAdapter.__super__.constructor.call(this);
  }

  Utils.Extend(BaseAdapter, Table);

  BaseAdapter.prototype.query = function (params, callback) {
    throw new Error('The `query` method must be defined in child classes.');
  };

  BaseAdapter.prototype.bind = function (container, $container) {
    // Can be implemented in subclasses
  };

  BaseAdapter.prototype.destroy = function () {
    // Can be implemented in subclasses
  };

  return BaseAdapter;
});

S2.define('h5table/data/htmlTable',[
  'jquery',
  './base',
  '../utils',
  '../types/table',
  '../types/column',
  '../types/row'
], function ($, BaseAdapter, Utils, Table, Column, Row) {

  function HtmlTableAdapter ($element, options) {
    this.$element = $element;
    this.options = options;

    if(!this.options.get('tableClass'))
      this.options.set('tableClass',this.$element.attr('class'));

    this.$head = $element.find('thead');
    this.$body = $element.find('tbody');

    this._cache = {};
    // we ignore the footer.

    console.log('HtmlTableAdapter::self', this);

    this.rowColumns = [];

    HtmlTableAdapter.__super__.constructor.call(this);

  };

  Utils.Extend(HtmlTableAdapter, BaseAdapter);

  HtmlTableAdapter.prototype.parseElement = function() {
    this.parseHeader();
    this.parseBody();
  }

  HtmlTableAdapter.prototype.parseHeader = function() {
    var headHtml = this.$head.html();
    if(this._cache.head==headHtml)
      return;

    var rows = this.$head.find('tr');
    var colMap = {};
    this.columns = [];
    this.rowColumns = [];
    
    for(var i = 0; i < rows.length; i++){
      var $row = $(rows[i]),
          cols = $row.find('td,th');

      colMap[i] = {};
      var k0 = 0;
      for(var j = 0; j < cols.length; j++){
        var $col = $(cols[j]),
            span = $col.attr('colspan') || 1,
            k1 = k0+span,
            colRepr = new Column(this, {title:$col.text()});
        $col.data('h5table-column', colRepr);
        if(i==rows.length-1){
          this.rowColumns.push(colRepr);
        }
        if(i==0){
          this.columns.push(colRepr);
        } else {
          colMap[i-1][k1].addColumn(colRepr);
        }
        for(var k = k0; k < k1; k++){
          colMap[i][k] = colRepr;
        }
      }
    }
    this._cache.head = headHtml;

    this.trigger('meta:updated', {
      table: this,
      meta: this.columns
    });
  };

  HtmlTableAdapter.prototype.parseBody = function() {
    var self = this,
        bodyHtml = this.$body.html();
    if(this._cache.body==bodyHtml)
      return;
    self.rows = [];
    this.$body.find('tr').each(function(index, el){
      var $row = $(el),
          $cols = $row.find('td,th');
      if($cols.length!=self.rowColumns.length)
        throw new Error('Expected '+self.rowColumns.length+' columns, but found '+$cols.length+' at row '+index+'.');
      var rowDef = new Row(self, {$row: $row});
      for(var j=0; j<$cols.length;j++){
        //debugger;
        var colDef = self.rowColumns[j];
        rowDef.setValue(colDef, $($cols[j]).text());
      }
      $row.data('h5table-row', rowDef);
      self.rows.push(rowDef);

    });

    this._cache.body = bodyHtml;
    
  };

  HtmlTableAdapter.prototype.bind = function (core, $element) {
    var self = this;

    core.on('query:updated', function(params){
      console.log('query:updated', arguments);
      self.query(params.query);
    });

    core.on('pagination:updated', function(params){

    });
  };

  HtmlTableAdapter.prototype.destroy = function () {
    // Remove anything added to child elements
    this.$element.find('*').each(function () {
      // Remove any custom data set by h5table
      $.removeData(this, 'data');
    });
  };

  HtmlTableAdapter.prototype.query = function (query) {
    this.parseElement();
    var results = query.applyTo(this.rows);
    console.log('HtmlTableAdapter::query', arguments, results);
    this.trigger('page:updated', {
      query: query,
      data: results
    });
  };

  return HtmlTableAdapter;
});

S2.define('h5table/data/array',[
  './htmlTable',
  '../utils',
  'jquery'
], function (HtmlTableAdapter, Utils, $) {
  function ArrayAdapter ($element, options) {
    var data = options.get('data') || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);

    this.addOptions(this.convertToOptions(data));
  }

  Utils.Extend(ArrayAdapter, HtmlTableAdapter);

  ArrayAdapter.prototype.select = function (data) {
    var $option = this.$element.find('option').filter(function (i, elm) {
      return elm.value == data.id.toString();
    });

    if ($option.length === 0) {
      $option = this.option(data);

      this.addOptions($option);
    }

    ArrayAdapter.__super__.select.call(this, data);
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.$element.find('option');
    var existingIds = $existing.map(function () {
      return self.item($(this)).id;
    }).get();

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem (item) {
      return function () {
        return $(this).val() == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if ($.inArray(item.id, existingIds) >= 0) {
        var $existingOption = $existing.filter(onlyItem(item));

        var existingData = this.item($existingOption);
        var newData = $.extend(true, {}, existingData, item);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        Utils.appendMany($option, $children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});

S2.define('h5table/data/ajax',[
  './array',
  '../utils',
  'jquery'
], function (ArrayAdapter, Utils, $) {
  function AjaxAdapter ($element, options) {
    this.ajaxOptions = this._applyDefaults(options.get('ajax'));

    if (this.ajaxOptions.processResults != null) {
      this.processResults = this.ajaxOptions.processResults;
    }

    AjaxAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(AjaxAdapter, ArrayAdapter);

  AjaxAdapter.prototype._applyDefaults = function (options) {
    var defaults = {
      data: function (params) {
        return $.extend({}, params, {
          q: params.term
        });
      },
      transport: function (params, success, failure) {
        var $request = $.ajax(params);

        $request.then(success);
        $request.fail(failure);

        return $request;
      }
    };

    return $.extend({}, defaults, options, true);
  };

  AjaxAdapter.prototype.processResults = function (results) {
    return results;
  };

  AjaxAdapter.prototype.query = function (params, callback) {
    var matches = [];
    var self = this;

    if (this._request != null) {
      // JSONP requests cannot always be aborted
      if ($.isFunction(this._request.abort)) {
        this._request.abort();
      }

      this._request = null;
    }

    var options = $.extend({
      type: 'GET'
    }, this.ajaxOptions);

    if (typeof options.url === 'function') {
      options.url = options.url.call(this.$element, params);
    }

    if (typeof options.data === 'function') {
      options.data = options.data.call(this.$element, params);
    }

    function request () {
      var $request = options.transport(options, function (data) {
        var results = self.processResults(data, params);

        if (self.options.get('debug') && window.console && console.error) {
          // Check to make sure that the response included a `results` key.
          if (!results || !results.results || !$.isArray(results.results)) {
            console.error(
              'h5table: The AJAX results did not return an array in the ' +
              '`results` key of the response.'
            );
          }
        }

        callback(results);
      }, function () {
        // TODO: Handle AJAX errors
      });

      self._request = $request;
    }

    if (this.ajaxOptions.delay && params.term !== '') {
      if (this._queryTimeout) {
        window.clearTimeout(this._queryTimeout);
      }

      this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
    } else {
      request();
    }
  };

  return AjaxAdapter;
});

S2.define('h5table/display/displayable',[
  'jquery',
  '../utils'
], function ($, Utils) {
	function Displayable(parent, $parentContainer) {
		this.parent = parent;
		this.$parentContainer = $parentContainer;
		this._children = [];
		Displayable.__super__.constructor.call(this);
	}

	Utils.Extend(Displayable, Utils.Observable);

	Displayable.prototype.init = function(){

	}

	Displayable.prototype.newChild = function(ChildClass, $container, initArgs, appendTo){
		var inst = new ChildClass(this.parent, $container || this.$parentContainer);
		initArgs = arguments.length>2 ? initArgs : [];
		inst.init.apply(inst, initArgs);
		this._children.push(inst);
		if(appendTo){
			if(!this[appendTo]){
				this[appendTo] = [];
			}
			this[appendTo].push(inst);
		}
		return inst;
	}

	Displayable.prototype.bind = function(core, $container){
		for(var i = 0; i<this._children.length;i++){
			this._children[i].bind(core, $container);
		}
	}

	Displayable.prototype.display = function(){

	}

	Displayable.prototype.destroy = function(){

	}

	Displayable.prototype.getCore = function(){
		// "Core" should always be the top parent.
		var core = this;
		while(core.parent){
			core = core.parent;
		}
		return core;
	}

	return Displayable;
});
S2.define('h5table/display/layout',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function Layout(parent, $parentContainer) {
		Layout.__super__.constructor.call(this, parent, $parentContainer);

		this.$prefix = $('<div class="h5table-prefix"></div>');
		this.$table = $('<div class="h5table-table"></div>');
		this.$suffix = $('<div class="h5table-suffix"></div>');
		
		this.$parentContainer.append(this.$prefix, this.$table, this.$suffix);

		console.log('Layout::constructor', this);

		var layoutOpts = parent.options.get('layout');

		this.newChild(layoutOpts.prefix, this.$prefix);
		this.newChild(layoutOpts.table, this.$table);
		this.newChild(layoutOpts.suffix, this.$suffix);
	}

	Utils.Extend(Layout, Displayable);

	Layout.prototype.bind = function(core, $container) {
		Layout.__super__.bind.call(this, core, $container);
	}

	Layout.prototype.display = function(table) {

	}

	Layout.prototype.destroy = function(){

	}

	return Layout;
});
S2.define('h5table/display/prefixBase',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function PrefixBase(parent, $parentContainer) {
		PrefixBase.__super__.constructor.call(this, parent, $parentContainer);
	}

	Utils.Extend(PrefixBase, Displayable);

	PrefixBase.prototype.bind = function(core, $container) {
		PrefixBase.__super__.bind.call(this, core, $container);
	}

	PrefixBase.prototype.display = function(){

	}

	PrefixBase.prototype.destroy = function(){

	}

	return PrefixBase;
});
S2.define('h5table/display/columnBase',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function ColumnBase(parent, $parentContainer) {
		ColumnBase.__super__.constructor.call(this, parent, $parentContainer);

		this.$cell = $('<th class="h5table-column"><span></span><div class="h5table-children"></div></th>');
		this.$label = this.$cell.find('span');
		this.$children = this.$cell.find('.h5table-children');
		this.$parentContainer.append(this.$cell);
	}

	Utils.Extend(ColumnBase, Displayable);

	ColumnBase.prototype.init = function(col) {
		console.log('init');
		this._col = col;
		this.$label.text(this._col.title);

		for(var i = 0; i < this._col.children.length; i++){
			this.newChild(ColumnBase, this.$children, [this._col.children[i]]);
		}
	}

	ColumnBase.prototype.bind = function(core, $container) {
		ColumnBase.__super__.bind.call(this, core, $container);
	}

	ColumnBase.prototype.display = function(){

	}

	ColumnBase.prototype.destroy = function(){

	}

	return ColumnBase;
});
S2.define('h5table/display/rowBase',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function RowBase(parent, $parentContainers) {
		RowBase.__super__.constructor.call(this, parent, $parentContainer);

	}

	Utils.Extend(RowBase, Displayable);

	RowBase.prototype.init = function(row) {
		this.row = row;
	}

	RowBase.prototype.bind = function(core, $container) {
		RowBase.__super__.bind.call(this, core, $container);
	}

	RowBase.prototype.display = function(){

	}

	RowBase.prototype.destroy = function(){

	}

	return RowBase;
});
S2.define('h5table/display/cellBase',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function CellBase(parent, $parentContainer) {
		CellBase.__super__.constructor.call(this, parent, $parentContainer);
	}

	Utils.Extend(CellBase, Displayable);

	CellBase.prototype.init = function(row, column) {
		
	}

	CellBase.prototype.bind = function(core, $container) {
		CellBase.__super__.bind.call(this, core, $container);
	}

	CellBase.prototype.display = function(){

	}

	CellBase.prototype.destroy = function(){

	}

	return CellBase;
});
S2.define('h5table/display/tableBase',[
  'jquery',
  '../utils',
  './displayable',
  './columnBase',
  './rowBase',
  './cellBase'
], function ($, Utils, Displayable, ColumnBase, RowBase, CellBase) {
	function TableBase(parent, $parentContainer) {
		TableBase.__super__.constructor.call(this, parent, $parentContainer);

		this.core = this.getCore();
		var tableClass = this.core.options.get('tableClass');
		this.$header = $(
			'<div class="h5table-header">' +
				'<div class="h5table-pinned">' +
					'<table class="'+tableClass+'">' +
						'<thead></thead>' +
					'</table>' +
				'</div>' +
				'<div class="h5table-viewport">' +
					'<div class="h5table-container">' +
						'<table class="'+tableClass+'">' +
							'<thead></thead>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>');
		this.$body = $(
			'<div class="h5table-body">' +
				'<div class="h5table-pinned">' +
					'<table class="'+tableClass+'">' +
						'<tbody></tbody>' +
					'</table>' +
				'</div>' +
				'<div class="h5table-viewport">' +
					'<div class="h5table-container">' +
						'<table class="'+tableClass+'">' +
							'<tbody></tbody>' +
						'</table>' +
					'</div>' +
				'</div>' +
			'</div>');
		this.$pinnedHeader = this.$header.find('.h5table-pinned thead');
		this.$regularHeader = this.$header.find('.h5table-viewport .h5table-container thead');

		this.$pinnedBody = this.$body.find('.h5table-pinned tbody');
		this.$regularBody = this.$body.find('.h5table-viewport .h5table-container tbody');

		this.$parentContainer.append(this.$header, this.$body);
	}

	Utils.Extend(TableBase, Displayable);

	TableBase.prototype.bind = function(core, $container) {
		TableBase.__super__.bind.call(this, core, $container);
		console.log('TableBase::bind', this, arguments);
		var self = this;

		core.on('query:updated', function(params){
			console.log('TableBase::bind(query.updated)', arguments);
		});
		core.on('pagination:updated', function(params){
			console.log('TableBase::bind(pagination.updated)', arguments);
		});
		core.on('meta:updated', function(params){
			self.updateMeta(params.table);
		});
		core.on('page:updated', function(params){
			self.updatePage(params.data, params.query);
		});
	}

	var ColumnEl = Symbol('$columnEl');

	TableBase.prototype.updateMeta = function(table){
		console.log('TableBase::updateMeta', arguments);
		var self = this;

		this.table = table;

		table.columns.map(function(col, ind, cols){
			var colEl = col[ColumnEl];
			var $to = col.pinned ? self.$pinnedHeader : self.$regularHeader;

			if(!colEl){
				colEl = self.newChild(ColumnBase, $to, [col], '_columns');
				col[ColumnEl] = colEl;
			}
			
			return colEl;
		});

		this.$body.css('paddingTop',this.$header.height());
	}

	TableBase.prototype.updatePage = function(data, query){
		console.log('TableBase::updatePage', arguments);
		

		var cols = this.table.columns;
		data.map(function(row, index, rows){

		});
	}

	TableBase.prototype.display = function(table, data, query){
		console.log('TableBase::display', arguments);
	}

	TableBase.prototype.destroy = function(){

	}

	return TableBase;
});
S2.define('h5table/display/suffixBase',[
  'jquery',
  '../utils',
  './displayable'
], function ($, Utils, Displayable) {
	function SuffixBase(options, $parentContainer) {
		SuffixBase.__super__.constructor.call(this, options, $parentContainer);

		this.numPages = 5;

		this.$left = $('<div class="left"></div>');
		this.$mid = $('<div class="mid"><nav><ul></ul></nav></div>');
		this.$pageList = this.$mid.find('ul');
		this.$right = $('<div class="right"></div>');

		this.$parentContainer.append(this.$left, this.$mid, this.$right);
	}

	Utils.Extend(SuffixBase, Displayable);

	SuffixBase.prototype.bind = function(core, $container) {
		SuffixBase.__super__.bind.call(this, core, $container);
		var self = this;

		core.on('query:updated', function(params){
			self.display(params.query.pagination);
		});

		core.on('pagination:updated', function(params){
			self.display(params.pagination);
		});

		this.$pageList.on('click','li>a[data-set-page-to]', function(evt){
			var $el = $(this),
			    setTo = $el.data('set-page-to');

			core.trigger('pagination:update', {
				curPage: setTo
			});
		});
	}

	SuffixBase.prototype.display = function(pagination){
		
		console.log('SuffixBase::display', arguments);
		var pagesBefore = Math.floor(this.numPages/2);
			absMinPage = pagination.firstPage,
		    absMaxPage = pagination.lastPage,
		    disMinPage = Math.max(absMinPage, pagination.curPage-pagesBefore),
		    disMaxPage = Math.min(absMaxPage+1, disMinPage+this.numPages);
		if(disMinPage>disMaxPage)
			throw new Error('The minimum page to display is greater than the maximum page to display!');

		this.$pageList.html('<li class="prev"><a href="#" aria-label="Previous" data-set-page-to="first"><span aria-hidden="true">&laquo;</span></a></li><li class="next"><a href="#" aria-label="Next" data-set-page-to="last"><span aria-hidden="true">&raquo;</span></a></li>');
		var $prevBtn = this.$pageList.find('.prev'),
		    $nextBtn = this.$pageList.find('.next');
		if(pagination.curPage==absMinPage)
			$prevBtn.addClass('disabled');
		if(pagination.curPage==absMaxPage)
			$nextBtn.addClass('disabled');
		var i = disMinPage;
		for(var i = disMinPage; i<disMaxPage; i++){
			$nextBtn.before('<li class="'+(i==pagination.curPage?'active':'')+'"><a href="#" data-set-page-to="'+i+'">'+(i+1)+'</a></li>');
		}
	}

	SuffixBase.prototype.destroy = function(){

	}

	return SuffixBase;
});
S2.define('h5table/i18n/en',[],function () {
  // English
  return {
    errorLoading: function () {
      return 'The results could not be loaded.';
    },
    inputTooLong: function (args) {
      var overChars = args.input.length - args.maximum;

      var message = 'Please delete ' + overChars + ' character';

      if (overChars != 1) {
        message += 's';
      }

      return message;
    },
    inputTooShort: function (args) {
      var remainingChars = args.minimum - args.input.length;

      var message = 'Please enter ' + remainingChars + ' or more characters';

      return message;
    },
    loadingMore: function () {
      return 'Loading more results…';
    },
    maximumSelected: function (args) {
      var message = 'You can only select ' + args.maximum + ' item';

      if (args.maximum != 1) {
        message += 's';
      }

      return message;
    },
    noResults: function () {
      return 'No results found';
    },
    searching: function () {
      return 'Searching…';
    }
  };
});

S2.define('h5table/defaults',[
  'jquery',
  'require',

  './utils',
  './translation',
  './diacritics',

  './data/htmlTable',
  './data/array',
  './data/ajax',

  './display/layout',
  './display/prefixBase',
  './display/tableBase',
  './display/suffixBase',

  './i18n/en'
], function ($, require,

             Utils, Translation, DIACRITICS,

             HtmlTableData, ArrayData, AjaxData,

             LayoutDisplay, PrefixDisplay, TableDisplay, SuffixDisplay,

             EnglishTranslation) {
  function Defaults () {
    this.reset();
  }

  Defaults.prototype.apply = function (options) {
    options = $.extend({}, this.defaults, options);

    if (options.dataAdapter == null) {
      if (options.ajax != null) {
        options.dataAdapter = AjaxData;
      } else if (options.data != null) {
        options.dataAdapter = ArrayData;
      } else {
        options.dataAdapter = HtmlTableData;
      }

    }

    if (options.displayAdapter == null) {
      options.displayAdapter = LayoutDisplay;
    }

    if (typeof options.language === 'string') {
      // Check if the language is specified with a region
      if (options.language.indexOf('-') > 0) {
        // Extract the region information if it is included
        var languageParts = options.language.split('-');
        var baseLanguage = languageParts[0];

        options.language = [options.language, baseLanguage];
      } else {
        options.language = [options.language];
      }
    }

    if ($.isArray(options.language)) {
      var languages = new Translation();
      options.language.push('en');

      var languageNames = options.language;

      for (var l = 0; l < languageNames.length; l++) {
        var name = languageNames[l];
        var language = {};

        try {
          // Try to load it with the original name
          language = Translation.loadPath(name);
        } catch (e) {
          try {
            // If we couldn't load it, check if it wasn't the full path
            name = this.defaults.amdLanguageBase + name;
            language = Translation.loadPath(name);
          } catch (ex) {
            // The translation could not be loaded at all. Sometimes this is
            // because of a configuration problem, other times this can be
            // because of how h5table helps load all possible translation files.
            if (options.debug && window.console && console.warn) {
              console.warn(
                'h5table: The language file for "' + name + '" could not be ' +
                'automatically loaded. A fallback will be used instead.'
              );
            }

            continue;
          }
        }

        languages.extend(language);
      }

      options.translations = languages;
    } else {
      var baseTranslation = Translation.loadPath(
        this.defaults.amdLanguageBase + 'en'
      );
      var customTranslation = new Translation(options.language);

      customTranslation.extend(baseTranslation);

      options.translations = customTranslation;
    }

    return options;
  };

  Defaults.prototype.reset = function () {
    function stripDiacritics (text) {
      // Used 'uni range + named function' from http://jsperf.com/diacritics/18
      function match(a) {
        return DIACRITICS[a] || a;
      }

      return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function matcher (params, data) {
      // Always return the object if there is nothing to compare
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do a recursive check for options with children
      if (data.children && data.children.length > 0) {
        // Clone the data object if there are children
        // This is required as we modify the object to remove any non-matches
        var match = $.extend(true, {}, data);

        // Check each child of the option
        for (var c = data.children.length - 1; c >= 0; c--) {
          var child = data.children[c];

          var matches = matcher(params, child);

          // If there wasn't a match, remove the object in the array
          if (matches == null) {
            match.children.splice(c, 1);
          }
        }

        // If any children matched, return the new object
        if (match.children.length > 0) {
          return match;
        }

        // If there were no matching children, check just the plain object
        return matcher(params, match);
      }

      var original = stripDiacritics(data.text).toUpperCase();
      var term = stripDiacritics(params.term).toUpperCase();

      // Check if the text contains the term
      if (original.indexOf(term) > -1) {
        return data;
      }

      // If it doesn't contain the term, don't return anything
      return null;
    }

    this.defaults = {
      amdBase: './',
      amdLanguageBase: './i18n/',
      debug: false,
      escapeMarkup: Utils.escapeMarkup,
      language: EnglishTranslation,
      theme: 'default',
      width: 'resolve',
      tableClass: '',
      pagination: {
        method: 'byPage',
        curPage: 0,
        pageSize: 20
      },
      layout: {
        prefix: PrefixDisplay,
        table: TableDisplay,
        suffix: SuffixDisplay
      }
    };
  };

  Defaults.prototype.set = function (key, value) {
    var camelKey = $.camelCase(key);

    var data = {};
    data[camelKey] = value;

    var convertedData = Utils._convertData(data);

    $.extend(this.defaults, convertedData);
  };

  var defaults = new Defaults();

  return defaults;
});

S2.define('h5table/options',[
  'require',
  'jquery',
  './defaults',
  './utils'
], function (require, $, Defaults, Utils) {
  function Options (options, $element) {
    this.options = options;

    if ($element != null) {
      this.fromElement($element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function ($e) {
    var excludedData = ['h5table'];

    if (this.options.multiple == null) {
      this.options.multiple = $e.prop('multiple');
    }

    if (this.options.disabled == null) {
      this.options.disabled = $e.prop('disabled');
    }

    if (this.options.language == null) {
      if ($e.prop('lang')) {
        this.options.language = $e.prop('lang').toLowerCase();
      } else if ($e.closest('[lang]').prop('lang')) {
        this.options.language = $e.closest('[lang]').prop('lang');
      }
    }

    if (this.options.dir == null) {
      if ($e.prop('dir')) {
        this.options.dir = $e.prop('dir');
      } else if ($e.closest('[dir]').prop('dir')) {
        this.options.dir = $e.closest('[dir]').prop('dir');
      } else {
        this.options.dir = 'ltr';
      }
    }

    $e.prop('disabled', this.options.disabled);

    var dataset = {};

    // Prefer the element's `dataset` attribute if it exists
    // jQuery 1.x does not correctly handle data attributes with multiple dashes
    if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
      dataset = $.extend(true, {}, $e[0].dataset, $e.data());
    } else {
      dataset = $e.data();
    }

    var data = $.extend(true, {}, dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if ($.inArray(key, excludedData) > -1) {
        continue;
      }

      if ($.isPlainObject(this.options[key])) {
        $.extend(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});

S2.define('h5table/keys',[

], function () {
  var KEYS = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
  };

  return KEYS;
});

S2.define('h5table/types/pagination',[
	'../utils'
],function(Utils){

	function Pagination(core, options) {
		console.log('Pagination::__init__', options);
		this.core = core;
		this.options = options.get('pagination');

		this.curPage = 0; // 0-based!
		this.pageSize = 0;
		this._offset=0;
		this.fromRow=0;
		this.endRow=0;

		this.lastRow=Number.POSITIVE_INFINITY;
		this.lastPage=Number.POSITIVE_INFINITY;

		switch(this.options.method){
			case 'byPage':
				this.byPage(this.options.curPage, this.options.pageSize);
				break;
			case 'byRange':
				this.byRange(this.options.startRow, this.options.endRow, true);
				break;
			default:
				throw new Error('"'+this.options.method+'" is not a valid pagination method.');
		}

		Pagination.__super__.constructor.call(this);
	}

	Utils.Extend(Pagination, Utils.Observable);

	Pagination.prototype.bind = function(core) {
		var self = this;

		console.log('Pagination::bind', self, arguments);
		core.on('pagination:update', function(params){
			console.log('Pagination::bind(pagination:update)', self, arguments);
			if(params.curPage){
				var curPage = params.curPage;
				if(typeof params.curPage == 'string') {
					switch(curPage.toLowerCase()){
						case 'prev':
							curPage = Math.max(curPage, self.firstPage);
							break;
						case 'next':
							curPage = Math.min(curPage, self.lastPage);
							break;
						case 'first':
							curPage = self.firstPage;
							break;
						case 'last':
							curPage = self.lastPage;
							break;
						default:
							throw new Error('"'+curPage+'" is not a valid page name.');
							break;
					}
				}

				if(curPage != self.curPage && self.firstPage <= curPage && curPage <= self.lastPage) {
					self.setCurPage(params.curPage);
				}
			}
		});
	}

	Pagination.prototype.byPage = function (curPage, pageSize, offset) {
		this.curPage = curPage;
		
		if(arguments.length>1)
			this.pageSize = pageSize;

		if(arguments.length>2)
			this._offset = offset;
		else
			this._offset = 0;

		this.fromRow = this._offset + (this.curPage) * this.pageSize;
		this.endRow = this._offset + (this.curPage+1) * this.pageSize-1;
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.byRange = function (startRow, endRow, forceIt) {
		forceIt = arguments.length>2 ? forceIt : false;
		if (startRow < 0 ) {
			throw new Error("Having startRow="+startRow+" and endRow="+ endRow+" makes absolutely no sense.  Check your maths!");
		}
		if (startRow > endRow) {
			throw new Error("Having startRow="+startRow+" and endRow="+ endRow+" makes absolutely no sense.  Check your maths!");
		}
		var pageSize = endRow - startRow + 1;
		var curPage = Math.floor(startRow/pageSize);
		var offset = startRow % pageSize;
		offset += (offset<0) ? pageSize : 0;

		if (forceIt || ( this._offset == offset )) {
			this._offset = offset;
			this.startRow = startRow;
			this.endRow = endRow;
			this.pageSize = pageSize;
			this.curPage = curPage;
		} else {
			throw new Error("startRow="+startRow+" and endRow="+ endRow+" don't land on page boundaries.");
		}
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.setCurPage = function(curPage){ // n is 
		this.byPage(curPage);
	}

	Pagination.prototype.prevPage = function(){
		this.byPage(this.curPage-1);
	}

	Pagination.prototype.nextPage = function(){
		this.byPage(this.curPage+1);
	}

	Pagination.prototype.setMaxNumRows = function(maxRows){
		this.lastRow = maxRows;
		this.lastPage = Math.ceil((maxRows - this._offset)/this.pageSize);

		this.trigger('pagination:changed', {
			pagination: this
		});
	}

	Pagination.prototype.setMaxPage = function(maxPage){
		this.lastPage = maxPage;
		this.lastRow = this._offset+(maxPage*this.pageSize);
		this.trigger('pagination:updated', {
			pagination: this
		});
	}

	Pagination.prototype.applyTo = function(rows){
		var self = this;
		var page = rows.filter(function(row, index, arr){
			return self.fromRow <= index && index <= self.endRow;
		});
		console.log('Pagination::applyTo', this, rows, page);
		return page;
	}

	Object.defineProperty(Pagination.prototype, 'firstPage', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this._offset==0?0:-1;
		}
	});

	return Pagination;
});
S2.define('h5table/types/filterGroup',[
], function(){
	function FilterGroup(type, filters) {
		this.type = arguments.length>0?type:FilterGroup.Types.and;
		Array.prototype.push.apply(this, (arguments.length>1?filters:[]));
	}

	FilterGroup.Types = {
		'and': function(item) {
			if(!(this.length>0))
				throw new Error('You cannot apply "and" to zero items.');
			for(var i = 0; i < this.length; i++){
				if(!this[i].matches(item))
					return false;
			}
			return true;
		},
		'or': function(item) {
			if(!(this.length>0))
				throw new Error('You cannot apply "or" to zero items.');
			for (var i = 0; i < this.length; i++) {
				if(this[i].matches(item))
					return true;
			}
			return false;
		},
		'xor': function(item) {
			if(!(this.length===2))
				throw new Error('You can only apply "xor" to exactly 2 items.');
			var aMatches = this[0].matches(item);
			var bMatches = this[1].matches(item);
			return ((aMatches && !bMatches) || (!aMatches && bMatches));
		}
	};

	FilterGroup.lookupType = function(type) {
		for(var key in FilterGroup.Types) {
			if(type == key || type==FilterGroup.Types[key])
				return key;
		}
		throw new Error('"'+type+'" is not a valid filter group type.');
	}

	FilterGroup.prototype = new Array();

	var FilterGroupType = Symbol('type');
	Object.defineProperty(FilterGroup.prototype, 'type', {
		enumerable: false,
		configurable: false,
		get: function(){
			return this[FilterGroupType];
		},
		set: function(val){
			this[FilterGroupType] = FilterGroup.lookupType(val);
		}
	});

	FilterGroup.prototype.push = function(){
		if(this.type==FilterGroup.Types.xor && this.length + arguments.length != 2){
			throw new Error('Xor FilterGroups must have exactly 2 items!');
		}
		Array.prototype.push.apply(this, Array.prototype.slice.apply(arguments));
	}

	FilterGroup.prototype.concat = function(values){
		return new FilterGroup(this.type, Array.prototype.concat.call(this, values));
	}

	FilterGroup.prototype.and = function() {
		var filters = Array.prototype.slice.apply(arguments);
		if(this.type===FilterGroup.types.and) {
			return this.concat(filters);
		} else {
			return new FilterGroup(FilterGroup.Types.and, [this].concat(filters));
		}
	}

	FilterGroup.prototype.or = function() {
		var filters = Array.prototype.slice.apply(arguments);
		if (this.type===FilterGroup.types.or) {
			return this.concat(filters);
		} else {
			return new FilterGroup(FilterGroup.Types.or, [this].concat(filters));
		}
	}

	FilterGroup.prototype.xor = function(other) {
		return new FilterGroup(FilterGroup.Types.xor, [this, other]);
	}

	FilterGroup.prototype.matches = function(row) {
		return this.type.apply(this, row);
	}

	FilterGroup.prototype.filter = function(rows) {
		var self = this;
		return rows.filter(function(row, index, arr){
			return self.matches(row);
		});
	}

	return FilterGroup;
});
S2.define('h5table/types/query',[
	'./pagination',
	'./filterGroup',
	'../utils'
],function(Pagination, FilterGroup, Utils){

	function Query(core, options){
		this.core = core;
		this.options = options;
		this.pagination = new Pagination(this, options);
		this.search = null;
		this.sortOrders = [];

		Query.__super__.constructor.call(this);
	}

	Utils.Extend(Query, Utils.Observable);

	Query.prototype._registerEvents = function() {
		var self = this;

		this.pagination.on('pagination:updated', function(params){
			console.log('Query::_registerEvents(pagination.updated)', self, arguments);
			
			self.trigger('pagination:updated', params);
		});
	}

	Query.prototype.bind = function(core) {
		var self = this;

		this.pagination.bind(core);

		this._registerEvents();
	}

	Query.prototype.matches = function(row) {
		if(this.search == null)
			return true;
		return this.search.matches(row);
	}

	Query.prototype.filter = function(rows) {
		return rows.filter(this.matches);
	}

	Query.prototype.paginate = function(rows) {
		return this.pagination.applyTo(rows);
	}

	Query.prototype.applyTo = function(rows) {
		return this.paginate(this.sort(this.filter(rows)));
	}

	Query.prototype.sort = function(rows) {
		var self = this;
		if(self.sortOrders.length==0)
			return rows;
		return rows.sort(function(row1, row2) {
			for(var i = 0; i<self.sortOrders.length; i++){
				var c = self.sortOrders[i].compare(row1, row2);
				if(c!=0)
					return c;
			}
			return 0;
		});
	}

	return Query;
});
S2.define('h5table/core',[
  'jquery',
  './options',
  './utils',
  './keys',
  './types/query'
], function ($, Options, Utils, KEYS, Query) {
  function h5table($element, options) {
    if ($element.data('h5table') != null) {
      $element.data('h5table').destroy();
    }

    this.$element = $element;

    this.id = this._generateId($element);

    options = options || {};

    this.options = new Options(options, $element);

    h5table.__super__.constructor.call(this);

    // Set up containers and adapters

    this.query = new Query(this, this.options);

    var DataAdapter = this.options.get('dataAdapter');
    this.dataAdapter = new DataAdapter($element, this.options);

    
    this.render();

    var DisplayAdapter = this.options.get('displayAdapter');
    this.displayAdapter = new DisplayAdapter(this, this.$container);

    this._placeContainer(this.$container);



    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerEvents();

    // Hide the original select
    $element.addClass('h5table-hidden-accessible');
    $element.attr('aria-hidden', 'true');

    // Synchronize any monitored attributes
    this._syncAttributes();

    $element.data('h5table', this);

    // Set the initial state
    self.trigger('query:updated', {
      query: self.query
    });
  };

  Utils.Extend(h5table, Utils.Observable);

  h5table.prototype.parent = null;

  h5table.prototype._generateId = function ($element) {
    var id = '';

    if ($element.attr('id') != null) {
      id = $element.attr('id');
    } else if ($element.attr('name') != null) {
      id = $element.attr('name') + '-' + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = 'h5table-' + id;

    return id;
  };

  h5table.prototype._placeContainer = function ($container) {
    $container.insertAfter(this.$element);
  };

  h5table.prototype._bindAdapters = function () {
    this.query.bind(this);
    this.dataAdapter.bind(this, this.$element);
    this.displayAdapter.bind(this, this.$container);
  };

  h5table.prototype._registerDomEvents = function () {
    var self = this;

    this.$element.on('change.h5table', function () {
      self.dataAdapter.current(function (data) {
        self.trigger('selection:update', {
          data: data
        });
      });
    });

    this._sync = Utils.bind(this._syncAttributes, this);

    if (this.$element[0].attachEvent) {
      this.$element[0].attachEvent('onpropertychange', this._sync);
    }

    var observer = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    ;

    if (observer != null) {
      this._observer = new observer(function (mutations) {
        $.each(mutations, self._sync);
      });
      this._observer.observe(this.$element[0], {
        attributes: true,
        subtree: false
      });
    } else if (this.$element[0].addEventListener) {
      this.$element[0].addEventListener('DOMAttrModified', self._sync, false);
    }
  };

  h5table.prototype._registerDataEvents = function () {
    var self = this;

    this.query.on('*', function(name, params){
      console.log('h5table::_registerDataEvents(query.*)', this, arguments);
      self.trigger(name, params);
    });

    this.dataAdapter.on('*', function (name, params) {
      console.log('h5table::_registerDataEvents(dataAdapter.*)', this, arguments);
      self.trigger(name, params);
    });

    this.displayAdapter.on('*', function(name, params) {
      console.log('h5table::_registerDataEvents(displayAdapter.*)', this, arguments);
      self.trigger(name, params);
    });
  };

  h5table.prototype._registerEvents = function () {
    var self = this;

    
  };

  h5table.prototype._syncAttributes = function () {
    this.options.set('disabled', this.$element.prop('disabled'));

    if (this.options.get('disabled')) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger('disable', {});
    } else {
      this.trigger('enable', {});
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  /*
  h5table.prototype.trigger = function (name, args) {
    var actualTrigger = h5table.__super__.trigger;
    var preTriggerMap = {
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };
  */

  h5table.prototype.destroy = function () {
    this.$container.remove();

    if (this.$element[0].detachEvent) {
      this.$element[0].detachEvent('onpropertychange', this._sync);
    }

    if (this._observer != null) {
      this._observer.disconnect();
      this._observer = null;
    } else if (this.$element[0].removeEventListener) {
      this.$element[0]
        .removeEventListener('DOMAttrModified', this._sync, false);
    }

    this._sync = null;

    this.$element.off('.h5table');
    this.$element.attr('tabindex', this.$element.data('old-tabindex'));

    this.$element.removeClass('h5table-hidden-accessible');
    this.$element.attr('aria-hidden', 'false');
    this.$element.removeData('h5table');

    this.dataAdapter.destroy();

    this.dataAdapter = null;
  };

  h5table.prototype.render = function () {
    var $container = $(
      '<div class="h5table h5table-container '+this.options.get('tableClass')+'"></div>'
    );

    $container.attr('dir', this.options.get('dir'));

    this.$container = $container;

    this.$container.addClass('h5table-container--' + this.options.get('theme'));

    $container.data('element', this.$element);

    return $container;
  };

  return h5table;
});

S2.define('jquery-mousewheel',[
  'jquery'
], function ($) {
  // Used to shim jQuery.mousewheel for non-full builds.
  return $;
});

S2.define('jquery.h5table',[
  'jquery',
  'jquery-mousewheel',

  './h5table/core',
  './h5table/defaults'
], function ($, _, h5table, Defaults) {
  if ($.fn.h5table == null) {
    // All methods that should return the element
    var thisMethods = ['destroy'];

    $.fn.h5table = function (options) {
      options = options || {};

      if (typeof options === 'object') {
        this.each(function () {
          var instanceOptions = $.extend(true, {}, options);
          var $this = $(this);
          var instance = new h5table($this, instanceOptions);
          $this.data('h5table', instance);
        });

        return this;
      } else if (typeof options === 'string') {
        var ret;

        this.each(function () {
          var instance = $(this).data('h5table');

          if (instance == null && window.console && console.error) {
            console.error(
              'The h5table(\'' + options + '\') method was called on an ' +
              'element that is not using h5table.'
            );
          }

          var args = Array.prototype.slice.call(arguments, 1);

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if ($.inArray(options, thisMethods) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error('Invalid arguments for h5table: ' + options);
      }
    };
  }

  if ($.fn.h5table.defaults == null) {
    $.fn.h5table.defaults = Defaults;
  }

  return h5table;
});

  // Return the AMD loader configuration so it can be used outside of this file
  return {
    define: S2.define,
    require: S2.require
  };
}());

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var h5table = S2.require('jquery.h5table');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows h5table to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.h5table.amd = S2;

  // Return the h5table instance for anyone who is importing it.
  return h5table;
}));
