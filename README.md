# jQuery Easy Confirm Dialog plugin

jQuery Easy Confirm Dialog is an easy to use confirm plugin module that acts as a built in, customisable confirm-function. It's only dependencies are jQuery and jQuery UI.

No need for manual callbacks, the default event will be put on hold and only executed if user confirms.

If there are any actions on the target these will be executed. If there are no actions but a URL present then the user will be redirected.

To set a custom min/max height, simply use:

    $(".confirm").easyconfirm({
        minHeight : 100, // default 120
        maxHeight : 250 // default 250
    });

Know issues:
* Will only work with events bound with jQuery
