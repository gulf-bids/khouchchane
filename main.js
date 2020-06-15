// Loading JS
$(window).on('load', function () {
    $(".loader-container").fadeOut('slow');
});
// Website JS
jQuery(document).ready(function ($) {
  if ($(window).width() <= 425) {
    $("#btn-hire").appendTo("#mainnav");
  }
  else {
    $("#btn-hire").appendTo("#main-navbar");
  }
  $("#btn-search").appendTo("#main-navbar");
  var portfolio = $("#portfolio_content"),
      ajaxCall = false;
  if (portfolio[0]) {
      $(window).scroll('scroll', function() {
          if($(window).scrollTop() >= portfolio.offset().top + portfolio.outerHeight() - window.innerHeight && !ajaxCall) {
              ajaxCall = true;
              $.ajax({
                  type: "post",
                  url: wpab_ajax.ajax_url,
                  data: {
                      action: "portfolio_request",
                      ajax_nonce: wpab_ajax.nonce
                  },
                  beforeSend: function () {
                      portfolio.html('<div class="lds-ripple"><div></div><div></div></div>');
                  },
                  success: function (response) {
                      portfolio.html(response);
                  },
                  error: function (errorThrown) {
                      portfolio.html('<h2 class="no_posts text-center"></h2>');
                  }
              });
          }
      });
  }
  $("#wpabContactForm").on("submit", function(e) {
      e.preventDefault();
      $(".has-error").removeClass("has-error");
      $(".is-invalid").removeClass("is-invalid");
      $(".js-show-feedback").removeClass("js-show-feedback");
      var a = $(this),
          n = a.find("#name").val(),
          e = a.find("#mail").val(),
          s = a.find("#subject").val(),
          m = a.find("#message").val();
      if (n === "") {
        $("#name").parent(".form-group").addClass("has-error");
        $("#name").addClass("is-invalid");
      }
      else if (e === "") {
        $("#mail").parent(".form-group").addClass("has-error");
        $("#mail").addClass("is-invalid");
      }
      else if (s === "") {
        $("#subject").parent(".form-group").addClass("has-error");
        $("#subject").addClass("is-invalid");
      }
      else if (m === "") {
        $("#message").parent(".form-group").addClass("has-error");
        $("#message").addClass("is-invalid");
      }
      else {
        $.ajax({
            url: wpab_ajax.ajax_url,
            type: "post",
            data: {
                name: n,
                email: e,
                subject: s,
                message: m,
                action: "contact_request",
                ajax_nonce: wpab_ajax.nonce
            },
            beforeSend: function () {
              a.find("input, button, textarea").attr("disabled", "disabled");
              $(".js-form-submission").addClass("js-show-feedback");
            },
            error: function(error) {
                $(".js-form-submission").removeClass("js-show-feedback");
                $(".js-form-error").addClass("js-show-feedback");
                a.find("input, button, textarea").removeAttr("disabled");
                console.log(error);
            },
            success: function(response) {
              if (response == 0) {
                  setTimeout(function() {
                      $(".js-form-submission").removeClass("js-show-feedback");
                      $(".js-form-error").addClass("js-show-feedback");
                      a.find("input, button, textarea").removeAttr("disabled");
                  }, 1500);
              }
              else {
                  setTimeout(function() {
                      $(".js-form-submission").removeClass("js-show-feedback");
                      $(".js-form-success").addClass("js-show-feedback");
                      a.find("input, button, textarea").removeAttr("disabled").val("");
                  }, 1500);
              }
            }
        });
    }
  });
  $(document).on('click', '#btn-load', function(e) {
    e.preventDefault();
    var clicked = $(this);
    var page = clicked.data('page');
    var newpage = page + 1;
    $.ajax({
        type: "post",
        url: wpab_ajax.ajax_url,
        data: {
            page: page,
            action: "load_request",
            ajax_nonce: wpab_ajax.nonce
        },
        beforeSend: function () {
          clicked.removeClass('btn-custom btn-see').html('<div class="lds-ripple"><div></div><div></div></div>');
        },
        success: function (response) {
          if (response == 0) {
            clicked.parent('.portfolio_more').html("<span class='doneload'></span>");
          }
          else {
            $('#loaded-posts').append(response);
            clicked.data('page', newpage);
            clicked.addClass('btn-custom btn-see').html('<span class="load_more"></span>');
          }
        },
        error: function (errorThrown) {
          console.log(errorThrown);
        }
    });
  });
  var oldCount = Math.round($(".rating_value").data("count"));
  ratingColor(oldCount);
  $(".rating_value span").on('mouseover', function starRating(item) {
      resetColors();
      var starId = $(this).attr('id'),
          starNum = parseInt(starId);
      for(var i = 1; i <= 5; i++) {
        if(i <= starNum) {
          document.getElementById((i)+'one').style.color="red";
        }
      }
    });
  $(".rating_value span").on('click', function sendRating(item) {
      var that = $(this),
          postCount = that.parent().data('count'),
          postID = that.parent().data('id'),
          starValue = parseInt(that.attr('id')),
          totalValue = ((starValue + postCount) / 2);
      $.ajax({
          type: "post",
          url: wpab_ajax.ajax_url,
          data: {
              value: starValue,
              postid: postID,
              total: totalValue,
              action: "rating_request",
              ajax_nonce: wpab_ajax.nonce
          },
          beforeSend: function () {
              that.parent().addClass('wait');
          },
          success: function (response) {
              location.reload();
          },
          error: function (errorThrown) {
            console.log(errorThrown);
          }
      });
    });
});
// Helpers
function resetColors() {
  $(".rating_value span").css( 'color', 'black' );
}
function ratingColor(value) {
  for(var i = 1; i <= 5; i++) {
    if(i <= value) {
      document.getElementById((i)+'one').style.color="red";
    }
  }
}
