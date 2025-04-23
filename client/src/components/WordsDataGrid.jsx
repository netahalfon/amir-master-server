import{ DataGrid } from "@mui/x-data-grid";

function WordsDataGrid({filteredRows, columns}) {
  return (
    <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          checkboxSelection={true}
          GridSearchIcon={true}
        />
      </div>
  )
}

export default WordsDataGrid