// [] => use for accessing custom attribute
const inputSlider = document.querySelector("[data-lengthChange"); 
const Displaylength = document.querySelector("[lengthNumber]");
const passwordDisplay = document.querySelector("[passwordDisplay]");
const copyBtn = document.querySelector("[datacopied]");
const copyMsg = document.querySelector("[copiedMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[indicator]");
const generatePwd = document.querySelector("[generate-pwd]");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$(%^&*])_-+={[|:;"<,>}.?/';

// starting values
let password = "";
let passwordLength = 10;
let checkCount = 0;
// set indicator color white at start
setIndicator("#ccc")

// handling slider and length
handle();
function handle(){
    inputSlider.value = passwordLength;
    Displaylength.innerText = passwordLength;
}

// strength calculation
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

// generating random number in the range of [min, max]
function getRandomInteger(min , max){
   return Math.floor(Math.random() * (max - min)) + min;
}

//generating number in the range of [0,9]
function getNumber(){
    return getRandomInteger(0,10);
}

// generating lowercase letter in the range of [a,z]
function getLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));  //converting into equivalent ascii code
}

// generating uppercase letter in the range of [A,Z]
function getUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

// generating symbol letter
function getSymbol(){
    const ranNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(ranNum);
}

function calStrength(){
    let beUpper = false;
    let beLower = false;
    let beNum = false;
    let beSym = false;

    if(uppercaseCheck.checked) beUpper = true;
    if(lowercaseCheck.checked) beLower = true;
    if(numbersCheck.checked) beNum = true;
    if(symbolsCheck.checked) beSym = true;

    if(beUpper && beLower && (beNum || beSym) && passwordLength > 7) setIndicator("#0f0");
    else if ((beUpper || beLower) && (beNum || beSym) && passwordLength >5) setIndicator("#ff0");
    else setIndicator("#f00");
}

function shufflePassword(array){
    // for shuffling => Fisher Yates Method => it is applied on array
    for(let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((all) => (str += all));
    return str;
}

// copycontent pop up
// it is a asyn operation
async function copyContent(){
    // asyn function return promise which either resolve or reject
    // await is used after copying in clipboard we display copied on screen
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e){
        copyMsg.innerText = "failed";
    }
    // to make visible copied message
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// handling the number of checkcount
function handlecheckcount(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked) checkCount++;
    })
    // special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handle();
    }
}

// travesing all checkbox ani updating the checkCount
allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handlecheckcount);
})

// Eventlistener on slider
inputSlider.addEventListener('input', (val) => {
    passwordLength = val.target.value;
    handle();
})

// Eventlistener on copybutton
copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value) copyContent();
})

// Eventlistener on Generate Password
generatePwd.addEventListener('click', ()=>{
    // none of the checkout are selected

    
    if(checkCount == 0){
        return;
    }
   
    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount; //update
        handle();  // update and show in UI
    }

    // lets now generate random password
    // while generating new password removing old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += getUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += getLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += getNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += getSymbol();
    // }

    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(getUpperCase);
    }

    if(lowercaseCheck.checked){
        funArr.push(getLowerCase);
    }

    if(numbersCheck.checked){
        funArr.push(getNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(getSymbol);
    }

    // compulsory addition
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }


    // remaining addition
    for(let i=0; i<passwordLength - funArr.length; i++){
        let ranIndex = getRandomInteger(0,funArr.length);
        password += funArr[ranIndex]();
    }


    // shuffle the password
    password =shufflePassword(Array.from(password));   //calling shuffle function by passing password in array form
    
    // now displaying the password in input field
    passwordDisplay.value = password;

    // now telling the strength of the password
    calStrength();
})