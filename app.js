
//WELCOME SCREEN
document.querySelector('.welcome-text').style.display = 'block';

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
function init (){
    document.querySelector('.welcome-text').style.display = 'none';
    
    for (var i = 0; i < 5; i++){
           document.querySelector('#ans-pts-' +i).style.display = 'block';
    }
    document.querySelector('#round-pts').style.display = 'block';
    
}

// Show one of the answers (after correct or end of the round)
function showAnwer (num) {
    document.querySelector('#answer-' + num).textContent = 'Jedna z odpowiedzi'; 
}

