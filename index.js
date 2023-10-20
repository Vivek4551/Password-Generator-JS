const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]")
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    // to make slider visible to only thumb part
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min) + "% 100%");
    // first % is for width and second is for heght
}

// set Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
   return Math.floor(Math.random() * (max-min)) + min;
}

function genertaeRandomNumber(){
    return getRndInteger(0,9);
}

function genertaeLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function genertaeUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

// kisi  checkbox ko tick kr dete hai and check krna chahte hai ki wo tick hai ya nahi to hm .checked method ka use krte hai
    if(uppercaseCheck.checked){
        hasUpper = true;
    } 
    // written like that also
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower &&(hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ) {
        setIndicator("#ff0")
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
// ye method ek api hai jise through hm value clipboard ke upar value ko copy kr skte hai
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active"); 

   setTimeout(() => {
    copyMsg.classList.remove("active");
   },2000);

}

function shufflePassword(array) {
    // fisher Yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    // edge case ki agr 4 box checked hai to password length minimum 4 hoga
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event listeners for checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

// Event listener on slider button
inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event listener on copy password button
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click',() => {
    // none of the chechbox are selected
    if(checkCount <= 0) return ;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    } 

    // lets start the journey to find new password
    console.log("Starting new journey");

    // remove old password
    password = "";

    // let put the stuffmentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += genertaeUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += genertaeLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += genertaeRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(genertaeUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(genertaeLowerCase);
    if(numbersCheck.checked)
        funcArr.push(genertaeRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

     //remaining adddition
     for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    // like agr 4 box tick hao to starting ke 4 guess ho skta hai pajhle uppercase hoga and all so to prevent this we are shuffling the password.

    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
})




