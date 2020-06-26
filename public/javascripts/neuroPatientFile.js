const patientId = parseInt(sessionStorage.getItem('patientId'));
const neuroId = parseInt(sessionStorage.getItem('neuroId'));

const patientInfo = document.getElementById("patientInfo");
const evalsTableC = document.getElementById("evalsTableContent");
const testsInfoS = document.getElementById("testsInfoSection");
const patientEvolS = document.getElementById("patientEvolutionSection");

getNeuroPatients(neuroId, {patientId: patientId})
getNeuroEvals(neuroId, {patientId: patientId})

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
           var patient = result.patients[0];
           injectPatientInfo(patientInfo, patient)
        }
    })
}

function injectPatientInfo(elem, patient){
    console.log(patient)
    str="<p>ID do paciente: "+patient.patientId+"</p>"
        +"<p>Nome: "+patient.name+"</p>"
        +"<p>Idade: "+patient.age+"</p>"
        +"<p>Contacto: "+patient.email+"</p>"
    elem.innerHTML=str;
}

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
           injectEvalsTable(evalsTableC, evals)
           loadPieChart(evals)
        }
    })
}

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
        chart.container("testsInfoSection");
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

function loadLineChart(evals){

    var data1 = [
        ['', 43],
        ['', 45],
        ['', 26],
        ['', 86],
        ['', 35],
        ['', 31],
        ['', 27],
        ['', 16],
        ['', 27],
        ['', 31],
        ['', 42],
        ['', 5]
      ];

      var data2 = [
        ['', 75],
        ['', 56],
        ['', 67],
        ['', 42],
        ['', 17],
        ['', 12],
        ['', 9],
        ['', 23],
        ['', 47],
        ['', 58],
        ['', 69],
        ['', 100]
      ];
          
    // create a chart
    chart = anychart.line();

    // create a line series and set the data
    var series1 = chart.line(data1);
    var series2 = chart.line(data2);

    series1.normal().stroke("#00cc99", 1, "10 5", "round");
    series1.hovered().stroke("#00cc99", 2, "10 5", "round");
    series1.selected().stroke("#00cc99", 4, "10 5", "round");

    series2.normal().stroke("#0066cc");
    series2.hovered().stroke("#0066cc", 2);
    series2.selected().stroke("#0066cc", 4);


    // set the container id
    chart.container("patientEvolutionSection");

    // initiate drawing the chart
    chart.draw();
}

function injectEvalsTable(elem, evals){
    var str = ""
    for(e of evals){
        str+="<tr>"
                +"<td>"+e.testId+"</td>"
                +"<td>"+e.assignedDate+"</td>"
                +"<td>"+e.evalState+"</td>"
                +"<td>"+e.completedDate+"</td>"
            +"</tr>"
    }
    elem.innerHTML = str
}

