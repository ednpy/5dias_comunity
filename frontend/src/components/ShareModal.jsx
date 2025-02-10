import React, { useState } from 'react';

const ShareModal = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-4 rounded-lg shadow-lg'>
                <h2 className='text-lg font-semibold mb-4'>Comparte éste Post</h2>
                <input
                    type='text'
                    value={url}
                    readOnly
                    className='w-full p-2 border border-gray-300 rounded mb-4'
                />
                <button
                    onClick={handleCopy}
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
                >
                    Copiar URL
                </button>
                <button
                    onClick={onClose}
                    className='ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300'
                >
                    Cerrar
                </button>
                {copied && <p className='mt-4 text-green-500'>URL copiada al portapapeles!</p>}
            </div>
        </div>
    );
};

export default ShareModal;