import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';

export function getUserProfile() {
    return axios.get(`${API_BASE_URL}/devconnect/user/profile`, { withCredentials: true });
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