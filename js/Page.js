function Page() {
    var self = this; // for event handlers
    var startButton = document.getElementById('start-button');

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

	const _stimulus_time = 500;

	// total time to wait for user input
	const _total_trial_time = 3000;

	// keeps track of the user's score
	this._score = new Score();

    // set to true whenever the game is running
    this._playingGame = false;

    // timers - from Page.xaml
    // initial wait - gap before the trial starts so the user can get ready
    // Timer_1 - for the stimulus, i.e. the square highlights
    // TrialTimer - total trial time, trial is ended when completed
    this.initialWait;
    this.Timer_1;
    this.TrialTimer;


	DisplayN(this._starting_N);
 	//square.Opacity = 0;
 	setProgress(0);
    
 	//DemoTimer.Completed += new EventHandler(demoStepEnded);
 	//InitialWait.Completed += new EventHandler(Start_Training);
 	//InitialWait.Duration = new TimeSpan(675 * 10000);//675ms
 	//_continueTimer.Completed += new EventHandler(startBlock);
 	//_continueTimer.Duration = new TimeSpan(675 * 10000);//675ms


 	// EVENTS
 	//PauseButton_Click() {
	    // //Pause all animations/timers
	    // Timer_1.Pause();
	    // FadeBoxOut.Pause();
	    // TrialTimer.Pause();

	    // //Position pop-ups
	    // GeneralTransform gt = PopupTarget.TransformToVisual(Application.Current.RootVisual as UIElement);
	    // Point offset = gt.Transform(new Point(0, 0));
	    // PausePopup.HorizontalOffset = offset.X;
	    // PausePopup.VerticalOffset = offset.Y;

	    // PausePopup.IsOpen = true;

	    // StartButton.Click -= PauseButton_Click;
	    // StartButton.Content = "Continue";
	    // StartButton.Click += continueButton_Click;
    //}

    // continue from pause
    // continueButton_Click() {
    //     StartButton.Click -= continueButton_Click;
    //     StartButton.Content = "Pause";
    //     StartButton.Click += PauseButton_Click;

    //     PausePopup.IsOpen = false;
    //     Timer_1.Resume();
    //     FadeBoxOut.Resume();
    //     TrialTimer.Resume();

    //}

    startButton.addEventListener('click', function(event) {
        // check for start/pause via changing the text value of the button itself
        if(event.target.value == "Start") {
            event.target.value = "Pause";
            event.target.textContent = "Pause";
            // original timer = 675 * 10000 (675ms)
            // in setTimeout() the delay is in milliseconds
            // 'this' in an event handler is the object that fired the event
            self.initialWait = window.setTimeout(self.Start_Training, 675);
        } else if(event.target.value == "Pause") {
            event.target.value = "Start";
            event.target.textContent = "Start";
        }
    });

    // Reset_Click() {
    //     StartButton.Content = Page_Resources.Start_Button;
    //     StartButton.Click -= Reset_Click;
    //     StartButton.Click += StartButton_Click;
    //     FadeHelpBoxOut.Begin();

    //     _blockNum = 0;
    //     _playingGame = false;
    //     _trialNum = 0;
    //     _n = _starting_N;
    //     //LayoutRoot.InvalidateArrange();

    //     SessionText.Text = String.Format("{0}/{1}", _blockNum, BlockCreator.default_Block_Size);
    //     //NumberCorrectText.Text = 0.ToString();
    //     ScoreText.Text = 0.ToString() ;
    //     //NText.Text = _n.ToString();
    //}

    document.addEventListener("keyup", function(event) {
      if(self._playingGame === true) {
        self._score.recordButtonPress(event.key);
      }
    }, false);

    // ContinueButton_Click() {
    //     EndBlockPopup.IsOpen = false;

    //     //Start a new block...
    //     ProgBar.setProgress(0);
    //     _blockNum++;
    //     SessionText.Text = String.Format("{0}/{1}", _blockNum+1, BlockCreator.default_Block_Size);

    //     m_Trials = BlockCreator.createBlock(_n);
    //     _trialNum = 0;

    //     //Tell the user the n they're using
    //     ShowN.DisplayN(_n);

    //     _score.startBlock(_n);

    //     //Make sure that the media players are stopped.
    //     AudioPlayer_1.Stop();
    //     AudioPlayer_2.Stop();
    //     AudioPlayer_3.Stop();
    //     AudioPlayer_4.Stop();
    //     AudioPlayer_5.Stop();
    //     AudioPlayer_6.Stop();
    //     AudioPlayer_7.Stop();
    //     AudioPlayer_8.Stop();

    //     //Give the user a chance to catch their breath before starting the next block.
    //     _continueTimer.Begin();
    // }

    //Reset whatever audio is calling us...
    // AudioPlayer_MediaEnded() {
    //     MediaElement m = (MediaElement)sender;
    //     m.Stop();
    //     m.Position = TimeSpan.FromMilliseconds(0);
    // }


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
        var blockCreator = new BlockCreator();

 		self._playingGame = true;

        _score = new Score();
        //_score.HandleTrialOutcome += handleTrialResult;
        //_score.HandleScores += handleScores;

        // we're starting, get the list of trials and clear the extra stuff
        self._n = self._starting_N;
        self._blockNum = 0;
        self._trialNum = 0;
        self.m_Trials = blockCreator.createBlock(self._n);
        _score.startBlock(self._n);

        // present the first trial to the user
        self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);
        _score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget);

        // start the timers for the first trial
        self.Timer_1 = window.setTimeout(self.hideStimulus, _stimulus_time);
        self.TrialTimer = window.setTimeout(self.trialTimeUp, _total_trial_time);
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
 			if(self._blockNum == (BlockCreator.num_Blocks_Total - 1)) {
 				// what was the average n level?
 				var averageN = self._score.getMeanN();
 				// output to screen....

 				if(self._score.getPercentGFIncrease() > 0) {
 					var gFIncrease = self._score.getPercentGFIncrease();
 					// output to screen...
 				}

 				//FadeInHelpBox.Begin();
                //StartButton.Content = Page_Resources.Reset__Button;
                //StartButton.Click -= StartButton_Click;
                //StartButton.Click -= PauseButton_Click;
                //StartButton.Click += Reset_Click;
                return;
 			}

 			// end the block
            // output results
            // AudioTargetsText.Text = String.Format("{0}/{1}", BlockCreator.default_Block_Size-_score.audioMistakes,BlockCreator.default_Block_Size);
            // VisualTargetsText.Text = String.Format("{0}/{1}", BlockCreator.default_Block_Size - _score.visualMistakes, BlockCreator.default_Block_Size);
 			var deltaN = self._score.endBlock();
 			if((deltaN + self._n) >= 2) {
 				self._n = self._n + deltaN;
 			}

 			// display the next trial level (N number) in the popup
 			//NumberBack.Text = _n.ToString();

 			//Position pop-ups
            //GeneralTransform gt = PopupTarget.TransformToVisual(Application.Current.RootVisual as UIElement);
            //Point offset = gt.Transform(new Point(0, 0));
            //EndBlockPopup.HorizontalOffset = offset.X;
            //EndBlockPopup.VerticalOffset = offset.Y;
            //EndBlockPopup.IsOpen = true;
            return;
 		}

 		// start a new trial
 		self._score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

 		self.Timer_1 = window.setTimeout(self.hideStimulus, _stimulus_time);
        self.TrialTimer = window.setTimeout(self.trialTimeUp, _total_trial_time);
 	}

 	this.startBlock = function() {
 		// start a new trial
 		self._score.startNewTrial(self.m_Trials[self._trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(self.m_Trials[self._trialNum]);

 		//Timer_1.Seek(new TimeSpan(0));
        window.clearTimeout(self.Timer_1);
 		//TrailTimer.Seek(new TimeSpan(0));
        window.clearTimeout(self.TrialTimer);
 		//Timer_1.Begin();
 		//TrialTimer.Begin();
        self.Timer_1 = window.setTimeout(self.hideStimulus, _stimulus_time);
        self.TrialTimer = window.setTimeout(self.trialTimeUp, _total_trial_time);
 	}

 	this.handleScores = function(totalCorrect, totalScore) {
 		//ScoreText.Text = totalScore.ToString();
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
    document.getElementById("score-text").textContent = totalScore.toString();
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