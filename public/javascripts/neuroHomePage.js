
const evalsContainer = document.getElementById("evalsTableContent")
const patientsContainer = document.getElementById("patientsTableContent")
const neuroId = 1;
const searchI = document.getElementById("searchI")
const testsContainer = document.getElementById("myTests")

function getNeuroEvals(id, filters){
    var user = "neuro"
    var url = '/api/users/'+user+'/'+id+'/evals'
    if(filters){
        url+='?'
        for(f in filters){
            url+=f+' = '+filters[f]+'&'
        }
        url = url.slice(0,-1);
    }
    $.ajax({
        url: url,
        method: 'get',
        success: function(result, status){
           var evals = result.evals;
           injectEvalsTable(evalsContainer, evals)
           loadPieChart(evals)
        }
    })
}

function getNeuroPatients(neuroId, filters){
    var url = '/api/neuros/'+neuroId+'/patients'
    if(filters){
        url+='?'
        for(f in filters){
            url+=f+' = '+filters[f]+'&'
        }
        url = url.slice(0,-1);
    }
    $.ajax({
        url: url,
        method: 'get',
        success: function(result, status){
           var patients = result.patients;
           injectPatientsTable(patientsContainer, patients)
        }
    })
}

function injectEvalsTable(elem, evals){
    var str = ""
    for(e of evals){
        str+="<tr>"
                +"<td>"+e.testId+"</td>"
                +"<td>"+e.patient.name+"</td>"
                +"<td>"+e.assignedDate+"</td>"
                +"<td>"+e.evalState+"</td>"
                +"<td>"+e.completedDate+"</td>"
            +"</tr>"
    }
    elem.innerHTML = str
}

function injectPatientsTable(elem, patients){
    console.log(patients)
    var str = ""
    for(p of patients){
        str+="<tr onclick='filterByPacient("+p.patientId+")' ondblclick='openPatientFile("+p.patientId+")'>"
                +"<td>"+p.patientId+"</td>"
                +"<td>"+p.name+"</td>"
                +"<td>"+p.age+"</td>"
                +"<td>"+p.email+"</td>"
            +"</tr>"
    }
    elem.innerHTML = str
}

function openPatientFile(patientId){
    console.log(patientId)
    sessionStorage.setItem("patientId",patientId);
    window.location = "neuroPatientFile.html";

}

function filterByPacient(patientId){
    getNeuroEvals(neuroId, {patientId: patientId});
}

getNeuroEvals(neuroId)
getNeuroPatients(neuroId)
getNeuroSavedTests(neuroId)

function loadPieChart(evals){
    var states = {}
    for(e of evals){
        if(e.evalState in states){
            states[e.evalState] = states[e.evalState] + 1;
        }else{
            states[e.evalState] = 1;
        }
    }
    anychart.onDocumentReady(function(){

        var data = [
            {x:"Marcados", value: states.Scheduled},
            {x:"Completados", value: states.Completed},
            {x:"Arquivados", value: states.Filed},
            {x:"Cancelados", value: states.Canceled},
            {x:"Remarcado", value: states.Rescheduled}
        ];

        var chart = anychart.pie();
        chart.data(data);
        chart.container("pieChartContainer");
        chart.legend().position("right");
        chart.legend().itemsLayout("vertical");

        chart.listen('pointClick', function (e) {
            e.point.get("filter")();
          });
        
        chart.labels().format(function(){
            return anychart.format.number(this.value);
        });

        chart.draw();
    });
}

function search(){
    var text = searchI.value;
}

function getNeuroSavedTests(neuroId){
    $.ajax({
        url: '/api/neuros/'+neuroId+'/savedTests',
        method: 'get',
        success: function(result, status){
           var tests = result.tests;
           console.log(tests)
           injectTests(testsContainer, tests)
        }
    })
}

function injectTests(testsContainer, tests){
    str=""
    for(t of tests){
        str+='<div class="test" onclick="openTest('+t.testId+')">'
                +'<div class="titleConteiner">'
                    +'<p class="testTitle">'+t.testTitle+'</p>'
                +'</div>'
                +'<div class="dropdown_menu">'
                    +'<a id="scheduleBtn" title="Marcar"><img src="./images/img_395492.png"></a>'
                    +'<a id="deleteBtn" title="Apagar"><img src="./images/clipart1120803.png"></a>'
                +'</div>'
            +'</div>'
    }
    str += '<p id="newTestBtn" onclick="openNewTest()">Criar novo teste</p>'
    testsContainer.innerHTML=str
}

function openTest(testId){
    sessionStorage.setItem("testId",testId);
    sessionStorage.setItem("neuroId",neuroId);
    window.location = "testParam.html";
}
function openNewTest(){
    sessionStorage.setItem("testId",-1);
    sessionStorage.setItem("neuroId",neuroId);
    window.location = "testParam.html";
}