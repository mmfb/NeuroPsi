
var testsPending;

function openSlideMenu(){
	document.getElementById('sideMenu').style.width='240px';
}
function closeSlideMenu(){
    document.getElementById('sideMenu').style.width=0;
}

const patientId = parseInt(sessionStorage.getItem("patientId"));

window.onload = function(){
    $.ajax({
        url:"/api/patients/"+patientId+"/tests/pending",
        methos:"get",
        success: function(result, status){
            testsPending = result.tests;
            console.log(testsPending[0].testId);
        }
    })
}