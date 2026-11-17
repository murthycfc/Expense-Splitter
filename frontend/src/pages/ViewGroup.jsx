import { useEffect, useState, useRef } from "react";
import Card from "../components/Card";
import { useNavigate, useParams } from "react-router";
import { addExpense, addMembers, getExpenses, getGroup, getMemberBalances, getMembers, getNonMembers, getTotalExpenses, getTotoalExpenses, removeMember } from "../api/apis";
import { ArrowLeft, ArrowRight, Calendar, CircleUserRound, CircleX, DollarSign, EllipsisVertical, Receipt, ReceiptPoundSterling, User, UserCheck, UserPlus, Users, UsersCollaboration, Wallet } from "lucide-react";
import Button from "../components/Button";
import DateFormatter from "../utils/DateFormatter";
import Input from "../components/Input";
import Modal from "react-bootstrap/Modal";
import CustomDatePicker from "../components/CustomDatePicker";
import Select from "../components/Select";
import AddExpenseValidation from "../validation/AddExpenseValidation";
import { FaUsers } from "react-icons/fa";
import CustomModal from "../components/CustomModal";
import SummaryCard from "../components/SummaryCard";
import { toast } from "react-toastify";

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
    const [viewMembersModal, setViewMembersModal] = useState(false);

    const [totalExpenseAmount, setTotalExpenseAmount] = useState();
    const [memberBalances, setMemberBalances] = useState([]);

    const [page, setPage] = useState(0);
    const [nonMembersPage, setNonMembersPage] = useState(0);
    const [pagination, setPagination] = useState({
        first: true,
        last: false,
        currentPage: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [emailSearch, setEmailSearch] = useState();
    const [activeMenu, setActiveMenu] = useState(null);

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
    async function fetchNonMembers(email="", nonMembersPage) {
        try {
            console.log(email);
            const data = await getNonMembers(groupId, email, nonMembersPage);
            setNonMembers(data.content);
            setPagination({
                first: data.first,
                last: data.last,
                currentPage: data.number,
                totalPages: data.totalPages
            });
        } catch (error) {
            setErrors({server: error?.response?.data?.message})
        }
    }

    async function fetchTotalExpenses(groupId) {
        try {
            const response = await getTotalExpenses(groupId);
            setTotalExpenseAmount(response.data);
            console.log(response.data)
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    async function fetchMemberBalances(groupId) {
        try {
            const response = await getMemberBalances(groupId);
            setMemberBalances(response.data);
            console.log(response.data);
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    useEffect(()=>{
        fetchGroup(groupId);
        fetchMembers(groupId);
        fetchTotalExpenses(groupId);
        fetchMemberBalances(groupId);

    },[groupId])

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setNonMembersPage(0);
            fetchNonMembers(emailSearch.trim(), 0)
        },500);
        return ()=> clearTimeout(timer)
    }, [emailSearch])
    
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
            toast.success("Expense created successfully!")
        } catch (error) {
            setErrors({server:error?.response?.data?.message})
        }
    }

    async function handleAddMembers() {
        setErrors({})
        try {
            if(selectedUserIdsToAdd.length<1){
                setErrors({server :"Select atleast one user"});
                return;
            }
            console.log("handleAddMembers")
            const data = await addMembers(groupId, selectedUserIdsToAdd);
            await fetchMemberBalances(groupId);
            setMembers(prev => [...prev, ...data]);
            setSelectedUserIdsToAdd([]);
            setShowAddMembersModal(false);
            
        } catch (error) {
            setErrors({server:error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    async function handleRemoveMember( userId) {
        try {
            const data = await removeMember(groupId, userId);
            setMembers(prevMembers => prevMembers.filter(member => member.id!==data.userId))
            setMemberBalances(prevMemberBalances => prevMemberBalances.filter(memberBalance => memberBalance.userId!==userId));
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    return(
        <div className="container mt-3">
            <Button 
                className="btn-phonepe hover-scale mb-3"
                onClick={()=>navigate("/")}
            >
                <ArrowLeft /> Back
            </Button>
            <Card>
                <Card style={{backgroundColor: "#7d35c9"}}>
                    <div className="text-white px-md-1" >
                        <div className="row align-items-center gx-2 gx-md-5">
                            <div className="col-4 col-md-1">
                                {/* <FaUsers size={40}/> */}
                                <img 
                                    src="/group_icon_1.png"
                                    style={{
                                        maxWidth: "100px",
                                        borderRadius:"50%"

                                    }}
                                />
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="d-flex flex-column gap-0">
                                    <h3 className="mb-0">{groupInfo?.name}</h3>
                                    {groupInfo?.description && (
                                        <p className="mb-0 ">{groupInfo?.description}</p>
                                    )}
                                    <div className="d-flex align-items-center gap-1">
                                        <span className="d-inline d-md-none">
                                            {members?.slice(0,2).map(member =>member.name).join(", ")}
                                            {members?.length>2 &&(
                                                <span className="fw-semibold ms-1">+{members.length-2} more</span>
                                            )}
                                        </span>
                                        <span className="d-none d-md-inline">
                                            {members?.slice(0, 6).map(m => m.name).join(", ")}
                                            {members?.length > 6 && (
                                                <span className="fw-semibold ms-1">+{members.length - 6} more</span>
                                            )}
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-4 col-md-2">
                                <Button
                                    className=" btn-phonepe hover-scale"
                                    onClick={()=>{
                                        setViewMembersModal(true)
                                        fetchMembers(groupId);
                                    }}
                                >
                                    View Members
                                </Button>
                            </div> */}
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
                                fetchNonMembers();
                            }}
                        >
                            Add Members
                        </Button>
                    }
                >
                    <div className="">
                        <div className="d-none d-md-block">
                            {expenses.length === 0 ? (
                                <div colSpan={7} className="text-center py-3 text-muted"> 
                                    <img 
                                        src="/no_expensess.png"
                                        alt="No Expenses Found"
                                        style={{ maxWidth: "300px" }}
                                    />
                                </div>
                            ) : (
                                <div className="table-responsive rounded">
                                <table className="table align-middle expense-table">
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
                                            <th className="">Date</th>
                                            <th>Title</th>
                                            <th>Amount</th>
                                            <th>Payer</th>
                                            <th>Participants</th>
                                            <th>Split Type</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.length===0 ? (
                                            <tr>
                                                
                                            </tr>
                                        ): (
                                            expenses?.map((expense)=>(
                                            <tr
                                                key={expense.id}
                                                className=""
                                            >
                                                <td className="text-nowrap">
                                                    <DateFormatter date={expense.date}/>
                                                </td>
                                                <td className="fw-bold expense-description">
                                                    {expense.description}
                                                </td>
                                                <td>
                                                    ₹{expense.amount}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <div 
                                                            className="d-flex align-items-center justify-content-center rounded-circle fw-bold "
                                                            style={{
                                                                // backgroundColor:" #efe3ff",
                                                                backgroundColor: "#6e2a5700",
                                                                width:"28px",
                                                                height:"28px",
                                                            }}>
                                                            {/* <User/> */}
                                                            <CircleUserRound size={40}/>
                                                        </div>
                                                        
                                                        <span>{expense.paidBy}</span>
                                                    </div>
                                                    
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
                                        ))
                                        )}
                                        
                                        
                                    </tbody>
                                </table>
                                {hasMore && (
                                <div ref={observerTarget} style={{ height: "20px" }} />
                            )}
                            { loading && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary"/>
                                    <p className="text-muted small mt-2">Loading expenses...</p>
                                </div>
                            )}
                            {!hasMore && expenses.length > 0 && page>0 && (
                                <p className="text-center text-muted py-3">
                                    You have reached the end of the expenses.
                                </p>
                            )}
                            </div>
                            
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
                                    // fetchMembers(groupId);
                                    // setShowExpenseModal(true)
                                    navigate(`/groups/${groupId}/createExpense`)
                                }}

                            >
                                Split New Expense
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="mt-3" title="Group Summary" >
                    <div className="row g-3">
                        <div className="col-12 col-sm-6 col-lg-4">
                            <SummaryCard 
                                title="Total Amount"
                                value={`₹${totalExpenseAmount}`}
                                description="Total amount spent in this group"
                                icon={<Wallet />}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4">
                            <SummaryCard 
                                title="Total Members"
                                value={members.length}
                                description="Group participants"
                                icon={<Users />}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4">
                            <SummaryCard 
                                title="Total Expenses"
                                value={expenses.length}
                                description="Recorded transactions"
                                icon={<ReceiptPoundSterling />}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4">
                            <SummaryCard 
                                title="Total Paid"
                                value={memberBalances.find(memberBalance =>
                                    memberBalance.userId===localStorage.getItem("id")
                                    )?.totalPaid ?? 0}
                                description="Total amount you have paid for group expenses"
                                icon={<ReceiptPoundSterling />}
                            />
                        </div>
                        <div className="col-12 col-sm-6 col-lg-4">
                            <SummaryCard 
                                title="Your Share"
                                value={memberBalances.find(memberBalance =>
                                    memberBalance.userId===localStorage.getItem("id")
                                    )?.totalShare ?? 0}
                                description="Your total share of the group expenses"
                                icon={<ReceiptPoundSterling />}
                            />
                        </div>
                    </div>
                </Card>

                <Card
                    title="Member Balances"
                    className="mt-3"
                >
                    {errors.server && (
                        <div className="d-flex justify-content-center">
                            <div className="alert alert-danger text-center w-50">
                                {errors.server}
                            </div>
                        </div>
                        
                    )}
                    <div className="row g-3">
                        {memberBalances.map((member)=>(
                            <div className="col-12 col-sm-6 col-lg-4" key={member.userId}>
                                <Card
                                    className="member-balance-card"
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <CircleUserRound size={30}/>
                                            <div className="d-flex flex-column">
                                                <h6 className="fw-bold mb-0">
                                                    {member.name}
                                                </h6>
                                                <span>{member.email}</span>
                                            </div>
                                        </div>
                                        

                                        <div className="dropdown position-relative">
                                            <Button
                                                onClick={()=>{
                                                    setActiveMenu(
                                                        activeMenu===member.userId ? null : member.userId
                                                    )
                                                }}
                                            >
                                                <EllipsisVertical size={20}/>
                                            </Button>
                                            {activeMenu===member.userId && (
                                                <div
                                                    className="dropdown-menu dropdown-menu-end show p-2"
                                                    style={{
                                                        position: "absolute",
                                                        top:"100%",
                                                        right:"0%",
                                                        minWidth: "150px",
                                                        borderRadius: "10px"
                                                    }}
                                                >
                                                    <Button
                                                        onClick={()=>{
                                                            setActiveMenu(null);
                                                            handleRemoveMember(member.userId);
                                                        }}
                                                        className="dropdown-item  rounded px-2 py-1 fw-semibold"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )}
                                            
                                        </div>

                                    </div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex gap-2">
                                        <small className="text-muted">
                                            Net Balance:
                                        </small>
                                        <h5 className={`fw-bold mb-0 ${
                                            member.status === "RECEIVE"
                                                ? "text-success"
                                                : member.status === "OWES"
                                                    ? "text-danger"
                                                    : "text-secondary"
                                        }`}>
                                            ₹{Math.abs(member.netBalance).toFixed(2)}
                                        </h5>
                                    </div>
                                    <div>
                                        <span className={`balance-status ${member.status.toLowerCase()}`}>
                                            {member.status}
                                        </span>
                                    </div>
                                   
                                    
                                </div>

                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">
                                        Total Paid
                                    </span>

                                    <span className="fw-semibold">
                                        ₹{member.totalPaid.toFixed(2)}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">
                                        Total Share
                                    </span>

                                    <span className="fw-semibold">
                                        ₹{member.totalShare.toFixed(2)}
                                    </span>
                                </div>

                                </Card>

                            </div>
                        ))}
                    </div>

                </Card>
            </Card>

            <CustomModal
                show={viewMembersModal}
                onHide={()=>{
                    setViewMembersModal(false)
                    setErrors({})
                }}
                title="Group Members"
                
            >
                <div className="mx-4 mt-3">
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                        {members.map(member =>(
                            <div 
                                key={member.id}
                                className="row align-items-center mb-2 gx-4"
                            >
                                <div className="col-1">
                                    
                                    <CircleUserRound size={24} />
                                </div>
                                <div className="col-4">
                                    {member.name}
                                </div>
                                <div className="col-4">
                                    {member.email}
                                </div>
                                <div className="col-2">
                                    <Button 
                                        onClick={()=>handleRemoveMember(member.id)}
                                        className="btn-phonepe hover-scale">
                                        Remove
                                    </Button>
                                </div>
                                
                            </div>
                            
                        ))}
                </div>
                

            </CustomModal>

            <CustomModal
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
                size="lg"
                title="Create Expense"
            >
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
                            className="btn-phonepe hover-scale"
                        
                        >
                            Create
                        </Button>
                    </Modal.Footer>
                </form>
            </CustomModal>

            <CustomModal
                show={showAddMembersModal}
                onHide={()=>{
                    setShowAddMembersModal(false)
                    setSelectedUserIdsToAdd([]);
                    setErrors({})
                    setEmailSearch("");
                }}
                title="Add Members"
                // description="Add people to this group to start splitting bills together."
            >
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">
                            <div className="position-relative">
                                <Input 
                                    id="emailSearch"
                                    placeholder="Search users by name or email"
                                    type="text"
                                    value={emailSearch}
                                    onChange={(e)=>{
                                        setEmailSearch(e.target.value)
                                    }}
                                />
                                {emailSearch && (
                                    <Button
                                        className="position-absolute top-0 end-0"
                                        style={{ zIndex: 10 }}
                                        onClick={()=>setEmailSearch("")}
                                    ><CircleX size={18}/></Button>
                                )}
                            </div>
                            
                        </div>
                        {/* <div className="col-3">
                            <Button 
                                className="btn-phonepe hover-scale w-100"
                                onClick={()=>fetchNonMembers(emailSearch)}
                            >
                                Search
                            </Button>
                        </div> */}
                    </div>
                    {nonMembers.length===0 ? (
                        <div className="text-center my-5">
                            <img 
                                src="/no_users.png"
                                style={{
                                    maxWidth:"300px"
                                }}
                            />
                        </div>
                    ) : (
                        nonMembers.map((nonMember)=>{
                        return (
                            <div 
                                key={nonMember.id}
                                className=""
                            >
                                <div className="row">
                                    <div className="col-5">
                                        <span>{nonMember.name}</span>
                                    </div>
                                    
                                    <div className="col-5">
                                        <span>{nonMember.email}</span>
                                    </div>
                                    
                                    <div className="col-2">
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
                                                
                                                <UserCheck />
                                            ) : (
                                                <UserPlus />
                                            )}
                                                
                                        </Button>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        )
                    })
                    
                    )}
                    {nonMembers.length!==0 &&(
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <Button
                                className="btn-secondary"
                                disabled={pagination.first}
                                onClick={()=>{
                                    const previousPage = nonMembersPage - 1; 
                                    setNonMembersPage(previousPage)
                                    fetchNonMembers(emailSearch,previousPage)
                                }}
                            >
                                Previous
                            </Button>
                            <span>{pagination.currentPage+1}/{pagination.totalPages} Pages</span>
                            <Button
                                className="btn-primary"
                                disabled={pagination.last}
                                onClick={()=>{
                                    const nextPage = nonMembersPage + 1;
                                    setNonMembersPage(nextPage)
                                    fetchNonMembers(emailSearch,nextPage)
                                }}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                    
                </Modal.Body>
                <Modal.Footer>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <Button
                        className="btn-phonepe hover-scale"
                        onClick={handleAddMembers}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </CustomModal>
        </div>
    )
}