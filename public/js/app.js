$(document).ready(function () {
  var cardShowHeight = parseInt($(".mdl-card__title").outerHeight(true) + $(".mdl-card__actions").outerHeight() + $(".mdl-card__supporting-text:first").outerHeight());

  $(".showComment").click(function () {
    var currComment = $(this).closest("div").siblings(".comments");
    $(currComment).toggle();
    if ($(this).parents(".mdl-card").siblings().not(currComment).height() >= cardShowHeight) {
      if ($(this).parents(".mdl-card").siblings().children(".comments").not(currComment).is(":visible")) {
        $(this).parents(".mdl-card").siblings().children(".comments").not(currComment).hide();
        $(this).closest(".mdl-card").height("auto");
      }
      if (currComment.is(":hidden")) {
        $(this).parents(".mdl-card").siblings().height("auto");
      }
      $(this).parents(".mdl-card").siblings().not(currComment).height(cardShowHeight);
    }
    else {
      $(this).parents(".mdl-card").siblings().height("auto");
    }
    if (currComment.is(":visible") && $(this).closest(".mdl-card").height() <= cardShowHeight) {
      $(this).closest(".mdl-card").height("auto");
      $(this).parents(".mdl-card").siblings().not(currComment).height(cardShowHeight);
    }
  });
});

// Add comment:
$(document).on("click", ".addComment", function (event) {
  event.preventDefault();
  var currName = $(this).siblings().find(".uname-input");;
  var currCommentText = $(this).siblings().find(".comment-input");
  var currCommentSec = $(this).closest("div.comments");
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/article/" + thisId,
    data: {
      author: currName.val(),
      body: currCommentText.val()
    }
  }).done(function (data) {
    $.ajax({
      method: "GET",
      url: "/article/" + thisId
    })
      .done(function (data) {
        if (data.comments) {
          console.log(data.comments[0].author);
          var commentHtml = "<div class=\"mdl-card__supporting-text mdl-card--border\"><div class=\"comment-body\">" +
            "<strong>" + data.comments[data.comments.length - 1].author + "</strong><p>" +
            data.comments[data.comments.length - 1].body + "</p></div><div><button class=\"mdl-button mdl-js-button mdl-button--icon comment-action\"> <i class=\"material-icons\">delete_forever</i></button></div></div>";
          $(currCommentSec).prepend(commentHtml);
          currName.val("").parent().removeClass("is-dirty");
          currCommentText.val("").parent().removeClass("is-dirty");
        }
      });
  });
});

//Delete:
$(document).on("click", ".comment-action", function (e) {
  $(this).closest(".mdl-card__supporting-text").hide();
});