/**
 * jQuery Easy Confirm Dialog plugin 1.4
 *
 * Copyright (c) 2010 Emil Janitzek (http://projectshadowlight.org)
 * Based on Confirm 1.3 by Nadia Alramli (http://nadiana.com/)
 *
 * Samples and instructions at: 
 * http://projectshadowlight.org/jquery-easy-confirm-dialog/
 *
 * This script is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free 
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 */
(function($) {
    $.easyconfirm = {};
    $.easyconfirm.locales = {};
    $.easyconfirm.locales.enUS = {
        title: 'Are you sure?',
        text: 'Are you sure that you want to perform this action?',
        button: ['Cancel', 'OK'],
        closeText: 'close'
    };
    $.easyconfirm.locales.svSE = {
        title: 'Är du säker?',
        text: 'Är du säker på att du vill genomföra denna åtgärden?',
        button: ['Avbryt', 'OK'],
        closeText: 'stäng'
    };
    $.easyconfirm.locales.itIT = {
        title: 'Sei sicuro?',
        text: 'Sei sicuro di voler compiere questa azione?',
        button: ['Annulla', 'Conferma'],
        closeText: 'chiudi'
    };

    $.fn.easyconfirm = function(options) {

        var _attr = $.fn.attr;

        $.fn.attr = function(attr, value) {
            // Let the original attr() do its work.
            var returned = _attr.apply(this, arguments);

            // Fix for jQuery 1.6+
            if (attr == 'title' && returned === undefined) 
                returned = '';

            return returned;
        };

        var options = jQuery.extend({
            eventType: 'click',
            icon: 'help',
            minHeight: 120,
            maxHeight: 200
        }, options);

        var locale = jQuery.extend({}, $.easyconfirm.locales.enUS, options.locale);

        // Shortcut to eventType.
        var type = options.eventType;

        return this.each(function() {
            var target = this;
            var $target = jQuery(target);

            // If no events present then and if there is a valid url, then trigger url change
            var urlClick = function() {
                    if (hasValidUrl(target.href)) {
                        document.location = target.href;
                    }
                },
                hasValidUrl = function(href) {
                    if (href) {
                        var length = String(href).length;
                        if (href.substring(length - 1, length) != '#') 
                            return true;
                    }
                    
                    return false;
                },
                // If any handlers where bind before triggering, lets save them and add them later
                saveHandlers = function() {
                    var events = $._data(target, 'events');
                    if (events) {
                        target._handlers = new Array();
                        for (var i in events[type]) {
                            target._handlers.push(events[type][i]);
                        }

                        $target.unbind(type);
                    }
                },
                // Re-bind old events
                rebindHandlers = function() {
                    if (target._handlers !== undefined) {
                        for (var i in target._handlers) {
                            $target.bind(type, target._handlers[i]);
                        }
                    }
                };

            if ($target.attr('title') !== null && $target.attr('title').length > 0) 
                locale.text = $target.attr('title');

            var dialog = (options.dialog === undefined || typeof(options.dialog) != 'object') ? 
                $('<div class="dialog confirm">' + locale.text + '</div>') : 
                options.dialog;

            var buttons = {};
            buttons[locale.button[0]] = function() {
                $(dialog).dialog('close');
            };
            buttons[locale.button[1]] = function() {
                // Unbind overriding handler and let default actions pass through
                $target.unbind(type, handler);

                // Close dialog
                $(dialog).dialog('close');

                // Check if there is any events on the target
                var anyEvents = $._data(target, 'events');
                if (anyEvents || !hasValidUrl(target.href)) {
                    // Trigger click event.
                    $target.trigger(type);
                }
                else {
                    // No event trigger new url
                    urlClick();
                }

                init();

            };

            $(dialog).dialog({
                autoOpen: false,
                resizable: false,
                draggable: true,
                closeOnEscape: true,
                width: 'auto',
                minHeight: options.minHeight,
                maxHeight: options.maxHeight,
                buttons: buttons,
                title: locale.title,
                closeText: locale.closeText,
                modal: true,
                open: function() { $(this).closest('.ui-dialog').find('.ui-dialog-buttonpane button:eq(1)').focus() }
            });

            // Handler that will override all other actions
            var handler = function(event) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    $(dialog).dialog('open');
                },
                init = function() {
                    saveHandlers();
                    $target.bind(type, handler);
                    rebindHandlers();
                };

            init();

        });

    };
})(jQuery);
