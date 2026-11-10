import DatePicker from "react-datepicker";

export default function CustomDatePicker({label, id,error, required, value, ...props}){
    return(
        <div className="mb-3 d-flex flex-column">
            {label && (
                <label 
                    className="form-label fw-semibold"
                    htmlFor={id}
                >
                    <span>{label}</span>
                    {required && (
                        <span className="text-danger ms-1">*</span>
                    )}
                </label>
            )}
            <DatePicker
                selected={value ? new Date(value) : null}
                id={id}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                {...props}
            />
            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}
        </div>
    )
    
}