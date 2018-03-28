var CryptoJS = require("crypto-js");
var os = require('os');
var jsonfile = require('jsonfile');
var fs = require('fs');
function encrypt(username, password) {
    var encryptedUsername = CryptoJS.AES.encrypt(username, os.hostname());
    var encryptedPassword = CryptoJS.AES.encrypt(password, os.hostname());
    writetoJSON(encryptedUsername, encryptedPassword);
}
function writetoJSON(encryptedUsername, encryptedPassword) {
    var file = 'data.json';
    var obj = { 'username': encryptedUsername.toString(), 'password': encryptedPassword.toString() };
    jsonfile.writeFile(file, obj, function (err) {
        if (err)
            throw err;
        console.log('Saved!');
    });
}
