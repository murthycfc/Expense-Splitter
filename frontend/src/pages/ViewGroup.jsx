import { useEffect, useState, useRef } from "react";
import Card from "../components/Card";
import { useNavigate, useParams } from "react-router";
import { addExpense, addMembers, getExpenses, getGroup, getMembers, getNonMembers } from "../api/apis";
import { ArrowRight, Calendar, UserCheck, UserPlus, UsersCollaboration } from "lucide-react";
import Button from "../components/Button";
import DateFormatter from "../utils/DateFormatter";
import Input from "../components/Input";
import Modal from "react-bootstrap/Modal";
import CustomDatePicker from "../components/CustomDatePicker";
import Select from "../components/Select";
import AddExpenseValidation from "../validation/AddExpenseValidation";
import { FaUsers } from "react-icons/fa";

export default function ViewGroup(){
    const [groupInfo, setGroupInfo] = useState();
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [nonMembers, setNonMembers] = useState([]);
    const [selectedUserIdsToAdd, setSelectedUserIdsToAdd] = useState([]);
    const [errors, setErrors] = useState({
    });
    const [showExpensemodal, setShowExpenseModal] = useState(false)
    const [showAddMembersModal, setShowAddMembersModal] = useState(false);
    const [expenseData, setExpenseData] = useState({
        description:"",
        amount:"",
        date:"",
        paidBy:"",
        status:"",
        participants:[]
    });
    const [percentages, setPercentages] = useState({});

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerTarget = useRef(null);


    const {groupId} = useParams();

    const navigate = useNavigate();
    
    async function fetchGroup(groupId) {
        try {
            console.log(localStorage.getItem("token"))
            const data = await getGroup(groupId);
            setGroupInfo(data);
        } catch (error) {
            setErrors({server:error?.response?.data?.message ?? "Something went wrong"});
        }
    }

    async function fetchExpenses(groupId) {
        try {
            setLoading(true);
            console.log("fetch expenses");
            const data = await getExpenses(groupId, page, 10);
            setExpenses(prev =>
                page===0 ? data.content : [...prev, ...data.content]
            );
            setHasMore(!data.last)
            console.log(data);
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"});
        }
        finally{
            setLoading(false)
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
    async function fetchNonMembers(groupId) {
        try {
            const data = await getNonMembers(groupId);
            setNonMembers(data);
        } catch (error) {
            setErrors({server: error?.response?.data?.message})
        }
    }
    useEffect(()=>{
        fetchGroup(groupId);
    },[groupId])
    useEffect(()=>{
        fetchExpenses(groupId);
    },[groupId, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if(entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            {
                threshold: 0.5
            }
        );
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => observer.disconnect();
    }, [hasMore, loading]);

    function handleChange(e){
        const {id,name, value} = e.target;
        const key = name || id;
        setExpenseData(prev=>({
            ...prev,
            [key]: value
        }))
        setErrors(prev =>({
            ...prev,
            [key]: ""
        }))
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
            const data = await addExpense(groupId,request);
            setExpenses(prev =>([
                data,
                ...prev
            ]))
            setShowExpenseModal(false);
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

    async function handleAddMembers() {
        setErrors({})
        try {
            console.log("handleAddMembers")
            const data = await addMembers(groupId, selectedUserIdsToAdd);
            setGroupInfo(prev =>({
                ...prev,
                members: [...prev.members, ...data]
                
            }))
            setSelectedUserIdsToAdd([]);
            setShowAddMembersModal(false);
        } catch (error) {
            setErrors({server:error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    return(
        <div className="container mt-3">
            <Card>
                <Card style={{backgroundColor: "#7d35c9"}}>
                    <div className="text-white px-2" >
                        <div className="row align-items-center">
                            <div className="col-2 col-md-1">
                                <FaUsers size={36}/>
                            </div>
                            <div className="col-10 col-md-5">
                                <div className="d-flex flex-column gap-0">
                                    <h3 className="mb-0">{groupInfo?.name}</h3>
                                    {groupInfo?.description && (
                                        <p className="mb-0 ">{groupInfo?.description}</p>
                                    )}
                                    <div className="d-flex align-items-center gap-1">
                                        <span className="d-inline d-md-none">
                                            {groupInfo?.members?.slice(0,2).map(member =>member.name).join(", ")}
                                            {groupInfo?.members?.length>2 &&(
                                                <span className="fw-semibold ms-1">+{groupInfo.members.length-2} more</span>
                                            )}
                                        </span>
                                        <span className="d-none d-md-inline">
                                            {groupInfo?.members?.slice(0, 6).map(m => m.name).join(", ")}
                                            {groupInfo?.members?.length > 6 && (
                                                <span className="fw-semibold ms-1">+{groupInfo.members.length - 6} more</span>
                                            )}
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card 
                    title="Group Expenses" 
                    className="mt-3 "
                    action={
                        <Button
                            className="btn-phonepe hover-scale"
                            onClick={()=>{
                                setShowAddMembersModal(true)
                                fetchNonMembers(groupId);
                            }}
                        >
                            Add Members
                        </Button>
                    }
                >
                    <div className="">
                        <div className="d-none d-md-block">
                            <div className="table-responsive rounded">
                                <table className="table align-middle table-striped">
                                    <colgroup>
                                        <col className="expense-date-col"/>
                                        <col className="expense-description-col"/>
                                        <col className="expense-amount-col"/>
                                        <col className="expense-payer-col"/>
                                        <col className="expense-participants-col"/>
                                        <col className="expense-spliyType-col"/>
                                        <col className="expense-action-col"/>
                                    </colgroup>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Amount</th>
                                            <th>Payer</th>
                                            <th>Participants</th>
                                            <th>Split Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses?.map((expense)=>(
                                            <tr
                                                key={expense.id}
                                                className=""
                                            >
                                                <td>
                                                    <DateFormatter date={expense.date}/>
                                                </td>
                                                <td className="fw-bold">
                                                    {expense.description}
                                                </td>
                                                <td>
                                                    ₹{expense.amount}
                                                </td>
                                                <td>
                                                    
                                                    {expense.paidBy}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center ps-2">
                                                        {expense?.participants.map((name, index)=>{
                                                            const letter = name.trim().charAt(0).toUpperCase();
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold bg-primary border border-2 border-white"
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        fontSize: '13px',
                                                                        marginLeft: index===0 ? '0' : '-10px',
                                                                        zIndex: 10 - index
                                                                    }}
                                                                    title={name}
                                                                >
                                                                    {letter}
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`badge bg-success  p-2`} >
                                                        {expense.status}
                                                    </div>
                                                    
                                                </td>
                                                <td>
                                                    <Button
                                                        onClick={()=>navigate(`/expenses/${expense.id}/view`)}
                                                        className="btn-phonepe hover-scale"
                                                    >
                                                        &gt;
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>

                            {hasMore && (
                                <div ref={observerTarget} style={{ height: "20px" }} />
                            )}
                            { loading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"/>
                                    <p className="text-muted small mt-2">Loading expenses...</p>
                                </div>
                            )}
                            {!hasMore && expenses.length > 0 && (
                                <p className="text-center text-muted py-3">
                                    You have reached the end of the expenses.
                                </p>
                            )}
                        </div>
                    
                        <div className="d-block d-md-none">
                            {
                                expenses.map((expense)=>(
                                    <Card
                                        key={expense.id}
                                        className="mb-3"
                                        style={{
                                            backgroundColor: '#f5f0ff', 
                                            border: '1px solid #ded2f4'  
                                        }}
                                    >
                                        <div className="d-flex flex-column gap-1">
                                            
                                            <div className="d-flex justify-content-between">
                                                <span className="fw-bold">{expense.description}</span>
                                                <span>{expense.amount}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex gap-2">
                                                    <Calendar />
                                                    <span>{expense.date}</span>
                                                </div>
                                                <div>
                                                    <span>Payer: </span>
                                                    <span>{expense.paidBy}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="d-flex gap-2 align-items-center ">
                                                        <span>Type: </span>
                                                        <span className="badge bg-success">{expense.status}</span>
                                                    </div>

                                                    <div className="d-flex align-items-center">
                                                        <span>Participants:</span>
                                                        {expense?.participants.map((name, index)=>{
                                                            const letter = name.trim().charAt(0).toUpperCase();
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold bg-primary border border-2 border-white"
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        fontSize: '13px',
                                                                        marginLeft: index===0 ? '0' : '-10px',
                                                                        zIndex: 10 - index
                                                                    }}
                                                                    title={name}
                                                                >
                                                                    {letter}
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                </div>
                                                <div>
                                                    <Button 
                                                        className="btn-phonepe hover-scale"
                                                        onClick={()=>navigate(`/expenses/${expense.id}/view`)}
                                                        
                                                    >
                                                        <span>View Details </span>
                                                    </Button>
                                                </div>

                                            </div>
                                            
                                            
                                        </div>
                                    </Card>
                                ))
                                
                            }
                            {hasMore && (
                                <div ref={observerTarget} style={{ height: "20px" }} />
                            )}
                            {loading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"/>
                                    <p className="text-muted small mt-2">Loading expenses...</p>
                                </div>
                            )}
                            {!hasMore && expenses.length > 0 && (
                                <p className="text-center text-muted py-3">
                                    You have reached the end of the expenses.
                                </p>
                            )}
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                className="btn-phonepe hover-scale"
                                onClick={()=>{
                                    fetchMembers(groupId);
                                    setShowExpenseModal(true)
                                }}

                            >
                                Split New Expense
                            </Button>
                        </div>
                    </div>
                </Card>
            </Card>

            <Modal
                show={showExpensemodal}
                onHide={()=>{
                    setShowExpenseModal(false)
                    setExpenseData({
                        description:"",
                        amount:"",
                        date:"",
                        paidBy:"",
                        status:"",
                        participants:[]
                    })
                    setErrors({})
                }}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Create Expense
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
                                {expenseData.status==="PERCENTAGE" && (
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
                                                {expenseData.participants.map(id=>{
                                                    const member = members?.find(member => member.id===id)

                                                    return(
                                                        <tr key={id}>
                                                            <td>
                                                                {member.name}
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
                                setShowExpenseModal(false)
                                setExpenseData({
                                    description:"",
                                    amount:"",
                                    date:"",
                                    paidBy:"",
                                    status:"",
                                    participants:[]
                                })
                                setErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="btn-phonepe hover-scale"
                        
                        >
                            Create
                        </Button>
                    </Modal.Footer>
                </form>


            </Modal>

            <Modal
                show={showAddMembersModal}
                onHide={()=>{
                    setShowAddMembersModal(false)
                    setSelectedUserIdsToAdd([]);
                    setErrors({})
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Members</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="">
                        {nonMembers.map((nonMember)=>{
                            return (
                                <div 
                                    key={nonMember.id}
                                    className=""
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span>{nonMember.name}</span>
                                        <span>{nonMember.email}</span>
                                        <Button
                                            onClick={()=>(
                                                setSelectedUserIdsToAdd((prev) =>{
                                                    if(prev.includes(nonMember.id)){
                                                        return prev.filter(id => id!==nonMember.id)
                                                    }
                                                    return [...prev, nonMember.id];
                                                })
                                            )}
                                            className={`${selectedUserIdsToAdd?.includes(nonMember.id) ? 'text-success' : 'text-muted'}`}
                                        >
                                            {selectedUserIdsToAdd.includes(nonMember.id) ? (
                                                // <CheckCircle2 />
                                                // <CircleDot />
                                                <UserCheck />
                                            ) : (
                                                // <Circle />
                                                <UserPlus />
                                            )}
                                             
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <Button
                        className="btn-secondary"
                        onClick={()=>{
                            setShowAddMembersModal(false)
                            setSelectedUserIdsToAdd([]);
                            setErrors({})
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="btn-phonepe hover-scale"
                        onClick={handleAddMembers}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>

            </Modal>
            
        </div>
    )
}