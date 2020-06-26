const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const testId = parseInt(sessionStorage.getItem("testId"));
const patientId = parseInt(sessionStorage.getItem("patientId"));
var coords;
var test
var params = []


getDiff("../images/ReyOsterrieth-Complex-Figure.png", "../images/Rey-osterreith_example.jpg")

function getDiff(url1, url2) {

    var img1  = new Image()
    var img2 = new Image()
    img2.onload = function(){
        base64Img1 = getBase64Image(img1)
        base64Img2 = getBase64Image(img2)
        $.ajax({
            url:"/api/patients/images",
            method:"post",
            data: {img1:base64Img1, img2:base64Img2},
            success: function(result, status){
                console.log(result)
                test.testId = result.testId
                alert("Teste guardado com sucesso");
            }
        })
    }
    img1.src = url1
    img1.onload = function(){
        img2.src = url2
    }
    img1.src = url1

    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL//.replace(/^data:image\/(png|jpg);base64,/, "");
}

  

window.onresize = function(){
    context.canvas.width = document.getElementById("test").clientWidth
    context.canvas.height = document.getElementById("test").clientHeight
}

window.onload = function(){
    context.canvas.width = document.getElementById("test").clientWidth
    context.canvas.height = document.getElementById("test").clientHeight
    navigator.geolocation.getCurrentPosition(success, error);
    getPatientTests(patientId,{testId:testId})



   /*$("#startBtn").click(function(){
        btnTxt = $(this).html();
        if(btnTxt == "Começar"){
            startRey();
            $(this).html("Proximo");
            
        }else if(btnTxt == "Proximo"){
            stopRecording();
            var serRec = serializeDrawing(drawing);
            context.clearRect(0,0, canvas.width, canvas.height);
            $.ajax({
                url: "/api/patients/"+patientId+"/tests/"+testId+"/replay",
                method: "post",
                data: {lat: coords.lat, lng: coords.lng, rec: JSON.stringify(serRec)},
                success: function(res, status){
                    alert("Teste submetido");
                    window.location = "patientTests.html";
                }
            });
        }
        $("#startBtn").prop("value","Proximo");
    });*/
}

function success(position){
    coords = {lat: position.coords.latitude, lng: position.coords.longitude};
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    patientLocation = JSON.parse(sessionStorage.getItem("patientCoords"));
    coords = {lat: patientLocation.y, lng: patientLocation.x}
};

/*function imgAnimation(img){
    var imgWidth = img.width;
    var imgHeight = img.height;
    var x = canvas.width/2 - imgWidth/2;
    var y = canvas.height/2 - imgHeight/2;
    
    var interval = setInterval(function(){    
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(img, x, y, imgWidth, imgHeight);

        window.setTimeout(function(){
            if(imgWidth > canvas.width*0.35){
                x = canvas.width/2 - imgWidth/2;
                y = canvas.height/2 - imgHeight/2;
                imgWidth -= 2;
                imgHeight -= 2;
            }else{
                if(x < canvas.width - imgWidth || y > 0){
                    if(x < canvas.width - imgWidth){
                        x+=2;
                    }
                    if(y > 0){
                        y-=2;
                    }
                }else{
                    clearInterval(interval);
                }
            }
        }, 500);  
    }, 4);
}

function startRey(){
    var img = new Image();
    img.src = "images/reyImage.gif";
    img.onload = function(){
        imgAnimation(img);
    }
    window.setTimeout(function(){
        startDraw("canvas");
        startRecording();
    }, 1000);
}*/

function getPatientTests(patientId, conditions){
    var url = '/api/patients/'+patientId+'/tests'
    if(conditions){
        url+='?'
        for(c in conditions){
            url+=c+'='+conditions[c]+'&'
        }
        url = url.slice(0,-1)
    }
    $.ajax({
        url:url,
        method:'get',
        success:function(result){
            test = result.tests[0]
            loadPagination(test)
        }
    })
}

function loadPagination(test){
    var str = "<a>&laquo;</a>"
    var i = 1
    for(exer of test.exer){
        for(param of exer.params){
            params.push(param)
            str+="<a"
            if(i == 1){
                str+=" class='active'"
            }
            str+=">"+i+"</a>"
            i++
        }
    }
    str+="<a onclick = 'loadNextParam()'>&raquo;</a>"
    document.getElementById("pagination").innerHTML = str
    loadParam(params[0])
}

function loadNextParam(){
    var pag = document.getElementsByClassName("active")[0]
    pag.classList.remove("active")
    var index = JSON.parse(pag.textContent)
    pag = document.getElementById("pagination").children

    pag[index+1].classList.add("active")

    if(index == params.length){
        alert("Teste terminado")
        endTest()
    }
    if(index > 1){
        saveParamResult(params[index-1])
    }
    loadParam(params[index])
}

function saveParamResult(param){
    var str = "save"+param.type+"Result"
    window[str](param)
}

function loadParam(param){
    console.log(param.type)
    var str = "load"+param.type+"Param"
    window[str](param) 

}

function endTest(){
    $.ajax({
        url: "/api/patients/"+patientId+"/tests/"+testId+"/results",
        method: "post",
        data: {test: test},
        success: function(res, status){
            alert("Teste submetido");
        }
    });
}




