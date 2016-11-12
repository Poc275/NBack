function Page() {
    // square highlight duration
    const _stimulus_time = 500;
    // total time to wait for user input
    const _total_trial_time = 3000;

    var self = this; // for event handlers
    var startButton = document.getElementById('start-button');
    var continueButton = document.getElementById('continue-button');

    this.blockCreator = new BlockCreator(); // is a static class in the original silverlight app

	// our list of trials
	this.m_Trials = [];

	// current block we're working on
	this._blockNum = 0;

	// current trial we're working on
	this._trialNum = 0;

	// starting value of n
	this._starting_N = 2;

	// value of n for the current block
	this._n = this._starting_N;

	// keeps track of the user's score
	this._score = new Score();

    // set to true whenever the game is running
    this._playingGame = false;

    // timers - from Page.xaml
    // initial wait - gap before the trial starts so the user can get ready
    // Timer_1 - for the stimulus, i.e. the square highlights
    // TrialTimer - total trial time, trial is ended when complete
    // _continurTimer - a timer to wait after the "continue" button has been clicked
    this.initialWait;
    this.Timer_1;
    this.TrialTimer;
    this._continueTimer;

	DisplayN(this._starting_N);
 	setProgress(0);


 	// EVENTS
    startButton.addEventListener('click', function(event) {
        // check for start/pause via changing the text value of the button itself
        if(event.target.value == "Start") {
            event.target.value = "Pause";
            event.target.textContent = "Pause";
            // original timer = 675 * 10000 (675ms)
            // in setTimeout() the delay is in milliseconds
            // 'this' in an event handler is the object that fired the event
            self.initialWait = new Timer(self.Start_Training, 675);
        } else if(event.target.value == "Pause") {
            event.target.value = "Resume";
            event.target.textContent = "Resume";
            // pause all animations/timers
            self.Timer_1.pause();
            self.TrialTimer.pause();
        } else if(event.target.value == "Resume") {
            // continue from pause
            event.target.value = "Pause";
            event.target.textContent = "Pause";
            self.Timer_1.resume();
            self.TrialTimer.resume();
        }
    });

    document.addEventListener("keyup", function(event) {
      if(self._playingGame === true) {
        self._score.recordButtonPress(event.key);
      }
    }, false);

    continueButton.addEventListener('click', function(event) {
        if(event.target.value == "Continue") {
            // Start a new block...
            setProgress(0);
            self._blockNum++;
            document.getElementById("session-number").innerHTML = (self._blockNum + 1).toString() +
                " / " + self.blockCreator.GetDefaultBlockSize().toString();

            self.m_Trials = self.blockCreator.createBlock(self._n);
            self._trialNum = 0;

            // Tell the user the n they're using
            DisplayN(self._n);
            self._score.startBlock(self._n);

            // Give the user a chance to catch their breath before starting the next block.
            self._continueTimer = new Timer(self.startBlock, 675);
        } else if(event.target.value == "Reset") {
            event.target.value = "Continue";
            event.target.textContent = "Continue";

            startButton.value = "Start";
            startButton.textContent = "Start";

            self._blockNum = 0;
            self._playingGame = false;
            self._trialNum = 0;
            self._n = self._starting_N;
            self._score._score = 0;
            setProgress(0);
            DisplayN(self._n);

            // reset session number
            document.getElementById("session-number").innerHTML = "1 / " + 
                self.blockCreator.GetDefaultBlockSize().toString();
            document.getElementById("score-text").innerHTML = "0";
        }
    });


    // FUNCTIONS
    // callback for when the timer expires for the stimulus, hide the stimulus
    this.hideStimulus = function() {
    	// just clear all grid squares for ease
        document.getElementById("bottom-left").style.backgroundColor = "";
        document.getElementById("bottom-middle").style.backgroundColor = "";
        document.getElementById("bottom-right").style.backgroundColor = "";
        document.getElementById("middle-left").style.backgroundColor = "";
        document.getElementById("middle-right").style.backgroundColor = "";
        document.getElementById("top-left").style.backgroundColor = "";
        document.getElementById("top-middle").style.backgroundColor = "";
        document.getElementById("top-right").style.backgroundColor = "";
    }

 	this.Start_Training = function() {
 		self._playingGame = true;

        // we're starting, get the list of trials and clear the extra stuff
        self._n = self._starting_N;
        self._blockNum = 0;
        self._trialNum = 0;
        self.m_Trials = self.blockCreator.createBlock(self._n);
        self._score.startBlock(self._n);

        // present the first trial to the user
        self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);
        self._score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget);

        // start the timers for the first trial
        self.Timer_1 = new Timer(self.hideStimulus, _stimulus_time);
        self.TrialTimer = new Timer(self.trialTimeUp, _total_trial_time);
 	}

 	// called whenever the total time for an individual trial has expired
 	this.trialTimeUp = function() {
 		self._score.endTrial();
 		self._trialNum++;

        // clear feedback boxes
        // TODO - should be handled with an animation so the boxes
        // are only shaded for a brief period, fade-in-out
        document.getElementById("left-hand-feedback").style.backgroundColor = "";
        document.getElementById("right-hand-feedback").style.backgroundColor = "";

 		var progress = self._trialNum / self.m_Trials.length;
 		setProgress(progress * 100);

 		// are we at the end of a block?
 		if(self._trialNum >= self.m_Trials.length) {
 			// are we at the end of an entire session (20 blocks)?
 			if(self._blockNum == (self.blockCreator.GetNumBlocksTotal() - 1)) {
 				// what was the average n level?
 				var averageN = self._score.getMeanN();
 				document.getElementById("next-level-info").innerHTML = "You have completed all of the sessions. Congratulations!<br>" + 
                    "You had an average N level of " + averageN.toString();

 				if(self._score.getPercentGFIncrease() > 0) {
 					var gFIncrease = self._score.getPercentGFIncrease();
 					document.getElementById("next-level-info").innerHTML += "<br>" + gFIncrease.toString();
 				}

                // output last block score, note the original version doesn't do this
                document.getElementById("correct-audio-results").innerHTML = "Correct Audio Results: " +
                    (self.blockCreator.GetDefaultBlockSize() - self._score.audioMistakes()).toString() + 
                    " / " + self.blockCreator.GetDefaultBlockSize().toString();
                document.getElementById("correct-visual-results").innerHTML = "Correct Visual Results: " + 
                    (self.blockCreator.GetDefaultBlockSize() - self._score.visualMistakes()).toString() + 
                    " / " + self.blockCreator.GetDefaultBlockSize().toString();

                // change button to reset to start a brand new trial
                continueButton.value = "Reset";
                continueButton.textContent = "Reset";

                // save progress
                addSessionToHistory(Date.now(), averageN);

                $('#scoreModal').modal('show');
                return;
 			}

 			// end the block, output results
            document.getElementById("correct-audio-results").innerHTML = "Correct Audio Results: " +
                (self.blockCreator.GetDefaultBlockSize() - self._score.audioMistakes()).toString() + 
                " / " + self.blockCreator.GetDefaultBlockSize().toString();
            document.getElementById("correct-visual-results").innerHTML = "Correct Visual Results: " + 
                (self.blockCreator.GetDefaultBlockSize() - self._score.visualMistakes()).toString() + 
                " / " + self.blockCreator.GetDefaultBlockSize().toString();
 			var deltaN = self._score.endBlock();
 			if((deltaN + self._n) >= 2) {
 				self._n = self._n + deltaN;
 			}

 			// display the next trial level (N number) in the popup
            document.getElementById("next-level-info").innerHTML = "Next level: " + self._n.toString();

            // display results dialog
            $('#scoreModal').modal('show');
            return;
 		}

 		// start a new trial
 		self._score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

        self.Timer_1 = new Timer(self.hideStimulus, _stimulus_time);
        self.TrialTimer = new Timer(self.trialTimeUp, _total_trial_time);
 	}

 	this.startBlock = function() {
 		// start a new trial
 		self._score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

        window.clearTimeout(self.Timer_1);
        window.clearTimeout(self.TrialTimer);
        self.Timer_1 = new Timer(self.hideStimulus, _stimulus_time);
        self.TrialTimer = new Timer(self.trialTimeUp, _total_trial_time);
 	}


 	// display trial information (square, audio, etc.) to the user
 	this.presentTrialInfoToUser = function(t) {
 		switch(t.GetLetter()) {
 			case Consonant.Letter1:
 				document.getElementById("letter1").play();
 				break;

			case Consonant.Letter2:
 				document.getElementById("letter2").play();
 				break;

			case Consonant.Letter3:
 				document.getElementById("letter3").play();
 				break;

			case Consonant.Letter4:
 				document.getElementById("letter4").play();
 				break;

			case Consonant.Letter5:
 				document.getElementById("letter5").play();
 				break;

			case Consonant.Letter6:
 				document.getElementById("letter6").play();
 				break;

			case Consonant.Letter7:
 				document.getElementById("letter7").play();
 				break;

			case Consonant.Letter8:
 				document.getElementById("letter8").play();
 				break;

			default:
 				break;
 		}

 		// display the visual information
 		switch(t.GetPosition()) {
 			case SquarePosition.BottomLeft:
 				document.getElementById("bottom-left").style.backgroundColor = "orange";
 				break;

			case SquarePosition.BottomMiddle:
 				document.getElementById("bottom-middle").style.backgroundColor = "orange";
 				break;

			case SquarePosition.BottomRight:
 				document.getElementById("bottom-right").style.backgroundColor = "orange";
 				break;

			case SquarePosition.MiddleLeft:
 				document.getElementById("middle-left").style.backgroundColor = "orange";
 				break;

			case SquarePosition.MiddleRight:
 				document.getElementById("middle-right").style.backgroundColor = "orange";
 				break;

			case SquarePosition.TopLeft:
 				document.getElementById("top-left").style.backgroundColor = "orange";
 				break;

			case SquarePosition.TopMiddle:
 				document.getElementById("top-middle").style.backgroundColor = "orange";
 				break;

			case SquarePosition.TopRight:
 				document.getElementById("top-right").style.backgroundColor = "orange";
 				break;

			default:
 				break;
 		}
 	}
}


function handleScores(totalScore) {
    document.getElementById("score-text").innerHTML = totalScore.toString();
}


// called via an event to say if there was a trial success or failure
// highlights the left/right areas of the grid for success/failure feedback
// Page & Score access need access to this function
function handleTrialResult(result) {
    if(result == TrialResult.Visual_Success) {
        document.getElementById("left-hand-feedback").style.backgroundColor = "green";
    } else if(result == TrialResult.Visual_Failure) {
        document.getElementById("left-hand-feedback").style.backgroundColor = "red";
    }
    if(result == TrialResult.Audio_Success) {
        document.getElementById("right-hand-feedback").style.backgroundColor = "green";
    } else if(result == TrialResult.Audio_Failure) {
        document.getElementById("right-hand-feedback").style.backgroundColor = "red";
    }
}


// display appropriate N to user
// from NDisplayGrid.xaml.cs
function DisplayN(n) {
    document.getElementById("N1").style.display = "none";
    document.getElementById("N2").style.display = "none";
    document.getElementById("N3").style.display = "none";
    document.getElementById("N4").style.display = "none";
    document.getElementById("N5").style.display = "none";
    document.getElementById("N6").style.display = "none";
    document.getElementById("N7").style.display = "none";

    if (n > 7)
    {
        var n7 = document.getElementById("N7");
        n7.style.display = "inline-block";
        n7.textContent = n.toString();
    } else {
        if (n > 0) {
            document.getElementById("N1").style.display = "inline-block";
        }

        if (n > 1) {
            document.getElementById("N2").style.display = "inline-block";
        }
        
        if (n > 2) {
            document.getElementById("N3").style.display = "inline-block";
        }
        
        if (n > 3) {
            document.getElementById("N4").style.display = "inline-block";
        }
        
        if (n > 4) {
            document.getElementById("N5").style.display = "inline-block";
        }
        
        if (n > 5) {
            document.getElementById("N6").style.display = "inline-block";
        }
        
        if (n > 6) {
            document.getElementById("N7").style.display = "inline-block";
        }
    }
}

// set progress bar value
// from ProgressBar.xaml.cs
function setProgress(prog) {
    if((prog > 100) || (prog < 0)) {
        return;
    }

    document.getElementById("prog-bar").style.width = prog + "%";
}

// setTimeout wrapper to include pause functionality
// source: http://stackoverflow.com/questions/3969475/javascript-pause-settimeout
function Timer(callback, delay) {
    var timerId;
    var start;
    var remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}