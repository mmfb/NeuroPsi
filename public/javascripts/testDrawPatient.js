const dropdownImg = document.getElementById("dropdownImg")

function loadDrawParam(test){
    var params = test.params[0]
    loadDropdownImg(dropdownImg, params, "Desenhar figura")
    startDrawTest("canvas")
}

function loadDropdownImg(dropdown, params, text){
    var img  = new Image()
    img.onload = function(){
        var w = params.imgWidth
        var h = params.imgHeigt
        var str = "<img src ="+params.imgPath+" width='100' height='"+100*h/w+"'><div id='dropdownImg-content'><img src="+params.imgPath+" width='"+w+"' height='"+h+"'>"
        if(text){
            str+="<div class='desc'>"+text+"</div>"
        }
        str+="</div>"
        dropdown.innerHTML=str
    }
    img.src = params.imgPath
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

function saveDrawResult(param){
    stopRecording()
    var serRec = serializeDrawing(drawing);
    param.result = {serRec: serRec}
}