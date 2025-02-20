import React from 'react';
import Sidebar from '../components/Sidebar';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const BigDataPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>
            <div className='col-span-1 lg:col-span-3'>
                <h1>Hola BigData</h1>
            </div>
        </div>
    );
};

export default BigDataPage;