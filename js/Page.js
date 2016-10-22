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

    // StartButton_Click() {
    //     //change the start button into a pause button.
    //     StartButton.Click -= StartButton_Click;
    //     StartButton.Content = "Pause";
    //     StartButton.Click += PauseButton_Click;

    //     //Start our timer which calls back to start the application.
    //     InitialWait.Begin();
    //}
    startButton.addEventListener('click', function(event) {
        // check for start/pause via changing the text value of the button itself
        if(event.target.value == "Start") {
            event.target.value = "Pause";
            event.target.textContent = "Pause";
            // original timer = 675 * 10000 (675ms)
            // in setTimeout() the delay is in milliseconds
            // 'this' in an event handler is the object that fired the event
            window.setTimeout(self.Start_Training, 675);
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

    // UserControl_KeyDown() {
    	//_score.recordButtonPress(key_press_value)
    //}

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

    // callback for when the timer expires for the stimulus, hide the stimulus
    //this.hideStimulus() {
    	//FadeBoxOut.Begin();
    //}



 	// FUNCTIONS
 	this.Start_Training = function() {
        alert("Started Training!");

        var blockCreator = new BlockCreator();

 		_playingGame = true;

 		//Set the stimulus fade-out timer
        //this.Timer_1.Duration = new Duration(new TimeSpan(_stimulus_time * 10000));
        //this.Timer_1.Completed += new EventHandler(hideStimulus);

        ////Set the trial time-out timer
        //TrialTimer.Duration = new Duration(new TimeSpan(_total_trial_time * 10000));
        //TrialTimer.Completed += new EventHandler(trialTimeUp);

        _score = new Score();
        //_score.HandleTrialOutcome += handleTrialResult;
        //_score.HandleScores += handleScores;

        // we're starting, get the list of trials and clear the extra stuff
        _n = self._starting_N;
        _blockNum = 0;
        _trialNum = 0;
        //m_Trials = BlockCreator.createBlock(_n);
        m_Trials = blockCreator.createBlock(_n);
        _score.startBlock(_n);

        // present the first trial to the user
        self.presentTrialInfoToUser(m_Trials[_trialNum]);
        _score.startNewTrial(m_Trials[_trialNum].GetSecondTrialInTarget);

        // start the timers for the first trial
        //this.Timer_1.Begin();
        //TrialTimer.Begin();
 	}

 	// called via an event to say if there was a trial success or failure
 	this.handleTrialResult = function(result) {
 		if(result == TrialResult.Visual_Success) {
 			Left_Success.Begin();
 		} else if(result == TrialResult.Visual_Failure) {
 			Left_Failure.Begin();
 		}
 		if(result == TrialResult.Audio_Success) {
 			Right_Success.Begin();
 		} else if(result == TrialResult.Audio_Failure) {
 			Right_Failure.Begin();
 		}
 	}

 	// called whenever the total time for an individual trial has expired
 	this.trialTimeUp = function() {
 		_score.endTrial();
 		_trialNum++;

 		var progress = _trialNum / m_Trials.length;
 		//ProgBar.setProgress(progress * 100);

 		// are we at the end of a block?
 		if(_trialNum >= m_Trials.length) {
 			// are we at the end of an entire session (20 blocks)?
 			if(_blockNum == (BlockCreator.num_Blocks_Total - 1)) {
 				// what was the average n level?
 				var averageN = _score.getMeanN();
 				// output to screen....

 				if(_score.getPercentGFIncrease() > 0) {
 					var gFIncrease = _score.getPercentGFIncrease();
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
 			// output audio targets text...
 			// output visual targets text...
 			var deltaN = _score.endBlock();
 			if((deltaN + _n) >= 2) {
 				_n = _n + deltaN;
 			}

 			// display the dialog
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
 		_score.startNewTrial(m_Trials[_trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(m_Trials[_trialNum]);

 		//Timer_1.Begin();
 		//TrialTimer.Begin();
 	}

 	this.startBlock = function() {
 		// start a new trial
 		_score.startNewTrial(m_Trials[_trialNum].GetSecondTrialInTarget());
 		self.presentTrialInfoToUser(m_Trials[_trialNum]);

 		//Timer_1.Seek(new TimeSpan(0));
 		//TrailTimer.Seek(new TimeSpan(0));
 		//Timer_1.Begin();
 		//TrialTimer.Begin();
 	}

 	this.handleScores = function(totalCorrect, totalScore) {
 		//ScoreText.Text = totalScore.ToString();
 	}

 	// display trial information (square, audio, etc.) to the user
 	this.presentTrialInfoToUser = function(t) {
 		switch(t.GetLetter()) {
 			case Consonant.Letter1:
 				// play audio...
 				break;

			case Consonant.Letter2:
 				// play audio...
 				break;

			case Consonant.Letter3:
 				// play audio...
 				break;

			case Consonant.Letter4:
 				// play audio...
 				break;

			case Consonant.Letter5:
 				// play audio...
 				break;

			case Consonant.Letter6:
 				// play audio...
 				break;

			case Consonant.Letter7:
 				// play audio...
 				break;

			case Consonant.Letter8:
 				// play audio...
 				break;

			default:
 				break;
 		}

 		// display the visual information
 		var iColumn = 0;
 		var iRow = 0;
 		switch(t.GetPosition()) {
 			case SquarePosition.BottomLeft:
 				iColumn = 0;
 				iRow = 2;
 				break;

			case SquarePosition.BottomMiddle:
 				iColumn = 1;
 				iRow = 2;
 				break;

			case SquarePosition.BottomRight:
 				iColumn = 2;
 				iRow = 2;
 				break;

			case SquarePosition.MiddleLeft:
 				iColumn = 0;
 				iRow = 1;
 				break;

			case SquarePosition.MiddleRight:
 				iColumn = 2;
 				iRow = 1;
 				break;

			case SquarePosition.TopLeft:
 				iColumn = 0;
 				iRow = 0;
 				break;

			case SquarePosition.TopMiddle:
 				iColumn = 1;
 				iRow = 0;
 				break;

			case SquarePosition.TopRight:
 				iColumn = 2;
 				iRow = 0;
 				break;

			default:
 				break;
 		}

 		// highlight appropriate grid square...
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