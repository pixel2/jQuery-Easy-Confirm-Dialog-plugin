/**
 * jQuery Confirm Dialog plugin 1.0
 *
 * Copyright (c) 2010 Emil Janitzek (http://projectshadowlight.org)
 * Based on Confirm 1.3 by Nadia Alramli (http://nadiana.com/)
 *
 * Samples and instructions at: 
 * http://projectshadowlight.org/jquery-confirm-dialog/
 *
 * This script is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free 
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 */  
(function($) {

	jQuery.fn.confirm = function(options) {
	  options = jQuery.extend({
	    title: 'Are you sure?',
	    text: 'Are you sure that you want to perform this action?',
	    icon: 'help',
	    eventType: 'click'
	  }, options);
  
	  // Shortcut to eventType.
	  var type = options.eventType;
  
	  return this.each(function() {
	    var target = this;
	    var $target = jQuery(target);
    
	    var urlClick = function() {

	      if (target.href) {
	        var length = String(target.href).length;
	        if (target.href.substring(length-1,length) != '#')
	          document.location = target.href;
	      }
	    }
    
	    // If any handlers where bind before triggering, lets save them and add them later
	    var saveHandlers = function() {
	      var events = jQuery.data(target, 'events');
	      if (events) {        
	        target._handlers = new Array();
	        for (var i in events[type]) {
	          target._handlers.push(events[type][i]);
	        }
      
	        $target.unbind(type); 
	      }
	    }
	    var rebindHandlers = function() {
	      // Re-bind old events
	      if (target._handlers != undefined) {
	        jQuery.each(target._handlers, function() {
	          $target.bind(type, this);
	        });
	      }
	    }

	    if ($target.attr('title').length > 0)
	      options.text = $target.attr('title');
    
	    var dialog = $('<div class="dialog confirm"><strong>'+ options.text +'</strong></div>');      
	    $(dialog).dialog({ autoOpen: false,
			                   resizable: false,
	                       draggable: true,
	                       closeOnEscape: true,
	                       width: 'auto',
	                       height: 120,
	                       minHeight: 120,
	                       maxHeight: 200,
	                       buttons: { "Cancel": function() { 
	                                    $(dialog).dialog("close");
	                                  },
	                                  "Confrim": function() { 
	                                    // Unbind overriding handler and let default actions pass through
	                                    $target.unbind(type, handler);
                                    
	                                    // Close dialog
	                                    $(dialog).dialog("close");
                                    
	                                    // Check if there is any events on the target
	                                    if (jQuery.data(target, 'events')) {                           
	                                      // Trigger click event.
	                                      $target.click();                                      
	                                    } else {
	                                      // No event trigger new url
	                                      urlClick();
	                                    }
                                    
	                                    init();
                           
	                                  }},
	                       title: options.title,
	                       closeText: 'close',
	                       modal: true});
    
    
	    // Handler that will override all other actions
	    var handler = function(event) {
	      $(dialog).dialog('open');
	      event.stopImmediatePropagation();
	      event.preventDefault();
	      return false;
	    }
    
	    var init = function() { 
	      saveHandlers();
	      $target.bind(type, handler);
	      rebindHandlers();
	    }
    
	    init();

	  });
  
	}
})(jQuery);