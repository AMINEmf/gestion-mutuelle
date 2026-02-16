import { useCallback, useEffect, useMemo, useState } from "react";

export const useMockTable = (items, onDeleteItems) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    setSelectedItems((prev) => prev.filter((id) => itemIds.includes(id)));
  }, [itemIds]);

  const handleSelectAllChange = useCallback(() => {
    setSelectedItems((prev) => (prev.length === itemIds.length ? [] : [...itemIds]));
  }, [itemIds]);

  const handleCheckboxChange = useCallback((id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (onDeleteItems && selectedItems.length > 0) {
      onDeleteItems(selectedItems);
    }
    setSelectedItems([]);
  }, [onDeleteItems, selectedItems]);

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    const nextValue = Number(event.target.value);
    setRowsPerPage(Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 10);
    setPage(0);
  }, []);

  return {
    selectedItems,
    rowsPerPage,
    page,
    handleSelectAllChange,
    handleCheckboxChange,
    handleDeleteSelected,
    handleChangePage,
    handleChangeRowsPerPage
  };
};
