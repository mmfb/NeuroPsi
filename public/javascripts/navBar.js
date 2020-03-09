const badgeCompleted = document.getElementById("badgeCompleted")
const badgePending = document.getElementById("badgePending")
const userId = sessionStorage.getItem("userId")

updateNotification(badgeCompleted, userId, "Completed");
updateNotification(badgePending, userId, "Pending");

function updateNotification(element, userId, testState){
    if(element){
        testState = JSON.stringify(testState)
        $.ajax({
            url:'/api/users/'+userId+'/tests/'+testState,
            method:'get',
            success: function(result, status){
                element.innerHTML = result.tests.length
            },
            error: function(){
                console.log("Error");
            }
        })
    }  
}
