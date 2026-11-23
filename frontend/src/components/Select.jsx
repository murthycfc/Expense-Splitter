import ReactSelect,{components} from "react-select";
import Button from "./Button";
import { Square, SquareCheck } from "lucide-react";

const CustomOption = (optionProps) => {
    const {data, isSelected} = optionProps;
    return(
        <components.Option {...optionProps}>
            <div className="d-flex justify-content-between mx-2">
                <span>{data.label}</span>
                {isSelected ? (
                    <SquareCheck 
                        size={19}
                        color="#5F259F"
                    />
                ): (
                    <Square 
                        size={19}
                        color="#777"
                    />
                )}
            </div>
        </components.Option>
    )
}
const CustomMenu = (menuProps) => {
    const { multiple, allSelected, handleAddAll } = menuProps.selectProps;
    return (
        <components.Menu {...menuProps}>
           
            {multiple && menuProps.options.length > 0 && (
                <div 
                    className="d-flex justify-content-between align-items-center mx-4"
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
                                color="#5F259F" 
                                size={19} 
                            /> 
                            : 
                            <Square 
                                size={19}
                                color="#777"
                            />}
                    </Button>
                </div>
            )}
            {menuProps.children}
        </components.Menu>
    );
};
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

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#aba6b05b" : "white",
            color: "#333",
            cursor: "pointer",
            ":active": {
                backgroundColor: "#F3ECFA"
            }
        }),

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
                    Menu: CustomMenu,
                    Option: CustomOption
                }}
                hideSelectedOptions={false}
                multiple={multiple}
                allSelected={allSelected}
                handleAddAll={handleAddAll}
                {...props}
            >
            </ReactSelect>
            {error && (<div className="text-danger small mt-1">
                {error}
            </div>)}

        </div>
    )
}