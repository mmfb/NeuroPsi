function openSlideMenu(){
	document.getElementById('sideMenu').style.width='240px';
}
function closeSlideMenu(){
    document.getElementById('sideMenu').style.width=0;
}

$(document).ready(function(){
    var contentPlacement = $("#navBar").position().top + $("#navBar").height();
    $("#title").css("margin-top", contentPlacement);
});

const patientId = sessionStorage("patientId");

window.onload = function(){
}