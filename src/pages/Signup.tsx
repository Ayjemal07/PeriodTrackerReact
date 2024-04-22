import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const url = "http://127.0.0.1:5000/api/signup";  // Adjust the URL to your backend API for signup
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
      // Assuming the signup was successful, display a success message
      setSuccessMessage('Registration successful! Please log in to continue.');
  
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login'); // Adjust as necessary
      }, 2000);
  
    } catch (error) {
      console.error('Failed to sign up:', error);
      setErrorMessage('Failed to sign up. Please try again.'); // Display error message to the user
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up Page</h1>
        <input placeholder="Email" name="email" type="email" required />
        <input placeholder="Password" name="password" type="password" required />
        <button type="submit">Sign Up</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default SignUp;
