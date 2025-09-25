import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ActionModal from '../components/ActionModal';
import '../cssFiles/config.css';

function Configuration({ apiData }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);

  const rows = useMemo(() => {
    return Object.entries(apiData).map(([endpoint, logs]) => {
      const firstCall = logs[logs.length - 1];
      const startDate = firstCall?.timestamp
        ? new Date(firstCall.timestamp).toLocaleString()
        : 'Unknown';

      return { name: endpoint, startDate };
    });
  }, [apiData]);

  const handleOpenModal = (apiName) => {
    setSelectedApi(apiName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedApi(null);
  };

  return (
    <>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow className="table-header">
              <TableCell className="table-cell">API Name</TableCell>
              <TableCell className="table-cell">Start Date</TableCell>
              <TableCell className="table-cell" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} className="table-row">
                <TableCell className="table-cell">{row.name}</TableCell>
                <TableCell className="table-cell">{row.startDate}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenModal(row.name)}
                    title="Configure API"
                    className="icon-button"
                  >
                    <MoreVertIcon className="icon-white" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ActionModal
        open={openModal}
        endpoint={selectedApi}
        handleClose={handleCloseModal}
        onSave={(settings) => {
          console.log(`Settings for ${selectedApi}:`, settings);
          handleCloseModal();
        }}
      />
    </>
  );
}

export default Configuration;
