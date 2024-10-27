import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from "./register.module.css";
import { Link, useNavigate } from 'react-router-dom';
import {API_BASE_URL} from "../../config/config";


interface UserInput {
  name: string;
  email: string;
  password: string;
}

const initialUserInput: UserInput = {
  name: '',
  email: '',
  password: '',
};
const Register = () => {
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput);
  const [errors, setErrors] = useState<{register?:string, name?: string; email?: string; password?: string }>({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!userInput.name) newErrors.name = 'Name is required.';
    if (!userInput.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userInput.email)) {
      newErrors.email = 'Email format is invalid.';
    }
    if (!userInput.password) {
      newErrors.password = 'Password is required.';
    } else if (userInput.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", register: ""  })); // Clear error for the current field
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      const payload = { ...userInput };
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
       
      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }else{
        console.log(`Redirecting to verify-email/${userInput.email}`);
        navigate(`/verify-email/${userInput.email}`)
        setUserInput(initialUserInput)
      }
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      setErrors((prevErrors)=>({...prevErrors,register:error.message as string}))
      console.error(error);
    }
  };


  return (
    <main className={styles.container}>
     <h2>Create your account</h2>
     {errors.register && <p className='error text-center font-size-lg mb-4'>{errors.register}</p>}
     <form action="" onSubmit={handleSubmit}>
      <div className='form-control'>
        <label className='label' htmlFor="name">Name</label>
        <input className='input' type="text" id="name" name="name" value={userInput.name} onChange={handleInputChange} placeholder='Enter your name'/>
        {errors.name && <p className='error'>{errors.name}</p>}
      </div>
      <div className='form-control'>
        <label className='label' htmlFor="email">Email</label>
        <input className='input' type="email" id="email" name="email" value={userInput.email}  onChange={handleInputChange} placeholder='Enter your email'/>
        {errors.email && <p className='error'>{errors.email}</p>}
      </div>
      <div className='form-control'>
        <label className='label' htmlFor="password">Password</label>
        <input className='input' type="password" id="password" name="password" value={userInput.password}  onChange={handleInputChange} placeholder='Enter your password'/>
        {errors.password && <p className='error'>{errors.password}</p>}
      </div>
      <button className='black-btn' type="submit">
      CREATE ACCOUNT
      </button>

      <p>Have an Account? <Link to="/login">LOGIN</Link></p>
     </form>
    </main>
  )
}

export default Register