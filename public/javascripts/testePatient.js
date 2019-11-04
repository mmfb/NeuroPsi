const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

window.onload = window.setTimeout(startAnimation, 100);

function startAnimation(){
    const elem = document.getElementsByClassName(".btn btn-white btn-animate");
    elem.style.transform = "translateY(-3px)";
    elem.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
}

function openSlideMenu(){
	document.getElementById('sideMenu').style.width='240px';
}
function closeSlideMenu(){
    document.getElementById('sideMenu').style.width=0;
}

function startRey(){
    var img = new Image();
    img.onload = function(){
        context.drawImage(img, canvas.width/2 - img.width/2, canvas.height/2 - img.height/2);
    };
    img.src = "images/reyImage.gif";
    window.setTimeout(startDraw, 1000);
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