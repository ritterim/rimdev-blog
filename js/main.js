(function($) {
  // create sidebar and attach to menu open
  $('.ui.sidebar')
    .sidebar('attach events', '.icon.newspaper');

  $('.ui.sidebar')
    .visibility({
      once: false,
      onPassing: function() {

        $('.pusher article')
          .css('filter', 'blur(2px)');
      },
      onPassing: function() {
        $('.pusher article')
          .css('filter', 'blur(0)');
      }
  });

  // (cc) image credit links will always vary in width.
  var $photoCredit = $('.photo-credit'),
      creditWidth  = $photoCredit.width();

  $photoCredit
    .css('right', 'calc(-'+creditWidth+'px + 0.3em)')
    .animate({
      opacity: 1
    });
  $photoCredit
    .hover(
      function() {
        $(this)
          .animate({ right: '-1em' });
      }, function() {
        $(this)
          .css( 'right', 'calc(-'+creditWidth+'px + 0.3em)');
  });

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

  // fix menu when passed
  $('.masthead')
    .visibility({
      once: false,
      onBottomPassed: function() {
        $('.icon.menu').transition('fade in');
      },
      onBottomPassedReverse: function() {
        $('.icon.menu').transition('fade out');
      }
    });

  $('.icon.heartbeat')
    .popup({
      popup: '.freshness.popup'
  });

  var $postMainColumnJs = $('#post-main-column-js');
  if ($postMainColumnJs.data('external-links-target-blank')) {

    // Selector from http://stackoverflow.com/a/1871394 from http://stackoverflow.com/questions/1871371/using-jquery-to-open-all-external-links-in-a-new-window
    $postMainColumnJs.find("a[href^='http://']").prop('target', '_blank');
  }
})(jQuery);
