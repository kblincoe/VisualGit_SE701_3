var CryptoJS = require("crypto-js");
const os = require('os');
var jsonfile = require('jsonfile');
var fs = require('fs');
var file;
var decryptedPasswordPlain = "";
var decryptedUsernamePlain = "";

  function decrypt() {

    file = 'data.json';
    
    var objRead = jsonfile.readFileSync(file); //JSON Object containing credentials
        
    var encryptedUsername = objRead.username;
    var encryptedPassword = objRead.password;

      
    var decryptedUsernameBytes = CryptoJS.AES.decrypt(encryptedUsername.toString(), os.hostname());
    decryptedUsernamePlain = decryptedUsernameBytes.toString(CryptoJS.enc.Utf8);

    var decryptedPasswordBytes = CryptoJS.AES.decrypt(encryptedPassword.toString(), os.hostname());
    decryptedPasswordPlain = decryptedPasswordBytes.toString(CryptoJS.enc.Utf8);


  }

  function getUsername() {
    return decryptedUsernamePlain;
  }

  function getPassword() {
    return decryptedPasswordPlain;
  }