import React from 'react';

const Card = ({ title, content, icon }) => {
    return (
        <div className="p-4 shadow-md rounded-md" style={{ backgroundColor: '#E2D9D2' }}>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div style={{height: '100px', margin: 'auto' }}>
            <p className='' style={{ text: '#E2D9D2' }}>{content}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h2>{icon}</h2>
            </div>
        </div>
    );
};

export default Card;