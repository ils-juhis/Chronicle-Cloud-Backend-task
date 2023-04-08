let toggleEye = (e)=>{
    let passwordEye = e.currentTarget;
    let passwordInput = e.currentTarget.previousElementSibling.firstElementChild ;
    if(passwordInput.type=="text"){
        passwordEye.innerHTML = `<i class="fa-solid fa-eye"></i> `
        passwordInput.type = "password";
    } else{
        passwordEye.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
        passwordInput.type = "text";
    }
    
}

let validateName= (event)=>{
    let name;
    if(event.currentTarget===undefined)
        name=event.value;
    else
        name=event.currentTarget.value;

    let messageEmail = document.getElementById("invalid-name")

    if(name===""){
        messageEmail.innerHTML= "*Please enter valid name.";
        return false;
    }else{
        messageEmail.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let validateEmail= (event)=>{
    let email;
    if(event.currentTarget===undefined)
        email=event.value;
    else
        email=event.currentTarget.value;

    let messageEmail = document.getElementById("invalid-email")
    let emailBox = document.getElementById("input-email").parentElement.parentElement
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let result = regex.test(email);
    if(!result){
        messageEmail.innerHTML= "*Please enter valid email address";
        emailBox.setAttribute("error", "true");
        return false;
    }else{
        messageEmail.innerHTML= `<span>&nbsp;</span>`
        emailBox.setAttribute("error", "false");

        return true;
    }
}

let validatePassword =(event)=>{
    let password;
    let passwordBox = document.getElementById("input-password").parentElement.parentElement

    if(event.currentTarget===undefined)
        password=event.value;
    else
        password=event.currentTarget.value;

    let messagePass = document.getElementById("invalid-password")

    if(password === ""){
        messagePass.innerHTML= "*Please enter valid password.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else if(! /[a-z]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 lower character.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else if(! /[A-Z]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 upper character.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else if(! /[0-9]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 digit.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else if(! /[!@#$%^&*]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 special character.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else if(password.length<8){
        messagePass.innerHTML= "*Password should be minimum of 8 charaters.";
        passwordBox.setAttribute("error", "true");
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        passwordBox.setAttribute("error", "false");
        return true;
    }
}

//remember me functionality
let  setCookie = ()=>{
    let  email= document.getElementById("input-email").value
    let password = document.getElementById("input-password").value
    let checked = document.getElementById("rememberCheck").checked

    if(checked === true){
        document.cookie = "email="+email+";path=http://127.0.0.1:5501/"
        document.cookie = "password="+password+";path=http://127.0.0.1:5501/"
        document.cookie = "checked="+checked+";path=http://127.0.0.1:5501/"
    }else{
        console.log("run")
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=http://127.0.0.1:5501/;";
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=http://127.0.0.1:5501/;";
        document.cookie = "checked=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=http://127.0.0.1:5501/;";
    }

}

let comparePassword = (event)=>{
    let cpassword;
    if(event.currentTarget===undefined)
        cpassword=event.value;
    else
        cpassword=event.currentTarget.value;

    let password = document.getElementById("input-password").value
    let messagePass = document.getElementById("invalid-cpassword")
    if(password !== cpassword){
        messagePass.innerHTML= "*Password doesn't match.";
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let validatePhoneNumber = (event)=>{
    let number;
    if(event.currentTarget===undefined)
        number=event.value;
    else
        number=event.currentTarget.value;
    let messagePass = document.getElementById("invalid-phone")
    if(number.length !== 10){
        messagePass.innerHTML= "*Number must be of 10 digits.";
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let validateForEmptyBox=(event, fieldName, fieldErrorId)=>{
    let fieldValue, element;

    if(event.currentTarget===undefined){
        fieldValue=event.value;
        element=event;
    }
    else{
        fieldValue=event.currentTarget.value;
        element.currentTarget
    }

    let outerBox = element.parentElement.parentElement

    let messagePass = document.getElementById(fieldErrorId)
    if(fieldValue === ""){
        messagePass.innerHTML= `*Please enter ${fieldName}`;
        outerBox.setAttribute("error", "true");
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`;
        outerBox.setAttribute("error", "false");
        return true;
    }
}

//validate login and forgot password form
let validateForm=(event, formName)=>{
    event.preventDefault();
    console.log(document.forms[formName].elements)
    let formFields = {
        "login-form": ["email", "password"],
        "forgot-email-form": ["email"],
    }

    fields=formFields[formName];
    let fieldname, result=true, r;
    for (let i = 0; i < fields.length; i++) {
        fieldname = fields[i];
        switch(fieldname){
            case "email": result = result && validateEmail(document.forms[formName]["email"]);
            break;
            case "password": r = validatePassword(document.forms[formName]["password"]); result = result && r;
            break;
        }
    }
    if((formName === "login-form") && result){
        document.forms[formName].submit();
        window.location.href='dashboard.html';
    }else if(formName === "forgot-email-form" && result){
        sendEmail(document.forms[formName]["email"].value)
    }
    return result;
}

let checkTermsConditions=(event, errorId)=>{
    let checked;
    if(event.currentTarget===undefined)
        checked=event.checked;
    else
        checked=event.currentTarget.checked;

        console.log(checked)
    if(!checked){
        document.getElementById(errorId).innerHTML= `*Please accept all Terms and Conditions.`;
        return false;
    }else{
        document.getElementById(errorId).innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

//validate login and forgot password form
let validateRegisterForm=(event, currentTab, lastStep)=>{
    event.preventDefault();
    let formFields = [[{fieldName: "email", fieldId: "input-email", errorId:"invalid-email"},
    {fieldName: "password", fieldId: "input-password", errorId:"invalid-password"},
    {fieldName: "first name", fieldId: "input-fname", errorId:"invalid-fname"},
    {fieldName: "last name", fieldId: "input-lname", errorId:"invalid-lname"},
    {fieldName: "mobile number", fieldId: "input-phone", errorId:"invalid-phone"},
    {fieldName: "confirm Password", fieldId: "confirm-password", errorId:"invalid-cpassword"}], 

    [{fieldName: "school name", fieldId: "input-schoolName", errorId:"invalid-school"},
    {fieldName: "state", fieldId: "input-state", errorId:"invalid-state"},
    {fieldName: "country", fieldId: "input-country", errorId:"invalid-country"},
    {fieldName: "zip code", fieldId: "input-zipCode", errorId:"invalid-zipCode"},
    {fieldName: "terms and conditions", fieldId:"condition-check", errorId: "uncheck-terms"}]]

    tabData=formFields[currentTab];
    let result=true, r;
    let form = document.forms["register-form"];
    for (let i = 0; i < tabData.length; i++) {
        fieldData = tabData[i]
        switch(fieldData.fieldName){
            case "email": result = result && validateEmail(form["email"]); console.log( validateEmail(form["email"]))
            break;
            case "password": r = validatePassword(form["password"]); result = result && r;
            break;
            case "confirm password": r = comparePassword(form["confirmPassword"]); result = result && r;
            break;
            case "first name": r = validateForEmptyBox(form["fname"], "first name", "invalid-fname"); result = result && r;
            break;
            case "last name": r = validateForEmptyBox(form["lname"], "last name", "invalid-lname"); result = result && r;
            break;
            case "mobile number": r = validatePhoneNumber(form["phoneNo"]); result = result && r;
            break;
            case "terms and conditions":  r = checkTermsConditions(document.getElementById(fieldData.fieldId), fieldData.errorId); result = result && r;
            break;
            default: r = validateForEmptyBox(document.getElementById(fieldData.fieldId), fieldData.fieldName, fieldData.errorId); result = result && r;
        }
    }

    if((lastStep) && result && document.getElementById("condition-check").checked){
        form.submit();
        window.location.href='dashboard.html';
    }
    return result;
}




let getCookie = (cname)=> {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

let getCookieData = () =>{
    let email = getCookie("email");
    let password = getCookie("password")
    let checked = getCookie("checked");
    document.getElementById("input-email").value = email;
    document.getElementById("input-password").value = password;
    document.getElementById("rememberCheck").checked = checked

}

let sendEmail = (email)=> {
    console.log(email)
    Email.send({
        Host: "smtp.gmail.com",
        Username: "Juhi Sahu",
        Password: "28/Sep/2001",
        To: email,
        From: "unknown.user100209@gmail.com",
        Subject: "OTP for forgot password",
        Body: "Your OTP is 12345",
        })
        .then(function (message) {
            // alert("mail sent successfully")
            console.log(message)
        });
  }

var currentTab = 0; 
let showTab = (n) => {
  let x = document.getElementsByClassName("tab");
  x[n].style.display = "block";

  fixStepIndicator(n)
}

let nextPrev = (e, n) => {
    let x = document.getElementsByClassName("tab");
    if (n>=0 && !validateRegisterForm(e, currentTab, x.length-1===currentTab)) 
        return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;
    showTab(currentTab);
  }

function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("tab-indicator");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    x[n].className += " active";
  }

showTab(currentTab); // Display the current tab


function onlyNumberKey(e) {              
    // Only ASCII character in that range allowed
    var ASCIICode = (e.which) ? e.which : e.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

//phone number input
function getIp(callback) {
    fetch('https://ipinfo.io/json?token=6978337c394849', { headers: { 'Accept': 'application/json' }})
      .then((resp) => resp.json())
      .catch(() => {
        return {
          country: 'us',
        };
      })
      .then((resp) => callback(resp.country));
   }

const phoneInputField = document.querySelector("#input-phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: getIp,
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });

