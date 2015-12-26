module('Dropdown - Stoping event propagation');

var Dropdown = require('h5table/dropdown');
var StopPropagation = require('h5table/dropdown/stopPropagation');

var $ = require('jquery');
var Options = require('h5table/options');
var Utils = require('h5table/utils');

var CustomDropdown = Utils.Decorate(Dropdown, StopPropagation);

var options = new Options();

test('click event does not propagate', function (assert) {
  expect(1);

  var $container = $('#qunit-fixture .event-container');
  var container = new MockContainer();

  var dropdown = new CustomDropdown($('#qunit-fixture select'), options);

  var $dropdown = dropdown.render();
  dropdown.bind(container, $container);

  $container.append($dropdown);
  $container.on('click', function () {
    assert.ok(false, 'The click event should have been stopped');
  });

  $dropdown.trigger('click');

  assert.ok(true, 'Something went wrong if this failed');
});
