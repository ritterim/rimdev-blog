
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

$(".freshness").hover(function () {
  $(".freshness-hover").addClass("hover-out").delay(3000).queue(function() {
    $(this).removeClass("hover-out").dequeue();
  });
});
