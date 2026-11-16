import { useEffect, useState, useRef } from "react"
import { createGroup, deleteGroup, loadGroups, updateGroup } from "../api/apis";
import Card from "../components/Card";
import Button from "../components/Button";
import { Edit, EllipsisVertical, Eye, PlusIcon, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import GroupValidation from "../validation/addGroupValidation";
import DateFormatter from "../utils/DateFormatter";
import CustomModal from "../components/CustomModal";
import { FaUser, FaUsers } from "react-icons/fa";

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
            }
            else {
                const data = await createGroup(group);
                setGroups(prev =>([
                    data,
                    ...prev
                ]));
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
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div style={{backgroundColor:"#5F259F"}} className="text-white p-2 rounded-3">
                            <FaUsers size={30} />
                        </div>
                        <div>
                            <h5 className=" mb-0 fw-bold">Groups</h5>
                            <span className="text-muted small">
                                Manage your groups and keep your expenses organized
                            </span>
                        </div>
                    </div>
                    <Button 
                        className="btn-phonepe hover-scale d-inline-flex align-items-center gap-1"
                        onClick={handleCreateGroup}
                    >
                        <PlusIcon/> Create Group
                    </Button>
                </div>
                    <Card>
                        <div className="row g-3">
                            <div className="col-8 col-md-10 ">
                                <Input 
                                    id="name"
                                    type="text"
                                    placeholder="Search groups by name"
                                    value={groupName}
                                    onChange={(e)=>{
                                        setGroupName(e.target.value);
                                    }}
                                    containerClassName="mb-0"
                                />
                            </div>
                            <div className="col-4 col-md-2">
                                <Button 
                                    className="btn-phonepe hover-scale  px-3 px-md-4"
                                    onClick={()=>fetchGroups(groupName,0)}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </Card>
                    
                    <Card>
                        {groups.length === 0 && (
                            <div className="text-center py-3">
                                <div 
                                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                    style={{ width: "56px", height: "56px", backgroundColor: "#f3e8ff", color: "#5F259F" }}
                                >
                                    <FaUsers size={26} />
                                </div>
                                <h6 className="fw-bold mb-1">No groups found</h6>
                                <p className="text-muted small mb-0">
                                    {groupName 
                                        ? `No groups matched "${groupName}". Try a different search.` 
                                        : "You don't have any groups yet. Click 'Create Group' to get started."}
                                </p>
                            </div>
                        )}
                        <div className="row g-3">
                            {groups.map((group) => (
                                <div className="col-12 col-md-6 col-xl-3" key={group.id}>
                                    <Card
                                        onClick={() => handleView(group.id)}
                                        className={`group-card h-100  ${activeMenu===group.id ? "active-dropdown-card": ""}` }
                                        style={{
                                            backgroundColor:"#FCFAFF"
                                        }}
                                    >
                                        <div className="d-flex flex-column h-100">
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
                                                        {group.name?.trim().charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="d-flex flex-column">
                                                        <h6 className="fw-bold mb-1">
                                                            {group.name}
                                                        </h6>
                                                        <p
                                                            className="text-muted mb-0 group-description"
                                                            title={group.description}
                                                        >
                                                            {group.description || "No description"}
                                                        </p>
                                                        
                                                    </div>

                                                </div>
                                                <div className="dropdown position-relative">
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
                                                                className="dropdown-item bg-primary-subtle text-primary rounded px-2 py-1 d-flex align-items-center gap-2 fw-semibold mb-2"
                                                            >
                                                                <Edit size={22} /> Edit
                                                            </Button>
                                                            <Button
                                                                className="dropdown-item bg-danger-subtle text-danger rounded px-2 py-1 d-flex align-items-center gap-2 fw-semibold"
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

                                            <div className="flex-grow-1 mb-0">
                                                 <small className="text-muted d-flex align-items-center gap-1 flex-wrap">
                                                    <span>Created on</span>
                                                    <DateFormatter
                                                        date={group?.createdAt?.split("T")[0]}
                                                    />
                                                </small>
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
                        {!hasMore && groups.length > 0 && (
                            <p className="text-center text-muted py-3">
                                You have reached the end of the expenses.
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