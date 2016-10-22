// Page tests
QUnit.test("Page class tests", function(assert) {
	var page = new Page();

	assert.ok(page instanceof Page, "Constructor instantiates ok");
	assert.deepEqual(document.getElementById("N1").style.display, "inline-block", "N Back 1 is visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N2").style.display, "inline-block", "N Back 2 is visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N3").style.display, "none", "N Back 3 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N4").style.display, "none", "N Back 4 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N5").style.display, "none", "N Back 5 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N6").style.display, "none", "N Back 6 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N7").style.display, "none", "N Back 7 is NOT visible at the start of a new trial");

	assert.deepEqual(document.getElementById("prog-bar").style.width, "0%", "Progress bar is initialised to 0%");

});

// Progress bar tests
QUnit.test("Progress bar function tests", function(assert) {
	var progressBar = document.getElementById("prog-bar");

	assert.deepEqual(progressBar.style.width, "0%", "Progress bar is initialised to 0%");
	setProgress(-10);
	assert.deepEqual(progressBar.style.width, "0%", "Progress bar cannot be set below zero");
	setProgress(101);
	assert.deepEqual(progressBar.style.width, "0%", "Progress bar cannot be set above zero");
	setProgress(50);
	assert.deepEqual(progressBar.style.width, "50%", "Progress bar is set correctly");
});

// N display grid tests
QUnit.test("N Display grid tests", function(assert) {
	var N1 = document.getElementById("N1");
	var N2 = document.getElementById("N2");
	var N3 = document.getElementById("N3");
	var N4 = document.getElementById("N4");
	var N5 = document.getElementById("N5");
	var N6 = document.getElementById("N6");
	var N7 = document.getElementById("N7");

	DisplayN(0);
	assert.deepEqual(N1.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N2.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N3.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N4.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N5.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N6.style.display, "none", "All n displays are hidden when N = 0");
	assert.deepEqual(N7.style.display, "none", "All n displays are hidden when N = 0");

	DisplayN(1);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 1");
	assert.deepEqual(N2.style.display, "none", "N2 hidden when N = 1");
	assert.deepEqual(N3.style.display, "none", "N3 hidden when N = 1");
	assert.deepEqual(N4.style.display, "none", "N4 hidden when N = 1");
	assert.deepEqual(N5.style.display, "none", "N5 hidden when N = 1");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N = 1");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 1");

	DisplayN(2);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 2");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 2");
	assert.deepEqual(N3.style.display, "none", "N3 hidden when N = 2");
	assert.deepEqual(N4.style.display, "none", "N4 hidden when N = 2");
	assert.deepEqual(N5.style.display, "none", "N5 hidden when N = 2");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N = 2");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 2");

	DisplayN(3);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 3");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 3");
	assert.deepEqual(N3.style.display, "inline-block", "N3 visible when N = 3");
	assert.deepEqual(N4.style.display, "none", "N4 hidden when N = 3");
	assert.deepEqual(N5.style.display, "none", "N5 hidden when N = 3");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N = 3");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 3");

	DisplayN(4);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 4");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 4");
	assert.deepEqual(N3.style.display, "inline-block", "N3 visible when N = 4");
	assert.deepEqual(N4.style.display, "inline-block", "N4 visible when N = 4");
	assert.deepEqual(N5.style.display, "none", "N5 hidden when N = 4");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N = 4");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 4");

	DisplayN(5);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 5");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 5");
	assert.deepEqual(N3.style.display, "inline-block", "N3 visible when N = 5");
	assert.deepEqual(N4.style.display, "inline-block", "N4 visible when N = 5");
	assert.deepEqual(N5.style.display, "inline-block", "N5 visible when N = 5");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N = 5");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 5");

	DisplayN(6);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 6");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 6");
	assert.deepEqual(N3.style.display, "inline-block", "N3 visible when N = 6");
	assert.deepEqual(N4.style.display, "inline-block", "N4 visible when N = 6");
	assert.deepEqual(N5.style.display, "inline-block", "N5 visible when N = 6");
	assert.deepEqual(N6.style.display, "inline-block", "N6 visible when N = 6");
	assert.deepEqual(N7.style.display, "none", "N7 hidden when N = 6");

	DisplayN(7);
	assert.deepEqual(N1.style.display, "inline-block", "N1 visible when N = 7");
	assert.deepEqual(N2.style.display, "inline-block", "N2 visible when N = 7");
	assert.deepEqual(N3.style.display, "inline-block", "N3 visible when N = 7");
	assert.deepEqual(N4.style.display, "inline-block", "N4 visible when N = 7");
	assert.deepEqual(N5.style.display, "inline-block", "N5 visible when N = 7");
	assert.deepEqual(N6.style.display, "inline-block", "N6 visible when N = 7");
	assert.deepEqual(N7.style.display, "inline-block", "N7 visible when N = 7");

	DisplayN(10);
	assert.deepEqual(N1.style.display, "none", "N1 hidden when N > 7");
	assert.deepEqual(N2.style.display, "none", "N2 hidden when N > 7");
	assert.deepEqual(N3.style.display, "none", "N3 hidden when N > 7");
	assert.deepEqual(N4.style.display, "none", "N4 hidden when N > 7");
	assert.deepEqual(N5.style.display, "none", "N5 hidden when N > 7");
	assert.deepEqual(N6.style.display, "none", "N6 hidden when N > 7");
	assert.deepEqual(N7.style.display, "inline-block", "N7 visible when N > 7");
	// if n > 7 then text should be changed accordingly
	assert.deepEqual(N7.textContent, "10", "N7 changes text accordingly when N > 7");
});

// Score tests
QUnit.test("Score class tests", function(assert) {
	var score = new Score();
	var abortedScore = [];
	var badScore = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
	var averageScore = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

	score.startBlock(2);

	assert.ok(score instanceof Score, "Constructor instantiates ok");
	assert.deepEqual(score.audioMistakes(), 0, "instantiated with 0 audio mistakes");
	assert.deepEqual(score.visualMistakes(), 0, "instantiated with 0 visual mistakes");

	score._nValues = abortedScore;
	assert.deepEqual(score.getMeanN(), 0, "an aborted test has a meanN of 0");
	assert.deepEqual(score.getPercentGFIncrease(), 0, "an aborted test has a 0% increase");

	score._nValues = badScore;
	assert.deepEqual(score.getMeanN(), 2, "a completely failed test has a meanN of 2");
	assert.deepEqual(score.getPercentGFIncrease(), 0, "a completely failed test has a 0% increase");

	score._nValues = averageScore;
	assert.deepEqual(score.getMeanN(), 4, "a sample test has a meanN of 4");
	// custom assertion for floats
	// 3rd argument is the tolerance
	assert.close(score.getPercentGFIncrease(), 1.45869, 0.00001, "a sample test has a 1.46% increase");

	score._audioMistakesPerBlock = 7;
	score._visualMistakesPerBlock = 6;
	assert.deepEqual(score.endBlock(), -1, "a test with more than 5 combined mistakes results in n back - 1");

	score._audioMistakesPerBlock = 1;
	score._visualMistakesPerBlock = 2;
	assert.deepEqual(score.endBlock(), 1, "a test with less than 3 visual and audio mistakes results in n back + 1");

	score._audioMistakesPerBlock = 4;
	score._visualMistakesPerBlock = 1;
	assert.deepEqual(score.endBlock(), 0, "a test with 5 combined mistakes results in n back of 0");
});

// Block creator tests
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
			nAudioTargets++;
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


// custom assertion for floating point numbers
// source: http://bumbu.me/comparing-numbers-approximately-in-qunitjs/
QUnit.assert.close = function(number, expected, error, message) {
	if (error === void 0 || error === null) {
		error = 0.00001;
	}

  	var result = number == expected || (number < expected + error && number > expected - error) || false;

  	this.push(result, number, expected, message);
};