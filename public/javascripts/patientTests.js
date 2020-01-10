const patientId = parseInt(sessionStorage.getItem('patientId'));
const testsT = document.getElementById("testsT");
var patient;
var tests;

window.onload = function(){
    $.ajax({
        url: '/api/patients/'+patientId,
        method: 'get',
        success: function(result, status){
            patient = result.patient;
            patientInfoHtmlInjection(patient);
        }
    })
    $.ajax({
        url: '/api/patients/'+patientId+'/tests',
        method: 'get',
        success: function(result, status){
            tests = result.tests;
            testsHtmlInjection(tests);
        }
    })
}

function patientInfoHtmlInjection(patient){
    var str = "<p>ID: "+patient.patientId+"</p><p>Nome: "+patient.name+"</p><p>Idade: "+patient.age+"</p><p>Sexo: "+patient.sex+"</p>";
    patientInfoS.innerHTML = str;
}

function testsHtmlInjection(tests){
    var str="";
    for(t of tests){
        str += "<tr";
        if(t.testState !== "Completed" || t.testState != ""){
            str += " onclick = openTest("+t.testId+")";
        }
        str += "><td>"+t.testId+"</td><td>"+t.testState+"</td><td>"+t.assignedDate+"</td><td>"+t.completedDate+"</td><td>"+t.comment+"</td></tr>";
    }
    testsT.innerHTML = str;
}

function openTest(testId){
    sessionStorage.setItem('testId', testId);
    window.location = 'testPatient.html';
}