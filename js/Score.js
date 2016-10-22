// Class that keeps track of the user's score
function Score() {
	this._target = TargetKind.None;
	this._n = 0;
	this._nValues = [];

	// set to true whenever an audio or visual key is pressed during a trial
	this._audioKeyPressed = false;
	this._visualKeyPressed = false;

	this._audioMistakesPerBlock = 0;
	this._visualMistakesPerBlock = 0;

	this._score = 0;

	this._TotalCorrect = 0;
	

	// GETS AND SETS
	this.audioMistakes = function() {
		return this._audioMistakesPerBlock;
	}

	this.visualMistakes = function() {
		return this._visualMistakesPerBlock;
	}


	// FUNCTIONS
	// start a new trial and give the correct answer
	this.startNewTrial = function(correctAnswer) {
		_target = correctAnswer;
	}

	// the user has pressed a button
	this.recordButtonPress = function(guess) {
		switch(guess) {
			case 'A':
				if(_visualKeyPressed == true) {
					return;
				}
				if((_target == TargetKind.Visual) || (_target == TargetKind.Both)) {
					HandleTrialOutcome(TrialResult.Visual_Success);
				} else {
					HandleTrialOutcome(TrialResult.Visual_Failure);
					_visualKeyPressed = true;
				}
				break;

			case 'L':
				if(_audioKeyPressed == true) {
					return;
				}
				if((_target == TargetKind.Audio) || (_target == TargetKind.Both)) {
					HandleTrialOutcome(TrialResult.Audio_Success);
				} else {
					HandleTrialOutcome(TrialResult.Audio_Failure);
					_audioKeyPressed = true;
				}
				break;

			default:
				break;
		}
	}

	this.endTrial = function() {
		// ignore any key presses that come early in the list (before a pair could exist)
		if(_target == TargetKind.TooEarly) {
			// clear the members
			_target = TargetKind.None;
			_audioKeyPressed = false;
			_visualKeyPressed = false;

			return;
		}

		// set to true if the user got a trial completely correct
		var correctTrial = false;

		if(_target == TargetKind.None) {
			if(_audioKeyPressed) {
				_audioMistakesPerBlock++;
			}
			if(_visualKeyPressed) {
				_visualMistakesPerBlock++;
			}

			if((_audioKeyPressed == false) && (_visualKeyPressed == false)) {
				correctTrial = true;
			}
		} else if(_target == TargetKind.Both) {
			if(_audioKeyPressed != true) {
				_audioMistakesPerBlock++;
			}
			if(_visualKeyPressed != true) {
				_visualMistakesPerBlock++;
			}

			if((_audioKeyPressed == true) || (_visualKeyPressed == true)) {
				correctTrial = true;
			}
		} else if(_target == TargetKind.Audio) {
			if(_audioKeyPressed != true) {
				// user didn't press audio key
				_audioMistakesPerBlock++;
			}
			if(_visualKeyPressed == true) {
				_visualMistakesPerBlock++;
			}

			if((_audioKeyPressed == true) && (_visualKeyPressed != true)) {
				correctTrial = true;
			}
		} else if(_target == TargetKind.Visual) {
			if(_audioKeyPressed == true) {
				_audioMistakesPerBlock++;
			}
			if(_visualKeyPressed != true) {
				// user didn't press the visual key
				_visualMistakesPerBlock++;
			}

			if((_audioKeyPressed != true) && (_visualKeyPressed == true)) {
				correctTrial = true;
			}
		}

		if(correctTrial == true) {
			_TotalCorrect++;
			_score += _n;
		}

		// update display
		HandleScores(_TotalCorrect, _score);

		// clear the members
		_target = TargetKind.None;
		_audioKeyPressed = false;
		_visualKeyPressed = false;
	}

	// called when a block is started
	this.startBlock = function(n) {
		this._n = n;
		this._nValues.push(n);

		this._audioMistakesPerBlock = 0;
		this._visualMistakesPerBlock = 0;
		this._target = TargetKind.None;

		// clear the button press flags
		this._audioKeyPressed = false;
		this._visualKeyPressed = false;
	}

	// get the average N value so far
	this.getMeanN = function() {
		var meaN = 0;

		if(this._nValues.length < 1) {
			return 0;
		}

		this._nValues.forEach(function(i) {
			meaN += i;
		});

		return (meaN / this._nValues.length);
	}

	// calculate a very rough increase in gF based on the scores.
	// tie mean-N to days of training and then tie that to gF increase
	this.getPercentGFIncrease = function() {
		var increase = 0;

		// compute number of days
		// y = .1073x + 3.0951
		// found by using linear regession tool here: 
		// http://www.xuru.org/rt/LR.asp#CopyPaste with estimated data from figure 2 in the paper.
		try {
			var meanN = this.getMeanN();
			var days = (meanN - 3.0951) / .1073;

			// compute gF increase from an assumed initial average of 9.5 (see figure 3). This is the 
			// number of solved problems in a 10 minute span. Again, used regression tool from above, and
			// used data from figure 3b.
			// calculated regression is y = .3973x + 3.212
			var increaseInGFScore = (days * .3973) - 3.212;

			increase = 100 * (increaseInGFScore / 9.5);
		} catch(e) {
			console.log(e.message);
		}

		// if someone scored below average on their first trial, don't report a negative value
		if (increase < 0) {
			return 0;
		} else {
			return increase;
		}
	}

	// called at the end of a block
	// returns -1 if n should be decreased by 1,
	// 1 if n should be increased by 1,
	// and 0 if n shouldn't change
	this.endBlock = function() {
		var deltaN = 0;

		// increase N if more than 3 mistakes per "modality" (see protocol)
		if((this._audioMistakesPerBlock < 3) && (this._visualMistakesPerBlock < 3)) {
			deltaN = 1;
		} else if((this._audioMistakesPerBlock + this._visualMistakesPerBlock) > 5) {
			deltaN = -1;
		}

		this._audioMistakesPerBlock = 0;
		this._visualMistakesPerBlock = 0;
		this._target = TargetKind.None;

		// clear button press flags
		this._audioKeyPressed = false;
		this._visualKeyPressed = false;

		return deltaN;
	}
}

