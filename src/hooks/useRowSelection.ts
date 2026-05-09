import { useState } from 'react';

export function useRowSelection() {
  const [selectedRows, setSelectedRows] = useState({});

  const selectedRowsId = Object.keys(selectedRows);

  const clearSelectedRows = () => {
    setSelectedRows({});
  };

  return {
    selectedRows,
    selectedRowsId,
    clearSelectedRows,
    setSelectedRows,
  };
}
