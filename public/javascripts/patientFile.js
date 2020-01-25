const patientId = parseInt(sessionStorage.getItem('patientId'));
const neuroId = parseInt(sessionStorage.getItem('neuroId'));
const attribId = parseInt(sessionStorage.getItem('attribId'));
const testsT = document.getElementById("testsT");
const patientInfoS = document.getElementById("patientInfoS");
const testBtn = document.getElementById("testBtn");
testBtn.onclick = scheduleTest;
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
        url: '/api/neuros/'+neuroId+'/attributions/'+attribId+'/patients/'+patientId+'/tests',
        mathod: 'get',
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
        if(t.completedDate != "-"){
            str += " onclick = openReplay("+t.testId+")";
        }
        str += "><td>"+t.testId+"</td><td>"+t.testState+"</td><td>"+t.assignedDate+"</td><td>"+t.completedDate+"</td><td>"+t.comment+"</td></tr>"; 
    }
    testsT.innerHTML = str;
}

function openReplay(testId){
    sessionStorage.setItem("testId", testId);
    window.location = 'resultsNeuro.html';
}

function scheduleTest(){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/patients/"+patientId+"/tests",
        method:"post",
        data: {attribId: attribId},
        success: function(data, status){
            alert("Teste marcado");
        },
        error: function(){
            console.log("Error");
        }
    })
}