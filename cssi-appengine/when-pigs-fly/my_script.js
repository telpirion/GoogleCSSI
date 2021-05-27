function showWhenClicked() {
    $("#pig").show();
}

function hideWhenClicked() {
    $("#pig").hide();
}

function setup() {
    $("#showPig").click(showWhenClicked);
    $("#hidePig").click(hideWhenClicked);
}

$(document).ready(setup);
