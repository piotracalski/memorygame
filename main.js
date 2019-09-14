var UIcontroller = (function() {
    
     var DOM = {
        wrapperLbl: '.game',
        gameLbl: '.game',
        boxLbl: '.box',
        boxActiveLbl: '.active',
        boxInvisibleLbl: 'boxInvisible',
        turnsCounterLbl: '.turnsCounterValue',
        timerMsecondsLbl: '.mseconds',
        timerSecondsLbl: '.seconds',
        timerMinutesLbl: '.minutes',
        gameBtnLbl: '.gameBtn',
        visibleLbl: 'visible',
        invisibleLbl: 'invisible',
        gameWonLbl: '.gameWon',
        welcomeScreenLbl: '.welcomeScreen',
        gamesPlayedLbl: '.gamesPlayed',
        lowestScoreLbl: '.lowestScore',
        highestScoreLbl: '.highestScore',
        averageScoreLbl: '.averageScore',
        lastGameLbl: '.lastGame',
        clearStatsBtnLbl: '.clearStats'
    };
    
    function storeScore() {
    
        var turns = parseInt(document.querySelector(DOM.turnsCounterLbl).textContent);
        var mSeconds = parseInt(document.querySelector(DOM.timerMsecondsLbl).textContent);
        var seconds = parseInt(document.querySelector(DOM.timerSecondsLbl).textContent);
        var minutes = parseInt(document.querySelector(DOM.timerMinutesLbl).textContent);
        var time = minutes + seconds / 60 + mSeconds / 100;
        var score = Math.floor((1000 / turns) * (10 / time) * 100);

        if(localStorage.memoryGames !== undefined) {
            localStorage.memoryGames = `${localStorage.memoryGames}-${score}`;
        } else {
            localStorage.memoryGames = score;
        }
        document.querySelector('.score').textContent = score;
    }
    
    function getScores() {
        return localStorage.memoryGames.split('-');
    }
    
    var scores = [];
    
    function previousScores() {
        var scoresTxt = localStorage.memoryGames.split('-');
        if(scores.length === scoresTxt.length || scores.length === 0) {
            scoresTxt.forEach((score) => {
                scores.unshift(parseInt(score));
            });
        } else {
            scores.unshift(parseInt(scoresTxt[scoresTxt.length - 1]));
        }
        
        var minScore = Math.min(...scores);
        var maxScore = Math.max(...scores);
        var avgScore = Math.floor((scores.reduce((a,b) => {
            return parseInt(a) + parseInt(b);
        })) / scores.length);
        
        document.querySelector(DOM.gamesPlayedLbl).textContent = scores.length;
        document.querySelector(DOM.lowestScoreLbl).textContent = minScore;
        document.querySelector(DOM.highestScoreLbl).textContent = maxScore;
        document.querySelector(DOM.averageScoreLbl).textContent = avgScore;
    }
    
    function updateLastScores() {
        if(localStorage.memoryGames !== undefined) {
            for(var i = 0; i <= 2; i++){
                var lastScores = localStorage.memoryGames
                    .split('-')
                    .slice(-3)
                    .reverse();
                if(lastScores[i] !== undefined) {
                    document.querySelector(`${DOM.lastGameLbl}-${i}`).textContent = lastScores[i];
                } else {
                    document.querySelector(`${DOM.lastGameLbl}-${i}`).textContent = '-';
                }
            }
        } else {
            for(var i = 0; i <= 2; i++){
                document.querySelector(`${DOM.lastGameLbl}-${i}`).textContent = '-';
            }
        }
    }
    
    return {
        
        getDomStrings: (function () {
            return DOM; 
        })(),
        
        getCurrentTurn: () => {
            return parseInt(document.querySelector(DOM.turnsCounterLbl).textContent);
        },
        
        nextTurn: () => {
            var previousTurn = parseInt(document.querySelector(DOM.turnsCounterLbl).textContent);
            document.querySelector(DOM.turnsCounterLbl).textContent = previousTurn + 1;
        },
        
        resetTimer: () => {
            document.querySelector(DOM.timerMsecondsLbl).textContent = '00';
            document.querySelector(DOM.timerSecondsLbl).textContent = '00';
            document.querySelector(DOM.timerMinutesLbl).textContent = '0';
        },
        
        resetTurns: () => {
            document.querySelector(DOM.turnsCounterLbl).textContent = 0;
        },
        
        gameWon: () => {
            storeScore();
            previousScores();
            document.querySelector(DOM.gameBtnLbl).textContent = 'NEXT GAME';
            document.querySelector(DOM.gameLbl).style.display = 'none';
            document.querySelector(DOM.gameWonLbl).style.display = 'block';
            updateLastScores();
        },
        
        updateScoresOnLoad: updateLastScores(),
        
        resetLocalStorage: () => {
            localStorage.removeItem('memoryGames');
            for(var i = 0; i <= 2; i++){
                document.querySelector(`${DOM.lastGameLbl}-${i}`).textContent = '-';
            }
        }
    }
})();
  
var gameController = (function(UiCtrl, globalCtrl) {
    
    var pictureIds = [];
    
    var numberOfPictures = 18;
    
    var id = function() {
        return `B_${Math.floor(Math.random()*numberOfPictures + 1)}-${Math.floor(Math.random()*2 + 1)}`
    };
    
    var countInArray = function(array, item) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item) {
                count++;
            }
        }
        return count;
    };
    
    var backgroundImageNumber = function(pic) {
        return pic.split('_')[1].split('-')[0];
    }
    
    function setBackgroundImage(pic) {
        document.getElementById(pic).style.backgroundImage = `url(img/box/B_${backgroundImageNumber(pic)}.png)`
    }
    
    function animateBox(pic) {
        document.getElementById(pic).style.height = '0.1rem';
        setTimeout(() => {
            setBackgroundImage(pic);
            document.getElementById(pic).style.height = '5rem';
        },100)
        
    }
    
    function deletePictureId(arr,id) {
        for( var i = 0; i < arr.length; i++){ 
            if ( arr[i] === id) {
                arr.splice(i, 1); 
            }
        }
    }
    
    function loadBox() {    
            var pictureId = id();
            if (countInArray(pictureIds, pictureId) === 0) {
                var html = `<div class="box" id="${pictureId}"></div>`;
                document
                    .querySelector(UiCtrl.getDomStrings.wrapperLbl)
                    .insertAdjacentHTML('beforeend', html);
                pictureIds.push(pictureId);
            }   
    }
    
    function compareBoxes() {
        var activeBoxes = document.querySelectorAll(UiCtrl.getDomStrings.boxActiveLbl);
        var pictureOneNumber = backgroundImageNumber(activeBoxes[0].id);
        var pictureTwoNumber = backgroundImageNumber(activeBoxes[1].id);
        if (pictureOneNumber === pictureTwoNumber) {
            Array.from(activeBoxes).forEach((item) => {
                deletePictureId(pictureIds,item.id);
                item.classList.remove('active');
                item.classList.add('boxMatched');
            });
            setTimeout(() => {
                Array.from(activeBoxes).forEach((item) => {
                    item.classList.remove('boxMatched');
                    item.classList.remove('box');
                    item.classList.add(UiCtrl.getDomStrings.boxInvisibleLbl);
                    item.style.backgroundImage = 'none';
                });
            },1000);
        } else {
            setTimeout(() => {
                Array.from(activeBoxes).forEach((item) => {
                    item.classList.remove('active')
                    item.style.backgroundImage = 'none';
                })},1000);
            UiCtrl.nextTurn();
        }
    }
    
    return {
        
        gameOn: false,
        
        getPictureIds: () => {
            return pictureIds;
        },
        
        gameInit: () => {
            
            while (pictureIds.length !== numberOfPictures * 2) {
                loadBox();
            };

        },
        
        timer: function() {
            
            var msecondsTxt = document.querySelector(UiCtrl.getDomStrings.timerMsecondsLbl);
            var secondsTxt = document.querySelector(UiCtrl.getDomStrings.timerSecondsLbl);
            var minutesTxt = document.querySelector(UiCtrl.getDomStrings.timerMinutesLbl);
        
            var mseconds = parseInt(msecondsTxt.textContent);
            var seconds = parseInt(secondsTxt.textContent);
            var minutes = parseInt(minutesTxt.textContent);

            if(mseconds < 100) {
                mseconds++
                if(mseconds === 100) {
                    mseconds = 0;
                    seconds++;
                    if(seconds === 60) {
                        seconds = 0;
                        minutes++;
                    }
                }
                
            }
            if(mseconds < 10) {
                msecondsTxt.textContent = `0${mseconds}`;
            } else {
                msecondsTxt.textContent = `${mseconds}`;
            }
            if(seconds < 10) {
                secondsTxt.textContent = `0${seconds}`;
            } else {
                secondsTxt.textContent = `${seconds}`;
            }
            minutesTxt.textContent = `${minutes}`;
                

        },
        
        showBox: () => {
            document.getElementById(event.target.id).classList.add('active');
            animateBox(event.target.id);
            if (document.querySelectorAll(UiCtrl.getDomStrings.boxActiveLbl).length === 2) {
                compareBoxes();
            }
        },
        
        clearBoard: () => {
            var div = document.querySelector(UiCtrl.getDomStrings.wrapperLbl);
            while(div.firstChild){
                div.removeChild(div.firstChild);
            };
            pictureIds = [];
        }
        
    }
    
})(UIcontroller, globalController);

var globalController = (function(UiCtrl, gameCtrl) {
    
    var gameTimer;
    var gameBtnLbl = document.querySelector(UiCtrl.getDomStrings.gameBtnLbl);
    
    function start() {
        gameCtrl.gameOn = true;
        UiCtrl.resetTimer();
        UiCtrl.resetTurns();
        document.querySelector(UiCtrl.getDomStrings.welcomeScreenLbl).style.display = 'none';
        document.querySelector(UiCtrl.getDomStrings.gameWonLbl).style.display = 'none';
        document.querySelector(UiCtrl.getDomStrings.gameLbl).style.display = 'grid';
        gameCtrl.clearBoard();
        gameCtrl.gameInit();
        UiCtrl.nextTurn();
        gameTimer = setInterval(gameCtrl.timer, 10);
        gameBtnLbl.textContent = 'EXIT GAME';
        
    }
    
    function stop() {
        gameCtrl.gameOn = false;
        gameBtnLbl.textContent = 'START';
        gameCtrl.clearBoard();
        stopTimer();
        UiCtrl.resetTimer();
        UiCtrl.resetTurns();
    }
    
    function stopTimer() {
        clearInterval(gameTimer);
    }
    
    function setupEventListeners() {
                
        gameBtnLbl.addEventListener('click', () => {
            if(gameCtrl.gameOn) {
                stop();
            } else {
                start();
            }
        });
        
        document.querySelector(UiCtrl.getDomStrings.wrapperLbl).addEventListener('click', () => {
            if(gameCtrl.gameOn) {
                var activeBoxes = document.querySelectorAll(UiCtrl.getDomStrings.boxActiveLbl);
                if (gameCtrl.getPictureIds().includes(event.target.id) && activeBoxes.length <= 1 && Array.from(activeBoxes).includes(event.target) === false) {
                    gameCtrl.showBox();
                }
                if(gameCtrl.getPictureIds().length === 0) {
                    gameCtrl.gameOn = false;
                    UiCtrl.gameWon();
                    stopTimer();
                }
            }
        });
        
        document.querySelector(UiCtrl.getDomStrings.clearStatsBtnLbl).addEventListener('click', UiCtrl.resetLocalStorage);
        
    }
    
    return {
        
        init: () => {
            
            setupEventListeners();
            
            UiCtrl.updateScoresOnLoad;
            
        },
    }
    
})(UIcontroller, gameController);

globalController.init();