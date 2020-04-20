const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const testId = parseInt(sessionStorage.getItem("testId"));
const patientId = parseInt(sessionStorage.getItem("patientId"));
var coords;
var test

window.onresize = function(){
    context.canvas.width = document.getElementById("test").clientWidth
    context.canvas.height = document.getElementById("test").clientHeight
}

window.onload = function(){
    context.canvas.width = document.getElementById("test").clientWidth
    context.canvas.height = document.getElementById("test").clientHeight
    navigator.geolocation.getCurrentPosition(success, error);
    getUserTests(1,{evalId:5}, loadPagination)



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

function getUserTests(userId, params, callback){
    var url = '/api/users/'+userId+'/tests/'
    if(params){
        url+='?'
        for(p in params){
            url+=p+'='+params[p]+'&'
        }
        url = url.slice(0,-1)
    }
    $.ajax({
        url:url,
        method:'get',
        success:function(result){
            test = result.tests[0]
            callback(test)
        }
    })
}

function loadPagination(test){
    var str = "<a>&laquo;</a>"
    var i = 1
    for(t of test.test){
        str+="<a"
        if(i == 1){
            str+=" class='active'"
        }
        str+=">"+i+"</a>"
        i++
    }
    str+="<a onclick = 'loadNextTest()'>&raquo;</a>"
    document.getElementById("pagination").innerHTML = str
    loadTest(test.test[0])
}

function loadNextTest(){
    var pag = document.getElementsByClassName("active")[0]
    pag.classList.remove("active")
    var index = JSON.parse(pag.textContent)
    console.log(index)
    pag = document.getElementById("pagination").children
    console.log(pag)

    pag[index+1].classList.add("active")

    if(index == test.test.length){
        alert("Teste terminado")
    }
    if(index > 1){
        endTest(test.test[index-1])
    }
    loadTest(test.test[index])
}

function endTest(test){
    console.log(test)
    var str = "end"+test.type+"Test"
    window[str](test)
}

function loadTest(test){
    var str = "load"+test.type+"Test"
    window[str](test) 

}




