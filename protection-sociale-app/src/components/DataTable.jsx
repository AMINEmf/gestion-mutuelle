export default function DataTable({ columns = [], data = [], onRowClick }) {
  const tableStyle = {
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    borderCollapse: 'separate',
    borderSpacing: 0
  };

  const headerStyle = {
    backgroundColor: '#f2f2f2',
    color: '#4b5563',
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
    whiteSpace: 'nowrap'
  };

  const cellStyle = {
    fontSize: '0.875rem',
    padding: '12px 16px',
    color: '#2c3e50',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd'
  };

  return (
    <div className="table-responsive" style={{ borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ ...headerStyle, width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ ...cellStyle, textAlign: 'center', color: '#6b7280', padding: '32px' }}>
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                style={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={cellStyle}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
