import React from 'react';
import { Box, Typography } from '@mui/material';
import { Form } from 'react-bootstrap';

const formatDate = (d) => (d ? d : '');

const EmployeInfoReadonly = ({ employeInfo = {} }) => {
  const info = employeInfo || {};

  return (
    <Box sx={{ px: 0 }}>
      {/* CIN | Date de naissance */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 1.5 }}>
        <Form.Group>
          <Form.Label style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>CIN</Form.Label>
          <Form.Control 
            value={info.cin || ''} 
            disabled 
            readOnly 
            style={{ 
              backgroundColor: '#f9fafb',
              borderColor: '#e5e7eb',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Date de naissance</Form.Label>
          <Form.Control 
            value={formatDate(info.date_naiss)} 
            disabled 
            readOnly 
            style={{ 
              backgroundColor: '#f9fafb',
              borderColor: '#e5e7eb',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}
          />
        </Form.Group>
      </Box>

      {/* Situation familiale | Date d'embauche */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 1.5 }}>
        <Form.Group>
          <Form.Label style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Situation familiale</Form.Label>
          <Form.Control 
            value={info.situation_fm || ''} 
            disabled 
            readOnly 
            style={{ 
              backgroundColor: '#f9fafb',
              borderColor: '#e5e7eb',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Date d'embauche</Form.Label>
          <Form.Control 
            value={formatDate(info.date_embauche)} 
            disabled 
            readOnly 
            style={{ 
              backgroundColor: '#f9fafb',
              borderColor: '#e5e7eb',
              color: '#4b5563',
              fontSize: '0.875rem'
            }}
          />
        </Form.Group>
      </Box>

      {/* Adresse - pleine largeur */}
      <Form.Group>
        <Form.Label style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>Adresse</Form.Label>
        <Form.Control 
          value={info.adresse || ''} 
          disabled 
          readOnly 
          style={{ 
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            color: '#4b5563',
            fontSize: '0.875rem'
          }}
        />
      </Form.Group>
    </Box>
  );
};

export default EmployeInfoReadonly;
