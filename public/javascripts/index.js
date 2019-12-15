
var yourValue = 'something';

$("#loginBtn").click(function(){
    var name = $("#email").val();
    $.ajax({
        url: "/api/users/" + name,
        method: "get",
        contentType: "application/json",
        dataType: "json",
        success: function(result, status){
            if(result.err){
                console.log(JSON.stringify(result));
                return;
            }
            if(!result.user){
                alert("Esse utilizador não existe");
            }else{
                if(result.user.patientId != null){
                    window.location = "testePatient.html";
                }else if(result.user.neroId != null){
                    window.location = "patientsList.html?yourkey="+yourValue;
                }
            }
        }
    })
})

$.notify('Aqui');
$('#loginBtn').notify("Hello", 'info');
