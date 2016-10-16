// enum of possible positions of the square as it's displayed to the user
var SquarePosition = {
	TopLeft: 0,
	TopMiddle: 1,
	TopRight: 2,
	MiddleRight: 3,
	BottomRight: 4,
	BottomMiddle: 5,
	BottomLeft: 6,
	MiddleLeft: 7,
};

// enum of possible consonants to be played to the user
var Consonant = {
	Letter1: 0,
	Letter2: 1,
	Letter3: 2,
	Letter4: 3,
	Letter5: 4,
	Letter6: 5,
	Letter7: 6,
	Letter8: 7,
};

// enum of the kinds of target of each trial
var TargetKind = {
	Audio: 1,
	Visual: 2,
	Both: 3,
	None: 4, // the trial doesn't match
	TooEarly: 5, // this trial is too early in the list, and it doesn't have an earlier pair
};


function Trial(position, cons) {
	this._position = position;
	this._letter = cons;
	this._secondTrialInTarget = TargetKind.None;

	// GETS & SETS
	this.GetPosition = function() {
		return this._position;
	}

	this.SetPosition = function(val) {
		this._position = val;
	}

	this.GetLetter = function() {
		return this._letter;
	}

	this.SetLetter = function(val) {
		this._letter = val;
	}

	this.GetSecondTrialInTarget = function() {
		return this._secondTrialInTarget;
	}

	this.SetSecondTrialInTarget = function(val) {
		this._secondTrialInTarget = val;
	}
}