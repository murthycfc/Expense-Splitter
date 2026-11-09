export default function Textarea({label, id, ...props}){
    return (
        <div className="mb-3">
            {label && (
                <label
                    className="form-label fw-semibold"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}
            <div>
                <textarea 
                    className="form-control"
                    rows={3}
                    id={id}
                    {...props}
                />
            </div>
        </div>
    )
}