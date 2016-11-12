var progressLink = document.getElementById("progress-link");

// Is local storage available?
// Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
	try {
		var storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

// adds a completed session to a user's history
// if local storage is available, and the save toggle is on
function addSessionToHistory(date, meanN) {
	if(storageAvailable('localStorage') && $("#save-toggle").prop('checked')) {
		localStorage.setItem(date, meanN);
	}
}

// gets all items in history and prints them to the appropriate element
function printHistory() {
	var tableOutput = document.getElementById("progress-score-table");

	// remove previous score rows, leaving the header row intact
	var scoreRows = document.getElementsByClassName("score-row");
	while(scoreRows.length > 0) {
		scoreRows[0].parentNode.removeChild(scoreRows[0]);
	}

	if(storageAvailable('localStorage')) {
		for(var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			var value = localStorage[key];
			var keyDate = new Date();
			keyDate.setTime(parseInt(key));
			var dateOptions = {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit"
			};

			var tableRow = document.createElement('tr');
			tableRow.setAttribute('class', 'score-row');
			var rowNum = document.createElement('td');
			var rowDate = document.createElement('td');
			var rowScore = document.createElement('td');

			var rowNumText = document.createTextNode(i + 1);
			var rowDateText = document.createTextNode(keyDate.toLocaleTimeString("en-GB", dateOptions));
			var rowScoreText = document.createTextNode(value);

			rowNum.appendChild(rowNumText);
			rowDate.appendChild(rowDateText);
			rowScore.appendChild(rowScoreText);

			tableRow.appendChild(rowNum);
			tableRow.appendChild(rowDate);
			tableRow.appendChild(rowScore);

			tableOutput.appendChild(tableRow);
		}
	} else {
		tableOutput.appendChild(document.createTextNode("Local storage isn't available in your browser so your scores cannot be saved"));
	}
}

// clears the history
function clearHistory() {
	localStorage.clear();
}

// show progress click event handler
progressLink.addEventListener('click', function(event) {
	printHistory();
	$('#progressModal').modal('show');
});