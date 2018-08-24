
//WELCOME SCREEN
document.querySelector('.welcome-text').style.display = 'none';

for (var i = 0; i < 3; i++){
    document.querySelector('.wrong-0-' + i).style.display = 'none';
    document.querySelector('.wrong-1-' + i).style.display = 'none';
    document.querySelector('.wrong-0-' + i).style.display = 'none';
    document.querySelector('.wrong-1-' + i).style.display = 'none';
    document.querySelector('#ans-pts-' +i).style.display = 'none';
}
document.querySelector('#ans-pts-3').style.display = 'none';
document.querySelector('#ans-pts-4').style.display = 'none';
document.querySelector('#round-pts').style.display = 'none';


//document.addEventListener('keypress', function(event) {
//            if (event.keyCode === 32 || event.keyCode == 65) {
//                console.log('space clicked');
//                document.querySelector('#answer-0').textContent = 'Najlepsza odpowiedz';
//            }
//});

//Funkcja przeliczajaca obecny errorPoints i w stosunku do tego i active playera wyswietla odpowiedni error

function showErrors() {
    var smallErr = '|   | \n \\/ \n /\\ \n|   |';
    
    document.querySelector('.wrong-0-0').textContent = smallErr;
    document.querySelector('.wrong-0-1').textContent = smallErr;
    document.querySelector('.wrong-0-2').textContent = smallErr;
    document.querySelector('.wrong-1-0').textContent = smallErr;
    document.querySelector('.wrong-1-1').textContent = smallErr;
    document.querySelector('.wrong-1-2').textContent = smallErr;
}

//Odswierzany po kazdej dobrej odpowiedzi
function updateRoundScore(points) {
    document.querySelector('#round-pts').textContent = 'SUM ' + points;
}

// BEGIN ROUND
/*function init (){
    document.querySelector('.welcome-text').style.display = 'none';
    
    for (var i = 0; i < 5; i++){
           document.querySelector('#ans-pts-' +i).style.display = 'block';
    }
    document.querySelector('#round-pts').style.display = 'block';
    
}*/

// Show one of the answers (after correct or end of the round)
function showAnwer (num) {
    document.querySelector('#answer-' + num).textContent = 'Jedna z odpowiedzi'; 
}

var screenController = (function() {
    
    return {
        //Show one answer
        showOnScreen : function (queNum, ansNum) {
            document.querySelector('#answer-' + ansNum).textContent = question[queNum][ansNum]; 
        }
    }
})();

var question = [];
var questionController = (function() {
    
    return {
        //*pozniej raczej kontrola rundy = liczba odp
        
        // Add new question from console
        addQuestion : function (que, ans1, ans2, ans3) {
            var queNum = question.length;
            console.log(queNum);
            question.push([]);
            question[queNum].push(que,ans1,ans2,ans3);
        },
        
        // Show all questions
        showQuestions : function () {
            for (var i = 0; i < question.length; i++) {
                console.log(question[i]);
            }
        }
    }
})();

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
 });
}

//przyklad dzialania podwojnej tablicy
//
//var que = [[]];
//
//que[0].push('pyt1', 'odp1','odp2', 'odp3');
//que.push([]);
//que[1].push('pyt2', 'odp1','odp2', 'odp3');
//console.log(que[0][1]);





