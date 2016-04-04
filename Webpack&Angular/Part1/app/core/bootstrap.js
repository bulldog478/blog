/*jshint browser:true */
'use strict';

require('angular');
// load the main app file
require('./vendor')();
var appModule = require('../index');
// replaces ng-app="appName"
angular.element(document).ready(function () {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});