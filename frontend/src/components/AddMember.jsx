import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { addUser } from "../api/apis";
import addMemberValidation from "../validation/addMemberValidation";

export default function AddMember({onUserAdded}){
    const [registerData, setRegisterData] = useState({
        name:"",
        email:""
    });
    const [errors, setErrors] = useState({});

    function handleChange(e){
        const {id, value} = e.target;
        setRegisterData({
            ...registerData,
            [id]: value
        });
        setErrors(prev =>({
            ...prev,
            [id]: ""
        }))
    }


    async function handleSubmit(e) {
        
        e.preventDefault();
        setErrors({});
        const validationErrors = addMemberValidation(registerData.name, registerData.email)
        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return ;
        }
        try {
            console.log(registerData);
            const data = await addUser(registerData);
            onUserAdded(data);
        } catch (error) {
            setErrors({server: error.response.data.message})
        }
        finally{
            setRegisterData({
                name:"",
                email:""
            });
        }
    }
    
    return (
        <div className="container mb-4">
            <div className="d-flex flex-column">
                {errors.server && (
                    <div className="alert alert-danger">
                        {errors.server}
                    </div>
                )}
                <h3>Add Member</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <Input 
                                id="name"
                                placeholder="Enter name"
                                type="text"
                                label="Name" 
                                style={{width:"400px"}}
                                required
                                error={errors.name}
                                value={registerData.name} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input 
                                id="email"
                                placeholder="Enter email address"
                                type="email"
                                style={{width:"400px"}}
                                required
                                label="Email" 
                                error={errors.email}
                                value={registerData.email} 
                                onChange={handleChange}
                            />
                        </div>
                        
                        
                    </div>
                    <div>
                        <Button
                            className="btn btn-primary"
                        >+ Add Member
                        </Button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}