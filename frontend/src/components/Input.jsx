export default function Input({label,type,required,error,id,endIcon,height=42,startIcon,className,containerClassName="mb-3", ...props}){
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
        <div className={containerClassName}>
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
            <div className="input-with-icon">
                {startIcon &&(
                    <span className="input-start-icon">{startIcon}</span>
                )}
                <input 
                    className={`form-control ${startIcon ? "ps-5 " : ""} ${className || ""}`}
                    type={type}
                    id={id}
                    style={{height:`${height}px`}}
                    {...props}
                />
                {endIcon && (
                    <span className="input-end-icon">{endIcon}</span>
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