import * as React from "react";
import { DataGrid } from "@mui/x-data-grid"; //import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchInput from "../search/SearchInput";
import { useState } from "react";

const columns = [
  { field: "english", headerName: "english", width: 200 },
  { field: "hebrow", headerName: "hebrow", width: 300 },
  { field: "level", headerName: "level", width: 100 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <strong>
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </button>
      </strong>
    ),
  },
];

//תוכן הטבלה
const originalRows = [
  { id: 1, english: "neta", hebrow: "נטע", level: 1 },
  { id: 2, english: "gil", hebrow: "גיל", level: 2 },
  { id: 3, english: "yali", hebrow: "יהלי", level: 3 },
];

function wordBankAdmin() {
  const [searchText, setSearchText] = useState("");

  const filteredRows = originalRows.filter((row) =>
    row.english.toLowerCase().includes(searchText.toLowerCase())||
    row.hebrow.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <SearchInput
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          checkboxSelection={true}
          GridSearchIcon={true}
        />
      </div>
    </>
  );
}

export default wordBankAdmin;
