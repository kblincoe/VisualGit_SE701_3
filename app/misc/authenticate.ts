/// <reference path="git.ts" />

import * as nodegit from "git";
import NodeGit, { Status } from "nodegit";

let Git = require("nodegit");
let repo;

let github = require("octonode");
let username;
let password;
let aid, atoken;
let client;
let avaterImg;
let repoList = {};
let url;
var signed = 0;
var changes = 0;

//NOTE: for interaction with Issue #7, it must be made that variables are reset when user is sent back to the login page. (Such as signed,changes and CommitButNoPush)

//Called then user pushes to sign out even if they have commited changes but not pushed; prompts a confirmation modal
function CommitNoPush(){
	if (CommitButNoPush == 1){
		$("#modalW2").modal();
	}
}

function signInHead(callback) {
	username = document.getElementById("Email1").value;
	password = document.getElementById("Password1").value;
	console.log(username + '      ' + password);
	if (signed == 1){
		if ((changes == 1) || (CommitButNoPush == 1)){
			$("#modalW2").modal();
		}
		else {
			getUserInfo(callback);
		}
	}
	else{
	  getUserInfo(callback);
	}
}

function LogInAfterConfirm(callback){
	username = document.getElementById("Email1").value;
	password = document.getElementById("Password1").value;
	getUserInfo(callback);
}

function ModalSignIn(callback){
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
  ghme.info(function(err, data, head) {
    if (err) {
      displayModal(err);
    } else {
      avaterImg = Object.values(data)[2]
      // let doc = document.getElementById("avater");
      // doc.innerHTML = "";
      // var elem = document.createElement("img");
      // elem.width = 40;
      // elem.height = 40;
      // elem.src = avaterImg;
      // doc.appendChild(elem);
      // doc = document.getElementById("log");
      // doc.innerHTML = 'sign out';
      let doc = document.getElementById("avatar");
      doc.innerHTML = 'Sign out';
	  signed = 1;
	  //updateModalText("If you try to sign out with unsaved commits they will be lost!");
      callback();
    }
  });

  ghme.repos(function(err, data, head) {
    if (err) {
      return;
    } else {
      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        let rep = Object.values(data)[i];
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
  let butt = document.getElementById("cloneButton");
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
  let splitUrl = url.split("/");
  let local;
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
