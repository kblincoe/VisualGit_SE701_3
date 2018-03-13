var github = require("octonode");
var username;
var password;
var aid, atoken;
var client;
var avaterImg;
var repoList = {};
var url;
function signInHead(callback) {
    username = document.getElementById("Email1").value;
    password = document.getElementById("Password1").value;
    console.log(username + '      ' + password);
    getUserInfo(callback);
}
function signInPage(callback) {
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    getUserInfo(callback);
}
function getUserInfo(callback) {
    cred = Git.Cred.userpassPlaintextNew(username, password);
    client = github.client({
        username: username,
        password: password
    });
    var ghme = client.me();
    ghme.info(function (err, data, head) {
        if (err) {
            displayModal(err);
        }
        else {
            avaterImg = Object.values(data)[2];
            // let doc = document.getElementById("avater");
            // doc.innerHTML = "";
            // var elem = document.createElement("img");
            // elem.width = 40;
            // elem.height = 40;
            // elem.src = avaterImg;
            // doc.appendChild(elem);
            // doc = document.getElementById("log");
            // doc.innerHTML = 'sign out';
            var docGitUser = document.getElementById("githubname");
            docGitUser.innerHTML = Object.values(data)[0];
            var doc = document.getElementById("avatar");
            doc.innerHTML = 'Sign out';
            callback();
        }
    });
    ghme.repos(function (err, data, head) {
        if (err) {
            return;
        }
        else {
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                var rep = Object.values(data)[i];
                console.log(rep['html_url']);
                displayBranch(rep['name'], "repo-dropdown", "selectRepo(this)");
                repoList[rep['name']] = rep['html_url'];
            }
        }
    });
    // let scopes = {
    //   'add_scopes': ['user', 'repo', 'gist'],
    //   'note': 'admin script'
    // };
    //
    // github.auth.config({
    //   username: username,
    //   password: password
    // }).login(scopes, function (err, id, token) {
    //   if (err !== null) {
    //     console.log("login fail -- " + err);
    //   }
    //   aid = id;
    //   atoken = token;
    //   console.log(id, token);
    // });
}
function selectRepo(ele) {
    url = repoList[ele.innerHTML];
    var butt = document.getElementById("cloneButton");
    butt.innerHTML = 'Clone ' + ele.innerHTML;
    butt.setAttribute('class', 'btn btn-primary');
    console.log(url + 'JJJJJJJJ' + ele.innerHTML);
}
function cloneRepo() {
    if (url === null) {
        updateModalText("Web URL for repo could not be found. Try cloning by providing the repo's web URL directly in the 'Add repository' window");
        return;
    }
    console.log("cloneRepo().url = " + url);
    var splitUrl = url.split("/");
    var local;
    if (splitUrl.length >= 2) {
        local = splitUrl[splitUrl.length - 1];
    }
    console.log("cloneRepo().local = " + local);
    if (local == null) {
        updateModalText("Error: could not define name of repo");
        return;
    }
    downloadFunc(url, local);
    url = null;
    $('#repo-modal').modal('hide');
}
