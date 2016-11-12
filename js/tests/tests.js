// Storage/history tests
QUnit.test("Storage and score history tests", function(assert) {
	// clear history so the length tests start from zero
	clearHistory();

	var dateOne = Date.now().toString();
	addSessionToHistory("1", 2.5);

	assert.ok(storageAvailable('localStorage'), "Local storage is available");

	assert.deepEqual(localStorage.getItem("1"), "2.5", "Local storage stores a session successfully");
	assert.deepEqual(localStorage.length, 1, "Local storage is populated after session added to history");

	var dateTwo = Date.now().toString();
	addSessionToHistory("2", 3);
	assert.deepEqual(localStorage.getItem("2"), "3", "Local storage stores another session successfully");
	assert.deepEqual(localStorage.length, 2, "Local storage is populated after second session added to history");

	clearHistory();
	assert.deepEqual(localStorage.length, 0, "Local storage is empty after call to clear history");

	// toggle switch test - toggle off and try to add another session to local storage
	$("#save-toggle").bootstrapToggle('toggle');
	assert.notOk($("#save-toggle").prop('checked'), "Toggle switch turns off");
	var dateThree = Date.now().toString();
	addSessionToHistory("3", 3.5);
	assert.deepEqual(localStorage.length, 0, "Local storage is not populated if switch is off");
});

// Page tests
QUnit.test("Page class timing tests", function(assert) {
	var page = new Page();
	var blockCreator = new BlockCreator();
	var trials = blockCreator.createBlock(2);
	var timerText = "incomplete";
	var pauseTimerText = "incomplete";
	var done = assert.async();
	var pauseDone = assert.async();
	var resumeDone = assert.async();

	page.m_Trials = trials;

	// end of trial/block tests
	assert.deepEqual(page._trialNum, 0, "trial number initialised correctly");
	page.trialTimeUp();
	assert.deepEqual(page._trialNum, 1, "trial number increments correctly");
	assert.deepEqual(document.getElementById("prog-bar").style.width, "4.54545%", "Progress bar increments correctly");

	// settimeout() wrapper tests
	var timer = new Timer(function() {
		timerText = "complete";
	}, 1000);
	assert.ok(timer instanceof Timer, "Timer constructor instantiates ok");
	assert.deepEqual(timerText, "incomplete", "Timer callback initiated ok");
	setTimeout(function() {
		assert.deepEqual(timerText, "complete", "Timer callback completes");
		done();
	}, 1000);

	var pauseTimer = new Timer(function() {
		pauseTimerText = "complete";
	}, 1000);
	pauseTimer.pause();
	setTimeout(function() {
		assert.deepEqual(pauseTimerText, "incomplete", "Timer pause works");
		pauseDone();
	}, 1000);
	pauseTimer.resume();
	setTimeout(function() {
		assert.deepEqual(pauseTimerText, "complete", "Timer resume works");
		resumeDone();
	}, 1000);
});


QUnit.test("Page class feedback tests", function(assert) {
	var page = new Page();
	var position = SquarePosition.BottomMiddle;
	var consonant = Consonant.Letter2;
	var trial = new Trial(position, consonant);

	// grid square highlight test
	assert.deepEqual(document.getElementById("bottom-middle").style.backgroundColor, "", "square is blank before it gets highlighted");
	page.presentTrialInfoToUser(trial);
	assert.deepEqual(document.getElementById("bottom-middle").style.backgroundColor, "orange", "correct square gets highlighted");

	page.hideStimulus();
	assert.deepEqual(document.getElementById("bottom-left").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("bottom-middle").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("bottom-right").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("middle-left").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("middle-right").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("top-left").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("top-middle").style.backgroundColor, "", "hideStimulus() clears grid correctly");
    assert.deepEqual(document.getElementById("top-right").style.backgroundColor, "", "hideStimulus() clears grid correctly");

	// success/failure feedback tests
	var result = TrialResult.Visual_Success;
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "", "visual feedback correct before result");
	handleTrialResult(result);
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "green", "visual success feedback correct");

	result = TrialResult.Visual_Failure;
	handleTrialResult(result);
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "red", "visual failure feedback correct");

	result = TrialResult.Audio_Success;
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "", "audio feedback correct before result");
	handleTrialResult(result);
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "green", "audio success feedback correct");

	result = TrialResult.Audio_Failure;
	handleTrialResult(result);
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "red", "audio success feedback correct");
});


QUnit.test("Page class basic tests", function(assert) {
	var page = new Page();
	var startButton = $('#start-button');

	assert.ok(page instanceof Page, "Constructor instantiates ok");
	assert.notOk(page._playingGame, "game is not playing until start button is clicked");
	assert.deepEqual(document.getElementById("N1").style.display, "inline-block", "N Back 1 is visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N2").style.display, "inline-block", "N Back 2 is visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N3").style.display, "none", "N Back 3 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N4").style.display, "none", "N Back 4 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N5").style.display, "none", "N Back 5 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N6").style.display, "none", "N Back 6 is NOT visible at the start of a new trial");
	assert.deepEqual(document.getElementById("N7").style.display, "none", "N Back 7 is NOT visible at the start of a new trial");

	assert.deepEqual(document.getElementById("prog-bar").style.width, "0%", "Progress bar is initialised to 0%");

	assert.deepEqual(startButton.val(), "Start", "Start button is initialised correctly");
	assert.deepEqual(startButton.text(), "Start", "Start button is initialised correctly");

	// trigger a start button click event
	startButton.trigger('click');
	assert.deepEqual(startButton.val(), "Pause", "Start button changes to a pause button on click");
	assert.deepEqual(startButton.text(), "Pause", "Start button changes to a pause button on click");

	// game will not be playing until after initial wait timer is complete
	var done = assert.async();
	setTimeout(function() {
		assert.ok(page._playingGame, "game is not playing until start button is clicked");
		done();
	}, 700);
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
	setProgress(0);
	assert.deepEqual(progressBar.style.width, "0%", "Progress bar resets back to 0%");
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

	score.startNewTrial(TargetKind.Both)
	assert.deepEqual(score._target, TargetKind.Both, "start new trial registers correct answer");

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

	score._target = TargetKind.TooEarly;
	score.endTrial();
	assert.deepEqual(score._target, TargetKind.None, "a target kind of too early doesn't score");
	assert.notOk(score._audioKeyPressed, "audio/visual key press flags are reset after a score is checked");
	assert.notOk(score._visualKeyPressed, "audio/visual key press flags are reset after a score is checked");

	score._target = TargetKind.None;
	score._audioKeyPressed = true;
	score._visualKeyPressed = true;
	score.endTrial();
	assert.deepEqual(score._audioMistakesPerBlock, 1, "a target of none results in a mistake if the audio key is pressed");
	assert.deepEqual(score._visualMistakesPerBlock, 1, "a target of none results in a mistake if the visual key is pressed");
	score._audioKeyPressed = false;
	score._visualKeyPressed = false;
	score.endTrial();
	assert.deepEqual(score._TotalCorrect, 1, "score is updated on a successful trial");
	assert.deepEqual(document.getElementById("score-text").textContent, score._score.toString(), "score is updated in display");

	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "", "feedback boxes are blank when starting a trial");
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "", "feedback boxes are blank when starting a trial");

	score._target = TargetKind.Visual;
	score.recordButtonPress('a');
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "green", "visual trial is correct when the 'a' key is pressed");
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "", "audio feedback not modified on a visual trial");
	score.recordButtonPress('l');
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "red", "visual trial is incorrect when the 'l' key is pressed");

	// clear feedback for next test - this will be handled in Page.trialTimeUp() but for testing, do it here
	document.getElementById("left-hand-feedback").style.backgroundColor = "";
	document.getElementById("right-hand-feedback").style.backgroundColor = "";
	score._visualKeyPressed = false;
	score._audioKeyPressed = false;

	score._target = TargetKind.Audio;
	score.recordButtonPress('a');
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "red", "audio trial is incorrect when the 'a' key is pressed");
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "", "visual feedback not modified on an audio trial");
	score.recordButtonPress('l');
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "green", "audio trial is correct when the 'l' key is pressed");

	// clear feedback for next test - this will be handled in Page.trialTimeUp() but for testing, do it here
	document.getElementById("left-hand-feedback").style.backgroundColor = "";
	document.getElementById("right-hand-feedback").style.backgroundColor = "";
	score._visualKeyPressed = false;
	score._audioKeyPressed = false;

	score._target = TargetKind.Both;
	score.recordButtonPress('a');
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "green", "both feedbacks are green when a trial of both is presented");
	score.recordButtonPress('l');
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "green", "both feedbacks are green when a trial of both is presented");

	// clear feedback for next test - this will be handled in Page.trialTimeUp() but for testing, do it here
	document.getElementById("left-hand-feedback").style.backgroundColor = "";
	document.getElementById("right-hand-feedback").style.backgroundColor = "";
	score._visualKeyPressed = false;
	score._audioKeyPressed = false;

	score._target = TargetKind.None;
	score.recordButtonPress('a');
	score.recordButtonPress('l');
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "red", "both feedbacks are red when a trial of none is presented");
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "red", "both feedbacks are red when a trial of none is presented");

	// clear feedback for next test - this will be handled in Page.trialTimeUp() but for testing, do it here
	document.getElementById("left-hand-feedback").style.backgroundColor = "";
	document.getElementById("right-hand-feedback").style.backgroundColor = "";
	score._visualKeyPressed = false;
	score._audioKeyPressed = false;

	score._target = TargetKind.Audio;
	score.recordButtonPress('A');
	score.recordButtonPress('L');
	assert.deepEqual(document.getElementById("left-hand-feedback").style.backgroundColor, "", "upper case letters do not work");
	assert.deepEqual(document.getElementById("right-hand-feedback").style.backgroundColor, "", "upper case letters do not work");
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
	var t = blockCreator.getRandomTrial();
	var nTrialsAudioTargets = 0;
	var nTrialsVisualTargets = 0;
	var nTrialsBothTargets = 0;
	var nTrialsTooEarlyTargets = 0;
	var nTrialsNoneTargets = 0;
	var nBackHigher = blockCreator.createBlock(Math.floor((Math.random() * 7) + 1));

	assert.ok(t.GetPosition() >= 0 && t.GetPosition() <= 7, "getRandomTrial() returns a correct Trial object");
	assert.ok(t.GetLetter() >= 0 && t.GetLetter() <= 7, "getRandomTrial() returns a correct Trial object");

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
	assert.deepEqual(trials[0].GetSecondTrialInTarget(), TargetKind.TooEarly, "First two trials are set to too early");
	assert.deepEqual(trials[1].GetSecondTrialInTarget(), TargetKind.TooEarly, "First two trials are set to too early");

	trials.forEach(function(t) {
		assert.ok(t instanceof Trial, "createBlock() creates array of Trial objects");
		assert.notDeepEqual(t.GetPosition(), undefined, "individual trials in the block have a valid target position");
		assert.notDeepEqual(t.GetLetter(), undefined, "individual trials in the block have a valid target letter");
		if(t.GetSecondTrialInTarget() === TargetKind.Audio) {
			nTrialsAudioTargets++;
		} else if(t.GetSecondTrialInTarget() === TargetKind.Visual) {
			nTrialsVisualTargets++;
		} else if(t.GetSecondTrialInTarget() === TargetKind.Both) {
			nTrialsBothTargets++;
		} else if(t.GetSecondTrialInTarget() === TargetKind.TooEarly) {
			nTrialsTooEarlyTargets++;
		} else if(t.GetSecondTrialInTarget() === TargetKind.None) {
			nTrialsNoneTargets++;
		}
	});

	nBackHigher.forEach(function(t) {
		assert.ok(t instanceof Trial, "createBlock() works with a higher NBack number");
		assert.notDeepEqual(t.GetPosition(), undefined, "createBlock() works with a higher NBack number");
		assert.notDeepEqual(t.GetLetter(), undefined, "createBlock() works with a higher NBack number");
	});

	assert.deepEqual(nTrialsAudioTargets, 4, "we have 4 trials that are audio targets");
	assert.deepEqual(nTrialsVisualTargets, 4, "we have 4 trials that are visual targets");
	assert.deepEqual(nTrialsBothTargets, 2, "we have 2 trials that are both targets");
	assert.deepEqual(nTrialsTooEarlyTargets, 2, "we have 2 trials that are too early targets");
	assert.deepEqual(nTrialsNoneTargets, 10, "we have 10 trials that are none targets");

	assert.deepEqual(typeof(randTargetLoc), "number", "getRandomTargetLocation() returns a number");
	assert.ok(randTargetLoc >= 0, "getRandomTargetLocation() returns a number greater than or equal to 0");
	assert.ok(randTargetLoc < 20, "getRandomTargetLocation() returns a number less than 20");
	
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

	// use setters with indexes
	trial.SetPosition(4);
	trial.SetLetter(2);
	trial.SetSecondTrialInTarget(1);

	assert.deepEqual(trial.GetPosition(), 4, "setting via index returns correct value");
	assert.deepEqual(trial.GetLetter(), 2, "setting via index returns correct value");
	assert.deepEqual(trial.GetSecondTrialInTarget(), 1, "setting via index returns correct value");

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


// enum indexer utility functions tests
QUnit.test("Enums utility functions tests", function(assert) {
	assert.deepEqual(squarePositionIndexer(0), SquarePosition.TopLeft, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(1), SquarePosition.TopMiddle, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(2), SquarePosition.TopRight, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(3), SquarePosition.MiddleRight, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(4), SquarePosition.BottomRight, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(5), SquarePosition.BottomMiddle, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(6), SquarePosition.BottomLeft, "utility SquarePosition indexer function works correctly");
	assert.deepEqual(squarePositionIndexer(7), SquarePosition.MiddleLeft, "utility SquarePosition indexer function works correctly");

	assert.deepEqual(consonantIndexer(0), Consonant.Letter1, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(1), Consonant.Letter2, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(2), Consonant.Letter3, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(3), Consonant.Letter4, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(4), Consonant.Letter5, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(5), Consonant.Letter6, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(6), Consonant.Letter7, "utility Consonant indexer function works correctly");
	assert.deepEqual(consonantIndexer(7), Consonant.Letter8, "utility Consonant indexer function works correctly");

	assert.deepEqual(squarePositionIndexer(-1), undefined, "incorrect indexes handled correctly");
	assert.deepEqual(squarePositionIndexer(8), undefined, "incorrect indexes handled correctly");
	assert.deepEqual(consonantIndexer(-1), undefined, "incorrect indexes handled correctly");
	assert.deepEqual(consonantIndexer(8), undefined, "incorrect indexes handled correctly");
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

	// random number generator tests
	assert.ok(GenerateRandomPosition() >= 0, "Square Position random number generator is within range");
	assert.ok(GenerateRandomPosition() <= 7, "Square Position random number generator is within range");

	assert.ok(GenerateRandomLetter() >= 0, "Consonant random number generator is within range");
	assert.ok(GenerateRandomLetter() <= 7, "Consonant random number generator is within range");
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


// custom random number generator functions - lifted as an excerpt from BlockCreator
function GenerateRandomPosition() {
	return Math.floor((Math.random() * SquarePosition.MiddleLeft) + 1);
}

function GenerateRandomLetter() {
	return Math.floor((Math.random() * Consonant.Letter8) + 1);
}