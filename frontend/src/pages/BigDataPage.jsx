import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import PowerBIEmbed from '../components/elements/PowerBIEmbed';
import { useMediaQuery } from 'react-responsive';

const BigDataPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const [latestFile, setLatestFile] = useState({ url_flipbook: '#', url_img: '/page_1.jpg' });

    useEffect(() => {
        const fetchLatestFile = async () => {
            try {
                const response = await axiosInstance.get(`/issued/latest-file`);
                setLatestFile(response.data);
            } catch (error) {
                console.error('Error fetching latest file:', error);
            }
        };

        fetchLatestFile();
    }, []);

    const NoticeCards = ({ order }) => (
        <>
            <div className={`notice-card order-${order} lg:order-none`} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
                <div className="card mt-1" style={{ border: '5px solid white' }}>
                    <div className="image">
                        <img src={latestFile.url_img} alt='Portada del día' className='image' style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'block', margin: '0 auto' }}/>                    
                    </div>
                    <div className="content">
                        <a href={latestFile.url_flipbook} target="_blank">
                            <span className="title">Diario Digital del día.</span>
                        </a> 
                        <br></br>
                        <p className="text-sm text-gray-600 mt-2">Lee el diario del día y mantente informado.</p>
                        <a className="action" href={latestFile.url_flipbook} target="_blank">
                            Ver
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className={`notice-card order-${order} lg:order-none`} style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
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

    const PowerBIEmbedComponent = ({ order }) => (
        <div className={`col-span-1 lg:col-span-4 order-${order} lg:order-none`}>
            <div className='bg-[#7e559b] rounded-lg p-4 flex items-center mb-4'>
                <svg className='w-6 h-6 text-yellow-500 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z'></path>
                </svg>
                <p className='text-white'>Le recomendamos visualizar los informes PowerBI desde una PC y no desde su celular.</p>
            </div>
            <h1>ACTIVO - PASIVO - PATRIMONIO NETO</h1>
            <PowerBIEmbed url="https://app.powerbi.com/view?r=eyJrIjoiYzA5NzlmMDktYjE3MS00YmRkLWFhNmMtNWQ4MDI0MzVlM2M4IiwidCI6IjhmZjBkZDEyLWYzMjYtNDAyMi1hOWM1LTkwZTNhNWVjZDQzMiIsImMiOjR9" />
        </div>
    );

    return (
        <div className='grid grid-cols-1 gap-6'>
            {isMobile ? (
                <>
                    <NoticeCards order={1} />
                    <PowerBIEmbedComponent order={1} />
                </>
            ) : (
                <>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4'>
                        <NoticeCards order={1} />
                    </div>

                    <PowerBIEmbedComponent order={1} />
                </>
            )}
        </div>
    );
};

export default BigDataPage;