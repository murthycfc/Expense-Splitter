export default function Input({label,type,required,error,id, ...props}){
    const isRadio = type==="radio";
    if(isRadio){
        return (
            <div className="d-flex gap-2">
                <input
                    className="form-check-input"
                    type={type}
                    {...props}
                />
                <span className="form-check-label">{label}</span>
            </div>
        )
    }
    return (
        <div className="mb-3">
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
            <input 
                className="form-control"
                type={type}
                id={id}
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