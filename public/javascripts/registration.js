const password = document.getElementsByName("password");
const repeat_password = document.getElementsByName("repeat_password");

function comparePasswords(){
    if(password !== repeat_password)
        throw ("Password is incorrect!");
}

function validatePassword(password) {
    if(password.length < 8){
        throw ("Password is to short!")
    }
}