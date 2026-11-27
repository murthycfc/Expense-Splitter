import { useEffect, useState, useRef } from "react"
import { createGroup, deleteGroup, loadGroups, updateGroup } from "../api/apis";
import Card from "../components/Card";
import Button from "../components/Button";
import { Calendar, Edit, EllipsisVertical, Eye, PlusIcon, Search, Trash, Users } from "lucide-react";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import GroupValidation from "../validation/addGroupValidation";
import DateFormatter from "../utils/DateFormatter";
import CustomModal from "../components/CustomModal";
import { FaUser, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import BreadCrumb from "../components/Breadcrumb";

export default function Groups(){
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});
    const [deletingGroup, setDeletingGroup] = useState();
    const [updatingGroupId, setupdatingGroupId] = useState(null);
    const [groupName, setGroupName] = useState();
    const [activeMenu, setActiveMenu] = useState(null);
    
    const [group, setGroup] = useState({
        name:"",
        description: ""
    })

    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerTarget = useRef(null);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    async function fetchGroups(groupName,page) {
        try {
            
            setLoading(true)
            const data = await loadGroups(groupName, page);
            setGroups(prev => page===0 ? data.content : [...prev, ...data.content]);
            setHasMore(!data.last);
            console.log(data);
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"});
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchGroups("",page);
    },[page])

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

    useEffect(()=>{
        const handleClickOutside = (event) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                console.log("askjabc");
                setActiveMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[]);

    function handleCreateGroup(){
        setupdatingGroupId(null);
        setErrors({});
        setShowGroupModal(true);
        
    }

    async function handleGroupSubmit(e) {
        e.preventDefault();
        setErrors({});
        const valiadationErrors = GroupValidation(group.name);
        console.log(valiadationErrors);
        if(Object.keys(valiadationErrors).length>0){
            console.log(valiadationErrors);
            setErrors(valiadationErrors);
            return;
        }
        try {
            if(updatingGroupId){
                const data = await updateGroup(updatingGroupId,group);
                setGroups(prev => prev.map(item => 
                    item.id===updatingGroupId ? data : item));
                toast.success("Group updated successfully")
                console.log("updated");
            }
            else {
                const data = await createGroup(group);
                setGroups(prev =>([
                    data,
                    ...prev
                ]));
                toast.success("Group created successfully")
            }
            
            setShowGroupModal(false);
            setupdatingGroupId(null);
            setGroup({
                name:"",
                description: ""
            })
            setErrors({});
        } catch (error) {
            setErrors({server: error?.response?.data?.message ?? "Something went wrong"})
        }
    }

    
    function handleChange(e){
        const {id, value} = e.target;
        setGroup({
            ...group,
            [id]: value
        })
        setErrors(prev =>({
            ...prev,
            [id]: ""
        }))
    }

    function handleView(groupId){
        navigate(`/groups/${groupId}/view`);
    }

    function handleEdit(e, group){
        e.stopPropagation();
        setGroup({
            name: group.name,
            description: group.description || ""
        })
        setupdatingGroupId(group.id);
        console.log("handleEdit");
        setErrors({});
        setShowGroupModal(true);
    }

    function handleDelete(e, group){
        e.stopPropagation();
        setShowDeleteModal(true);
        setDeletingGroup(group);
    }

    async function confirmDelete(group) {
        try {
            const data = await deleteGroup(group.id);
            
            setGroups(prev => 
                prev.filter(item => item.id!==group.id)
            )
            setShowDeleteModal(false);
            setDeletingGroup(null);

        } catch (error) {
            setErrors({server: error?.response?.data?.message})
        }
    }

    

    return (
        <div className="container my-4">
            <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center ">
                    <div className="d-flex align-items-center gap-3">
                        <div>
                            <img 
                                src="/groupsimg.png"
                                style={{maxWidth:"150px"}}
                            />
                        </div>
                        <div className="d-flex flex-column gap-2">
                            <h5 className=" mb-0 fw-bold">Groups</h5>
                            <span className="text-muted small d-none d-md-block">
                                Manage your groups and keep your expenses organized
                            </span>
                                <Button 
                                    className=" btn-phonepe hover-scale d-inline-flex align-items-center gap-1 align-self-end d-md-none "
                                    onClick={handleCreateGroup}
                                >
                                    <PlusIcon/> Create Group
                                </Button>
                            

                        </div>
                    </div>
                    {/* <Button 
                        className="btn-phonepe hover-scale d-inline-flex align-items-center gap-1 d-md-none"
                        onClick={handleCreateGroup}
                    >
                        <PlusIcon/> Create Group
                    </Button> */}
                </div>
                    {/* <Card> */}
                        <div className="row g-3 align-items-center">
                            <div className="col-9 col-md-6 ">
                                <Input 
                                    id="name"
                                    type="text"
                                    placeholder="Search groups by name"
                                    value={groupName}
                                    onChange={(e)=>{
                                        setGroupName(e.target.value);
                                    }}
                                    height={48}
                                    containerClassName="mb-0"
                                    startIcon={<Search size={20} className="text-muted"/>}
                                />
                                
                            </div>
                            <div className="col-3 col-md-2">
                                <Button 
                                    className="btn-phonepe hover-scale  px-3 py-2 px-md-4"
                                    onClick={()=>fetchGroups(groupName,0)}
                                >
                                    Search
                                </Button>
                            </div>
                            <div className="d-none d-md-block col-md-4 text-md-end">
                                    <Button 
                                        className="btn-phonepe hover-scale d-inline-flex align-items-center gap-1 me-1"
                                        onClick={handleCreateGroup}
                                    >
                                        <PlusIcon/> Create Group
                                    </Button>
                            </div>
                        </div>
                    {/* </Card> */}
                    
                    <Card>
                        {groups.length === 0 && (
                            <div className="text-center py-3">
                                <img 
                                    src="/no_groups.png"
                                    alt="No Groups Found"
                                    style={{ maxWidth: "300px" }}
                                />
                            </div>
                        )}
                        <div className="row g-3" ref={dropdownRef}>
                            {groups.map((group) => (
                                // console.log(group.totalMembers)
                                <div className="col-12 col-md-6 col-xl-4" key={group.id} >
                                    <Card
                                        onClick={() => handleView(group.id)}
                                        className={`group-card h-100  ${activeMenu===group.id ? "active-dropdown-card": ""}` }
                                        style={{
                                            background: "#FCFAFF"                                            
                                        }}
                                    >
                                        <div className="d-flex flex-column gap-1 h-100">
                                            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                                                <div className="d-flex gap-2">
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            backgroundColor: "#732dbd",
                                                            fontSize: "20px"
                                                        }}
                                                    >
                                                        {/* {group.name?.trim().charAt(0).toUpperCase()} */}
                                                        <img 
                                                            src="/kedarnath.png"
                                                            style={{
                                                                maxWidth:"50px"
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="d-flex flex-column">
                                                        <h6 className="fw-bold mb-1">
                                                            {group.name}
                                                        </h6>
                                                        <p
                                                            className="text-muted mb-0 group-description"
                                                            title={group.description}
                                                        >
                                                            {group.description || ""}
                                                        </p>
                                                        
                                                        
                                                    </div>

                                                </div>
                                                <div className="dropdown position-relative" >
                                                    <Button
                                                        className=" p-1"
                                                        onClick={(e)=>{
                                                            e.stopPropagation();
                                                            setActiveMenu(
                                                                activeMenu === group.id ? null : group.id
                                                            )
                                                        }}
                                                    >
                                                        <EllipsisVertical />
                                                    </Button>
                                                    {activeMenu === group.id && (
                                                        <div
                                                            onClick={(e)=>e.stopPropagation()}
                                                            className="dropdown-menu dropdown-menu-end show shadow border-0 p-2"
                                                            style={{
                                                                position: "absolute",
                                                                top: "100%",
                                                                right: 0,
                                                                minWidth: "150px",
                                                                borderRadius: "10px"
                                                            }}
                                                        >
                                                            <Button
                                                                onClick={(e) => {
                                                                    setActiveMenu(null);
                                                                    handleEdit(e, group)}
                                                                }
                                                                className="dropdown-item dropdown-edit-item rounded px-2 py-1 d-flex align-items-center gap-2 fw-semibold mb-2"
                                                            >
                                                                <Edit size={22} /> Edit
                                                            </Button>
                                                            <Button
                                                                className="dropdown-item dropdown-delete-item rounded px-2 py-1 d-flex align-items-center gap-2 fw-semibold"
                                                                onClick={(e) => {
                                                                    setActiveMenu(null);
                                                                    handleDelete(e, group)}
                                                                }
                                                            >
                                                                <Trash size={22} />Delete
                                                                
                                                            </Button>
                                                            {/* </div> */}
                                                            
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center gap-2 mb-0">
                                                <div className="d-flex  gap-2 align-items-center px-3 rounded-pill " style={{
                                                    backgroundColor:"#F1E9FA",
                                                    color: "#5F259F"
                                                }}>
                                                    <span className="" style={{
                                                        color:"#5F259F"
                                                    }}><FaUsers size={24}/> </span>
                                                    <span className="fs-4">{group.totalMembers}</span>
                                                    <span>Members</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2" style={{color: "#77717E"}}>
                                                    <span><Calendar /></span>
                                                    <div className="d-flex flex-column">
                                                        <span>Created on</span>
                                                        <DateFormatter
                                                            date={group?.createdAt?.split("T")[0]}
                                                        />
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            

                                        </div>
                                    </Card>
                                </div>
                            ))}
                            
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
                        {!hasMore && groups.length > 0 && page>0 && (
                            <p className="text-center text-muted py-3">
                                You have reached the end of the groups.
                            </p>
                        )}
                    </Card>
                </div>


            <CustomModal 
                show={showGroupModal}
                onHide={()=> {
                    setupdatingGroupId(null)
                    setShowGroupModal(false)
                    setGroup({
                        name:"",
                        description:""
                    })
                    setErrors({})
                }}
                title={updatingGroupId ? "Update Group" : "Create Group"}
            >
                <form onSubmit={
                    handleGroupSubmit}>
                    <Modal.Body>
                        <div className="row ">
                            <div className="col-12 ">
                                <Input 
                                    id="name"
                                    placeholder="Enter group name"
                                    type="text"
                                    required
                                    label="Name"
                                    error={errors.name}
                                    value={group.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <Textarea 
                                    id="description"
                                    placeholder="Enter group description"
                                    label="Description"
                                    value={group.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        {errors.server && (
                            <div className="alert alert-danger">
                                {errors.server}
                            </div>
                        ) }
                        <Button
                            className="btn-phonepe hover-scale"
                        >
                            {updatingGroupId ? "Update" : "Create"}
                        </Button>
                    </Modal.Footer>
                </form>
            </CustomModal>
            
            <CustomModal
                show={showDeleteModal}
                onHide={()=> {
                    setShowDeleteModal(false)
                    setErrors({})
                    setDeletingGroup(null)
                }}
                title="Delete Group"
            >
                <Modal.Body>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <p>Are you sure want to delete group: {deletingGroup?.name}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btn-danger"
                        onClick={()=>confirmDelete(deletingGroup)}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </CustomModal>

        </div>
    )
}