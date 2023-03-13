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


let validateEmail= (event)=>{
    let messageEmail = document.getElementById("invalid-email")
    console.log(event.currentTarget.value)

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let result = regex.test(event.currentTarget.value);
    if(!result){
        messageEmail.innerHTML= "*Please enter valid email address";
        return false;
    }else{
        messageEmail.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let validatePassword =(event)=>{
    let messagePass = document.getElementById("invalid-password")

    if(! /[a-z]/.test(event.currentTarget.value)){
        messagePass.innerHTML= "*Password should contain altleast 1 lower character.";
        return false;
    }if(! /[A-Z]/.test(event.currentTarget.value)){
        messagePass.innerHTML= "*Password should contain altleast 1 upper character.";
        return false;
    }if(! /[0-9]/.test(event.currentTarget.value)){
        messagePass.innerHTML= "*Password should contain altleast 1 digit.";
        return false;
    }if(! /[!@#$%^&*]/.test(event.currentTarget.value)){
        messagePass.innerHTML= "*Password should contain altleast 1 special character.";
        return false;
    }if(event.currentTarget.value.length<8){
        messagePass.innerHTML= "*Password should be minimum of 8 charaters.";
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

let comparePassword = (event)=>{
    let password = document.getElementById("input-password").value
    let cpassword = event.currentTarget.value;
    let messagePass = document.getElementById("invalid-cpassword")
    if(password !== cpassword){
        messagePass.innerHTML= "*Password doesn't match.";
        return false;
    }else{
        messagePass.innerHTML= `<span>&nbsp;</span>`
        return true;
    }
}

var currentTab = 0; 
let showTab = (n) => {
  let x = document.getElementsByClassName("tab");
  x[n].style.display = "block";

  fixStepIndicator(n)
}

let nextPrev = (n) => {
    let x = document.getElementsByClassName("tab");
    if (n == 1 && !(true)) 
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


// let fetchCode = async()=>{
//     let response =  await fetch("https://restcountries.com/v3.1/all")
//     data=await response.json();
//     console.log(data[0]);

//     function compare( a, b ) {
//         if ( a.name.common < b.name.common ){
//           return -1;
//         }
//         if ( a.name.common > b.name.common ){
//           return 1;
//         }
//         return 0;
//       }
      
//       data.sort( compare );

//     let select = document.getElementById("select-country");

//     for(let i=0; i<data.length; i++){
//         select.innerHTML += `<option value="${data[i].idd.root+ data[i].idd.suffixes[0]}">
//             <span  style="width: 20px;background-image:url(${data[i].flags.svg})"></span>
//             ${data[i].name.common} (${data[i].idd.root+ data[i].idd.suffixes[0]})
//         </option>`;
//     }

// }

// fetchCode()