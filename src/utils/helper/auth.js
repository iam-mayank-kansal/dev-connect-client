import axios from "axios";

export function getUserProfile() {
    const user = axios.get('http://localhost:8080/devconnect/user/profile', { withCredentials: true });
    console.log(user);
    return user;
}

const handleLogout = async () => {
    try {
        await axios.post('http://localhost:8080/devconnect/auth/logout', {}, { withCredentials: true });
        // After a successful server response, update the UI state
        // setUser(null);
        // setDropdownOpen(false);
        // You might also want to redirect the user
        // router.push('/login');
    } catch (error) {
        console.error("Logout failed", error);
    }
};