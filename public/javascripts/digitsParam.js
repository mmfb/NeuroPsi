

function loadDigitsParams(elemId, exer){
    var elem = document.getElementById(elemId).children[0]
    str="<form id = 'paramForum' onSubmit='return false;'>"
            +"<p>Instruções</p>"
            +"<textarea id='question' rows='4' cols='50'></textarea>"
            +"<p>Cartas</p>"
            +"<label>número: </label>"
            +"<input type='number' min='0' max='10' value='0' id='numCards'>"
            +"<p>Resposta certa</p>"
            +"<input type='text' id='correctAnswer'>"
            +"<input type='text' id='cardsInfo' value='[]'>"
        +"</form>"
    elem.innerHTML=str;
    if(exer){
        var param = exer.params[paramIndex]
        insertParamsFromTest(param)
    }else{
        test.exer[exerIndex].type = "Digits"
    }
    param = test.exer[exerIndex].params[paramIndex]
    loadDigitsInPreview(param)
}

function loadDigitsInPreview(param){
    passParamsToExer("paramForum", exerIndex, paramIndex)
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
    str+="</div>"
    var elem = document.getElementById("preview")
    elem.innerHTML = str
}

function loadCardParam(elem, cardIndex){
    elem.onclick = 'none'
    var param = test.exer[exerIndex].params[paramIndex]
    var cards = JSON.parse(param.cardsInfo)
    var card = cards[cardIndex]
    var str = "<form id='cardForm'>"
            +"<label>num: </label>"
            +"<input type='number' min='0' max='10' value='"+card.cardNum+"' id='cardNum'>"
            +"<label>char: </label>"
            +"<input type='text' pattern='[A-Za-z]{1}' value='"+card.cardChar+"' id='cardChar'>"
            +"</form>"
    elem.innerHTML = str

    elem.addEventListener("keyup", function(event) {
        if (event.keyCode === 13){
          event.preventDefault();
          loadCardsInfo(elem, cardIndex)
        }
    });
}

function loadCardsInfo(elem, cardIndex){
    var exer = test.exer[exerIndex]
    var param = exer.params[paramIndex]
    var cards = JSON.parse(param.cardsInfo)
    var cardNum = document.getElementById('cardNum').value
    var cardChar = document.getElementById('cardChar').value
    cards[cardIndex]={index:cardIndex, cardNum:cardNum, cardChar:cardChar}
    param.cardsInfo = JSON.stringify(cards)
    insertParamsFromTest(param)
    loadDigitsInPreview(param)
}