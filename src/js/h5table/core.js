define([
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
