import { styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(() => ({
  ".MuiDataGrid-cell": {
    border: "none",
  },
  "& .MuiDataGrid-row:nth-child(odd)": {
    backgroundColor: "#FFFFFF",
    fontWeight: 400,
    fontSize: 16,
    fontStyle: "normal",
    borderRadius: "4px",
    marginTop: "3px",
    height: 40,
    border: "1px solid rgba(0, 124, 161, 0.1)",
  },
  "& .MuiDataGrid-row:nth-child(even)": {
    backgroundColor: "#FFFFFF",
    fontWeight: 400,
    fontSize: 16,
    fontStyle: "normal",
    borderRadius: "4px",
    marginTop: "3px",
    height: 40,
    border: "1px solid rgba(0, 124, 161, 0.1)",
  },
  "& .MuiDataGrid-columnHeader:nth-child(even)": {
    fontWeight: 700,
    fontSize: 16,
    fontStyle: "normal",
    color: "rgba(51, 51, 51, 1)",
    borderRadius: "4px",
    height: 40,
  },
  "& .MuiDataGrid-columnHeader:nth-child(odd)": {
    fontWeight: 700,
    fontSize: 16,
    fontStyle: "normal",
    color: "rgba(51, 51, 51, 1)",
    borderRadius: "4px",
    height: 40,
    paddingLeft: -100,
  },
  "& .MuiDataGrid-columnSeparator": {
    visibility: "hidden",
  },
  "&.MuiDataGrid-root": {
    border: "none",
  },
}));

export default StyledDataGrid;
