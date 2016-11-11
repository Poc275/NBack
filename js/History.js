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
function addSessionToHistory(date, meanN) {
	localStorage.setItem(date, meanN);
}

// clears the history
function clearHistory() {
	localStorage.clear();
}