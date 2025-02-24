import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            toast.success("Password reset successfully");
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className='text-center text-3xl font-extrabold text-gray-900'>Reset Password</h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
                <div className='bg-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='input input-bordered w-full bg-white'
                            required
                        />
                        <button type='submit' className='btn btn-primary w-full text-white' disabled={loading}>
                            {loading ? "Loading..." : "Cambiar Contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;