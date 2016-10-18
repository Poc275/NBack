function BlockCreator() {
	const default_Block_Size = 20;
	const num_Blocks_Total = 20;
	const num_Audio_Targets = 4;
	const num_Visual_Targets = 4;
	const num_Both_Targets = 2;

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
			var trialToAdd = this.getRandomTrial(trials[i - n]);

			var matchingKind;

			// is this trial the 2nd in a target ("matching") pair? If so,
			// we need to tweak it before we add it so that it matches
			var findResult = targets.find(function(el) {
				return el === (i - n);
			});
			if(findResult != undefined) {
				var matchingKind = targets.find(i - n);
				var trialAlreadyAdded = trials[i - n];

				// set the "matching kind" in the 2nd pair that we're adding
				trialToAdd.SetSecondTrialInTarget = matchingKind;
				if(matchingKind == TargetKind.Audio) {
					trialToAdd.SetLetter = trialAlreadyAdded.GetLetter();
				} else if(matchingKind == TargetKind.Visual) {
					trialToAdd.SetPosition = trialAlreadyAdded.GetPosition();
				} else if(matchingKind == TargetKind.Both) {
					trialToAdd.SetLetter = trialAlreadyAdded.GetLetter();
					trialToAdd.SetPosition = trialAlreadyAdded.GetPosition();
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
			// a must be equal
			return 0;
		});

		return targets;
	}

	// hand back a target location that isn't already used in the list of targets (in the list, the
	// key is the target location). Will only choose the first trial that will consist of the pair that
	// forms a "target". The first of the pair can appear in location 0 to default_Block_Size
	this.getRandomTargetLocation = function(targets) {
		var iLocation = 0;

		do {
			// gives 0 to default_Block_Size - 1 which is a perfect index into all possible iLocation(s)
			iLocation = Math.floor((Math.random() * default_Block_Size) + 1);

			var k;

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
	this.getRandomTrial = function(noMatch) {
		var s;
		var c;

		do {
			var rand = Math.floor((Math.random() * SquarePosition.MiddleLeft) + 1);
			s = SquarePosition[rand];
			if(s != noMatch.GetPosition()) {
				break;
			}
		} while(true);

		do {
			var rand = Math.floor((Math.random() * Consonant.Letter8) + 1);
			c = Consonant[rand];
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
		var s = SquarePosition[rand];

		rand = Math.floor((Math.random() * Consonant.Letter8) + 1);
		c = Consonant[rand];

		var t = new Trial(s, c);
		return t;
	}
}