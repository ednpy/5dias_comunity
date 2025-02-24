import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const RequestPasswordResetPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/request-password-reset", { email });
            toast.success("Link de restauración enviado a tu correo");
            setEmail("");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className='text-center text-3xl font-extrabold text-gray-900'>Resetear Contraseña</h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
                <div className='bg-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='input input-bordered w-full bg-white'
                            required
                        />
                        <button type='submit' className='btn btn-primary w-full text-white' disabled={isLoading}>
                            {isLoading ? <Loader className='animate-spin' /> : "Enviar link de reseteo"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestPasswordResetPage;