
/*if(document.getElementById("dropdownCheck").checked){
    dropdownImgInjection("Desenhar esta figura")
}
else{
    drawImageOnCanvas()
}*/

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

function loadImage(src) {
    var img = new Image();
    img.onload = function(){
        return img
    }
    img.src = src;
}

function loadDrawParams(elemId, exer){
    var elem = document.getElementById(elemId).children[0]
    //elem.setAttribute('data-function', 'saveParamsInTest')
    str="<form id='paramForum' onSubmit='return false;'>"
            +"<p>Imagem</p>"
            +"<label>url: </label>"
            +"<input type='text' id='imgPath'><br>"
            +"<p>Tamanho</p>"
            +"<label>altura: </label>"
            +"<input type='number' min='0' value='0' id='imgHeight'>"
            +"<label>largura: </label>"
            +"<input type='number' min='0' value='0' id='imgWidth'>"
            +"<p>Tempo</p>"
            +"<input type='number' min='0' value='0' id='imgTime'>"
            +"<label>min</label>"
        +"</form>"
    elem.innerHTML=str;
    if(exer){
        var param = exer.params[paramIndex]
        insertParamsFromTest(param)
        dropdownImgInjection("Desenhar esta figura")
    }else{
        test.exer[exerIndex].type = "Draw"
        passParamsToExer("paramForum", exerIndex, paramIndex)
    }
}

function loadDrawInPreview(param){
    passParamsToExer("paramForum", exerIndex, paramIndex)
    console.log(param)
}


