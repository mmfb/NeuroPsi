const dropdownImg = document.getElementById("dropdownImg")

function loadDrawParam(test){
    var params = test.params[0]
    if(params.dropdownCheck){
        loadDropdownImg(dropdownImg, params, "Desenhar figura")
    }
    startDrawTest("canvas")
}

function loadDropdownImg(dropdown, params, text){
    console.log(params)
    var img  = new Image()
    img.onload = function(){
        var w = params.imgWidth
        var h = params.imgHeigt
        var str = "<img src ="+params.imgPath+" width='100' height='"+100*h/w+"'><div id='dropdownImg-content'><img src="+params.imgPath+" width='"+w+"' height='"+h+"'>"
        if(text){
            str+="<div class='desc'>"+text+"</div>"
        }
        str+="</div>"
        console.log(str)
        dropdown.innerHTML=str
    }
    img.src = params.imgPath
}

function drawImageOnCanvas(){
    var src = document.getElementById("imgUrl").value;
    var w = document.getElementById("imgW").value;
    var h = document.getElementById("imgH").value;
    var x = document.getElementById("imgX").value;
    var y = document.getElementById("imgY").value;
    document.getElementsByClassName("dropdownImg")[0].innerHTML="";
    previewCtx.clearRect(0, 0, preview.width, preview.height);
    loadImage(src,w,h,x,y);
}

function loadImage(src) {
    var img = new Image();
    img.onload = function(){
        return img
    }
    img.src = src;
}

function startDrawTest(canvasId){
    startDraw(canvasId)
    startRecording()
}

function endDrawTest(test){
    stopRecording()
    var serRec = serializeDrawing(drawing);
    /*$.ajax({
        url: "/api/patients/"+patientId+"/tests/"+testId+"/results",
        method: "post",
        data: {lat: coords.lat, lng: coords.lng, rec: JSON.stringify(serRec)},
        success: function(res, status){
            alert("Teste submetido");
        }
    });*/
}