import { useEffect, useState } from "react";
import AddExpenseValidation from "../validation/AddExpenseValidation";
import { useNavigate, useParams } from "react-router";
import { addExpense, editExpense, getExpense, getMembers } from "../api/apis";
import Input from "./Input";
import CustomDatePicker from "./CustomDatePicker";
import Select from "./Select";
import Button from "./Button";
import { toast } from "react-toastify";

export default function ExpenseCompoent({isEdit}){
    
    const {groupId,expenseId} = useParams();
    const navigate = useNavigate();

    const [expenseData, setExpenseData] = useState({
        description:"",
        amount:"",
        date:"",
        paidBy:"",
        status:"",
        participants:[]
    });
    

    const [percentages, setPercentages] = useState({});
    const [members, setMembers] = useState([]);

    const [errors, setErrors] = useState({});

    useEffect(()=>{
        try {
            fetchMembers(groupId);
            if(isEdit){
                fetchExpense(expenseId);
            }
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
        
    },[groupId, expenseId]);


    
    async function fetchExpense(expenseId) {
        try {
            const response = await getExpense(expenseId);
            const expense = response.data;
            const extractedUserIds = expense.participants.map(
                participant => participant.userId
            );
            setExpenseData({
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                paidBy: expense.paidBy,
                status: expense.status,
                participants: extractedUserIds
            });

            const initialPercentagesObj = {};
            expense.participants.forEach(participant => {
                initialPercentagesObj[participant.userId] =
                    participant.percent ?? "";
            });
            setPercentages(initialPercentagesObj);
            
            console.log(response.data);
            
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"});
        }
        }
    async function fetchMembers(groupId) {
        try {
            console.log("fetch members")
            const data = await getMembers(groupId);
            setMembers(data);
            console.log("members", {data})
        } catch (error) {
            setErrors({server: error?.response?.data?.message})
        }
    }
    function handleChange(e){
        const {id,name, value} = e.target;
        const key = name || id;
        setExpenseData(prev=>({
            ...prev,
            [key]: value
        }))
        if(key==="status"){
            distributeEqually(expenseData.participants);
        }
        setErrors(prev =>({
            ...prev,
            [key]: ""
        }))
    }

    function distributeEqually(participantIds){
        const totalPercentage = 10000;
        const count = participantIds.length;

        if(count===0){
            setPercentages({});
            return ;
        }

        const equalShare = Math.floor(totalPercentage/count);
        const remainder = totalPercentage%count;

        const updatedPercentages = {};

        participantIds.forEach((id, index)=>{
            const percentage = equalShare + (index===0 ? remainder : 0);
            updatedPercentages[id] = (percentage/100).toFixed(2);
        });
        setPercentages(updatedPercentages);
    }

    async function handleSubmit(e){
        e.preventDefault();
        setErrors({});
        const valiadationErrors = AddExpenseValidation(expenseData);
        if(Object.keys(valiadationErrors).length>0){
            console.log(valiadationErrors);
            setErrors(valiadationErrors);
            return;
        }
        try {
            const request = {
                description: expenseData.description,
                amount: expenseData.amount,
                date: expenseData.date,
                paidBy: expenseData.paidBy,
                status: expenseData.status,
                participants: expenseData.participants.map(id => ({
                    id: id,
                    percent: percentages[id] || ""
                }))
            }
            if(isEdit){
                const data = await editExpense(expenseId, request);
                navigate(`/expenses/${expenseId}/view`)
                toast.success("Expense updated successfully!")
            }
            else {
                const data = await addExpense(groupId,request);
                navigate(`/groups/${groupId}/view`)
                toast.success("Expense created successfully!")
            }

            setExpenseData({
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
    const totalPercentage = expenseData.participants.reduce(
        (total, id) => total + (Number(percentages[id]) || 0),0);

    return(
        <div >
                <div className="mb-4 fw-bold fs-4">
                    {isEdit ? "Update Expense" : "Create new expense"}
                </div>
           
            <form onSubmit={handleSubmit}>
                <div className="row mx-3">
                    <div className="col-12 col-md-6">
                        <Input 
                            id="description"
                            placeholder="Enter description"
                            type="text"
                            label="Description"
                            required
                            value={expenseData.description}
                            onChange={handleChange}
                            error={errors?.description}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <Input 
                            id="amount"
                            placeholder="Enter amount"
                            type="number"
                            label="Amount"
                            required
                            min={1}
                            value={expenseData.amount}
                            onChange={handleChange}
                            error={errors?.amount}
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <CustomDatePicker 
                            id="date"
                            placeholderText="Select expense date"
                            label="Date"
                            required
                            value={expenseData.date}
                            onChange={(date)=>{
                                setExpenseData(prev=>({
                                    ...prev,
                                    date: date ? date.toISOString().split("T")[0]: ""
                                }))
                                setErrors(prev =>({
                                    ...prev,
                                    date: ""
                                }))
                            }}
                            error={errors?.date}
                        />
                    </div>
                        <div className="col-12 col-md-6">
                            <Select 
                                id="paidBy"
                                placeholder="Select Payer"
                                label="Paid by"
                                value={expenseData.paidBy}
                                required
                                onChange={(value)=>{
                                    setExpenseData(prev =>{
                                        const updatedParticipants = prev.participants.includes(value) ? prev.participants : [...prev.participants, value];
                                        return {
                                            ...prev,
                                            paidBy: value,
                                            participants: updatedParticipants
                                        }
                                    })
                                    setErrors(prev => ({
                                        ...prev,
                                        paidBy: ""
                                    }))
                                }}
                                error={errors.paidBy}
                                options={members.map(member =>({
                                    value: member.id,
                                    label: member.name
                                }))}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <p className="form-label fw-semibold">Split Type<span className="text-danger ms-1">*</span></p>
                            <div className="d-flex gap-4">
                                <Input 
                                    id="equals"
                                    name="status"
                                    type="radio"
                                    label="Equal Split"
                                    value="EQUAL"
                                    onChange={handleChange}
                                    checked={expenseData.status==="EQUAL"}
                                    error={errors?.status}
                                />
                                <Input 
                                    id="percentage"
                                    name="status"
                                    type="radio"
                                    label="Percentage"
                                    value="PERCENTAGE"
                                    onChange={handleChange}
                                    checked={expenseData.status==="PERCENTAGE"}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Select 
                                id="participants"
                                label="participants"
                                placeholder="Select participants"
                                multiple
                                required
                                value={expenseData.participants}
                                onChange={(values)=>{
                                    setExpenseData(prev =>({
                                        ...prev,
                                        participants: values
                                    }))
                                    distributeEqually(values)

                                    setErrors(prev =>({
                                        ...prev,
                                        participants: ""
                                    }))
                                }}
                                options={members.map(member=>({
                                    value: member.id,
                                    label: member.name 
                                }))}
                                error={errors?.participants}
                            />
                        </div>
                        <div className="col-10 mt-4 mx-auto">
                            {expenseData.status==="PERCENTAGE" && (
                                <div className="table-responsive border rounded">
                                    <div className="mx-3 my-3">
                                        <span className="fs-4">Percentage Split – Assign a percentage share to each participant.</span>
                                    </div>
                                    
                                    <table className="table align-middle mb-0">
                                        <colgroup>
                                                <col style={{width: "50%"}}/>
                                                <col style={{width: "25%"}}/>
                                                <col style={{width: "25%"}}/>
                                            </colgroup>
                                        <thead className="table-light">
                                            <tr>
                                                <td className="fw-bold">Name</td>
                                                <td className="fw-bold">Percentage</td>
                                                <td className="fw-bold">Amount</td>
                                            </tr>
                                        
                                        </thead>
                                        <tbody>
                                            {expenseData.participants.map(id=>{
                                                const member = members?.find(member => member.id===id)

                                                return(
                                                    <tr key={id}>
                                                        <td>
                                                            {member?.name}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Input 
                                                                    type="number"
                                                                    min="0"
                                                                    max={100}
                                                                    className="form-control"
                                                                    step="0.01" 
                                                                    value={percentages[id] ?? ""}
                                                                    onChange={(e)=>{
                                                                        const value = e.target.value;
                                                                        const newTotalPercentage = totalPercentage - (Number(percentages[id]) || 0) + (Number(value)||0);
                                                                        if(Number(value)>100 || newTotalPercentage > 100){
                                                                            return;
                                                                        }
                                                                        setPercentages(prev=>({
                                                                            ...prev,
                                                                            [id]: value
                                                                        }))
                                                                        setErrors(prev=>({
                                                                            ...prev,
                                                                            percentages:""
                                                                        }))
                                                                    }}
                                                                    containerClassName="mb-0"
                                                                />
                                                                <span className="mt-2">%</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <span>{(expenseData.amount*(percentages[id]/100)).toFixed(2)}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="fw-semibold px-3">Total</td>
                                                <td>{totalPercentage.toFixed(2)}</td>
                                                <td> {(Number(expenseData.amount || 0) * (totalPercentage / 100)).toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {errors?.server && (
                        <div className="d-flex justify-content-center">
                            <div className="alert alert-danger mt-3 w-50 text-center">
                                <span>{errors.server}</span>
                            </div>
                        </div>
                        
                    )}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button 
                            className="btn-secondary hover-scale"
                            onClick={()=> navigate(-1)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="btn-phonepe hover-scale"
                        >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div>
                    
            </form>
        </div>
    )
}