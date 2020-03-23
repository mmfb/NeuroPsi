//const canvas = document.getElementById("canvas")
//const context = canvas.getContext("2d")

CanvasElement = function(x, y){
    this.width = 50
    this.height = 50
    this.x = x-this.width/2
    this.y = y-this.height/2
    this.selected = false

    this.select = function(){
        var selectionArea = new SelectionArea(this.x,this.y,this.width,this.height)
        selectionArea.draw()
    }

    this.checkIfSelected = function(mousex, mousey){
        if(mousex>=this.x && mousex<=this.x+this.width && mousey>=this.y && mousey<=this.y+this.height){
            return true
        }else{
            return false
        }
    }
}

Polygon = function(x, y){
    CanvasElement.call(this,x,y)
}

Ellipse = function(x, y){
    Polygon.call(this,x,y)
    this.radiusX = (this.width)/2
    this.radiusY = (this.height)/2

    this.draw = function(){
        context.beginPath()
        context.ellipse(this.x+this.width/2,this.y+this.height/2,this.radiusX,this.radiusY,0,0,2*Math.PI)
        context.stroke();
        if(this.selected){
            this.select()
        }
    }
}

Rectangle = function(x, y){
    Polygon.call(this,x,y)
    this.w = this.width
    this.h = this.height

    this.draw = function(){
        context.beginPath()
        context.rect(this.x,this.y,this.w,this.h)
        context.stroke();
        if(this.selected){
            this.select()
        }
    }
}

TextBox = function(x,y){
    CanvasElement.call(this.x,this.y)
    this.fontSize = 10
    this.font = "Arial"
    this.color = "black"
}

SelectionArea = function(x,y,w,h){
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.cornerLT = new ResizeArea(this.x,this.y)
    this.cornerRT = new ResizeArea(this.x+this.w,this.y)
    this.cornerLB = new ResizeArea(this.x,this.y+this.h)
    this.cornerRB = new ResizeArea(this.x+this.w,this.y+this.h)
    this.sideL = new ResizeArea(this.x,this.y+this.h/2)
    this.sideR = new ResizeArea(this.x+this.w,this.y+this.h/2)
    this.sideT = new ResizeArea(this.x+this.w/2,this.y)
    this.sideB = new ResizeArea(this.x+this.w/2,this.y+this.h)

    this.draw = function(){
        context.beginPath()
        context.setLineDash([2]);
        context.rect(this.x,this.y,this.w,this.h)
        context.stroke()
        context.setLineDash([]);
        this.cornerLT.draw()
        this.cornerRT.draw()
        this.cornerLB.draw()
        this.cornerRB.draw()
        this.sideL.draw()
        this.sideR.draw()
        this.sideT.draw()
        this.sideB.draw()

    }
}

ResizeArea = function(x,y){
    this.x = x
    this.y = y
    this.r = 4

    this.draw = function(){
        context.beginPath()
        context.ellipse(this.x,this.y,this.r,this.r,0,0,2*Math.PI)
        context.stroke();
    }
}






