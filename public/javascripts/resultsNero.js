const patientId = 2;
window.onload = function(){
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    $.ajax({
        url: "/api/patients/"+patientId+"/tests/completed/replay",
        method: "get",
        success: function(result, status){
            if(result){
                var serRec = result.rec;
                var rec = deserializeDrawing(JSON.parse(serRec));
                console.log(rec);
                startDraw("canvas");
                drawing.recordings = rec;
                //set drawing property of each recording
                for (var i = 0; i < rec.length; i++){
                    rec[i].drawing = drawing;
                }
            }  
        }
    });
}