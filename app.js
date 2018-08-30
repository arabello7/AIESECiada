
//WELCOME SCREEN
//*potem do dodania do init
//document.querySelector('.welcome-text').style.display = 'none';
//
//for (var i = 0; i < 3; i++){
//    document.querySelector('.wrong-0-' + i).style.display = 'none';
//    document.querySelector('.wrong-1-' + i).style.display = 'none';
//}
//for (var i = 0; i < 5; i ++) {
//    document.querySelector('#ans-pts-' + i).style.display = 'block';
//}
//document.querySelector('#round-pts').style.display = 'none';


//document.addEventListener('keypress', function(event) {
//            if (event.keyCode === 32 || event.keyCode == 65) {
//                console.log('space clicked');
//                document.querySelector('#answer-0').textContent = 'Najlepsza odpowiedz';
//            }
//});

//Funkcja przeliczajaca obecny errorPoints i w stosunku do tego i active playera wyswietla odpowiedni error

function errorScore () {
    var activeTeam = 0;
    var teamErrCount = [];
    var answer;
    
    if (answer === -1) {
        teamErrCount[activeTeam]++;
    }
    screenController.showOneError(activeTeam,teamErrCount);
}

//!!! WHERE THE FUN BEGINS

// Dostępne z zewnatrz, potem mozna dodac getData w dataControllerze
var data = [];
var teamErrCount = [];
// na wszelki
teamErrCount[0] = 0;
teamErrCount[1] = 0;
var activeTeam = 0;

// OBSLUGA CONSOLI
var consoleController = (function() {
    var roundScore = 0;
    
    // Wczytuje podana odpowiedz i przekazuje do wyswietlania
    function readAnswer (queNum) {
        
        // czy to powinno byc ciagle aktywne??, mozna tylko max liczba razy + obsluga wyjscia po wygranej/przegranej
        document.addEventListener('keypress', function(event) {
                var input = document.querySelector('input[name="getAnswer"]');
                if(event.keyCode === 13) {
                    console.log('answer: ' + input.value);
                    
                    var ans = input.value;
                    var scale = data[queNum].answers.length;
                    
                    if (ans === '-1') {
                        screenController.showOneError();
                        document.querySelector('.wrong-' + activeTeam + '-' + teamErrCount[activeTeam]).textContent = 'x';
                        teamErrCount[activeTeam]++;
                    } else if (ans > scale - 1 || ans < -1) {
                        console.log('Answer out of scale! Repeat.');
                    } else if (ans >= 0 && ans <= scale) {
                        screenController.putAnsOnScreen(0, input.value);
                        screenController.updateRoundScore(roundScore + input.value);
                    }
                }
            });
    }
    return {
        //*pozniej raczej kontrola rundy = liczba odp
        
        // Wyswietla na konsoli pytanie i odpowiedzi
        printAnswers : function (queNum) {
            // Wyswietla pytanie
            console.log(data[queNum].question);
            
            // Wyswietla wszystkie odpowiedzi do konsoli
            var n = data[queNum].answers.length;
            for (var i = 0; i < n; i++) {
                 console.log(i + '. ' + data[queNum].answers[i]);
            }
            console.log('-1. Żadna z powyższych');
            // Funkcja wczytująca pole tekstowe
            readAnswer(queNum);
        }
    }
})();

// OBSLUGA BAZY DANYCH
var dataController = (function () {
    
    // Obiekt do zapisu danych - pytania, odpowiedzi i punkty za nie
    function Data (ques, ans, pts) {
        this.question = ques;
        this.answers = ans;
        this.points = pts;
    }
    
    return {
        loadData : function () {
            data[0] = new Data('Przedmiot szkolny, który najmniej przydaje się w życiu?', ['Geografia', 'Kanapka'], [9, 47]);
            data[1] = new Data('Więcej niż jedno zwierzę to?', ['Owca', 'Lama'], [1, 99]);
        }
    }
})();


// OBSLUGA EKRANU GRY
var screenController = (function() {  
    return {
        
        //Show one answer, ansNum = [0..4]
        putAnsOnScreen : function (queNum, ansNum) {
            document.querySelector('#ans-' + ansNum).textContent = data[queNum].answers[ansNum];
            document.querySelector('#ans-pts-' + ansNum).textContent = data[queNum].points[ansNum];
        },
        resetRound : function () {
            
            // not needed to execute every round - can be moved
            document.querySelector('.welcome-text').style.display = 'none';

            for (var i = 0; i < 3; i++){ //wczesniej bylo none
                document.querySelector('.wrong-0-' + i).textContent = '';
                document.querySelector('.wrong-1-' + i).textContent = '';
            }

            for (var i = 0; i < 5; i ++) {
                document.querySelector('#ans-pts-' + i).textContent = 0;
                document.querySelector('#ans-pts-' + i).style.display = 'block';
            }
            
            document.querySelector('#round-pts').textContent = 'SUM 0';
            document.querySelector('#round-pts').style.display = 'block';
        },
        // Shows just FAMILIADA text
        welcomeText : function () {
            document.querySelector('.welcome-text').style.display = 'block';
            for (var i = 0; i < 5; i ++) {
                document.querySelector('#ans-pts-' + i).style.display = 'none';
            }
        },
        
        //Odswierzany po kazdej dobrej odpowiedzi
        updateRoundScore : function (points) {
            document.querySelector('#round-pts').textContent = 'SUM ' + points;
        },
        
        // Wyswietla pojedynczy blad
        showOneError : function () {
            var smallErr = '|   | \n \\/ \n /\\ \n|   |'; //byc moze potrzebne glob
//            document.querySelector('.wrong-' + activeTeam + '-' + teamErrCount[activeTeam]).style.display = 'block';
            document.querySelector('.wrong-' + activeTeam + '-' + teamErrCount[activeTeam]).textContent = smallErr;
            //w score ctrl teamErrCount[activeTeam]++;
        }

    }
})();

//TO BEGIN
//consoleController.printAnswers(0);
//var i;
//consoleController.readAnswer(i);


// Shows just FAMILIADA text
function init () {
    dataController.loadData();
    screenController.welcomeText();
    document.querySelector('.welcome-text').style.display = 'none'; //do testow
    screenController.resetRound();
    consoleController.printAnswers(0);
}
