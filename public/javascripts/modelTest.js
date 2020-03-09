const canvas = document.getElementById("canvas");
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const context = canvas.getContext("2d");
const combobox = document.getElementById("polygon");
const checkbox = document.getElementById("checkbox");

var list = [];

window.onload = function(){
    context.canvas.width = window.innerWidth*0.5;
    context.canvas.height = window.innerHeight*0.5;

    canvas.addEventListener('click', function(e){
        var x = e.pageX - canvasLeft;
        var y = e.pageY - canvasTop;
        if(checkbox.checked){
            addElementToCanvas(x,y)
        }else{
            selectElementFromCanvas(x,y)
        }
        

    })
}

function addElementToCanvas(x,y){

    var polygon = combobox.options[combobox.selectedIndex].value;

    list.push({fn: polygon, params: [x, y, 50, 0, 2*Math.PI]})

    context.beginPath();
    context[polygon](x, y, 50, 0, 2*Math.PI);
    context.stroke();
}

function selectElementFromCanvas(x,y){

    var index = -1; 

    for(i=0; i<list.length; i++){
        if(Math.pow((x - list[i].params[0]), 2) + Math.pow((y - list[i].params[1]), 2) <= Math.pow(list[i].params[2], 2)){
            index = i;
        }
    }

    if(index != -1){
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(i=0; i<list.length; i++){
            context.beginPath();
            if(i == index){
                context.lineWidth = 10;
            }else{
                context.lineWidth = 1;
            }
            var fn = list[i].fn;
            context[fn](list[i].params[0], list[i].params[1], 50, 0, 2*Math.PI);
            context.stroke();
        }
    }
}





