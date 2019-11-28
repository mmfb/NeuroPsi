function openSlideMenu(){
	document.getElementById('sideMenu').style.width='240px';
}
function closeSlideMenu(){
    document.getElementById('sideMenu').style.width=0;
}

var patients;

window.onload = function(){
    var patientsT = document.getElementById("patients");
    $.ajax({
        url:"/api/patients",
        method:"get",
        success: function(result, status){
            patients = result;
            var str="";
            for(i in patients){
                str+="<tr><td><img src='images/login pic.png'></td><td>"+patients[i].id+"</td><td>"+patients[i].name+
                "</td><td>"+patients[i].age+
                "</td><td><div class='dropdown'><button class='dropbtn'>V</button><div class='dropContent'><a href='#'>Link 1</a><a href='#'>Link 2</a><a href='#'>Link 3</a></div></div></td></tr>"
            }
            patientsT.innerHTML = str;
        },
        error: function(){
            console.log("Error");
        }
    })
};


