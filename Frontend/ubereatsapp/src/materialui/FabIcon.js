import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function FabIcon() {
  return (
    <Fab 
      style={{ 
        backgroundColor: 'transparent',  // Remove background
        border: 'none',                  // Remove border
        boxShadow: 'none'                // Remove default shadow (often looks like a border)
      }}
    >
      <AddIcon />
    </Fab>
  );
}
