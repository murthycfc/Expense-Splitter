import { validateAmount, validateDate, validateDescription, validatePaidBy, validateParticipants, validateSplitType } from "./validationRules";

export default function AddExpenseValidation(expense){
    const errors = {};
    const descriptionError = validateDescription(expense.description);
    if(descriptionError){
        errors.description = descriptionError;
    }

    const amountError = validateAmount(expense.amount);
    if(amountError){
        errors.amount = amountError;
    }

    const dateError = validateDate(expense.date)
    if(dateError){
        errors.date = dateError;
    }

    const typeError = validateSplitType(expense.status);
    if(typeError){
        errors.status = typeError;
    }

    const payerError = validatePaidBy(expense.paidBy)
    if(payerError){
        errors.paidBy = payerError;
    }

    const participantsError = validateParticipants(expense.participants)
    if(participantsError){
        errors.participants = participantsError;
    }

    return errors;
}