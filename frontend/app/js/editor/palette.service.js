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
    .module('bonitasoft.designer.services')
    .service('paletteService', paletteService);

  /**
   * Components Service manage ui-designer components
   * handle registration and initialisation.
   *
   * Create a new scope with a properties object derived from user entered propertyValues.
   * This allow to bind propertyValues to widget properties and keep a WYSWYG approach in editor while editing widget properties
   */
  function paletteService() {

    var componentsMap = {};
    return {
      reset: reset,
      getSections: getSections,
      register: register,
      init: init
    };

    function reset() {
      componentsMap = {};
    }

    function getSections() {
      var sections = Object.keys(componentsMap).reduce(function (sections, item) {
        var sectionName = componentsMap[item].sectionName;
        sections[sectionName] = sections[sectionName] || {
          name: sectionName,
          order: componentsMap[item].sectionOrder,
          widgets: []
        };

        sections[sectionName].widgets = sections[sectionName].widgets.concat(componentsMap[item]);
        return sections;
      }, {});

      return Object.keys(sections).map(function (key) {
        return sections[key];
      });
    }

    function register(items) {
      componentsMap = items.reduce(function (components, item) {
        components[item.component.id] = item;
        return components;
      }, componentsMap);
    }

    function init(component, parentRow) {
      // container have no id, only a type
      var id = component.id || component.type;

      if (!componentsMap.hasOwnProperty(id)) {
        throw new Error('Component ' + id + ' has not been registered');
      }
      var fnInit = componentsMap[id].init;
      fnInit(component, parentRow);
    }

  }
})();
