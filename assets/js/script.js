let passwordEye = document.getElementById("password-eye");
let passwordInput = document.getElementById("input-password")

let toggleEye = ()=>{
    if(passwordInput.type=="text"){
        passwordEye.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
        passwordInput.type = "password";
    } else{
        passwordEye.innerHTML = `<i class="fa-solid fa-eye"></i> `
        passwordInput.type = "text";
    }
    
}

let message = document.getElementById("invalid-message")

let validateEmail= (event)=>{
    console.log(event.target.value)

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let result = regex.test(event.target.value);
    if(!result){
        message.style.display= "block";
        return false;
    }else{
        message.style.display= "none"
        return true;
    }
}