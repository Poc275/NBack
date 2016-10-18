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