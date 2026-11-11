import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import { deleteExpense, editExpense, getExpense, getMembers } from "../api/apis";
import Button from "../components/Button";
import { ArrowLeft, Calendar, CircleDollarSign, ReceiptIndianRupee, Split, UserRound, Users } from "lucide-react";
import Card from "../components/Card";
import DateFormatter from "../utils/DateFormatter";
import { Modal } from "react-bootstrap";
import Input from "../components/Input";
import CustomDatePicker from "../components/CustomDatePicker";
import Select from "../components/Select";
import AddExpenseValidation from "../validation/AddExpenseValidation";
export default function ViewExpense(){
    const {expenseId} = useParams();
    const [expenseData, setExpenseData] = useState();
    const [updatingExpenseData, setUpdatingExpenseData] = useState();
    const [members, setMembers] = useState([]);
    const [errors, setErrors] = useState({});
    const [showExpenseDeleteModal, setShowExpenseDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [percentages, setPercentages] = useState({});
    const navigate = useNavigate();

    async function fetchExpense(expenseId) {
        try {
            const response = await getExpense(expenseId);
            setExpenseData(response.data);
            console.log(response.data);
            
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"});
        }
    }
    useEffect(()=>{
        fetchExpense(expenseId);
    },[expenseId]);

    async function confirmDelete() {
        try {
            const data = await deleteExpense(expenseId);
            console.log(data);
            setShowExpenseDeleteModal(false)
            navigate(`/groups/${expenseData?.groupId}/view`)
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    async function handleExpenseUpdate() {
        try {
            setErrors({});
            setUpdateModal(true);
            setUpdatingExpenseData(expenseData)
            await fetchMembers(expenseData?.groupId)
            const extractedUserIds = expenseData?.participants.map(p => p.userId);

            setUpdatingExpenseData(prev =>({
                ...prev,
                participants: extractedUserIds
            }))
            
            if(expenseData?.participants){
                const initialPercentagesObj = {};
                expenseData.participants.forEach(participant =>{
                    initialPercentagesObj[participant.userId] = participant.percent!==null ? participant.percent : 0
                })
                setPercentages(initialPercentagesObj);
            }
            
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    function handleChange(e){
        const {id,name, value} = e.target;
        const key = name || id;
        setUpdatingExpenseData(prev=>({
            ...prev,
            [key]: value
        }))
        setErrors(prev =>({
            ...prev,
            [key]: ""
        }))
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

    async function handleSubmit(e) {
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
                description: updatingExpenseData.description,
                amount: updatingExpenseData.amount,
                date: updatingExpenseData.date,
                paidBy: updatingExpenseData.paidBy,
                status: updatingExpenseData.status,
                participants: updatingExpenseData.participants.map(userId  => {
                    return{
                        id: userId,
                        percent: percentages[userId] || ""
                    }
                })
            }
            console.log(request);
            const data = await editExpense(expenseId,request);
            console.log(data);
            setUpdateModal(false);

        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }
    return(
        <div className="container my-3 ">
            <div className="d-flex flex-column gap-2">
                <div>
                    <Button
                        className="btn-phonepe"
                        onClick={()=>navigate(`/groups/${expenseData?.groupId}/view`)}
                    >
                            <ArrowLeft />
                            Back to Expenses
                        
                    </Button>
                </div>
                <Card 
                    className="p-0"
                >
                    <div className="d-flex flex-column">
                        <div
                            style={{backgroundColor:"#732dbd"}}
                            className="d-flex align-items-center justify-content-between text-white py-md-2"
                        >
                            <div className="d-flex align-items-center gap-3 gap-md-4 mx-3 mx-md-5">
                                <div 
                                    className="d-flex align-items-center justify-content-center fw-bold rounded-circle bg-white " 
                                    style={{width:"42px", height:"42px" }}
                                >
                                    <ReceiptIndianRupee 
                                        size={28}
                                        style={{color: "#864dc2"}}
                                    />
                                </div>
                                <div className="d-flex flex-column gap-0">
                                    <span className="fw-bold fs-4">{expenseData?.description}</span>
                                    <span>View expense info. and participants</span>
                                </div>
                            </div>
                            <div
                                className="d-flex flex-column flex-md-row fap-2 gap-2 gap-md-4 m-2 m-md-3"
                            >
                                <Button
                                    className="btn-primary"
                                    onClick={handleExpenseUpdate}
                                >
                                    Update
                                </Button>
                                <Button
                                    className="btn-danger"
                                    onClick={()=>setShowExpenseDeleteModal(true)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <div>
                            <div className="d-flex flex-column flex-md-row justify-content-md-around gap-3 mt-3">
                                <div className="d-flex flex-md-column justify-content-around align-items-center gap-2">
                                    <div className="d-flex flex-md-column align-items-center gap-2">
                                        <Calendar 
                                            color="#864dc2"
                                        />
                                        <span> Date</span>
                                    </div>
                                    
                                    <span className="fw-bold"><DateFormatter date={expenseData?.date}/></span>
                                </div>
                                
                                <div className="d-flex flex-md-column justify-content-around align-items-center gap-2">
                                    
                                    <div className="d-flex flex-md-column align-items-center gap-2">
                                        <CircleDollarSign 
                                            color="#864dc2"
                                        />
                                        <span>Amount</span>
                                    </div>
                                    
                                    <span className="fw-bold">{expenseData?.amount}</span>
                                </div>
                                <div className="d-flex flex-md-column justify-content-around align-items-center gap-2">
                                    <div className="d-flex flex-md-column align-items-center gap-2">
                                        <UserRound 
                                            color="#864dc2"
                                        />
                                        <span>Paid by</span>
                                    </div>
                                    
                                    <span className="fw-bold">{expenseData?.payerName}</span>
                                </div>
                                <div className="d-flex flex-md-column justify-content-around align-items-center gap-2">
                                    <div className="d-flex flex-md-column align-items-center gap-2">
                                        <Split 
                                            color="#864dc2"
                                        />
                                        
                                        <span>Split Type</span>
                                    </div>
                                    <span className="fw-bold">{expenseData?.status}</span>
                                </div>
                            </div>
                            <div>
                                <Card
                                    title="Participants"
                                    icon={<Users style={{color:"864dc2"}}/>}
                                    className="mt-3 "
                                >
                                    <div className="row justify-content-center">
                                        <div className="col-12 col-md-10">
                                            <div className="table-responsive rounded shadow-sm mx-auto w-100 w-md-50">
                                                <table className="table align-middle table-striped">
                                                    <colgroup>
                                                        <col className="participant-name-col"/>
                                                        <col className="partcipant-percentage-col"/>
                                                        <col className="participant-amount-col"/>
                                                    </colgroup>
                                                    <thead>
                                                        <tr className="text-center">
                                                            <th>Name</th>
                                                            <th> Percentage</th>
                                                            <th>Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {expenseData?.participants.map((participant)=>(
                                                            <tr
                                                                key={participant.id}
                                                                className="text-center"
                                                            >
                                                                <td>
                                                                    <div className="fw-semibold">
                                                                        {participant.name}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {participant.percent ? (
                                                                        <span>{participant?.percent}%</span>
                                                                        
                                                                    ) : (
                                                                        <span>null</span>
                                                                    )
                                                                }
                                                                    
                                                                </td>
                                                                <td>
                                                                    <div className="badge rounded-pill" style={{backgroundColor:"#9558d6"}}>
                                                                        {participant?.value}
                                                                    </div>
                                                                    
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
            <Modal
                show={showExpenseDeleteModal}
                onHide={()=>{
                    setShowExpenseDeleteModal(false);
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Delete Expense
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <p>Are you sure want to delete expense: <span className="fw-bold">{expenseData?.description}</span></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn-secondary"
                        onClick={()=> {
                            setShowExpenseDeleteModal(false)
                            setErrors({})
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="btn-danger"
                        onClick={()=>confirmDelete()}
                    >
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>

            <Modal
                show={updateModal}
                onHide={()=>{
                    setUpdateModal(false);
                    setErrors({})
                }}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Expense
                    </Modal.Title>
                </Modal.Header>

                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <Input 
                                    id="description"
                                    placeholder="Enter description"
                                    type="text"
                                    label="Description"
                                    required
                                    value={updatingExpenseData?.description}
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
                                    value={updatingExpenseData?.amount}
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
                                    value={updatingExpenseData?.date}
                                    onChange={(date)=>{
                                        setUpdatingExpenseData(prev=>({
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
                                    value={updatingExpenseData?.paidBy}
                                    required
                                    onChange={(value)=>{
                                        setUpdatingExpenseData(prev =>{
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
                                        checked={updatingExpenseData?.status==="EQUAL"}
                                        error={errors?.status}
                                    />
                                    <Input 
                                        id="percentage"
                                        name="status"
                                        type="radio"
                                        label="Percentage"
                                        value="PERCENTAGE"
                                        onChange={handleChange}
                                        checked={updatingExpenseData?.status==="PERCENTAGE"}
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
                                    value={updatingExpenseData?.participants}
                                    onChange={(values)=>{
                                        setUpdatingExpenseData(prev =>({
                                            ...prev,
                                            participants: values
                                        }))
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
                            <div className="col-12 col-md-6">
                                {updatingExpenseData?.status==="PERCENTAGE" && (
                                    <div className="table-responsive border rounded">
                                        <div className="d-flex justify-content-center my-3">
                                            <span>Percentage Split(Enter % for each participant)</span>
                                        </div>
                                        
                                        <table className="table table-striped align-middle ">
                                            <colgroup>
                                                    <col style={{width: "50%"}}/>
                                                    <col style={{width: "50%"}}/>
                                                </colgroup>
                                            <thead>
                                                <tr>
                                                    <td>Name</td>
                                                    <td>Percentage</td>
                                                </tr>
                                            
                                            </thead>
                                            <tbody>
                                                {updatingExpenseData?.participants.map(id=>{
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
                                                                        max="100"
                                                                        className="form-control"
                                                                        step="0.01" 
                                                                        value={percentages[id] || ""}
                                                                        onChange={(e)=>{
                                                                            setPercentages(prev=>({
                                                                                ...prev,
                                                                                [id]: e.target.value
                                                                            }))
                                                                            setErrors(prev=>({
                                                                                ...prev,
                                                                                percentages:""
                                                                            }))
                                                                        }}
                                                                    />
                                                                    <span className="mt-2">%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td className="fw-semibold px-3">Total</td>
                                                    <td>{Object.values(percentages).reduce((total, currVal)=> total+ (Number(currVal) || 0),0)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {errors?.server && (
                            <div className="alert alert-danger">
                                {errors.server}
                            </div>
                        )}
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={()=>{
                                setErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="btn-phonepe hover-scale"
                        >
                            Update
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>

    )
}