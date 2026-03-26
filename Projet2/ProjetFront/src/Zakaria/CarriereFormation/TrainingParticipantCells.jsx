import React from "react";

export const getStatusBadgeClass = (status) => {
  if (status === "Termine") return "success";
  if (status === "En cours") return "info";
  return "warning";
};

export const StatusBadge = ({ status }) => (
  <span className={`career-badge ${getStatusBadgeClass(status)}`}>
    {status || "—"}
  </span>
);

export const AttestationUpload = ({ onUpload }) => (
  <div className="career-upload" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
    <input
      type="file"
      className="form-control form-control-sm"
      style={{ maxWidth: "130px" }}
      onChange={onUpload}
    />
    <button type="button" className="btn btn-sm btn-light">
      Uploader
    </button>
  </div>
);
