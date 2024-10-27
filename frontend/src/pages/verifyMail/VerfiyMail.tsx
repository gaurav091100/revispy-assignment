import React, { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import styles from './verfiyMail.module.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import { hideEmail } from '../../utils/hideEmail';
import {API_BASE_URL} from "../../config/config";

const VerifyMail: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(8).fill('')); // 8 input fields
  const [errors, setErrors] = useState<{verify?:string }>({});

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for input elements

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {emailId}:any  = useParams();
  

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow a single digit
    if (!/^\d*$/.test(value)) return;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors((prev) => ({ ...prev, verify: ""  }));
    // Move to next input if filled
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullOtp = otp.join('');
   
    try {
        const payload = {
            otp : fullOtp,
            email:emailId
        };
         const response = await fetch(`${API_BASE_URL}/verify-otp`,{
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
          navigate("/login")
        }
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        setErrors((prevErrors)=>({...prevErrors,verfiy:error.message as string}))
        console.error(error);
      }
  };

  return (
    <main className={styles.container}>
      <h2>Verify your email</h2>
      <p>Enter the 8 digit code you have received on <br />  
      {hideEmail(emailId)}
      </p>

      {errors.verify && <p className='error text-center font-size-lg mb-4'>{errors.verify}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.otpContainer}>
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className={styles.otpInput}
              maxLength={1} // Only allow one character
            />
          ))}
        </div>
        <button className="black-btn" type="submit">VERIFY OTP</button>
      </form>
    </main>
  );
};

export default VerifyMail;
