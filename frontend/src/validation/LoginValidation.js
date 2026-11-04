import { validateEmail, validatePassword } from "./validationRules";

export default function LoginValidation(email, password){
    const errors = {};
    const emailError = validateEmail(email);
    if(emailError){
        errors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if(passwordError){
        errors.password = passwordError;
    }

    return errors;

}