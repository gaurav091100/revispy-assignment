import React, { ChangeEvent, FormEvent, useState } from 'react';
import styles from "./login.module.css";
import { Link } from 'react-router-dom';
import {API_BASE_URL} from "../../config/config";


interface UserInput {
  email: string;
  password: string;
}

const initialUserInput: UserInput = {
  email: '',
  password: '',
};
const Login = () => {
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput);
  const [showPassword,setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{login?:string, email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
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
    setErrors((prev) => ({ ...prev, [name]: "", login: ""  }));
  };

  const handleTogglePassword = () =>{
    setShowPassword(!showPassword)
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {...userInput};
       const response = await fetch(`${API_BASE_URL}/login`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(payload)
       });
       const data = await response.json();
       
      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred");
      }else{
        const {token,user } = data.result;
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user));
        window.location.href = "/categories"
        setUserInput(initialUserInput)
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
      setErrors((prevErrors)=>({...prevErrors,login:error.message as string}))
      console.error(error);
    }
  }
  return (
    <main className={styles.container}>
     <h2>Login</h2>

     <h5>Welcome back to ECOMMERCE</h5>
     <p>The next gen business marketplace</p>
     {errors.login && <p className='error text-center font-size-lg mb-4'>{errors.login}</p>}
     <form action="" onSubmit={handleSubmit}>
      <div className='form-control'>
        <label className='label' htmlFor="email">Email</label>
        <input className='input' type="email" id="email" name="email" value={userInput.email}  onChange={handleInputChange} placeholder='Enter your email'/>
        {errors.email && <p className='error'>{errors.email}</p>}
      </div>
      <div className='form-control'>
        <label className='label' htmlFor="password">Password</label>
        <div style={{position:"relative",height:"48px"}}>
        <input className='input' type={showPassword ? "text" : "password"} id="password" name="password" value={userInput.password}  onChange={handleInputChange} placeholder='Enter your password'/>
          <span onClick={handleTogglePassword} style={{position:"absolute",right:0,top:"50%",transform:"translate(-50%,-50%)"}}>{ showPassword ?  "HIDE" : "Show"}</span>
        </div>
        {errors.password && <p className='error'>{errors.password}</p>}
        
      </div>
      <button className='black-btn' type="submit">
      LOGIN
      </button>
      <p>Don’t have an Account? <Link to="/register">SIGN UP</Link></p>
     </form>
    </main>
  )
}

export default Login