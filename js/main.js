(function($) {
  // create sidebar and attach to menu open
  $('.ui.sidebar')
    .sidebar('attach events', '.icon.newspaper, .close');

  // don't see a way to handle this within semantic ui;
  // could be wrong?
  $('a .newspaper')
    .on('click', function(e) {
      e.preventDefault();
  })

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

  $('.secondary-credit')
    .hover(
      function() {
        $(this)
          .find('a')
          .show();
      }, function() {
        $(this)
          .find('a')
          .hide();
    });

  // fix menu when passed
  $('.masthead')
     .visibility({
       once: false,
       onBottomPassed: function() {
         $('.fixed.menu')
           .transition('fade in');
       },
       onBottomPassedReverse: function() {
         $('.fixed.menu')
           .transition('fade out');
       }
   });

  // freshness popup
  $('.icon.heartbeat')
    .popup({
      popup: '.freshness.popup'
  });

  // lazy load images
  $('.image')
    .visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
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

  var $postMainColumnJs = $('#post-main-column-js');
  if ($postMainColumnJs.data('external-links-target-blank')) {

    // Selector from http://stackoverflow.com/a/1871394 from http://stackoverflow.com/questions/1871371/using-jquery-to-open-all-external-links-in-a-new-window
    $postMainColumnJs.find("a[href^='http://']").prop('target', '_blank');
  }

  // ------ Begin post specific js; label

  // invert; 2016-11-01-using-css-filter-invert-for-low-vision-accessibility
  $('button.filter-invert')
    .on('click', function() {
      $('body').toggleClass('inverted');
  });

  // onion-skin; 2017-01-16-the-rimdev-logo-story-or-a-tale-of-2-knights
  $('.onion')
  .on(
    'click',
    function() {
      $('[class*=svg-]').toggleClass('svg-onion');
    }
  );

})(jQuery);
