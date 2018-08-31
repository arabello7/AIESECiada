



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
                        // After wrong answer
                        screenController.showOneError();
                        teamErrCount[activeTeam]++;
                        // Checks if should change the team
                        changeTeam();
                    } else if (ans >= 0 && ans <= scale) {
                        // After right answer
                        screenController.putAnsOnScreen(0, input.value);
                        screenController.updateRoundScore(roundScore + input.value);
                    } else {
                        // Catching error
                        console.log('Answer out of scale! Repeat.');
                    }
                }
            });
    }
    return {
        
        // Printing question and answers in console
        printAnswers : function (queNum) {
            console.log(data[queNum].question);
            
            var n = data[queNum].answers.length;
            for (var i = 0; i < n; i++) {
                 console.log(i + '. ' + data[queNum].answers[i]);
            }
            console.log('-1. Żadna z powyższych');
            // Funkcja wczytująca pole tekstowe
//            readAnswer(queNum); wylaczone w ramach testów
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


//TESTING
startRound();
console.log('lets go');

// Obsługa pulpitu zgłaszania się
function startRound () {
    // Team 0 wciska lewy ctrl
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 17) {
            console.log('active:' + 0) ;
            goon(); //umozliwia dalsza część
        }
    });

    // Team 1 wciska strzalke w prawo
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 39) {
            console.log('active:' + 1);
            goon(); //umozliwia dalsza część
        }  
    });
    console.log('startRound finished');
}

function readFirstAns () {
    document.addEventListener('keypress', function(event) {
                var input = document.querySelector('input[name="getAnswer"]');
                if(event.keyCode === 13) {
                    activeTeam = input.value;
                    console.log('active team: ' + input.value);
                }
    });
}
    

function goon() {
    consoleController.printAnswers(0);
        
    var readAnswer = function (queNum) { //możliwe że var x = function ()
        var ans; //musi tu byc zeby dzialalo poza funkcja
        document.addEventListener('keypress', function(event) {
                var input = document.querySelector('input[name="getAnswer"]');
                if(event.keyCode === 13) {
                    console.log('answer: ' + input.value);
                    ans = input.value; //zmienione
                    var scale = data[queNum].answers.length;
                    if (ans === '-1') {
                        screenController.showOneError();
                        teamErrCount[activeTeam]++;
                        changeTeam();
                    } else if (ans >= 0 && ans <= scale) {
                        screenController.putAnsOnScreen(0, input.value);
                        screenController.updateRoundScore(roundScore + input.value);
                    } else {
                        console.log('Answer out of scale! Repeat.');
                    }
                    goon2();
                }
                
            });
//        return data[queNum].points[ans];
    }
}

function goon2 () {
    var ansPoints = readAnswer(0);
//       readAnswer(0); 
        var firstAns = [];
        firstAns[0] = 0;
        firstAns[1] = 0;
        
    firstAns[activeTeam] = ansPoints;
    activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
    console.log('active team: ' + activeTeam);
    ansPoints = readAnswer(0);
    firstAns[activeTeam] = ansPoints;
    if (firstAns[0] > firstAns[1]) activeTeam = 0;
    else {
        activeTeam = 1;
    }
    console.log('active team: ' + activeTeam);
}