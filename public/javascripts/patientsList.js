const neuroId = parseInt(sessionStorage.getItem("neuroId"));
const patientsT = document.getElementById("patientsT");
var patients;

window.onload = function(){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/patients",
        method:"get",
        success: function(result, status){
            patients = result.patients;
            patientsHtmlInjection(patients);
        },
        error: function(){
            console.log("Error");
        }
    })
};

function patientsHtmlInjection(patients){
    var str="";
    for(p of patients){
        str+="<tr id = "+p.patientId+"><td><img src='images/login pic.png'></td><td>"+p.patientId+"</td><td>"+p.name+"</td><td>"+p.age+
        "</td><td><div class='dropdown'><button onmouseover='disableOnclick("+p.patientId+")' onmouseout = 'enableOnclick("+p.patientId+","+p.attribId+")' class='dropbtn'>V</button><div class='dropContent' onmouseover='disableOnclick("+p.patientId+")' onmouseout = 'enableOnclick("+p.patientId+","+p.attribId+")'><a onclick = 'scheduleTest("+p.paientId+","+p.attribId+")'>Agendar teste</a><a onclick = 'openTestResults()'>Ver resultados</a></div></div></td></tr>"
    }
    patientsT.innerHTML = str;
    for(p of patients){
        enableOnclick(p.patientId, p.attribId);
    }
}

function disableOnclick(patientId){
    var elements = document.getElementById(patientId);
    elements.onclick = null;
}

function enableOnclick(patientId, attribId){
    var elements = document.getElementById(patientId);
    elements.onclick = selectPatient(patientId, attribId);
}

function selectPatient(patientId, attribId) {
    return function(){
        alert(patientId+"/"+attribId);
        sessionStorage.setItem('patientId', patientId);
        sessionStorage.setItem('attribId', attribId);
        window.location = 'patientFile.html';
    };
}

function scheduleTest(patientId, attribId){
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




