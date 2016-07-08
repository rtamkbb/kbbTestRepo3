var RegEx = require('./regex.js');

var validateText = function (msg) {
    var commitMessageRegexPattern = new RegExp(RegEx.commitMessage());
    var match = commitMessageRegexPattern.test(msg);
    var statusCode = 1;
    if (match) {
        statusCode = 0;
    }
    else {
        console.log('ERROR: Commit comment is not valid');
    }
    return statusCode;
}

var validateBranch = function (branchName) {
    var blockedBranches = ['master', 'staging', 'develop'];
    if(blockedBranches.indexOf(branchName) > -1) {
		console.log('ERROR: Should not be committing to: master, staging, or develop');
		return 1;
	}
	else {
		return 0;
	}
}

module.exports = {
    validate: function (commitMsg, branchName) {
        var statusCode = 1;
        console.log('commit-msg js start');
        if (validateText(commitMsg) === 0 && validateBranch(branchName) === 0) {
            statusCode = 0;
        }
        console.log('commit-msg js end: ' + statusCode);
        return statusCode;
    }
};