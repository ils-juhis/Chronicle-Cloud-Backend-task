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

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let result = regex.test(email);
    if(!result){
        messageEmail.innerHTML= "*Please enter valid email address";
        return false;
    }else{
        messageEmail.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let validatePassword =(event)=>{
    let password;
    if(event.currentTarget===undefined)
        password=event.value;
    else
        password=event.currentTarget.value;

    let messagePass = document.getElementById("invalid-password")

    if(password === ""){
        messagePass.innerHTML= "*Please enter valid password.";
        return false;
    }else if(! /[a-z]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 lower character.";
        return false;
    }else if(! /[A-Z]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 upper character.";
        return false;
    }else if(! /[0-9]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 digit.";
        return false;
    }else if(! /[!@#$%^&*]/.test(password)){
        messagePass.innerHTML= "*Password should contain altleast 1 special character.";
        return false;
    }else if(password.length<8){
        messagePass.innerHTML= "*Password should be minimum of 8 charaters.";
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        return true;
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

//validate login and forgot password form
let validateForm=(event, formName, lastStep)=>{
    event.preventDefault();
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
        document.forms[formName].submit();
    }
    return result;
}
//validate login and forgot password form
let validateRegisterForm=(event, currentTab, lastStep)=>{
    event.preventDefault();
    let formFields = [["email", "password", "confirmPassword", "fname", "lname", "phoneNo"], 
    ["schoolName", "state", "country", "zipCode"]]

    fields=formFields[currentTab];
    let fieldname, result=true, r;
    for (let i = 0; i < fields.length; i++) {
        fieldname = fields[i];
        switch(fieldname){
            case "email": result = result && validateEmail(document.forms["register-form"]["email"]);
            break;
            case "password": r = validatePassword(document.forms["register-form"]["password"]); result = result && r;
            break;
            case "confirmPassword": r = comparePassword(document.forms["register-form"]["confirmPassword"]); result = result && r;
            break;
            case "fname" ||"lname": r = validateName(document.forms["register-form"]["fname"]); result = result && r;
                r = validateName(document.forms["register-form"]["lname"]); result = result && r;
            break;
            case "phoneNo": if(document.forms["register-form"]["phoneNo"].value === "")
                            {
                                document.getElementById("invalid-phone").innerHTML = "*Please enter valid mobile number."
                                r=false;
                            }else{
                                document.getElementById("invalid-phone").innerHTML = `<span>&nbsp;</span>`
                                r=true;
                            }
                            result = result && r;
                            break;
            default: if(document.forms["register-form"][fieldname].value === "")
                    {
                        document.getElementById("invalid-fields").innerHTML = "*Please fill all fields."
                        r=false;
                    }else{
                        document.getElementById("invalid-fields").innerHTML = `<span>&nbsp;</span>`
                        r=true;
                    }
                    result = result && r;
        }
    }

    if((lastStep) && result && document.getElementById("condition-check").checked){
        document.forms["register-form"].submit();
        window.location.href='dashboard.html';
    }
    return result;
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

const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: getIp,
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });
