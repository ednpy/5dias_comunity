// frontend/src/components/PowerBIEmbed.jsx
import React from 'react';

const PowerBIEmbed = ({url}) => {
    return (
        <div className='powerbi-embed'>
            <iframe
                src={url}
                width="100%"
                height="600px"
                frameBorder="0"
                allowFullScreen={true}
                title="PowerBI Report"
            ></iframe>
        </div>
    );
};

export default PowerBIEmbed;