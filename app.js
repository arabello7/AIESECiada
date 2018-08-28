
//WELCOME SCREEN
//*potem do dodania do init
document.querySelector('.welcome-text').style.display = 'none';

for (var i = 0; i < 3; i++){
    document.querySelector('.wrong-0-' + i).style.display = 'none';
    document.querySelector('.wrong-1-' + i).style.display = 'none';
}
for (var i = 1; i <= 5; i ++) {
    document.querySelector('#ans-pts-' + i).style.display = 'block';
}
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



//!!! WHERE THE FUN BEGINS

// Dostępne z zewnatrz, potem mozna dodac getData w dataControllerze
var data = [];

// OBSLUGA CONSOLI
var consoleController = (function() {
    
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
        },
        
        //Wczytuje podana odpowiedz i przekazuje do wyswietlania
        readAnswer : function (ansNum) {
//               var ansNum = readline();
//            console.log('Wczytano: ' + ansNum);
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
dataController.loadData();

// OBSLUGA EKRANU GRY
var screenController = (function() {  
    return {
        //Show one answer, ansNum = [0..4]
        putAnsOnScreen : function (queNum, ansNum) {
            document.querySelector('#ans-' + ansNum).textContent = data[queNum].answers[ansNum];
            document.querySelector('#ans-pts-' + ansNum).textContent = data[queNum].points[ansNum];
        }
    }
})();

//TO BEGIN
consoleController.printAnswers(0);
var i;
consoleController.readAnswer(i);

