(function ($) {

    Drupal.behaviors.appendDfpNative = {
        attach: function (context, settings) {

            var appendDfp = {
                settings: Drupal.settings.dfpNative,

                // Append the rendered Dfp slot to specified element.
                appendDfp: function (tags) {
                    $.each(tags, function (index, item) {
                        position = item.position != undefined && item.position > 0 ? item.position : 0;
                        // loop through each selector: if a match found, render dfp and break loop.
                        $.each(item.selector, function (index, itemValue) {
                            if($(itemValue).eq(position).length == 1) {
                                $(itemValue).eq(position).before(item.renderedDfp);
                                return false;
                            }
                        });
                    });
                },
                // appendDfp initialization function.
                init: function () {
                    return !!(window.googletag &&
                    Drupal.settings.dfpNative &&
                    Drupal.settings.dfpNative.tags &&
                    this.appendDfp(Drupal.settings.dfpNative.tags));
                }
            };

            // Initial call.
            appendDfp.init();
        }
    };

})(jQuery);