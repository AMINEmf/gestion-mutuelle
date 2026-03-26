import React from "react";
import AddDemandeMobilite from "./AddDemandeMobilite";

const EditDemandeMobilite = ({ demande, employees, postes, departements, onSubmit, onCancel }) => {
  return (
    <AddDemandeMobilite
      mode="edit"
      demande={demande}
      employees={employees}
      postes={postes}
      departements={departements}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default EditDemandeMobilite;
