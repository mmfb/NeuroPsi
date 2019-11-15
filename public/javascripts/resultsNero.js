window.onload = function(){
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    $.ajax({
        url: "/api/clientes/1/ficha/testes/1/resultados",
        method: "get",
        success: function(serRec, status){
            alert(JSON.stringify(serRec));
            var rec = deserializeDrawing(serRec)
            startDraw("canvas");
            drawing.recordings = rec;
            //set drawing property of each recording
			for (var i = 0; i < rec.length; i++)
                rec[i].drawing = drawing;
            $("#playBtn").show();
        }
    });
}