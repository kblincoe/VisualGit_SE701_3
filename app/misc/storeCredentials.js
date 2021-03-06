var CryptoJS = require("crypto-js");
var os = require('os');
var jsonfile = require('jsonfile');
var fs = require('fs');
var encryptedPassword;
var encryptedUsername;
function encrypt(username, password) {
    encryptedUsername = CryptoJS.AES.encrypt(username, os.hostname());
    encryptedPassword = CryptoJS.AES.encrypt(password, os.hostname());
    writetoJSON(encryptedUsername, encryptedPassword);
}
function encryptTemp(username, password) {
    encryptedUsername = CryptoJS.AES.encrypt(username, os.hostname());
    encryptedPassword = CryptoJS.AES.encrypt(password, os.hostname());
}
function getUsernameTemp() {
    var decryptedUsernameBytes = CryptoJS.AES.decrypt(encryptedUsername.toString(), os.hostname());
    return decryptedUsernameBytes.toString(CryptoJS.enc.Utf8);
    ;
}
function getPasswordTemp() {
    var decryptedPasswordBytes = CryptoJS.AES.decrypt(encryptedPassword.toString(), os.hostname());
    return decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);
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
