$(document).ready(function() {
    var items = $(".item");
    var bgs = $(".bg");
    bgs.css("transform", "scale(1)");
    bgs.slice(2).hide();
    var windowHeight = $(window).height();
    $(window).on("scroll", function() {
      var scrollTop = $(window).scrollTop();
      items.toArray().reverse().forEach(function(item, index) {
        var itemOffset = $(item).offset().top;
        var itemHeight = $(item).height();
        var bg = bgs.eq(bgs.length - 1 - index);
     var scaleFactor = 1 - (scrollTop - itemOffset) / itemHeight;
        scaleFactor = Math.max(0, Math.min(1, scaleFactor));
        bg.css("transform", "scale(" + scaleFactor + ")");
        if (scaleFactor < 1) {
          bg.css("z-index", 1);
        } else {
          bg.css("z-index", 0);
        }
        if (scaleFactor < 1) {
          bgs.eq(bgs.length - index).show();
        } else {
          bgs.eq(bgs.length - index).hide();
        }
      });
    });
    });