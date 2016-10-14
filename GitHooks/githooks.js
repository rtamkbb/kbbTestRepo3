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

           if(process.argv[3] === 'merge'){
                console.error(`ERROR: You are not allowed to merge to ${currentBranchName}.   Merge from Github using a pull request`);
            }else{
                console.error(`ERROR: You cannot commit directly to the ${currentBranchName} branch`);
            }
           return 1;
       }
       return 0;
    }

}


//should handel merge conflict ??
//
module.exports = {
    validateCommit: function () {
        let statusCode = 1;

        if ( validateBranch() === 0 &&validateCommitMsg() === 0 ) {
            statusCode = 0;
        }
        process.exit(statusCode);
    }
};
