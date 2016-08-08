(function($) {
  if ($(window).width() > 991) {
    var lastScrollTop = 0;
    $(window).on("scroll", function() {
      var state = $(this).scrollTop();
      if (state < lastScrollTop){
        $("footer").show("fast");
      } else {
        $("footer").hide("slow");
      }
      lastScrollTop = state;
    });
  } else {
    $("footer").show();
  }

  $('*[data-freshness-datetime]').each(function(i, el) {
    var $el = $(el);
    var daysOld = parseInt((Date.now() - Date.parse($el.data('freshness-datetime'))) / 1000 / 60 / 60 / 24);

    $el.find('.freshness-icon-js').each(function(i , iconEl) {
      var $iconEl = $(iconEl);

      if (daysOld <= 30) {
        $iconEl.addClass('new');
      } else if (daysOld >= 31 && daysOld <= 190) {
        $iconEl.addClass('old');
      } else if (daysOld >= 191 && daysOld <= 364) {
        $iconEl.addClass('stale');
      } else if (daysOld >= 365) {
        $iconEl.addClass('rubbish');
      }
    });

    $el.find('.freshness-days-old-js').each(function(i, daysOldEl) {
      $(daysOldEl).text(daysOld);
    });
  });

  $("a[href*='#']").on("click", function(e) {
    var target = $(this.hash);
    if (target.length) {
      e.preventDefault();
      $("html,body").animate({
        scrollTop: (target.offset().top) - 100
      }, "fast");
      return false;
    }
  });

  $(".freshness i").hover(function () {
    $(".freshness-hover").addClass("hover-out").delay(3000).queue(function() {
      $(this).removeClass("hover-out").dequeue();
    });
  });
})(jQuery);
