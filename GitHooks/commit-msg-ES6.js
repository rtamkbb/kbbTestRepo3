'use strict';



var validateCommitMsg = function (msg) {

    const commitMessageReg = '(Story: S-|BugId: |Epic: E-)[0-9]* \| .*$';
    const fs = require('fs');
    const file = process.argv[2]; // commit message is stored in a file, usually ".git/COMMIT_EDITMSG";

    if(!file){
        console.error('ERROR: No commit message file found');
        return 1;
    }else{
        let commitMsg = fs.readFileSync(file, { encoding: 'utf8' });

        if (!RegExp(commitMessageReg).test(commitMsg)) {
             console.error(`ERROR: Your commit message must follow this naming convention:
                            Story: S-XXXXX | desc ,
                            BugId: XXXXX | desc ,
                            Epic: E-XXXXX | desc
                            `);
            return 1;
        }
        return 0;
    }
}

var validateBranch = function () {

    const protectedBranches =  ['master', 'staging', 'develop'];
    const  childProcess = require('child_process');
    const  spawn = childProcess.spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    let error = spawn.stderr.toString().trim();
    let currentBranchName = '';

    if(error){
        console.error('ERROR: Failed to get branch name');
        return 1;
    } else{

        currentBranchName = spawn.stdout.toString().trim();

        if (protectedBranches.join('').indexOf(currentBranchName) >= 0) {
           console.error(`ERROR: You cannot commit directly to the ${branchName} branch`);
           return 1;
       }
       return 0;
    }

}

var validateMergeToBranch = function () {

    const protectedBranches =  ['master', 'staging', 'develop'];
    const  childProcess = require('child_process');
    const  spawn = childProcess.spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    let error = spawn.stderr.toString().trim();
    let currentBranchName = '';
    let mergeFromBranchName = '';

    // get the source branch name
    // I could only find out how to get the source head from the environment variables.  It's stored in the GITHEAD_<sha> variable
    // Usually it can be found in the .git/MERGE_HEAD file, but that file is not availalble at this point.
    for(var prop in process.env) {
        if(prop.startsWith('GITHEAD_')) {
            mergeFromBranchName = process.env[prop];
            break;
        }
    }

    if(error){
        console.error('ERROR: Failed to get branch name');
        return 1;
    } else{

        currentBranchName = branchName.trim();

        if (protectedBranches.join('').indexOf(branchName) >= 0) {
           console.error(`ERROR: You cannot commit directly to the ${branchName} branch`);
           return 1;

       } elseP
       return 0;
    }

}

//should handel merge conflict ??
//
module.exports = {
    validateCommit: function () {
        let statusCode = 1;

        if (validateCommitMsg() === 0 && validateBranch() === 0) {
            statusCode = 0;
        }
        process.exit(statusCode);
    },
    validatePrepareCommit: function(){
        let statusCode = 1;

        if (validateCommitMsg() === 0 && validateMergeToBranch() === 0) {
            statusCode = 0;
        }
        process.exit(statusCode);
    }
};
