var RegEx = require('./regex.js');
var request = require('sync-request');
var checkLabelApiUrl = 'http://engineering.kbb.com/AutomanifestGit/api/toMergeGitHubBranch?branchToCheck={0}&labels={1}';

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

var validatePullRequestLabels = function(currentBranchName, mergeFromBranchName) {
	var statusCode = 1;
	// allow merges going from master->staging and staging->develop without a code review
	if(currentBranchName === 'staging' && mergeFromBranchName === 'master') {
		statusCode = 0;
	}
	else if(currentBranchName === 'develop' && mergeFromBranchName === 'staging') {
		statusCode = 0;
	}
	// allow merges going into feature branches
	else if(currentBranchName !== 'develop' && currentBranchName != 'staging' && currentBranchName != 'master') {
		statusCode = 0;
	}
	else {
		console.log('check for the backend approved label and frontend approved label');
		// check for the 'backend approved' label and 'frontend approved' label
		var backendApproved = checkLabel(mergeFromBranchName, 'backend approved');
		var frontendApproved = checkLabel(mergeFromBranchName, 'frontend approved');

		if(!backendApproved) {
			console.log('ERROR: Missing "backend approved" label');
		}

		if(!frontendApproved) {
			console.log('ERROR: Missing "frontend approved" label');
		}

		if(backendApproved && frontendApproved) {
			statusCode = 0;
		}

		// check for 'protected files' label
	}

	return statusCode;
}

// API call to check the label exists on the pull request
var checkLabel = function(mergeFromBranchName, label) {
	var url = checkLabelApiUrl;
	url = url.replace('{0}', mergeFromBranchName);
	url = url.replace('{1}', label);

	var res;
	try {
		res = request('GET', url);
		if(res) {
			var data = JSON.parse(res.getBody('utf8'));
			if(data) {
				if(data.Successful) {
					return true;
				}
				else {
					console.log('ERROR: ' + data.Information);
				}
			}
		}
	}
	catch(err) {
		console.log(err);
	}
	return false;
}


module.exports = {
    validate: function (currentBranchName, mergeFromBranchName, mergeCommitMessage) {
		console.log('prepare-commit-msg js start');
        var statusCode = 1;
        if (validateCommitMessage(mergeCommitMessage) === 0 && validatePullRequestLabels(currentBranchName, mergeFromBranchName) === 0) {
			statusCode = 0;
        }

        console.log('prepare-commit-msg js end: ' + statusCode);
        return statusCode;
    }
};