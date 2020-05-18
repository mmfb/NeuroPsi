
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext('2d');
const exersD = document.getElementById("exers")
var test = {testTime:0, exer:[]}
var exerIndex
var paramIndex
var neuroId = 1

/*test = 
{testTime: 80, exer:[
    {type:"Draw", exerTime: 10, params:[
        {imgPosX:800}, 
        {imgPosY:800}]
    }, 
    {type:"Draw", exerTime: 5, params:[
        {imgPosX:100}]
    },
    {type:"Digits", exerTime:50, params:[
        {numCards:80},
        {numCards:80}]
    }]
}*/
//saveNewTestInDB(neuroId, test)
//getNeuroSavedTests(neuroId)

/*$(document).on("keypress", function(e){
    if(e.which == 13){
        var exer = test.exer[exerIndex]
        var param = exer.params[paramIndex]
        window["load"+exer.type+"InPreview"](param)
    }
});*/

document.getElementById("exerParam").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      var exer = test.exer[exerIndex]
      var param = exer.params[paramIndex]
      window["load"+exer.type+"InPreview"](param)
    }
});

function addExer(){
    //var imgPreview = preview.toDataURL("image/png");
    test.exer.push({exerTime:0, params:[{}]})
    exerIndex = test.exer.length-1
    paramIndex = test.exer[exerIndex].params.length-1
    loadParamsImgsOnElem(test, exersD)
}

function convertExerInParam(){
    var exer = test.exer.splice(exerIndex, 1)
    var params = exer[0].params
    for(param of params){
        test.exer[exerIndex-1].params.push(param)
    }
    loadParamsImgsOnElem(test, exersD)
}

function loadParams(exer){
    if("type" in exer){
        window["load"+exer.type+"Params"]("exerParam", exer)
        return
    }
    document.getElementById("exerParam").children[0].innerHTML = "";
    document.getElementById("preview").innerHTML = "";
}

function loadParamsImgsOnElem(test, elem){
    str=""
    for(i=0; i<test.exer.length; i++){
        str+="<div class='exer' data-value='"+i+"'>"
        for(j=0; j<test.exer[i].params.length; j++){
            str+="<div class='param' data-value='"+j+"'"
            str+="onclick='selectParam(this,"+i+","+j+")'></div>"/*<img src='"+test.exer[i].params[j].imgPreview+"'>*/
        }
        str+="</div>"
    }
    elem.innerHTML = str;
    var exersElem = elem.children
    var exerElem = exersElem[exersElem.length-1]
    var exerIndex = parseInt(exerElem.getAttribute("data-value"))
    var paramsElem = exerElem.getElementsByClassName("param")
    var paramElem = paramsElem[paramsElem.length-1]
    var paramIndex = parseInt(paramElem.getAttribute("data-value"))
    selectParam(paramElem, exerIndex, paramIndex)
}

function selectParam(elem, eIndex, pIndex){
    exerIndex = eIndex
    paramIndex = pIndex
    removeAllParamsHighlights()
    elem.classList.add("highlight")
    var exer = test.exer[exerIndex]
    loadParams(exer)
}

function insertParamsFromTest(param){
    console.log(param)
    for(key in param){
        document.getElementById(key).value = param[key]
    }
}

function removeAllParamsHighlights(){
    var exers = exersD.children
    for(exer of exers){
        var params = exer.children
        for(param of params){
            param.classList.remove("highlight")    
        }
    }
}

function saveExerParam(){
    passParamsToExer("paramForum", exerIndex, paramIndex)
}

function passParamsToExer(elemId, exerIndex, paramIndex){
    var elements = document.getElementById(elemId).children
    elements = Array.from(elements).filter(e => e.id);
    var exer = test.exer[exerIndex]
    var param = exer.params[paramIndex]
    for(elem of elements){
        param[elem.id] = elem.value
    }
}

function getTestImgElem(testIndex){
    elements = document.getElementById("tests").children
    for(elem of elements){
        if (elem.getAttribute("data-value") == testIndex){
            return elem
        }
    }
}

function saveTest(){
    //saveParamsInTest("testParam", testIndex)
    saveTestInDB(neuroId, test)
}

function saveTestInDB(neuroId, test){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/savedTests",
        method:"post",
        data: {test:JSON.stringify(test)},
        success: function(result, status){
            console.log(result)
            test.testId = result.testId
            alert("Teste guardado com sucesso");
        }
    })
}

function getNeuroSavedTests(neuroId){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/savedTests",
        method:"get",
        success: function(result, status){
            console.log(result.tests)
        }
    })
}

var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
function closeModal() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function openPatientsList(){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/patients",
        method:"get",
        success: function(result, status){
            patients = result.patients;
            patientsHtmlInjection(patients);
            modal.style.display = "block";
        },
        error: function(){
            console.log("Error");
        }
    })
}

function scheduleTest(patientId, attribId){
    $.ajax({
        url:"/api/neuros/"+neuroId+"/tests/"+test.testId+"/patients/"+patientId,
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

function patientsHtmlInjection(patients){
    str = "<span class='close' onclick = 'closeModal()'>&times;</span>"+
            "<table id='table'>"+
                "<thead>"+
                    "<tr>"+
                        "<th>ID</th>"+
                        "<th>Nome</th>"+
                        "<th>Idade</th>"+
                    "</tr>"+
                "</thead>"+
                "<tbody id='patientsT'>"
                for(p of patients){
                    str+="<tr id = "+p.patientId+" onclick = 'scheduleTest("+p.patientId+","+p.attribId+")'><td>"+p.patientId+"</td><td>"+p.name+"</td><td>"+p.age+
                    "</td></tr>"
                }
                str+="</tbody>"+
            "</table>"
    document.getElementsByClassName("modal-content")[0].innerHTML = str  
}