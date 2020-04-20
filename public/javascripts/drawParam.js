
$("#dropdownCheck").change(function(){
    if(this.checked){
        dropdownImgInjection("Desenhar esta figura")
    }
    else{
        drawImageOnCanvas()
    }
})

$(document).on("keypress", "input", function(e){
    if(e.which == 13){
        if(document.getElementById("dropdownCheck").checked){
            dropdownImgInjection("Desenhar esta figura")
        }
        else{
            drawImageOnCanvas()
        }
    }
});

function dropdownImgInjection(text){
    var src = document.getElementById("imgPath").value;
    var img  = new Image()
    img.onload = function(){
        var w = img.width
        var h = img.heigt
        previewCtx.clearRect(0, 0, preview.width, preview.height);
        str = "<img src ="+src+" width='100' height='"+100*h/w+"'><div id='dropdownImg-content'><img src="+src+" width='"+w+"' height='"+h+"'>"
        if(text){
            str+="<div class='desc'>"+text+"</div>"
        }
        str+="</div>"
        document.getElementById("dropdownImg").innerHTML=str
    }
    img.src = src
}

function drawImageOnCanvas(){
    var src = document.getElementById("imgPath").value;
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

function loadDrawParams(elemId, test){
    var elem = document.getElementById(elemId).children[0]
    //elem.setAttribute('data-function', 'saveParamsInTest')
    str="<form onSubmit='return false;'>"
            +"<p>Imagem</p>"
            +"<label>url: </label>"
            +"<input type='text' id='imgPath'><br>"
            +"<label>Imagem dropdown: </label>"
            +"<input type='checkbox' id='dropdownCheck'>"
            +"<p>Tamanho</p>"
            +"<label>altura: </label>"
            +"<input type='number' min='0' value='0' id='imgHeight'>"
            +"<label>largura: </label>"
            +"<input type='number' min='0' value='0' id='imgWidth'>"
            +"<p>Posição</p>"
            +"<label>x: </label>"
            +"<input type='number' min='0' value='0' id='imgPosX'>"
            +"<label>y: </label>"
            +"<input type='number' min='0' value='0' id='imgPosY'>"
            +"<p>Tempo</p>"
            +"<input type='number' min='0' value='0' id='imgTime'>"
            +"<label>min</label>"
        +"</form>"
    elem.innerHTML=str;
    if(test){
        insertParamsFromTest(test)
    }else{
        tests[testIndex].type = "Draw"
        elem = getTestImgElem(testIndex)
        //elem.setAttribute('data-function', 'loadDrawParams')
        saveParamsInTest("testParam", testIndex)
    }
}

function insertParamsFromTest(tests){
    for(test of tests){
        for(param of test.params){
            document.getElementById(param).value = test.params[param]
        }
    }
}

