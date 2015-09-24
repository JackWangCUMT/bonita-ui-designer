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
    .module('bonitasoft.designer.editor')
    .service('whiteboardComponentWrapper', whiteboardComponentWrapper);

  function whiteboardComponentWrapper(components, componentId) {

    var service = {
      wrapPage: wrapPage,
      wrapWidget: wrapWidget,
      wrapContainer: wrapContainer,
      wrapTabsContainer: wrapTabsContainer,
      wrapTab: wrapTab,
      wrapFormContainer: wrapFormContainer
    };
    return service;

    /**
     * @internal
     * Initializes a row coming from the server.
     */
    function wrapRow(container, row) {
      var parentContainerRow = {
        container: container,
        row: row
      };
      angular.forEach(row, function (component) {
        components.init(component, parentContainerRow);
      });
    }


    function wrapPage(page) {
      page.rows.forEach(wrapRow.bind(null, page));
    }


    /**
     * Initialize (mutate) a component to be used in whiteboard
     * component can come from a page definition or from createWidget
     * @param  {Object} widget    Widget configuration
     * @param  {Object} element      Widget instance
     * @param  {Object} parentRow parent row container
     */
    function wrapWidget(widget, element, parentRow) {
      // The $$ prefix makes sure the attribute is not serialized to JSON
      // $$id is only used by e2e tests
      // $$widget is a direct reference to the widget identified by widgetId. Only widgetId needs to be serialized
      // $$templateUrl is  used in container.html to display the component
      // $$parentContainerRow is a backward reference to the containing container and row, which is only useful in the
      // editor, but must not and can not be serialized (cyclic reference)
      return angular.extend(element, {
        $$id: componentId.getNextId('component'),
        $$widget: angular.copy(widget), // make sure to render all properties every time we select a component
        $$templateUrl: 'js/editor/workspace/component-template.html',
        $$propertiesTemplateUrl: 'js/editor/properties-panel/component-properties-template.html',
        $$parentContainerRow: parentRow
      });
    }

    function wrapContainer(container, element, parentRow) {
      var component = angular.extend(element, {
        $$id: componentId.getNextId('container'),
        $$widget: angular.copy(container),
        $$templateUrl: 'js/editor/workspace/container-template.html',
        $$propertiesTemplateUrl: 'js/editor/properties-panel/container-properties-template.html',
        $$parentContainerRow: parentRow
      });

      component.rows.forEach(wrapRow.bind(null, element));
      return component;
    }

    function wrapTabsContainer(tabContainer, element, parentRow) {
      var component = angular.extend(element, {
        $$id: componentId.getNextId('tabsContainer'),
        $$widget: angular.copy(tabContainer),
        $$templateUrl: 'js/editor/workspace/tabs-container-template.html',
        $$propertiesTemplateUrl: 'js/editor/properties-panel/component-properties-template.html',
        $$parentContainerRow: parentRow
      });

      element.tabs.forEach(function (tab) {
        service.wrapTab(tab, element);
        service.wrapContainer({}, tab.container);
      });

      return component;
    }

    function wrapTab(tab, tabsContainer) {
      angular.extend(tab, {
          $$parentTabsContainer: tabsContainer,
          $$widget: {
            name: 'Tab'
          },
          $$propertiesTemplateUrl: 'js/editor/properties-panel/tab-properties-template.html'
        }
      );
    }

    function wrapFormContainer(formContainer, element, parentRow) {
      var component = angular.extend(element, {
        $$id: componentId.getNextId('formContainer'),
        $$widget: angular.copy(formContainer),
        $$templateUrl: 'js/editor/workspace/form-container-template.html',
        $$propertiesTemplateUrl: 'js/editor/properties-panel/component-properties-template.html',
        $$parentContainerRow: parentRow
      });

      service.wrapContainer({}, element.container);
      return component;
    }

  }
})
();
