import { Link } from 'react-router-dom';
import { useAuth } from '../auth/UserAuth';

function Navbar() {
    const isLoggedIn = useAuth()?.isLoggedIn;
    const logout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
       
        window.location.href = '/'; 

    };
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {isLoggedIn && <Link to="/periodtracker">PeriodTracker</Link>}
                {isLoggedIn ? (
                    <button onClick={logout}>Sign out</button>
                ) : (
                    <>
                        <Link to="/login"><button>Login</button></Link>
                
                        <Link to="/signup"><button>Sign Up</button></Link>
                    </>

                )}
        </nav>
    );
}

export default Navbar;