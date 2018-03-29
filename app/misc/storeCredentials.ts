var CryptoJS = require("crypto-js");
const os = require('os');
var jsonfile = require('jsonfile');
var fs = require('fs');



function encrypt(username, password) {

    //OS.hostname() is the key.
    //AES encryption
       
    var encryptedUsername = CryptoJS.AES.encrypt(username, os.hostname());
    var encryptedPassword = CryptoJS.AES.encrypt(password, os.hostname());


    writetoJSON(encryptedUsername, encryptedPassword);
    
}

function writetoJSON(encryptedUsername, encryptedPassword) {
      
   //console.log("encrypted username is: " + encryptedUsername);
   var file = 'data.json';
   var obj = {'username': encryptedUsername.toString(), 'password': encryptedPassword.toString()};
    
   jsonfile.writeFile(file, obj, function (err) {
     if (err) throw err;
     console.log('Saved!');
     
   })

}



