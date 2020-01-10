const neroId = parseInt(sessionStorage.getItem("neroId"));
const patientsT = document.getElementById("patientsT");
var patients;

window.onload = function(){
    $.ajax({
        url:"/api/neros/"+neroId+"/patients",
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
        str+="<tr onclick = selectPatient("+p.patientId+")><td><img src='images/login pic.png'></td><td>"+p.patientId+"</td><td>"+p.name+
        "</td><td>"+p.age+
        "</td><td><div class='dropdown'><button class='dropbtn'>V</button><div class='dropContent'><a onclick = 'addTest("+p.patientId+")' href='#'>Marcar teste</a><a href='#'>Ver resultados</a><a href='#'>Ficha</a></div></div></td></tr>"
    }
    patientsT.innerHTML = str;
}

function addTest(patientId){
    $.ajax({
        url:"/api/patients/"+patientId+"/tests",
        method:"post",
        data: {neroId: neroId, patientId: patientId},
        success: function(data, status){
            alert("Teste marcado");
        },
        error: function(){
            console.log("Error");
        }
    })
}

function selectPatient(patientId){
    sessionStorage.setItem('patientId', patientId);
    window.location = 'patientFile.html';
}


