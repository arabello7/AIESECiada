//!!! WHERE THE FUN BEGINS

// Dostępne z zewnatrz, potem mozna dodac getData w dataControllerze
var data = [];
var teamErrCount = [];
teamErrCount[0] = 0;
teamErrCount[1] = 0;
var activeTeam = 0;
var teamPoints = [];
teamPoints[0] = 0;
teamPoints[1] = 0;
var queNum = 0;
var countPress = 0;

//potem do consoleCtrl
function switchTeam () {
    activeTeam === 0 ? activeTeam = 1 : activeTeam = 0;
}

// OBSLUGA CONSOLI
var consoleController = (function() {
    var roundScore = 0;
    var firstAns = [];
    firstAns[0] = 0; //na 2 runde wyzerowanie 
    firstAns[1] = 0;
    
    function resetScore() {
        //czy na poczatku tego nie wywolywac zamiast pisania
        roundScore = 0;
        teamErrCount[0] = 0;
        teamErrCount[1] = 0;
        firstAns[0] = 0; //na 2 runde wyzerowanie 
        firstAns[1] = 0;
        countPress = 0;
    }
    
    // Zmienia team po 3 blednych
    function changeTeam () {
        // Errors condition
        if (teamErrCount[activeTeam] >= 3) { //4 może jako big error?
            switchTeam();
            return 1; //trigger do lastAns
        } 
    }
    
    function chooseTeam () {
        // Two wrong answers
        if (firstAns[0] === firstAns[1]) {
            switchTeam();
            console.log('pytam teraz na zmiane');
        } else if (firstAns[0] > firstAns[1]) activeTeam = 0;
        else activeTeam = 1;
    }
    
    return {
    // Wczytuje podana odpowiedz i przekazuje do wyswietlania
        readAnswer : function (queNum, input) {
            // czy to powinno byc ciagle aktywne??, mozna tylko max liczba razy + obsluga wyjscia po wygranej/przegranej
            console.log('answer: ' + input);
            //czy ans razem z input jest potrzebne
            var ans = input;
            var scale = data[queNum].answers.length;
            
            // After wrong answer
            if (ans === '-1') {
                // First wrong answers
                if (countPress <= 2) {
                    screenController.showBigError();
                } else {
                    screenController.showOneError();
                    teamErrCount[activeTeam]++;
                }
                // Last answer is incorrect
                if (countPress > 99) {
                    switchTeam();
                    console.log('wygrana teamu' + activeTeam);
                    teamPoints[activeTeam] += roundScore;
                    resetScore();
                    audioController.playJoke();
                }
                // Triggers last answer condition
                if (changeTeam() === 1) {
                    //zmiana teamErrCount, potem do wyswietlania X
                    countPress = 99;
                }
                
            } else if (ans >= 0 && ans <= scale) {
                // After right answer
                audioController.playGood();
                screenController.putAnsOnScreen(queNum, input);
                roundScore += data[queNum].points[input];
                screenController.updateRoundScore(roundScore);
                // Last answer is correct
                if (countPress > 99) {
                    console.log('wygrana teamu ' + activeTeam);
                    teamPoints[activeTeam] += roundScore;
                    resetScore();
                    audioController.playJoke();
                }
            } else {
                // Catching error
                console.log('Answer out of scale! Repeat.');
            }
            
            // Wybieranie teamu z lepsza odpowiedzia
            //potem mozna to data[...] skrocic do zmiennej
            if (countPress < 2) {
                firstAns[activeTeam] = data[queNum].points[input];
                switchTeam();
                
            } else if (countPress === 2) {
                firstAns[activeTeam] = data[queNum].points[input];
                //*moze jakies opoznienie do tego potem
//                screenController.resetErrors();
                chooseTeam();
                console.log('active: ' + activeTeam);
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
            data[0] = new Data('Przedmiot szkolny, który najmniej przydaje się w życiu?', ['Kanapka', 'Piórnik','Olówek', 'Dziennik', 'Plastus'], [47, 23, 15, 9, 1]);
            data[1] = new Data('Więcej niż jedno zwierzę to?', ['Lama', 'Owca', 'Krowa', 'Stado', 'Klucz'], [99, 67, 43, 15, 14]);
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
            
            for (var i = 0; i < data[queNum].answers.length; i ++) {
                document.querySelector('#ans-pts-' + i).textContent = 0;
                document.querySelector('#ans-pts-' + i).style.display = 'block';
                document.querySelector('#ans-' + i).textContent = "";
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
            audioController.playWrong();
            document.querySelector('.wrong-' + activeTeam + '-1').textContent = bigErr;
        },
        // Used after beginning of round, potem raczej duże X
        resetErrors : function () {
            //nie tak szybko
            document.querySelector('.wrong-0-1').textContent = "";
            document.querySelector('.wrong-1-1').textContent = "";
//            document.querySelector('.wrong-0-0').textContent = "";
//            document.querySelector('.wrong-1-0').textContent = "";
        }
    }
})();


var audioController = (function() {
    var wrong = new Audio('sounds/wrong.mp3');
    var good = new Audio('sounds/good.mp3');
    var joke = new Audio('sounds/zart1.mp3');
    
    return {
        playWrong : function() {
            wrong.play();
        },
        playGood : function() {
            good.play();
        },
        playJoke : function() {
            joke.play();
        }
    }
})();

// Answer buttons handling
document.querySelector('#btn-0').addEventListener('click', function(){
    answerButton(0);
});
document.querySelector('#btn-1').addEventListener('click', function(){
    answerButton(1);
});
document.querySelector('#btn-2').addEventListener('click', function(){
    answerButton(2);
});
document.querySelector('#btn-3').addEventListener('click', function(){
    answerButton(3);
});
document.querySelector('#btn-4').addEventListener('click', function(){
    answerButton(4);
});
document.querySelector('#btn-x').addEventListener('click', function(){
    countPress++;
    consoleController.readAnswer(queNum,'-1');
});

// Function executed after clicking button
function answerButton(num){
    countPress++;
    consoleController.readAnswer(queNum, num); 
    document.querySelector('#btn-' + num).style.display = 'none';
}

// TO BEGIN
//function init () {
    dataController.loadData();
    screenController.welcomeText();
    document.querySelector('.welcome-text').style.display = 'none'; //do testow
    screenController.resetRound();
//    consoleController.printAnswers(0);
//}


//4 potem na liczbe odpowiedzi odczytywana
function bringTheButtons(){
    for (var i = 0; i < data[queNum].answers.length; i++) {
         document.querySelector('#btn-' + i).style.display = 'block';
    }
}

//TESTING
function roundOne(){
    queNum = 0;
    console.log('active: ' + activeTeam);
    consoleController.printAnswers(queNum);
}
roundOne();

function roundTwo(){
    screenController.resetRound();
    bringTheButtons();
    //roundScore = 0;
//    countPress = 0;
    queNum = 1;
    activeTeam = 0;
    console.log('active: ' + activeTeam);
    consoleController.printAnswers(queNum);
}


function showPoints(){
    console.log('Team 0: ' + teamPoints[0]);
    console.log('Team 1: ' + teamPoints[1]);
}