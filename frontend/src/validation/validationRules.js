export function validateName(name){
    if(!name.trim()){
        return "Name is required";
    }
    else if(name.trim().length<3){
        return "Name must be at least 3 characters"
    }
    return "";
}

export function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.trim()){
        return "Email is required";
    }
    else if(!emailRegex.test(email)){
        return "Please enter a valid email"
    }
    return "";
}

export function validatePassword(password){
    if(!password.trim()){
        return "Password is required";
    }
    else if(password.trim().length<6){
        return "Password must be atleast 6 characters"
    }
    return "";
}

export function validateConfirmPassword(password,confirmPassword){
    if(!confirmPassword.trim()){
        return "Confirm Password is required";
    }
    if(confirmPassword!==password){
        return "Confirm Password must be equal to entered Password";
    }
    return "";
}

export function validateDescription(description){
    if(!description.trim()){
        return "Description required"
    }
    return "";
}
export function validateAmount(amount){
    if(!amount){
        return "Amount is required";
    }
    return "";
}
export function validateDate(date){
    if(!date){
        return "Date is required";
    }
    return ;
}

export function validateSplitType(type){
    if(!type){
        return "Split type is required";
    }
    return "";
}

export function validatePaidBy(payer){
    if(!payer){
        return "Payer is required";
    }
    return "";
}

export function validateParticipants(participants){
    if(participants.length===0){
        return "Enter atleast 1 participant";
    }
    return "";
}

export function validatePhoneNumber(phoneNumber){
    if(!phoneNumber){
        return "Phone number is required"
    }

    const phoneRegex = /^[6-9]\d{9}$/
    if(!phoneRegex.test(phoneNumber)){
        return "Please enter a valid 10-digit phone number"
    }
    return "";
}

export function validateGroupName(groupName){
    if(!groupName.trim()){
        return "Group name is required";
    }
    return "";
}