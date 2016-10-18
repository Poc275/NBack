// Block Creator tests
QUnit.test("Block creator class tests", function(assert) {
	var blockCreator = new BlockCreator();
	var trials = blockCreator.createBlock(2);
	var randTargetLoc = blockCreator.getRandomTargetLocation([]);
	var targets = blockCreator.getTargets();
	var nAudioTargets = 0;
	var nVisualTargets = 0;
	var nBothTargets = 0;

	targets.forEach(function(el) {
		if(el.Value === TargetKind.Audio) {
			nAudioTargets++
		} else if(el.Value === TargetKind.Visual) {
			nVisualTargets++;
		} else if (el.Value === TargetKind.Both) {
			nBothTargets++;
		}
	});

	assert.ok(blockCreator instanceof BlockCreator, "Constructor instantiates ok");

	assert.deepEqual(trials.length, 22, "createBlock() creates array of correct length");
	assert.ok(trials[0] instanceof Trial, "createBlock() creates array of Trial objects");

	assert.deepEqual(trials[0].GetSecondTrialInTarget(), TargetKind.TooEarly, "First two trials are set to too early");
	assert.deepEqual(trials[1].GetSecondTrialInTarget(), TargetKind.TooEarly, "First two trials are set to too early");

	assert.deepEqual(typeof(randTargetLoc), "number", "getRandomTargetLocation() returns a number");
	assert.ok(randTargetLoc > 0, "getRandomTargetLocation() returns a number greater than 0");
	assert.ok(randTargetLoc <= 20, "getRandomTargetLocation() returns a number less than or equal to 20");
	
	assert.deepEqual(targets.length, 10, "getTargets() returns correct number of trials");
	assert.deepEqual(nAudioTargets, 4, "we have 4 audio targets");
	assert.deepEqual(nVisualTargets, 4, "we have 4 visual targets");
	assert.deepEqual(nBothTargets, 2, "we have 2 both targets");
	// check targets is sorted by key
	for(var i = 1; i < targets.length; i++) {
		assert.ok(targets[i].Key > targets[i - 1].Key, "getTargets() is sorted correctly");
	}
});


// Trial tests
QUnit.test("Trial class tests", function(assert) {
	var position = SquarePosition.BottomMiddle;
	var consonant = Consonant.Letter2;
	var trial = new Trial(position, consonant);

	assert.ok(trial instanceof Trial, "Constructor instantiates ok");

	assert.deepEqual(trial.GetPosition(), SquarePosition.BottomMiddle, "getters return correct values");
	assert.deepEqual(trial.GetLetter(), Consonant.Letter2, "getters return correct values");
	assert.deepEqual(trial.GetSecondTrialInTarget(), TargetKind.None, "getters return correct values");

	// use setters to change properties and re-test
	trial.SetPosition(SquarePosition.MiddleLeft);
	trial.SetLetter(Consonant.Letter5);
	trial.SetSecondTrialInTarget(TargetKind.Visual);

	assert.deepEqual(trial.GetPosition(), SquarePosition.MiddleLeft, "setters return correct values");
	assert.deepEqual(trial.GetLetter(), Consonant.Letter5, "setters return correct values");
	assert.deepEqual(trial.GetSecondTrialInTarget(), TargetKind.Visual, "setters return correct values");

});


// enum tests
QUnit.test("Enums tests", function(assert) {
	var position = SquarePosition.TopLeft;
	var consonant = Consonant.Letter4;
	var targetKind = TargetKind.TooEarly;
	var trialResult = TrialResult.Audio_Failure;

	assert.deepEqual(position, SquarePosition.TopLeft, "Square Position enum returns correct value");
	assert.deepEqual(position, 0, "Square Position enum returns correct value");
	assert.notDeepEqual(position, SquarePosition.BottomRight, "Square Position enum returns correct value");
	assert.notDeepEqual(position, 1, "Square Position enum returns correct value");

	assert.deepEqual(consonant, Consonant.Letter4, "Consonant enum returns correct value");
	assert.deepEqual(consonant, 3, "Consonant enum returns correct value");
	assert.notDeepEqual(consonant, Consonant.Letter5, "Consonant enum returns correct value");
	assert.notDeepEqual(consonant, 4, "Consonant enum returns correct value");

	assert.deepEqual(targetKind, TargetKind.TooEarly, "Target Kind enum returns correct value");
	assert.deepEqual(targetKind, 5, "Target Kind enum returns correct value");
	assert.notDeepEqual(targetKind, TargetKind.Both, "Target Kind enum returns correct value");
	assert.notDeepEqual(targetKind, 4, "Target Kind enum returns correct value");

	assert.deepEqual(trialResult, TrialResult.Audio_Failure, "Trial Result enum returns correct value");
	assert.deepEqual(trialResult, 2, "Trial Result enum returns correct value");
	assert.notDeepEqual(trialResult, TrialResult.Visual_Success, "Trial Result enum returns correct value");
	assert.notDeepEqual(trialResult, 1, "Trial Result enum returns correct value");

	// check enums cannot return false members
	assert.deepEqual(SquarePosition.LeftRight, undefined, "enums do not return non-existent members");
	assert.deepEqual(Consonant.Letter9, undefined, "enums do not return non-existent members");
	assert.deepEqual(TargetKind.WayTooEarly, undefined, "enums do not return non-existent members");
	assert.deepEqual(TrialResult.Abject_Failure, undefined, "enums do not return non-existent members");
});