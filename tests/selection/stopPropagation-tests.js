module('Selection containers - Stoping event propagation');

var SingleSelection = require('h5table/selection/single');
var StopPropagation = require('h5table/selection/stopPropagation');

var $ = require('jquery');
var Options = require('h5table/options');
var Utils = require('h5table/utils');

var CutomSelection = Utils.Decorate(SingleSelection, StopPropagation);

var options = new Options();

test('click event does not propagate', function (assert) {
  expect(1);

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var selection = new CutomSelection($('#qunit-fixture select'), options);

  var $selection = selection.render();
  selection.bind(container, $container);

  $container.append($selection);
  $container.on('click', function () {
    assert.ok(false, 'The click event should have been stopped');
  });

  $selection.trigger('click');

  assert.ok(true, 'Something went wrong if this failed');
});
