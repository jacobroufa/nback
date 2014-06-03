var $$ = function( prop, context ) {

      if ( !( this instanceof $$ ) )
      {
        return new $$( prop, context );
      }

      var elements = ( context !== undefined ) ? context.querySelectorAll( prop ) : document.querySelectorAll( prop );

      for ( var i = 0; i < elements.length; i++ )
      {
        this[i] = elements[i];
      }

      this.length = elements.length;

      this.forEach = function( func ) {
        return Array.prototype.forEach.call( this, function( elem, index ) {
          return func.call( elem, elem, index );
        });
      };

    },

    Utils = function() {

      var squares = {
        1: { selector: '#uno', letter: 'b' },
        2: { selector: '#dos', letter: 'f' },
        3: { selector: '#tres', letter: 'k' },
        4: { selector: '#cuatro', letter: 'n' },
        5: { selector: '#seis', letter: 'p' },
        6: { selector: '#siete', letter: 'q' },
        7: { selector: '#ocho', letter: 'r' },
        8: { selector: '#nueve', letter: 't' },
      };

      this.n = 2;

      this.running = false;

      this.userScore = [0, 0, 0, 0]; // Visual correct, audio correct, visual mistakes, audio mistakes

      this.boardSize = function() {
        var body = $$( 'body' )[0],
            size = ( window.innerHeight || document.documentElement.clientHeight || body.clientHeight ) * 0.50,
            board = $$( '#board' )[0];

        board.style.width = size + 'px';
        board.style.height = size + 'px';
      };

      this.sqrMaker = function( position ) {
        var selector = squares[ position ].selector,
            square = $$( selector )[0];

        square.classList.toggle('on');

        setTimeout( function() {
          square.classList.toggle( 'on' );
        }, 500 );
      };

      this.letters = function( position ) {
        var letter = squares[ position ].letter,
            speech, file, howl;

        if ( 'speechSynthesis' in window ) {
          speech = new SpeechSynthesisUtterance( letter );

          speechSynthesis.speak( speech );
        } else {
          file = 'audio/' + letter;

          howl = new Howl({
            urls: [ file + '.mp3', file + '.ogg', file + '.wav' ]
          });

          howl.play();
        }
      };

    },

    // get rid of these once everything is encapsulated in Utils
    utils = new Utils(),
    letters = utils.letters,
    sqrMaker = utils.sqrMaker,
    n = utils.n,
    userScore = utils.userScore;
    blockRunning = utils.running;


(function( Utils, $ ) {

  var info = $( '#info' )[0],
      close = $( '#close' )[0],
      instruct = $( '#instruct' )[0],
      resultClose = $( '#resultclose' )[0],
      resultsWindow = $( '#resultswindow' )[0],
      utils = new Utils();

  // set the board size on load and resize
  document.addEventListener( 'DOMContentLoaded', utils.boardSize );
  window.onresize = utils.boardSize;

  // show and hide things
  info.addEventListener( 'click', function() {
    console.log( 'clicked info button' );
    instruct.style.display = 'block';
  });

  close.addEventListener( 'click', function() {
    instruct.style.display = 'none';
  });

  resultClose.addEventListener( 'click', function() {
    resultsWindow.style.display = 'none';
  });

})( Utils, $$ );

// PREPARE BLOCK FUNCTION

function prepareBlock(n) {

	// Empty block array

	var thisBlock = [];

	// Populate thisBlock with [0, 0] pairs

	for(var i = 0; i < 20 + n; i++) {
		thisBlock.push([0, 0]);
	}

	// Get the length of the block

	var blockLength = thisBlock.length;

	// Create 4 visual targets in empty spots

	var visuals = 0;
	while(visuals < 4) {
		var visTarg = Math.floor(Math.random() * blockLength);
		if(thisBlock[visTarg + n]) {
			if(thisBlock[visTarg][0] == 0 && thisBlock[visTarg][1] == 0 && thisBlock[visTarg + n][0] == 0 && thisBlock[visTarg + n][1] == 0) {
				thisBlock[visTarg][0] = 1 + Math.floor(Math.random() * 8);
				thisBlock[visTarg + n][0] = thisBlock[visTarg][0];
				visuals++;
			}
			else if(thisBlock[visTarg][0] !== 0 && thisBlock[visTarg][1] == 0 && thisBlock[visTarg + n][0] == 0 && thisBlock[visTarg + n][1] == 0) {
				thisBlock[visTarg + n][0] = thisBlock[visTarg][0];
				visuals++;
			}
			else if(thisBlock[visTarg][0] == 0 && thisBlock[visTarg][1] == 0 && thisBlock[visTarg + n][0] !== 0 && thisBlock[visTarg + n][1] == 0) {
				thisBlock[visTarg][0] = thisBlock[visTarg + n][0];
				visuals++;
			}
			else{
				continue;
			}
		}
		else {
			continue;
			}
	}

	// Create 4 audio targets in empty spots

	var audios = 0;
	audioRuns = 0;
	while(audios < 4) {
		var audTarg = Math.floor(Math.random() * blockLength);
		audioRuns++;
		if(thisBlock[audTarg + n]) {
			if(thisBlock[audTarg][0] == 0 && thisBlock[audTarg][1] == 0 && thisBlock[audTarg + n][0] == 0 && thisBlock[audTarg + n][1] == 0) {
				thisBlock[audTarg][1] = 1 + Math.floor(Math.random() * 8);
				thisBlock[audTarg + n][1] = thisBlock[audTarg][1];
				audios++;
			}
			else if(thisBlock[audTarg][0] == 0 && thisBlock[audTarg][1] !== 0 && thisBlock[audTarg + n][0] == 0 && thisBlock[audTarg + n][1] == 0) {
				thisBlock[audTarg + n][1] = thisBlock[audTarg][1];
				audios++;
			}
			else if(thisBlock[audTarg][0] == 0 && thisBlock[audTarg][1] == 0 && thisBlock[audTarg + n][0] == 0 && thisBlock[audTarg + n][1] !== 0) {
				thisBlock[audTarg][1] = thisBlock[audTarg + n][1];
				audios++;
			}
			else {
				if(audioRuns>1000) {
					break;
				}
				else {
					continue;
				}
			}
		}
		else {
			continue;
		}
	}

	// Create 2 dual targets in empty spots

	var doubles = 0;
	var visualRuns = 0;
	while(doubles < 2) {
		var dualTarg = Math.floor(Math.random() * blockLength);
		visualRuns++;
		if(thisBlock[dualTarg + n]) {
			if(thisBlock[dualTarg][0] == 0 && thisBlock[dualTarg][1] == 0 && thisBlock[dualTarg + n][0] == 0 && thisBlock[dualTarg + n][1] == 0) {
				thisBlock[dualTarg][0] = 1 + Math.floor(Math.random() * 8);
				thisBlock[dualTarg][1] = 1 + Math.floor(Math.random() * 8);
				thisBlock[dualTarg + n] = thisBlock[dualTarg];
				doubles++;
			}
			else {
				if(visualRuns>1000) {
					break;
				}
				else {
					continue;
				}
			}
		}
		else {
			continue;
		}
	}

	// Fill other values with random, non-matching values

	for(var x = 0; x < blockLength; x++) {
		if(thisBlock[x][0] == 0) {
			thisBlock[x][0] = 1 + Math.floor(Math.random() * 8);
			if(thisBlock[x - n] && thisBlock[x][0] === thisBlock [x - n][0] && thisBlock[x] !== thisBlock[x - n]) {
				if(thisBlock[x][0] < 8) {
					thisBlock[x][0] += 1;
				} else {
					thisBlock[x][0] -= 1;
				}
			}
			else if(thisBlock[x + n] && thisBlock[x][0] === thisBlock [x + n][0] && thisBlock[x] !== thisBlock[x + n]) {
				if(thisBlock[x][0] < 8) {
					thisBlock[x][0] += 1;
				} else {
					thisBlock[x][0] -= 1;
				}
			}
		}
		if(thisBlock[x][1] == 0) {
			thisBlock[x][1] = 1 + Math.floor(Math.random() * 8);
			if(thisBlock[x - n] && thisBlock[x][1] === thisBlock [x - n][1] && thisBlock[x] !== thisBlock[x - n]) {
				if(thisBlock[x][1] < 8) {
					thisBlock[x][1] += 1;
				} else {
					thisBlock[x][1] -= 1;
				}
			}
			else if(thisBlock[x + n] && thisBlock[x][1] === thisBlock [x + n][1] && thisBlock[x] !== thisBlock[x + n]) {
				if(thisBlock[x][1] < 8) {
					thisBlock[x][1] += 1;
				} else {
					thisBlock[x][1] -= 1;
				}
			}
		}
	}

	return thisBlock;

};
// END PREPARE BLOCK FUNCTION

// EVALUATE BLOCK FUNCTION

function evaluateBlock(block) {
	var vTargCount = 0;
	var aTargCount = 0;
	for(var i=0; i<block.length; i++) {
		if(block[i - n]) {
			if(block[i][0] == block[i - n][0]) {
				vTargCount += 1;
			}
			if(block[i][1] == block[i - n][1]) {
				aTargCount += 1;
			}
		}
	}
	return [vTargCount, aTargCount];
}

// MAIN GAME FUNCTION

function playBlock() {
	var currentBlock = prepareBlock(n);
	var blockEval = evaluateBlock(currentBlock);
	while(blockEval[0] != 6 && blockEval[1] != 6) {
		currentBlock = prepareBlock(n);
		blockEval = evaluateBlock(currentBlock);
	}
	var blockCounter = -1;
	var thisBlockLength = currentBlock.length;
	var hitsThisValue = [0, 0];
	playValue();
	function playValue() {
		$('html').on('keydown', function(event) {
		if(event.which == 65) {
			hitsThisValue[0] = 1;
		} else if(event.which == 76) {
			hitsThisValue[1] = 1;
		}
	});
		if(++blockCounter < thisBlockLength) {
			if(blockCounter > n && currentBlock[blockCounter]) {
				if(currentBlock[blockCounter - 1][0] == currentBlock[blockCounter - n - 1][0]) {
					console.log('visual n back');
					if(hitsThisValue[0] > 0) {
						userScore[0] += 1;
					}
					else {
						userScore[2] += 1;
					}
				}
				else {
					if(hitsThisValue[0] > 0) {
						userScore[2] += 1;
					}
				}
				if(currentBlock[blockCounter - 1][1] == currentBlock[blockCounter - n - 1][1]) {
					console.log('audio n back');
					if(hitsThisValue[1] > 0) {
						userScore[1] += 1;
					}
					else {
						userScore[3] += 1;
					}
				}
				else {
					if(hitsThisValue[1] > 0) {
						userScore[3] += 1;
					}
				}
			}
			if(currentBlock[blockCounter]) {
			sqrMaker(currentBlock[blockCounter][0]);
			letters(currentBlock[blockCounter][1]);
			}
			console.log('this block: ' + currentBlock[blockCounter]);
			console.log('keypresses: ' + hitsThisValue);
			console.log('current score: ' + userScore);
			setTimeout(playValue, 3000);
			hitsThisValue = [0, 0];
		}
		else {
			$('#resultswindow').css({'display':'block'});
			$('#results').html('You got ' + userScore[0] + ' of 6 visual cues and ' + userScore[1] + ' of 6 audio cues.');
			if(userScore[2] < 3 && userScore[3] < 3) {
				n += 1;
				$('#resultstwo').html('Great job! You made fewer than three mistakes per modality. N has been increased to ' + n);
				$('#nvalue').html('n = ' + n);
			}
			else if((userScore[2] + userScore[3]) > 6) {
				if(n > 1) {
					n -= 1;
				}
				$('#resultstwo').html('You made more than five mistakes. N is now ' + n + '.');
				$('#nvalue').html('n = ' + n);
			}
			else {
				$('#resultstwo').html('N will remain ' + n);
			}
			userScore = [0, 0, 0, 0];
		}
	}
}

$('#begin').click(function() {
	if(blockRunning === false) {
		playBlock();
	}
	blockRunning = true;
	setTimeout(function() {
		blockRunning = false;
	}, 20000)
});

