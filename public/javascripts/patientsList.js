
var neroId = 1;

window.onload = function(){
    var patientsT = document.getElementById("patients");
    $.ajax({
        url:"/api/nero/"+neroId+"/patients",
        method:"get",
        success: function(result, status){
            var str="";
            for(p of result.patients){
                str+="<tr><td><img src='images/login pic.png'></td><td>"+p.patientId+"</td><td>"+p.name+
                "</td><td>"+p.birthdate+
                "</td><td><div class='dropdown'><button class='dropbtn'>V</button><div class='dropContent'><a href='#'>Link 1</a><a href='#'>Link 2</a><a href='#'>Link 3</a></div></div></td></tr>"
            }
            patientsT.innerHTML = str;
        },
        error: function(){
            console.log("Error");
        }
    })
};


