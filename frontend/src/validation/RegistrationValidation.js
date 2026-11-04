import { validateConfirmPassword, validateEmail, validateName, validatePassword, validatePhoneNumber } from "./validationRules";

export default function RegisterValidation(registerData){
    const errors = {};
    const nameError = validateName(registerData.name);
    if(nameError){
        errors.name =nameError
    }

    const emailError = validateEmail(registerData.email);
    if(emailError){
        errors.email = emailError
    }

    const passwordError = validatePassword(registerData.password);
    if(passwordError){
        errors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(registerData.password,registerData.confirmPassword);
    if(confirmPasswordError){
        errors.confirmPassword = confirmPasswordError;
    }

    const phoneNumberError = validatePhoneNumber(registerData.phoneNumber);
    if(phoneNumberError){
        errors.phoneNumber = phoneNumberError;
    }
    return errors;
}