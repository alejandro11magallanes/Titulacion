import React, { useState, useEffect } from "react";
import SidebarCostum from "../global/Sidebar";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import TopBarSupervisor from "../global/TopBarSupervisor";
import apiUrl from "../../apiConfig";

//url de las apis
const baseUrlEmpresasSelect = `${apiUrl}/selectEmpresa`;
const baseUrlBuscarEmpresa = `${apiUrl}/LinksEmpresa`;

const QRs = () => {
  //declaraciones de useState
  const [data, setData] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: "",
  });

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmpresa((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(selectedEmpresa);
  };

  //Peticiones a la api

  const peticionGetEmpresas = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.get(baseUrlEmpresasSelect, config).then((response) => {
      setDataEmpresas(response.data.result);
    });
  };

  const peticionGet = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlBuscarEmpresa, selectedEmpresa, config)
      .then((response) => {
        console.log(response.data);
        setData([response.data.empresa]);
      });
  };



 

  useEffect(() => {
    const fetchData = async () => {
      await peticionGetEmpresas();
    };

    fetchData();
  });


 
  return (
    <>
      <TopBarSupervisor />
      <Grid container>
        <Grid>
          {" "}
          <SidebarCostum selectedItem="QRs"/>
        </Grid>
        <Grid sx={{width: "90%"}}>
          {" "}
          <Box m="20px">
            <Box sx={{ display: "flex" }}>
              <Typography variant="h3">QRs</Typography>
            </Box>
            <br />
            <Box sx={{ display: "flex", width: "40%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select">Empresa</InputLabel>
                <Select
                  labelId="demo-simple-select"
                  id="demo-simple-select"
                  name="empresa"
                  onChange={handleEmpresaChange}
                  label="Empresa"
                >
                  {dataEmpresas.map((empresa) => (
                    <MenuItem key={empresa.emp_clave} value={empresa.emp_clave}>
                      {empresa.emp_nomcom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#084720", marginLeft: "20px" }}
                onClick={() => peticionGet()}
              >
                Buscar
              </Button>
            </Box>
            <br />
            <br />
            <TableContainer>
              <Table sx={{ border: "2px solid #ccc" }}>
                <TableHead sx={{ backgroundColor: "#084720" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>Link </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((consola) => (
                    <TableRow key={consola.emp_linkagc}>
                      <TableCell>{consola.emp_linkagc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default QRs;

