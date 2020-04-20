
const preview = document.getElementById("preview");
const previewCtx = preview.getContext('2d');
const testsD = document.getElementById("tests")
var tests = []
var testIndex
var neuroId = 1
var testId

/*window.onload = function(){
    tests = [{time:20, type:"Draw", params:[{imgPosX:200},{imgPosX:200}]}, {time:30, type:"Draw", params:[{imgPosY:400}]}]
    saveTests()
}*/

function addTest(){
    var imgPreview = preview.toDataURL("image/png");
    tests.push({time:0, type:"Draw", params:[{}], imgPreview:imgPreview})
    testIndex = tests.length-1
    loadTestsImgsOnElem(tests, testsD)
}

function loadTestsImgsOnElem(tests, elem){
    str=""
    for(i=0; i<tests.length; i++){
        str+="<div data-value='"+i+"'"
        if(i==testIndex){
            str+="class='highlight' "
        }
        str+="onclick='selectTest(this)'><img src='"+tests[i].imgPreview+"'></div>"
    }
    elem.innerHTML = str;
}

function selectTest(elem){
    removeAllTestsHighlights()
    elem.classList.add("highlight")
    testIndex = parseInt(elem.getAttribute("data-value"))
    var test = tests[testIndex]
    if(elem.hasAttribute('data-function')){
        window[elem.getAttribute('data-function')]("testParam", test)
    }else{
        document.getElementById("testParam").children[0].innerHTML = "";
    }
}

function removeAllTestsHighlights(){
    var tests = testsD.children
    for(t of tests){
        t.classList.remove("highlight")
    }
}

function saveTestParams(){
    saveParamsInTest("testParam", testIndex)
}

function saveParamsInTest(elemId, testIndex){
    var elements = document.getElementById(elemId).getElementsByTagName("input")
    var test = tests[testIndex]
    for(elem of elements){
        if (elem.type && elem.type === 'checkbox'){
            test.params[0][elem.id] = elem.checked
        }else{
            test.params[0][elem.id] = elem.value
        }
    }
    console.log(tests)
}

function getTestImgElem(testIndex){
    elements = document.getElementById("tests").children
    for(elem of elements){
        if (elem.getAttribute("data-value") == testIndex){
            return elem
        }
    }
}

function clearElem(elemId){
    document.getElementById(elemId).innerHTML = "";
}

function saveTests(){
    saveParamsInTest("testParam", testIndex)
    $.ajax({
        url:"/api/neuros/"+neuroId+"/testsSaved",
        method:"post",
        data: {tests:JSON.stringify(tests)},
        success: function(result, status){
            console.log(result)
            testId = result.testId
            alert("Teste guardado com sucesso");
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
        url:"/api/neuros/"+neuroId+"/tests/"+testId+"/patients/"+patientId,
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