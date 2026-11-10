export default function Input({label,type,required,error,id,eye, ...props}){
    const isRadio = type==="radio";
    if(isRadio){
        return (
            <div className="d-flex flex-column">
                <div className="d-flex gap-2">
                    <input
                        className="form-check-input"
                        type={type}
                        {...props}
                    />
                    <span className="form-check-label">{label}</span>
                </div>
                {error && (
                    <div className="text-danger small mt-1">
                        {error}
                    </div>
                )}
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
            <div className="input-group">
                <input 
                    className="form-control"
                    type={type}
                    id={id}
                    {...props}
                />
                {eye && (
                    <span className="input-group-text bg-white p-0">{eye}</span>
                )}
            </div>
            
            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}
        </div>
    )
}