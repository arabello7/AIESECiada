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
    var firstAns = [];
    firstAns[0] = 0; //na 2 runde wyzerowanie 
    firstAns[1] = 0;
    
    // Zmienia team po 3 blednych
    function changeTeam () {
        // Errors condition
        if (teamErrCount[activeTeam] > 3) { //4 może jako big error?
            activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
            return 1; //trigger do lastAns
        }  //moze funkcja samo change team
    }
    
    function chooseTeam () {
        if (firstAns[0] > firstAns[1]) activeTeam = 0;
        else activeTeam = 1;
        //*jezeli obaj zle to ten co szybciej :/
    }
    
    return {
    // Wczytuje podana odpowiedz i przekazuje do wyswietlania
        readAnswer : function (queNum, input) {

            // czy to powinno byc ciagle aktywne??, mozna tylko max liczba razy + obsluga wyjscia po wygranej/przegranej
            console.log('answer: ' + input);

            var ans = input;
            var scale = data[queNum].answers.length;

            if (ans === '-1') {
                // After wrong answer
                screenController.showOneError();
                teamErrCount[activeTeam]++;
                
                // Jeśli tak to duzy blad
                if (changeTeam === 1) {
                    console.log('X');
                }
                // Checks if should change the team after 3x
                changeTeam();
            } else if (ans >= 0 && ans <= scale) {
                // After right answer
                audioController.playGood();
                screenController.putAnsOnScreen(0, input);
                roundScore += data[queNum].points[input];
                screenController.updateRoundScore(roundScore);
            } else {
                // Catching error
                console.log('Answer out of scale! Repeat.');
            }
            // Returned value to check higher points
//            return out;
            
            // Wybieranie teamu z lepsza odpowiedzia
            //potem mozna to data[...] skrocic do zmiennej
            if (countPress < 2) {
                firstAns[activeTeam] = data[queNum].points[input];
                activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
                
            } else if (countPress === 2) {
                chooseTeam();
            }
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
            data[0] = new Data('Przedmiot szkolny, który najmniej przydaje się w życiu?', ['Kanapka', 'Piórnik','Olówek', 'Dziennik'], [47, 23, 15, 9]);
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
            audioController.playWrong();
            document.querySelector('.wrong-' + activeTeam + '-' + teamErrCount[activeTeam]).textContent = smallErr;
        },
        
        // Big error
        showBigError : function () {
            var bigErr = '|\t|\n|\t|\n|\t|\n \\   /\n  |||\n /   \\ \n|\t|\n|\t|\n|\t|';
//            audioController.playWrong();
            document.querySelector('.wrong-' + activeTeam + '-1').textContent = bigErr;
        }
    }
})();


var audioController = (function() {
    var wrong = new Audio('sounds/wrong.mp3');
    var good = new Audio('sounds/good.mp3') 
    
    return {
        playWrong : function() {
            wrong.play();
        },
        playGood : function() {
            good.play();
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

//TESTING
var queNum = 0;
console.log('active: ' + activeTeam);
consoleController.printAnswers(queNum);

var countPress = 0;
buttonsController();
function buttonsController(){
    
    document.querySelector('#btn-0').addEventListener('click', function() {
    countPress++;
    consoleController.readAnswer(queNum,0);
    document.querySelector('#btn-0').style.display = 'none';
    });
    
    document.querySelector('#btn-1').addEventListener('click', function() {
    countPress++;
    consoleController.readAnswer(queNum,1); 
    document.querySelector('#btn-1').style.display = 'none';
    });
    
    document.querySelector('#btn-2').addEventListener('click', function() {
    countPress++;
    consoleController.readAnswer(queNum,2); 
    document.querySelector('#btn-2').style.display = 'none';
    });
    
    document.querySelector('#btn-3').addEventListener('click', function() {
    countPress++;
    consoleController.readAnswer(queNum,3); 
    document.querySelector('#btn-3').style.display = 'none';
    });

    document.querySelector('#btn-4').addEventListener('click', function() {
        countPress++;
        consoleController.readAnswer(queNum,'-1');
    });
}