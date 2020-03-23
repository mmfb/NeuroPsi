const canvas = document.getElementById("canvas");
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const context = canvas.getContext("2d");
const imgURL = document.getElementById("imgURL")
const imgHeight = document.getElementById("imgHeight")
const imgWidth = document.getElementById("imgWidth")
const imgX = document.getElementById("imgX")
const imgY = document.getElementById("imgY")

context.canvas.width  = window.innerWidth*0.99;
context.canvas.height = window.innerHeight*0.90;


function loadImg(){
    var img = new Image()
    img.src = imgURL.value
    context.drawImage(img,0,0)
}





