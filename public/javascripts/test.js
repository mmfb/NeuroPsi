
CanvasElement = function(x, y){
    this.x = x
    this.y = y
    this.width = 40
    this.height = 40

    this.drawElement(){
        
    }
}

Polygon = function(x, y){
    CanvasElement.call(this,x,y)
}

Circle = function(x, y){
    Polygon.call(this,x,y)
    this.r = (this.width - 10)/2
}

Rectangle = function(x, y, w, h){
    Polygon.call(this,x,y)
    this.w = this.width - 10
    this.h = this.height - 10
}

TextBox = function(x,y){
    CanvasElement.call(this,x,y)
    this.fontSize = 10
    this.font = "Arial"
    this.color = "black"
}





