window.onload = function () {
    $(".display div").hide();
    $(".display div").first().show();

    $(".page-1").click(function () {
           $(".display div").hide();
           $(".display .page-2").first().show();
    });
}