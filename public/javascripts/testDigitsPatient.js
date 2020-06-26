function loadDigitsParam(param){
    var question = param.question
    var str = "<p>"+question+"</p><div id='cardsConteiner'>"
    var numCards = JSON.parse(param.numCards)
    var cards = JSON.parse(param.cardsInfo)
    for(i=0;i<numCards;i++){
        var index = i+1
        str+="<div onclick='loadCardParam(this, "+i+")' class='card'><div id=indexBox>"+index+"</div>"
        if(cards[i]){
            var cardNum = cards[i].cardNum
            str+="<div id='charsConteiner'>"
            for(j=0;j<cardNum;j++){
                str+="<div class='chars'>"+cards[i].cardChar+"</div>"
            }
            str+="</div>"
        }else{
            cards.push({index:i, cardNum:0, cardChar:""})
        }
        param.cardsInfo = JSON.stringify(cards)
        str+="</div>"
    }
    str+="</div><div id='answerField'><label>Resposta: </label><input type='number'></div>"
    var elem = document.getElementById("test")
    elem.innerHTML = str
    
}

const answerI = document.getElementsByTagName("input")[0]

function saveDigitsResult(param){
    param.result = {answer: JSON.parse(answerI.value)}
}