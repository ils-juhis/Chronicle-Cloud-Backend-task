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
        sendEmail(document.forms[formName]["email"].value)
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

const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: getIp,
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
   });

