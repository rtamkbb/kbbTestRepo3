var RegEx = require('./regex.js');

var validateCommitMessage = function (mergeCommitMessage) {
    var commitMessageRegexPattern = new RegExp(RegEx.commitMessage());
    var match = commitMessageRegexPattern.test(mergeCommitMessage);
    var statusCode = 1;
    if (match) {
        statusCode = 0;
    }
    else {
        console.log('ERROR: Commit comment is not valid');
    }
    return statusCode;
}

module.exports = {
    validate: function (currentBranchName, mergeFromBranchName, mergeCommitMessage) {
		console.log('prepare-commit-msg js start');
        var statusCode = 1;
        if (validateCommitMessage(mergeCommitMessage) === 0) {
			statusCode = 0;
        }

        console.log('prepare-commit-msg js end: ' + statusCode);
        return statusCode;
    }
};
