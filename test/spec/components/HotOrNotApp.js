'use strict';

describe('Main', function () {
  var React = require('react/addons');
  var HotOrNotApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    HotOrNotApp = require('components/HotOrNotApp.js');
    component = React.createElement(HotOrNotApp);
  });

  it('should create a new instance of HotOrNotApp', function () {
    expect(component).toBeDefined();
  });
});
