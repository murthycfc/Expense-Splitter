import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { addExpense, getAllUsers } from "../api/apis";
import Select from "./Select";
import AddExpenseValidation from "../validation/AddExpenseValidation";
import CustomDatePicker from "./CustomDatePicker";
import "react-datepicker/dist/react-datepicker.css";
export default function AddExpense({onExpenseAdd}){
    const [expense, setExpense] = useState({
        description:"",
        amount:0,
        date:"",
        paidBy:"",
        status:"",
        participants:[]
    })
    const [percentages, setPercentages] = useState({});
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    async function fetchUsers() {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            setErrors(error.response.data.message)
        }
    }
    useEffect(()=>{
        fetchUsers();
    },[]);

    function handleChange(e){
        const {id,name, value} = e.target;
        const key = name || id;
        
        setExpense({
            ...expense,
            [key]: value
        });
    
        setErrors(prev=>({
            ...prev,
            [key]: ""
        }))
    }

    function handlePercentageChange(id, percent){
        setPercentages(prev => ({
            ...prev,
            [id]: percent
        }))
        setErrors(prev =>({
            ...prev,
            server:""
        }))

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({})
        const valiadationErrors = AddExpenseValidation(expense);
        console.log(valiadationErrors);
        if(Object.keys(valiadationErrors).length>0){
            setErrors(valiadationErrors);
            return;
        }
        try {
            const request = {
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                paidBy: expense.paidBy,
                status: expense.status,
                participants: expense.participants.map(id => ({
                    id: id,
                    percent: percentages[id] || ""
                }))
            }
            console.log(request);
            await addExpense(request);
            onExpenseAdd();
            setExpense({
                description:"",
                amount:0,
                date:"",
                paidBy:"",
                status:"",
                participants:[]
            });
        
        } catch (error) {
            setErrors({server:error?.response?.data?.message})   
        }
    }

    return(
        <div className="container mb-4">
            <div className="">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-column gap-2 px-3">
                        <h3 className="mt-2">Add Expense</h3>
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-4">
                                <Input 
                                    id="description"
                                    placeholder="eg. Dinner, Petrol"
                                    type="text"
                                    required
                                    label="Description" 
                                    error={errors?.description}
                                    value={expense.description} 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <Input 
                                    id="amount"
                                    placeholder="0.00"
                                    type="number"
                                    error={errors?.amount}
                                    required
                                    label="Amount(₹)" 
                                    value={expense.amount} 
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                {/* <Input 
                                    id="date"
                                    type="date"
                                    required
                                    error={errors.date}
                                    label="Expense Date" 
                                    value={expense.date} 
                                    onChange={handleChange}
                                /> */}
                                <CustomDatePicker
                                    id="date"
                                    label="Date"
                                    required
                                    value={expense.date}
                                    error={errors?.date}
                                    onChange={(date)=>{
                                        setExpense(prev =>({
                                            ...prev,
                                            date: date ? date.toISOString().split("T")[0] : ""
                                        }))
                                        setErrors(prev => ({
                                            ...prev,
                                            date: ""
                                        }))
                                    }}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-4">
                                <Select
                                    id="paidBy"
                                    label="Paid by"
                                    value={expense.paidBy}
                                    placeholder="Select Payer"
                                    required
                                    onChange={(value)=>{
                                        setExpense(prev =>{
                                            const updatedParticipants = prev.participants.includes(value) ? prev.participants : [...prev.participants, value];
                                            return {
                                                ...prev,
                                                paidBy: value,
                                                participants: updatedParticipants
                                            }
                                        })
                                        setErrors(prev =>({
                                            ...prev,
                                            paidBy: ""
                                        }))
                                    }}
                                    error={errors?.paidBy}
                                    options={users.map(user =>({
                                        value: user.id,
                                        label: user.name
                                    }))}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-md-5">
                                <p className="form-label">Split Type<span className="text-danger ms-1">*</span></p>
                                <div className="d-flex gap-4">
                                    <Input 
                                        id="equal"
                                        type="radio"
                                        name="status"
                                        label="Equal Split"
                                        value="EQUAL"
                                        error={errors?.splitType}
                                        checked={expense.status==="EQUAL"}
                                        onChange={handleChange}
                                    />
                                    <Input 
                                        id="percentage"
                                        type="radio"
                                        name="status"
                                        label="Percentage Split"
                                        value="PERCENTAGE"
                                        checked={expense.status==="PERCENTAGE"}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors?.status && (
                                    <div className="text-danger">
                                        {errors?.status}
                                    </div>
                                )}
                            </div>

                            <div className="col-12 col-sm-4">
                                <Select
                                    id="participants"
                                    label="Participants"
                                    multiple
                                    value={expense.participants}
                                    required
                                    onChange={(values)=>{
                                        setExpense(prev =>({
                                            ...prev,
                                            participants: values
                                        }))
                                        setErrors(prev =>({
                                            ...prev,
                                            participants:""
                                        }))
                                    }}
                                    placeholder="Select participants"
                                    error={errors?.participants}
                                    options={users.map(user=>({
                                        value: user.id,
                                        label: user.name
                                    }))}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                {expense.status==="PERCENTAGE" && (
                                    <div className="mt-3">
                                        <table className="table table-striped border align-middle">
                                            <colgroup>
                                                <col style={{width: "20%"}}/>
                                                <col style={{width: "20%"}}/>
                                            </colgroup>
                                            <thead >
                                                <tr>
                                                    <th colSpan={2} className="text-start px-5 py-3">Percentage Split(Enter % for each participant)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expense.participants.map(id =>{
                                                    const user = users.find(user => user.id === id);

                                                    return (
                                                        <tr key={id} className="">
                                                            <td className="px-3">{user.name}</td>
                                                            <td>
                                                                <div className="d-flex gap-1">
                                                                    <Input 
                                                                        type="number"
                                                                        className="form-control"
                                                                        min="0"
                                                                        max="100"
                                                                        step="0.01" 
                                                                        value={percentages[id] || ""}
                                                                        onChange={(e)=>handlePercentageChange(id,e.target.value)}
                                                                    /> 
                                                                    <span className="mt-2">%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr >
                                                    <td className="fw-semibold px-3">Total</td>
                                                    <td className="me-4 fw-bold">{Object.values(percentages).reduce((total, currVal) => total+ (Number(currVal) || 0),0)}</td>
                                                </tr>
                                                
                                            </tfoot>

                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors?.server && (
                            <div className="alert alert-danger mt-2">
                                {errors.server}
                            </div>
                        )}

                        <div className="d-flex justify-content-end">
                            
                            <Button className="btn btn-primary mt-2">+ Add Expense</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}