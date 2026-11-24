import { useEffect, useState } from "react";
import AddExpenseValidation from "../validation/AddExpenseValidation";
import { useNavigate, useParams } from "react-router";
import { addExpense, editExpense, getExpense, getMembers } from "../api/apis";
import Input from "./Input";
import CustomDatePicker from "./CustomDatePicker";
import Select from "./Select";
import Button from "./Button";
import { toast } from "react-toastify";
import { RotateCcw, RotateCw } from "lucide-react";

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
    const [lockedPercentages, setLockedPercentages] = useState(new Set());

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
            distributeEqually(expenseData.participants, expenseData.paidBy);
        }
        setErrors(prev =>({
            ...prev,
            [key]: ""
        }))
    }

    function distributeEqually(participantIds, paidBy=""){
        setLockedPercentages(new Set());

        const totalPercentage = 100;
        const count = participantIds.length;

        if(count===0){
            setPercentages({});
            return ;
        }

        const equalShare = Math.floor((totalPercentage/count)*100)/100;
        const remainder = Number((totalPercentage-(equalShare*count)).toFixed(2));

        const updatedPercentages = {};

        const remainderAddIndex = participantIds.includes(paidBy) 
            ? participantIds.indexOf(paidBy) : 0;

        participantIds.forEach((id, index)=>{
            const percentage = equalShare + (index===remainderAddIndex ? remainder : 0);
            updatedPercentages[id] = percentage.toFixed(2);
        });
        setPercentages(updatedPercentages);
    }

    function handlePercentageChange(id, inputValue){
        if(Number(inputValue)<0){
            return;
        }
        const nextLocked = new Set(lockedPercentages);
        nextLocked.add(id);
        let lockedTotal = 0;

        for(const participantId of expenseData.participants){
            if(nextLocked.has(participantId)){
                const percentage = participantId===id ? Number(inputValue) || 0 : Number(percentages[participantId]) || 0;
                lockedTotal+=percentage;
            }
        }

        // if(lockedTotal>100){
        //     return;
        // }

        const remainingParticipants = expenseData.participants.filter(participantId => !nextLocked.has(participantId));
        const remainingPercentage = Number((100-lockedTotal).toFixed(2));
        const equalShare = remainingParticipants.length>0 ? Math.floor((remainingPercentage/remainingParticipants.length)*100)/100 : 0;
        const remainder = Number((remainingPercentage-equalShare*remainingParticipants.length).toFixed(2));

        setPercentages(prev => {
            const updatedPercentages ={
                ...prev,
                [id]: inputValue
            };

            remainingParticipants.forEach((participantId, index)=>{
                const percentage = equalShare + (index===0 ? remainder : 0);
                updatedPercentages[participantId] = percentage.toFixed(2)>0 ? percentage.toFixed(2) : 0;
            })
            return updatedPercentages;
        });

        setLockedPercentages(nextLocked);

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
                    percent: percentages[id] || 0
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
            toast.error(error?.response?.data?.message);
            // setErrors({server:error?.response?.data?.message})
        }
    }
    const totalPercentage = expenseData.participants.reduce(
        (total, id) => total + (Number(percentages[id]) || 0),0);

    return(
        <div className="mb-4 mx-2 mx-md-4">
            <div className="fw-bold fs-4">
                {isEdit ? "Update Expense" : "Create new expense"}
            </div>
            <div className="text-muted small mt-1 mb-4">
                {isEdit
                    ? "Update expense details, payer information, or participant shares."
                    : "Add an expense, choose who paid, and split the amount among group members."
                }
            </div>
           
            <form onSubmit={handleSubmit}>
                <div className="row mx-1">
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
                                    const updatedParticipants = value ? 
                                        (expenseData.participants.includes(value) ? 
                                            expenseData.participants : [...expenseData.participants, value]) : 
                                        expenseData.participants;
                                    setExpenseData(prev =>({
                                        ...prev,
                                        paidBy: value,
                                        participants: updatedParticipants
                                        
                                    }))
                                
                                    distributeEqually(updatedParticipants, value);
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
                        <div className="col-12 col-md-6 mb-3">
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
                                    distributeEqually(values, expenseData.paidBy)

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
                        <div className="col-12 col-md-10  mt-4 mx-auto">
                            {expenseData.status==="PERCENTAGE" && (
                                <div className="table-responsive border rounded">
                                    <div className="d-flex justify-content-between align-items-center mx-2 mx-md-3">
                                        <div className="">
                                            <p className="fs-4 fw-semibold mb-0">Percentage Split </p>
                                            <p className="fs-6">Assign a percentage share to each participant.</p>
                                        </div>
                                        <div className="">
                                            <Button 
                                                type="button"
                                                onClick={()=> distributeEqually(expenseData.participants, expenseData.paidBy)}> 
                                                <div className="d-flex align-items-center gap-1">
                                                    <RotateCw size={20} className="text-muted mt-1"/> 
                                                    <span className="d-none d-md-block">Split Equally</span>
                                                </div>
                                                
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <table className="table align-middle mb-0">
                                        <colgroup>
                                                <col style={{width: "45%"}}/>
                                                <col style={{width: "40%"}}/>
                                                <col style={{width: "15%"}}/>
                                            </colgroup>
                                        <thead className="table-light">
                                            <tr>
                                                <td className="fw-bold px-3">Name</td>
                                                <td className="fw-bold">Percentage</td>
                                                <td className="fw-bold">Amount</td>
                                            </tr>
                                        
                                        </thead>
                                        <tbody>
                                            {expenseData.participants.map(id=>{
                                                const member = members?.find(member => member.id===id)

                                                return(
                                                    <tr key={id}>
                                                        <td className="px-3">
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
                                                                        if(value===""){
                                                                            setPercentages(prev=>({
                                                                                ...prev,
                                                                                [id]:""
                                                                            }));
                                                                            return;
                                                                        }
                                                                        
                                                                        if(Number(value)>100 ){
                                                                            return;
                                                                        }
                                                                        
                                                                        handlePercentageChange(id, value);
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
                                                <td className={`${totalPercentage.toFixed(2)>100 ? "text-danger" : `${totalPercentage.toFixed(2)==="100.00" ? "text-success" : ""}`}  d-flex flex-column`}>
                                                    <span className="fw-bold">{totalPercentage.toFixed(2)}</span>
                                                    {totalPercentage.toFixed(2)>100 && (
                                                        <span className="text-danger fw-semibold">Total percentage must not exceed 100%</span>
                                                    )}
                                                </td>
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