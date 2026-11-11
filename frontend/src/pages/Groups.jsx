import { useEffect, useState } from "react"
import { createGroup, deleteGroup, loadGroups, updateGroup } from "../api/apis";
import Card from "../components/Card";
import Button from "../components/Button";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import GroupValidation from "../validation/addGroupValidation";

export default function Groups(){
    const [groups, setGroups] = useState([]);
    const [errors, setErrors] = useState({});
    const [deletingGroup, setDeletingGroup] = useState();
    const [updatingGroupId, setupdatingGroupId] = useState(null);
    
    
    const [group, setGroup] = useState({
        name:"",
        description: ""
    })

    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();

    async function fetchGroups() {
        try {
            const data = await loadGroups();
            setGroups(data);
            console.log(data);
        } catch (error) {
            setErrors({server: error.response.data.message});
        }
    }
    useEffect(()=>{
        fetchGroups();
    },[])

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
            <Card 
                title="Groups"
                className="mt-3 px-2"
                action={
                    <Button 
                        className="btn-phonepe mb-3 hover-scale px-2"
                        onClick={handleCreateGroup}
                    >
                        + Create Group
                    </Button>
                }
            >
                <div className="d-flex flex-column">
                    
                    <div className="table-responsive border rounded">
                        <table className="table table-striped align-middle table-hover groups-table">
                            <colgroup>
                                <col className="group-name-col"/>
                                <col className="group-description-col"/>
                                <col className="group-actions-col"/>
                            </colgroup>
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th className="description-column">Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                { groups.map((group)=>(
                                    <tr 
                                        key={group.id}
                                        onClick={()=> handleView(group.id)}
                                        style={{cursor: "pointer"}}
                                    >
                                        <td>
                                            <div className="fw-semibold">
                                                {group.name}
                                            </div>
                                            <div className="mobile-description text-muted">
                                                {group.description}
                                            </div>
                                        </td>
                                        <td className="description-column">
                                            {group.description}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <Button 
                                                    className="text-primary p-1 hover-scale"
                                                    onClick={(e)=> handleEdit(e, group)}
                                                >
                                                    <Edit/>
                                                </Button>
                                                <Button 
                                                    className="text-danger p-1 hover-scale"
                                                    onClick={(e)=> handleDelete(e, group)}
                                                >
                                                    <Trash />
                                                </Button>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            <Modal
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
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{updatingGroupId ? "Update Group" : "Create Group"} </Modal.Title>
                </Modal.Header>
                <form onSubmit={
                    handleGroupSubmit}>
                    <Modal.Body>
                        <div className="row ">
                            <div className="col-12 col-md-6 ">
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
                            <div className="col-12 col-md-6">
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
                            type="button"
                            className="btn-secondary"
                            onClick={()=>{
                                setupdatingGroupId(null)
                                setShowGroupModal(false)
                                setGroup({
                                    name:"",
                                    description:""
                                })
                                setErrors({})
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="btn-phonepe"
                        >
                            {updatingGroupId ? "Update" : "Create"}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal
                show={showDeleteModal}
                onHide={()=> {
                    setShowDeleteModal(false)
                    setErrors({})
                    setDeletingGroup(null)
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Group</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {errors.server && (
                        <div className="alert alert-danger">
                            {errors.server}
                        </div>
                    )}
                    <p>Are you sure want to delete group {deletingGroup?.name}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btn-secondary"
                        onClick={()=> {
                            setShowDeleteModal(false)
                            setErrors({})
                            setDeletingGroup(null)
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="btn-danger"
                        onClick={()=>confirmDelete(deletingGroup)}
                    >
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>

        </div>
    )
}