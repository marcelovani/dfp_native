(function ($) {

    Drupal.behaviors.appendDfpNative = {
        attach: function (context, settings) {

            var appendDfp = {
                settings: Drupal.settings.dfpNative,

                // Append the rendered Dfp slot to specified element.
                appendDfp: function (tags) {
                    $.each(tags, function (index, item) {
                        // Turn the position into a zero-based index position.
                        var position = (item.position != undefined && item.position > 0 ? item.position : 1) -1;
                        var placement = item.placement != undefined && item.placement === 'replace' ? item.placement : 'insert';
                        // Loop through each selector: if a match found, render dfp and break loop.
                        $.each(item.selector, function (index, itemValue) {
                            if (placement === 'replace') {
                                if ($(itemValue).eq(position).length == 1) {
                                    // Adding event listener, So its available when ads is rendered/loaded
                                    googletag.cmd.push(function() {
                                        googletag.pubads().addEventListener('slotRenderEnded', function(e) {
                                            // Hide selectors element
                                            if ((e.slot === googletag.slots[item.ad_tag]) && (e.size[1] > 0)) {
                                                $(itemValue).eq(position).hide();
                                            }
                                        });
                                    });

                                    // Render the advert so that the slotRenderEnded event is fired.
                                    $(itemValue).eq(position).before(item.renderedDfp);
                                }
                                return false;
                            }
                            else {
                                if ($(itemValue).eq(position).length == 1) {
                                    $(itemValue).eq(position).before(item.renderedDfp);
                                }
                                else if ($(itemValue).eq(position-1).length == 1) {
                                    $(itemValue).eq(position-1).after(item.renderedDfp);
                                }
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
