var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'ipymsa',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'ipymsa',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

