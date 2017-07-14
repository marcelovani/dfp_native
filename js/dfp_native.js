(function ($) {

  Drupal.behaviors.appendDfpNative = {
    attach: function () {

      var appendDfp = {
        settings: Drupal.settings.dfpNative,

        // Append the rendered Dfp slot to specified element.
        appendDfp: function (tags) {
          $.each(tags, function (index, item) {
            // Turn the position into a zero-based index position.
            var position = (item.position !== undefined && item.position > 0 ? item.position : 1) -1;
            var placement = item.placement !== undefined && item.placement === 'replace' ? item.placement : 'insert';

            // Loop through each selector: if a match found, render dfp and break loop.
            $.each(item.selector, function (index, itemValue) {

              // Adding event listener, So its available when ad is rendered/loaded
              googletag.cmd.push(function() {
                googletag.pubads().addEventListener('slotRenderEnded', function(e) {
                  // Check if ad rendered
                  if ((e.slot === googletag.slots[item.ad_tag]) && (e.size[1] > 0)) {
                    // Apply a specific and generic class to the body if Native Ad is loaded
                    $(document.body).addClass(item.ad_tag + '-enabled');
                    // Hide the next view item

                    if (placement === 'replace') {
                      $(itemValue).eq(position).hide();
                    }
                  }
                });
              });

              // place the ad either before or after the target, depending on availability
              if ($(itemValue).eq(position).length === 1) {
                $(itemValue).eq(position).before(item.renderedDfp);
              }
              else if ($(itemValue).eq(position-1).length === 1) {
                $(itemValue).eq(position-1).after(item.renderedDfp);
              }
              return false;

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
