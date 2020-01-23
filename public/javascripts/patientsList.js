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
        str+="<tr class = 'patientR' onclick = selectPatient("+p.patientId+")><td><img src='images/login pic.png'></td><td>"+p.patientId+"</td><td>"+p.name+
        "</td><td>"+p.age+
        "</td><td><div class='dropdown'><button onmouseover='disableOnclick()' onmouseout = 'enableOnclick("+p.patientId+")' class='dropbtn'>V</button><div class='dropContent'><a onclick = 'addTest("+p.attribId+")' href='#'>Marcar teste</a><a href='#'>Ver resultados</a><a href='#'>Ficha</a></div></div></td></tr>"
    }
    patientsT.innerHTML = str;
}

function disableOnclick(){
    var elements = document.getElementsByClassName('patientR');
    for(e of elements){
        e.onclick = null;
    }
}

function enableOnclick(patientId){
    var elements = document.getElementsByClassName('patientR');
    for(e of elements){
        e.onclick = selectPatient(patientId);
    }
}

function addTest(attribId){
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

function selectPatient(patientId){
    sessionStorage.setItem('patientId', patientId);
    window.location = 'patientFile.html';
}



