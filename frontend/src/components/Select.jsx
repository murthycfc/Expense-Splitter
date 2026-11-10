import ReactSelect from "react-select";
export default function Select({label,options=[], value, onChange,placeholder="Select", error, required, multiple=false, ...props }){
    function handleChange(selectedOption){
        if(multiple){
            const selectedValues = selectedOption?.map(option => option.value)
            onChange(selectedValues);
        }
        else{
            onChange(selectedOption?.value)
        }
    }
    const selectedValue = multiple ?
                                options.filter(option => value?.includes(option.value))
                                : options.find(option => option.value === value) || null;
    return(
        <div className="mb-3">
            {label && (
                <label className="form-label fw-semibold">
                    {label}
                    {required && (
                        <span className="text-danger ms-1">*</span>
                    )}
                </label>
                
            )}
            <ReactSelect
                options={options}
                className="w-100"
                value={selectedValue}
                onChange={handleChange}
                placeholder={placeholder}
                isMulti={multiple}
                isClearable
                {...props}
            >
            </ReactSelect>
            {error && (<div className="text-danger small mt-1">
                {error}
            </div>)}

        </div>
    )
}