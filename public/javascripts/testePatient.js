const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");



$("#startBtn").click(function(){
    btnTxt = $(this).html();
    if(btnTxt == "Começar"){
        startRey();
        $(this).html("Proximo");
        
    }else if(btnTxt == "Proximo"){
        stopRecording();
        var serRec = serializeDrawing(drawing);
        alert(JSON.stringify(serRec));
        context.clearRect(0,0, canvas.width, canvas.height);
        $.ajax({
            url: "/api/clientes/1/ficha/testes/1/resultados",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(serRec),
            success: function(res, status){
                alert("Sucesso");
                window.location = "/resultsNero.html";
            }
        });
    }
    
    $("#startBtn").prop("value","Proximo");
});

function imgAnimation(img){
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
}

/*const circles = [
    {
        id: "Começar", x: 200, y:200, radius: 30, color: "rgb(255,0,0)"
    },
    {
        id: "Terminar", x: 0, y: 0, radius: 30, color: "rgb(0,255,0)"
    }
];

circles.forEach(function(circle){
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI, false);
    context.fillStyle = circle.color;
    context.fill();
});

canvas.addEventListener("click", function(event){
    var mousePos = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top
    };
    circles.forEach(circle => {
        if(isIntersect(mousePos, circle)){
            alert("click on circle: " + circle.id);
        }
    })
})

function isIntersect(point, circle){
    return Math.sqrt((point.x - circle.x)**2 + (point.y - circle.y)**2) < circle.radius;
}*/