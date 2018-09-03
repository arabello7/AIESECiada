



//!!! WHERE THE FUN BEGINS

// Dostępne z zewnatrz, potem mozna dodac getData w dataControllerze
var data = [];
var teamErrCount = [];
teamErrCount[0] = 0;
teamErrCount[1] = 0;
var activeTeam = 0;

// OBSLUGA CONSOLI
var consoleController = (function() {
    var roundScore = 0;
    
    function changeTeam () {
        // Errors condition
        if (teamErrCount[activeTeam] > 3) { //4 może jako big error?
            activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
        }  
    }
    
    return {
    // Wczytuje podana odpowiedz i przekazuje do wyswietlania
        readAnswer : function (queNum, input) {

            // czy to powinno byc ciagle aktywne??, mozna tylko max liczba razy + obsluga wyjscia po wygranej/przegranej
//            var out = document.addEventListener('keypress', function(event) {
//                    var input = document.querySelector('input[name="getAnswer"]');
//                    if(event.keyCode === 13) {
                        console.log('answer: ' + input);

                        var ans = input;
                        var scale = data[queNum].answers.length;

                        if (ans === '-1') {
                            // After wrong answer
                            screenController.showOneError();
                            teamErrCount[activeTeam]++;
                            // Checks if should change the team
                            changeTeam();
                        } else if (ans >= 0 && ans <= scale) {
                            // After right answer
                            screenController.putAnsOnScreen(0, input);
                            screenController.updateRoundScore(roundScore + input);
                        } else {
                            // Catching error
                            console.log('Answer out of scale! Repeat.');
                        }
//                        return data[queNum].points[input.value];
//                    }
//                });
            // Returned value to check higher points
//            return out;
        },
        
        // Printing question and answers in console
        printAnswers : function (queNum) {
            console.log(data[queNum].question);
            
            var n = data[queNum].answers.length;
            for (var i = 0; i < n; i++) {
                 console.log(i + '. ' + data[queNum].answers[i]);
            }
            console.log('-1. Żadna z powyższych');
            // Funkcja wczytująca pole tekstowe
//            readAnswer(queNum); 
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
            data[0] = new Data('Przedmiot szkolny, który najmniej przydaje się w życiu?', ['Kanapka', 'Geografia'], [47, 9]);
            data[1] = new Data('Więcej niż jedno zwierzę to?', ['Lama', 'Owca'], [99, 1]);
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
            var smallErr = '|   | \n \\/ \n /\\ \n|   |';
            document.querySelector('.wrong-' + activeTeam + '-' + teamErrCount[activeTeam]).textContent = smallErr;
        }

    }
})();

// TO BEGIN
//function init () {
    dataController.loadData();
    screenController.welcomeText();
    document.querySelector('.welcome-text').style.display = 'none'; //do testow
    screenController.resetRound();
//    consoleController.printAnswers(0);
//}


//function roundOne () {
//    //
//}

function roundTwo () {
    // *usun jedno pole odpowiedzi
    // *usun jeden przycisk odpowiedzi
}


//TESTING

// Obsługa pulpitu zgłaszania się
//function startRound () {
//    // Team 0 wciska lewy ctrl
//    document.addEventListener('keypress', function(event) {
//        if(event.keyCode === 17) {
//            console.log('active:' + 0) ;
//            goon(); //umozliwia dalsza część
//        }
//    });
//
//    // Team 1 wciska strzalke w prawo
//    document.addEventListener('keypress', function(event) {
//        if(event.keyCode === 39) {
//            console.log('active:' + 1);
//            goon(); //umozliwia dalsza część
//        }  
//    });
//    console.log('startRound finished');
//}

//function readFirstAns () {
//    document.addEventListener('keypress', function(event) {
//                var input = document.querySelector('input[name="getAnswer"]');
//                if(event.keyCode === 13) {
//                    activeTeam = input.value;
//                    console.log('active team: ' + input.value);
//                }
//    });
//}
    

//TESTING
var queNum = 0;
// Wybór grającej drużyny, potem do ukrycia w odpowiednim kontrolerze
var firstAns = [];
firstAns[0] = 0;
firstAns[1] = 0;

console.log('active: ' + activeTeam);
consoleController.printAnswers(queNum);
//firstAns[activeTeam] = consoleController.readAnswer(queNum);
//
//activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
//console.log('active: ' + activeTeam);
//firstAns[activeTeam] = consoleController.readAnswer(queNum);
//
//
////Wybór teamu, ktory zaczął z lepszą odpowiedzią
//if (firstAns[0] > firstAns[1]) activeTeam = 0;
//else activeTeam = 1;
//
//console.log('active: ' + activeTeam);
//
////consoleController.readAnswer(queNum);
// Obsługa przycisku button roll po obu stronach

roundOne();
function roundOne () {
    buttonsController();
    
}

function buttonsController(){
    var pts;
    document.querySelector('#btn-0').addEventListener('click', function() {
    pts = consoleController.readAnswer(queNum,0);
    document.querySelector('#btn-0').style.display = 'none';
    });
    
    document.querySelector('#btn-1').addEventListener('click', function() {
    pts = consoleController.readAnswer(queNum,1);
    document.querySelector('#btn-1').style.display = 'none';
    });

    document.querySelector('#btn-4').addEventListener('click', function() {
        consoleController.readAnswer(queNum,'-1');
        pts = 0;
    });
    return pts;
}


