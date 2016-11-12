function BlockCreator() {
	const default_Block_Size = 20;
	const num_Blocks_Total = 20;
	const num_Audio_Targets = 4;
	const num_Visual_Targets = 4;
	const num_Both_Targets = 2;

	// PROPERTIES
	this.GetDefaultBlockSize = function() {
		return default_Block_Size;
	}

	this.GetNumBlocksTotal = function() {
		return num_Blocks_Total;
	}

	// FUNCTIONS
	this.createBlock = function(n) {
		// get a list of targets (positive trials) that should appear in the trials
		var targets = this.getTargets();

		var trials = [];

		// the first n trials are completely random
		for(var i = 0; i < n; i++) {
			var t = this.getRandomTrial();
			// too early in the list for this trial to have an earlier matching pair
			t.SetSecondTrialInTarget(TargetKind.TooEarly);
			trials.push(t);
		}

		for(var i = n; i < default_Block_Size + n; i++) {
			// get a completely non-matching trial
			var trialToAdd = this.getRandomTrialNoMatch(trials[i - n]);

			// is this trial the 2nd in a target ("matching") pair? If so,
			// we need to tweak it before we add it so that it matches
			var matchingKind = targets.find(function(el) {
				return el.Key === (i - n);
			});
			if(matchingKind !== undefined) {
				var trialAlreadyAdded = trials[i - n];

				// set the "matching kind" in the 2nd pair that we're adding
				trialToAdd.SetSecondTrialInTarget(matchingKind.Value);
				if(matchingKind.Value === TargetKind.Audio) {
					trialToAdd.SetLetter(trialAlreadyAdded.GetLetter());
				} else if(matchingKind.Value === TargetKind.Visual) {
					trialToAdd.SetPosition(trialAlreadyAdded.GetPosition());
				} else if(matchingKind.Value === TargetKind.Both) {
					trialToAdd.SetLetter(trialAlreadyAdded.GetLetter());
					trialToAdd.SetPosition(trialAlreadyAdded.GetPosition());
				}
			}

			trials.push(trialToAdd);
		}

		return trials;
	}

	// get a list of targets ("matching" trials) to insert into a block.
	// the returned object is sorted by the position
	this.getTargets = function() {
		// targets is a dictionary, so use an associative array named "key" and "value"
		var targets = [];

		// audio targets
		for(var i = 0; i < num_Audio_Targets; i++) {
			var iTargetLocation = this.getRandomTargetLocation(targets);
			var target = {};
			target.Key = iTargetLocation;
			target.Value = TargetKind.Audio;
			targets.push(target);
		}

		// visual targets
		for(var i = 0; i < num_Visual_Targets; i++) {
			var iTargetLocation = this.getRandomTargetLocation(targets);
			var target = {};
			target.Key = iTargetLocation;
			target.Value = TargetKind.Visual;
			targets.push(target);
		}

		// both targets
		for(var i = 0; i < num_Both_Targets; i++) {
			var iTargetLocation = this.getRandomTargetLocation(targets);
			var target = {};
			target.Key = iTargetLocation;
			target.Value = TargetKind.Both;
			targets.push(target);
		}

		// sort the targets so they're all in order
		targets.sort(function(a, b) {
			if(a.Key > b.Key) {
				return 1;
			}
			if(a.Key < b.Key) {
				return -1;
			}
			// a, b must be equal
			return 0;
		});

		// OUTPUT ANSWERS FOR SCORE DEBUGGING
		// targets.forEach(function(target) {
		// 	var buttonToPress;

		// 	if(target.Value === 1) {
		// 		buttonToPress = 'L';
		// 	} else if(target.Value === 2) {
		// 		buttonToPress = 'A';
		// 	} else if(target.Value === 3) {
		// 		buttonToPress = 'Both';
		// 	}
		// 	console.log(target.Key + " - " + buttonToPress);
		// });

		return targets;
	}

	// hand back a target location that isn't already used in the list of targets (in the list, the
	// key is the target location). Will only choose the first trial that will consist of the pair that
	// forms a "target". The first of the pair can appear in location 0 to default_Block_Size
	this.getRandomTargetLocation = function(targets) {
		var iLocation = 0;

		do {
			// gives 0 to default_Block_Size - 1 which is a perfect index into all possible iLocation(s)
			iLocation = Math.floor((Math.random() * default_Block_Size));

			// if this value is already used, just stay in the loop
			var findElement = targets.find(function(el) {
				return el.Key === iLocation;
			});
			if(findElement === undefined) {
				break;
			}
		} while(true);

		return iLocation;
	}

	// get a random trial that doesn't match (either audio or visual) the passed-in trial
	this.getRandomTrialNoMatch = function(noMatch) {
		var s;
		var c;

		do {
			var rand = Math.floor((Math.random() * SquarePosition.MiddleLeft) + 1);
			s = squarePositionIndexer(rand);
			if(s != noMatch.GetPosition()) {
				break;
			}
		} while(true);

		do {
			var rand = Math.floor((Math.random() * Consonant.Letter8) + 1);
			c = consonantIndexer(rand);
			if(c != noMatch.GetLetter()) {
				break;
			}
		} while(true);

		var t = new Trial(s, c);
		return t;
	}

	// get a completely random trial
	this.getRandomTrial = function() {
		var rand = Math.floor((Math.random() * SquarePosition.MiddleLeft) + 1);
		var s = squarePositionIndexer(rand);

		rand = Math.floor((Math.random() * Consonant.Letter8) + 1);
		c = consonantIndexer(rand);

		var t = new Trial(s, c);
		return t;
	}
}


// utility functions for JS enums that returns the correct member from an index
function squarePositionIndexer(i) {
	var pos;

	switch(i) {
		case 0:
			pos = SquarePosition.TopLeft;
			break;

		case 1:
			pos = SquarePosition.TopMiddle;
			break;

		case 2:
			pos = SquarePosition.TopRight;
			break;

		case 3:
			pos = SquarePosition.MiddleRight;
			break;

		case 4:
			pos = SquarePosition.BottomRight;
			break;

		case 5:
			pos = SquarePosition.BottomMiddle;
			break;

		case 6:
			pos = SquarePosition.BottomLeft;
			break;

		case 7:
			pos = SquarePosition.MiddleLeft;
			break;

		default:
			break;
	}

	return pos;
}


function consonantIndexer(i) {
	var consonant;

	switch(i) {
		case 0:
			consonant = Consonant.Letter1;
			break;

		case 1:
			consonant = Consonant.Letter2;
			break;

		case 2:
			consonant = Consonant.Letter3;
			break;

		case 3:
			consonant = Consonant.Letter4;
			break;

		case 4:
			consonant = Consonant.Letter5;
			break;

		case 5:
			consonant = Consonant.Letter6;
			break;

		case 6:
			consonant = Consonant.Letter7;
			break;

		case 7:
			consonant = Consonant.Letter8;
			break;

		default:
			break;
	}

	return consonant;
}


function targetKindIndexer(i) {
	var targetKind;

	switch(i) {
		case 1:
			targetKind = TargetKind.Audio;
			break;

		case 2:
			targetKind = TargetKind.Visual;
			break;

		case 3:
			targetKind = TargetKind.Both;
			break;

		case 4:
			targetKind = TargetKind.None;
			break;

		case 5:
			targetKind = TargetKind.TooEarly;
			break;

		default:
			break;
	}

	return targetKind;
}