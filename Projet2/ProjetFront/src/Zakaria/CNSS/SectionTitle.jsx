import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * SectionTitle component to unify titles across CNSS modules
 * Mirroring the style of "Gestion Employé"
 */
const SectionTitle = ({ icon, text, iconComponent: IconComponent }) => {
    return (
        <span className="section-title mb-1" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c767c' }}>
            {IconComponent ? (
                <IconComponent className="me-2" style={{
                    background: 'linear-gradient(135deg, #2c767c 0%, #3a8a90 100%)',
                    padding: '6px',
                    borderRadius: '50%',
                    color: 'white',
                    width: '28px',
                    height: '28px'
                }} />
            ) : icon ? (
                <i className={`${icon} me-2`} style={{
                    color: 'rgba(8, 179, 173, 0.02)', // Matches Style.css
                    background: 'linear-gradient(135deg, #2c767c 0%, #3a8a90 100%)',
                    padding: '6px',
                    borderRadius: '50%',
                }}></i>
            ) : null}
            {text}
        </span>
    );
};

export default SectionTitle;
