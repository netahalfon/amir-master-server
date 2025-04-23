// components/AdminDataGrid.jsx
import React from "react";
import { Pencil } from "lucide-react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function AdminDataGrid({ rows, onEdit, selectedRows, onToggleRow }) {
  return (
    <div className="border rounded p-2">
      <Table hover responsive>
        <thead className="align-middle">
          <tr>
            <th>
              <Form.Check type="checkbox" disabled />
            </th>
            <th>Hebrew</th>
            <th>English</th>
            <th>Level</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => onToggleRow(row.id)}
                />
              </td>
              <td>{row.hebrew}</td>
              <td>{row.english}</td>
              <td>{row.level}</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => onEdit(row)}
                  className="p-0"
                >
                  <Pencil size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminDataGrid;
