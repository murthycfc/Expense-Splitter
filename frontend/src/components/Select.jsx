import ReactSelect,{components} from "react-select";
import Button from "./Button";
import { Square, SquareCheck } from "lucide-react";
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

    function handleAddAll(){
        const selectedValues = value || [];
        const allSelected = options.every(option =>
            selectedValues.includes(option.value)
        );

        if (allSelected) {
            onChange([]);
        } else {
            onChange(options.map(option => option.value));
        }
    }
    const allSelected =
        options.length > 0 &&
        options.every(option => value?.includes(option.value));

    const CustomMenu = (menuProps) => {
        return (
            <components.Menu {...menuProps}>
                {multiple && options.length > 0 && (
                    <div 
                        className="d-flex justify-content-between align-items-center mx-3"
                    >
                        <span className="fw-semibold">
                            {allSelected ? "All users selected" : "Select All"}
                        </span>
                        <Button
                            type="button"
                            onClick={handleAddAll}
                        >
                            {allSelected ? 
                                <SquareCheck 
                                    fill="green" 
                                    color="white" 
                                    size={26} 
                                /> 
                                : 
                                <Square size={20}/>}
                        </Button>
                    </div>
                )}
                {menuProps.children}
            </components.Menu>
        );
    };



    const customStyles = {
        valueContainer: (provided) => ({
            ...provided,
            flexWrap: "nowrap",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            scrollbarWidth: "none"
        }),
        multiValue: (provided) => ({
            ...provided,
            flexShrink: 0
        }),
        input: (provided) => ({
            ...provided,
            flex: "0 0 auto"
        })
    };
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
                closeMenuOnSelect={!multiple}
                styles={customStyles}
                components={{
                    Menu: CustomMenu
                }}
                // isSearchable
                {...props}
            >
            </ReactSelect>
            {error && (<div className="text-danger small mt-1">
                {error}
            </div>)}

        </div>
    )
}