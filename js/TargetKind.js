// enum of the kinds of target of each trial
var TargetKind = {
	Audio: 1,
	Visual: 2,
	Both: 3,
	None: 4, // the trial doesn't match
	TooEarly: 5, // this trial is too early in the list, and it doesn't have an earlier pair
};