import { validateEmail, validateName } from "./validationRules";

export default function addMemberValidation(name,email){
    const errors = {};
    const nameError = validateName(name);
    if(nameError){
        errors.name = nameError;
    }

    const emailError = validateEmail(email);
    if(emailError){
        errors.email = emailError;
    }

    return errors;
}

