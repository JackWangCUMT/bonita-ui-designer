/**
 * Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(function () {

  'use strict';

  angular
    .module('bonitasoft.designer.factories')
    .factory('commonParams', commonParamsService);

  function commonParamsService(gettext) {

    var common = [
      {
        label: gettext('CSS classes'),
        caption: gettext('Space-separated list'),
        name: 'cssClasses',
        type: 'string',
        defaultValue: '',
        bond: 'expression',
        help: gettext('Any accessible CSS classes. By default UI Designer comes with Bootstrap http://getbootstrap.com/css/#helper-classes')
      },
      {
        label: gettext('Hidden'),
        name: gettext('hidden'),
        type: 'boolean',
        defaultValue: false,
        bond: 'expression'
      }
    ];

    return {
      getDefinitions: getDefinitions,
      getDefaultValues: getDefaultValues
    };

    /**
     * Return custom params for a container or commons params for all
     * @return {Object}
     */
    function getDefinitions() {
      return common;
    }

    /**
     * Return custom properties as a container or global:
     * {
       *   type: 'constant',
       *   value: item.defaultValue
       * }
     *
     * @return {Object}
     */
    function getDefaultValues() {
      var propertyValues = {},
        data = getDefinitions();

      data.forEach(function (property) {
        propertyValues[property.name] = {
          type: property.bond === 'expression' ? 'constant' : property.bond,
          value: property.defaultValue
        };
      });

      return propertyValues;
    }

  }
})();
