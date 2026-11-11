import { validateGroupName } from "./validationRules";

export default function GroupValidation(group){
    const errors = {};
    const groupNameError = validateGroupName(group);
    if(groupNameError){
        errors.name = groupNameError; 
    }
    return errors;
}