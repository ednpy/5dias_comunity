import React from 'react';
import Sidebar from '../components/Sidebar';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import PowerBIEmbed from '../components/elements/PowerBIEmbed';
import { useMediaQuery } from 'react-responsive';

const BigDataPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const noticeCards = (
        <>
            <div className="notice-card order-2 lg:order-none" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div className="card mt-1" style={{ border: '5px solid white' }}>
                    <div className="image">
                        <img src='/page_1.jpg' alt='Portada del día' className='image' style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'block', margin: '0 auto' }}/>                    
                    </div>
                    <div className="content">
                        <a href='#' target="_blank">
                            <span className="title">Diario Digital del día.</span>
                        </a> 
                        <br></br>
                        <p className="text-sm text-gray-600 mt-2">Lee el diario del día y mantente informado.</p>
                        <a className="action" href='#' target="_blank">
                            Ver
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="notice-card order-2 lg:order-none" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div className="card mt-1" style={{ border: '5px solid white' }}>
                    <div className="image">
                        <img src='/boletin_estadistico.png' alt='Boletín Estadístico' className='image' style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'block', margin: '0 auto' }}/>                    
                    </div>
                    <div className="content">
                        <a href='#' target="_blank">
                            <span className="title">Último Boletín Estadístico.</span>
                        </a> 
                        <br></br>
                        <p className="text-sm text-gray-600 mt-2">Descarga el último boletín estadístico del BCP con información procesada y puesta a disposición para una lectura clara y directa.</p>
                        <a className="action" href='#' target="_blank">
                            Descargar
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );

    const powerBIEmbed = (
        <div className='col-span-1 lg:col-span-4 order-1 lg:order-none'>
            <div className='bg-[#7e559b] rounded-lg p-4 flex items-center mb-4'>
                <svg className='w-6 h-6 text-yellow-500 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'></path>
                </svg>
                <p className='text-white'>Le recomendamos visualizar los informes PowerBI desde una PC y no desde su celular.</p>
            </div>
            <PowerBIEmbed url="https://app.powerbi.com/view?r=eyJrIjoiYTYwNzNmZTMtODZiMi00YmVmLWEwNjEtYzI4YjJkZDhlN2ZhIiwidCI6IjhmZjBkZDEyLWYzMjYtNDAyMi1hOWM1LTkwZTNhNWVjZDQzMiIsImMiOjR9" />
        </div>
    );

    return (
        <div className='grid grid-cols-1 gap-6'>
            {isMobile ? (
                <>
                    {noticeCards}
                    {powerBIEmbed}
                </>
            ) : (
                <>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
                        {noticeCards}
                    </div>
                    {powerBIEmbed}
                </>
            )}
        </div>
    );
};

export default BigDataPage;