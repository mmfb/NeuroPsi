
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
                    sessionStorage.setItem("patientId", result.user.patientId);
                    window.location = "mainPatient.html";
                }else if(result.user.neroId != null){
                    sessionStorage.setItem("neroId",result.user.neroId);
                    window.location = "patientsList.html";
                }
            }
        }
    })
})
