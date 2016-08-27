"use strict";
var Git = require("nodegit");
var fs = require("fs");
var repoPath = require("path").join(__dirname, "tmp");
var green = "#84db00";
var repo, index, oid, remote;
function addAndCommit() {
    Git.Repository.open(repoPath)
        .then(function (repoResult) {
        repo = repoResult;
        return repo.refreshIndex();
    })
        .then(function (indexResult) {
        index = indexResult;
        var filesToStage = [];
        var filePanel = document.getElementById('files-changed');
        var fileElements = filePanel.childNodes;
        for (var i = 0; i < fileElements.length; i++) {
            var fileElementChildren = fileElements[i].childNodes;
            if (fileElementChildren[1].checked === true) {
                filesToStage.push(fileElementChildren[0].innerHTML);
            }
        }
        return index.addAll(filesToStage);
    })
        .then(function () {
        return index.write();
    })
        .then(function () {
        return index.writeTree();
    })
        .then(function (oidResult) {
        oid = oidResult;
        return Git.Reference.nameToId(repo, "HEAD");
    })
        .then(function (head) {
        return repo.getCommit(head);
    })
        .then(function (parent) {
        var author = Git.Signature.now("EdMinstrateur", "elliot.w@hotmail.com");
        var committer = Git.Signature.now("EdMinstrateur", "elliot.w@hotmail.com");
        var commitMessage = document.getElementById('commit-message-input').value;
        return repo.createCommit("HEAD", author, committer, commitMessage, oid, [parent]);
    })
        .then(function () {
        clearModifiedFilesList();
        clearCommitMessage();
    });
}
function clearModifiedFilesList() {
    var filePanel = document.getElementById('files-changed');
    while (filePanel.firstChild) {
        filePanel.removeChild(filePanel.firstChild);
    }
}
function clearCommitMessage() {
    document.getElementById('commit-message-input').value = "";
}
function getAllCommits(repoPath, callback) {
    Git.Repository.open(repoPath)
        .then(function (repo) {
        return repo.getMasterCommit();
    })
        .then(function (firstCommitOnMaster) {
        var history = firstCommitOnMaster.history(Git.Revwalk.SORT.Time);
        history.on("end", function (commits) {
            callback(commits);
        });
        history.start();
    });
}
function displayModifiedFiles(repoPath) {
    var modifiedFiles = [];
    Git.Repository.open(repoPath)
        .then(function (repo) {
        repo.getStatus().then(function (statuses) {
            statuses.forEach(addModifiedFile);
            if (modifiedFiles.length !== 0) {
                clearModifiedFilesList();
            }
            modifiedFiles.forEach(displayModifiedFile);
            function addModifiedFile(file) {
                var path = file.path();
                var modification = calculateModification(file);
                modifiedFiles.push({
                    filePath: path,
                    fileModification: modification
                });
            }
            function calculateModification(status) {
                if (status.isNew()) {
                    return "NEW";
                }
                else if (status.isModified()) {
                    return "MODIFIED";
                }
                else if (status.isDeleted()) {
                    return "DELETED";
                }
                else if (status.isTypechange()) {
                    return "TYPECHANGE";
                }
                else if (status.isRenamed()) {
                    return "RENAMED";
                }
                else if (status.isIgnored()) {
                    return "IGNORED";
                }
            }
            function displayModifiedFile(file) {
                var filePath = document.createElement("p");
                filePath.innerHTML = file.filePath;
                var fileElement = document.createElement("div");
                if (file.fileModification == "NEW") {
                    fileElement.className = "file file-created";
                }
                else if (file.fileModification == "MODIFIED") {
                    fileElement.className = "file file-modified";
                }
                else if (file.fileModification == "DELETED") {
                    fileElement.className = "file file-deleted";
                }
                else {
                    fileElement.className = "file";
                }
                fileElement.appendChild(filePath);
                document.getElementById('file-panel').appendChild(fileElement);
                fileElement.onclick = function () {
                    console.log("Printing diff for: " + file.filePath);
                    document.getElementById("diff-panel").innerHTML = "";
                    if (fileElement.className === "file file-created") {
                        printNewFile(file.filePath);
                    }
                    else {
                        printFileDiff(file.filePath);
                    }
                };
            }
            function printNewFile(filePath) {
                var fileLocation = "./tmp/" + filePath;
                console.log(fileLocation);
                var lineReader = require("readline").createInterface({
                    input: fs.createReadStream(fileLocation)
                });
                lineReader.on("line", function (line) {
                    formatNewFileLine(line);
                });
            }
            function printFileDiff(filePath) {
                repo.getHeadCommit().then(function (commit) {
                    getCurrentDiff(commit, filePath, function (line) {
                        formatLine(line);
                    });
                });
            }
            function getCurrentDiff(commit, filePath, callback) {
                commit.getTree().then(function (tree) {
                    Git.Diff.treeToWorkdir(repo, tree, null).then(function (diff) {
                        diff.patches().then(function (patches) {
                            patches.forEach(function (patch) {
                                patch.hunks().then(function (hunks) {
                                    hunks.forEach(function (hunk) {
                                        hunk.lines().then(function (lines) {
                                            var oldFilePath = patch.oldFile().path();
                                            var newFilePath = patch.newFile().path();
                                            if (newFilePath === filePath) {
                                                callback(hunk.header().trim());
                                                lines.forEach(function (line) {
                                                    callback(String.fromCharCode(line.origin()) + line.content().trim());
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            function formatLine(line) {
                var element = document.createElement("div");
                if (line.charAt(0) === "+") {
                    element.style.backgroundColor = green;
                }
                else if (line.charAt(0) === "-") {
                    element.style.backgroundColor = "red";
                }
                element.innerHTML = line;
                document.getElementById("diff-panel").appendChild(element);
            }
            function formatNewFileLine(text) {
                var element = document.createElement("div");
                element.style.backgroundColor = green;
                element.innerHTML = text;
                document.getElementById("diff-panel").appendChild(element);
            }
        });
    });
}