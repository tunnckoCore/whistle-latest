$(function() {
  /* Bitly JS Api */
  function bitlyShorten(longurl) {
    var resData;
    $.ajax({
      async: false,
      type: 'GET',
      dataType: 'json',
      url: 'https://api-ssl.bitly.com/v3/shorten',
      data: {
        "format": "json",
        "apiKey": 'R_fb96aa701e990e7d6098a55cb4a9e335',
        "login": 'o_7lhtle464r',
        "longUrl": longurl
      },
      success: function(data) {
        resData = data;
      }
    });
    return resData;
  }
  window.prettyPrint && prettyPrint();
  $("#tmfMainMenu li a").click(function() {
    var e = $(this).attr("data-href");
    //if ($("#tmfLoadPage div")) {
    //    $("#tmfLoadPage div").remove()
    //}
    //$("#tmfLoadPage").load("pages/" + e + ".html")
  });
  $(".tmf.page-content .box-front .click-flip").click(function() {
    $(".tmf.page-content").addClass("flipers")
  });
  $(".tmf.page-content .box-back .click-flip").click(function() {
    $(".tmf.page-content").removeClass("flipers")
  });
  $("#tmfMainMenu a").click(function() {
    $("#tmfMainMenu li").removeClass("active")
  });
  $(".tmf.collorize li").tooltip();
  $(".tmf.brand-nav a:first-child").tooltip();
  $(".tmf.brand-nav nav a:first-child span").tooltip();
  if ($.cookie("themeColor")) {
    $(".tmf.projection").addClass($.cookie("themeColor"))
  }
  $(".add-class").click(function(e) {
    e.preventDefault();
    var t = $(e.target);
    if ($(".tmf.projection").hasClass($.cookie("themeColor"))) {
      $(".tmf.projection").removeClass($.cookie("themeColor"))
    }
    $(".tmf.projection").addClass(t.attr("data-color"));
    $.cookie("themeColor", null);
    $.cookie("themeColor", t.attr("data-color"), {
      expires: 12 * 60 * 60,
      path: "/"
    })
  });
  $(".tmf-background-ads .advertise").click(function(evntr) {
    if ($(this).attr('data-href') == "") {
      return false;
    } else {
      window.open($(this).attr('data-href'), '_blank');
      return false;
    }
  });
});
