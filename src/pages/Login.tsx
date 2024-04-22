import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/UserAuth';


const Login = () => {
  const navigate = useNavigate();
  const  {setToken}  = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevents the default form submission behavior
  
      const email = e.target.email.value;
      const password = e.target.password.value;
  
      const url = "http://127.0.0.1:5000/api/login";
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      };
  
      try {
        const res = await fetch(url, options);
        if (!res.ok) { // Check if the response status code is not OK (e.g., 401, 500)
          throw new Error(`Error: ${res.status}`); // Throw an error with the status
        }
        const data = await res.json();
        setToken?.(data.token);
        console.log(data.token)
        // Handle success here
        setSuccessMessage('Login successful! Redirecting to PeriodTracker...');
  
        // Redirect to PeriodTracker after 2 seconds
        setTimeout(() => {
          navigate('/periodtracker'); // Use the path to your PeriodTracker page
        }, 2000);
  
      } catch (error) {
        console.error('Failed to login:', error);
        setErrorMessage('Failed to login. Please try again.'); // Display error message to the user
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Login Page</h1>
          <input placeholder="email" name="email" type="email" />
          <input placeholder="Password" name="password" type="password" />
          <button type="submit">Login</button>
        </form>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    );
  };
  
  export default Login;