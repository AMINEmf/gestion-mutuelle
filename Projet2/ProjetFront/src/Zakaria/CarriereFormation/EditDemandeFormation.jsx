import React from "react";
import AddDemandeFormation from "./AddDemandeFormation";

const EditDemandeFormation = ({ demande, employees, departements, formations, onSubmit, onCancel }) => {
  return (
    <AddDemandeFormation
      mode="edit"
      demande={demande}
      employees={employees}
      departements={departements}
      formations={formations}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default EditDemandeFormation;
