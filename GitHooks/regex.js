var commitMessageRegexPattern = '(Story: S-|BugId: |Epic: E-)[0-9]* \| .*$';

module.exports = {
    commitMessage: function () {
		return commitMessageRegexPattern;
    }
};