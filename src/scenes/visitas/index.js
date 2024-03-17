import React, { useEffect, useState } from "react";
import axios from "axios";
import apiUrl from "../../apiConfig";
import SidebarCostum from "../global/Sidebar";
import { downloadExcel } from "react-export-table-to-excel";
import TopBarSupervisor from "../global/TopBarSupervisor";
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

const BuscarEmpresa = `${apiUrl}/selectEmpresa`;
const TiposDeClientesXEmpresa = `${apiUrl}/selectXempct`;
const ReporteVisitas = `${apiUrl}/ExportarReporte`;

const Visitas = () => {
  const [data, setData] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [dataTipoCliente, setDataTipoCliente] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: "",
  });
  const [aparecerBox, setaparecerBox] = useState(false);
  const [aparecerTabla, setaparecerTabla] = useState(false);
  const [dataReporte, setDataReporte] = useState({
    empresa: selectedEmpresa.empresa,
    nuevo: 0,
    tipo: "",
    inicio: "",
    fin: "",
  });

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmpresa((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setDataReporte((prevState) => ({
      ...prevState,
      empresa: value,
    }));
  };
  const handleReporte = (e) => {
    const { name, value } = e.target;
    setDataReporte((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(dataReporte);
  };

  const handleNuevoChange = (e) => {
    const { checked } = e.target;
    const value = checked ? 1 : 0;
    setDataReporte((prevState) => ({
      ...prevState,
      nuevo: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      // Realizar la petición solo si hay una empresa seleccionada
      if (selectedEmpresa.empresa) {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        try {
          const response = await axios.post(
            TiposDeClientesXEmpresa,
            selectedEmpresa,
            config
          );
          setDataTipoCliente([
            { tip_clave: "0", tip_nom: "Todos" },
            ...response.data.result,
          ]);
          setaparecerBox(true);
        } catch (error) {
          console.error("Error al obtener tipos de cliente:", error);
        }
      } else {
        setDataTipoCliente([]); // Limpiar los tipos de cliente si no hay empresa seleccionada
        setaparecerBox(false);
      }
    };

    fetchData();
  }, [selectedEmpresa]); // Ejecutar este efecto cuando selectedEmpresa cambie

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(BuscarEmpresa, config);
        setDataEmpresas(response.data.result);
      } catch (error) {
        console.error("Error al obtener empresas:", error);
      }
    };

    fetchData();
  }, []);

  const peticionPost = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.post(ReporteVisitas, dataReporte, config).then((response) => {
      setData(response.data.result);
      setaparecerTabla(true);
    });
  };
  const header = [
    "Clave Empresa",
    "Nombre Empresa",
    "Tipo Cliente",
    "Nombre",
    "Fecha Visita",
    "Clave Cliente",
    "Nombre Cliente",
    "Celular",
  ];
  function handleDownloadExcel() {
    const dataFormatted = JSON.parse(JSON.stringify(data));

    // Formatear las fechas en el array copiado
    dataFormatted.forEach((item) => {
      // Obtener la fecha en formato Date
      const date = new Date(item.vis_fecha);

      // Formatear la fecha a año-mes-día
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      // Reemplazar la fecha original con la fecha formateada
      item.vis_fecha = formattedDate;
    });
    downloadExcel({
      fileName: "reporte",
      sheet: "reporte",
      tablePayload: {
        header,
        body: dataFormatted,
      },
    });
  }

  return (
    <>
      <TopBarSupervisor />
      <Grid container>
        <Grid>
          {" "}
          <SidebarCostum selectedItem="Exportacion de Visitas"/>
        </Grid>
        <Grid sx={{width: "90%"}}>
          {" "}
          <Box m="20px">
            <Box>
              <Typography variant="h4">Exportar Visitas por empresa</Typography>
              <br />
              <Box sx={{ display: "flex" }}>
                <FormControl sx={{width: "30%"}}>
                  <InputLabel id="demo-simple-select">Empresa</InputLabel>
                  <Select
                    labelId="demo-simple-select"
                    id="demo-simple-select"
                    name="empresa"
                    onChange={handleEmpresaChange}
                    label="Empresa"
                  >
                    {dataEmpresas.map((empresa) => (
                      <MenuItem
                        key={empresa.emp_clave}
                        value={empresa.emp_clave}
                      >
                        {empresa.emp_nomcom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <br />
              {aparecerBox && (
                <Box>
                  <FormControl sx={{width: "30%"}}>
                    <InputLabel id="demo-simple-select-dos">
                      Tipo de Cliente
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-dos"
                      id="demo-simple-select-dos"
                      name="tipo"
                      onChange={handleReporte}
                      label="Tipo de Cliente"
                    >
                      {dataTipoCliente.map((tipo) => (
                        <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
                          {tipo.tip_nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography sx={{ paddingTop: "10px" }}>
                    Nuevos:
                    <input type="checkbox" onChange={handleNuevoChange} />
                  </Typography>

                  <Box sx={{ display: "flex", paddingTop: "10px" }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography sx={{ padding: "5px" }}>
                        Fecha de inicio:
                      </Typography>
                      <input
                        type="date"
                        id="fecha"
                        name="inicio"
                        onChange={handleReporte}
                      />
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography sx={{ padding: "5px" }}>
                        Fecha Final:
                      </Typography>
                      <input
                        type="date"
                        id="fecha"
                        name="fin"
                        onChange={handleReporte}
                      />
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => peticionPost()}
                    sx={{ backgroundColor: "#084720", paddingTop: "10px" }}
                  >
                    Generar
                  </Button>
                </Box>
              )}
            </Box>
            {aparecerTabla && (
              <Box>
                <Button
                  onClick={handleDownloadExcel}
                  sx={{
                    backgroundColor: "#084720",
                    paddingTop: "10px",
                    marginLeft: "85%",
                  }}
                >
                  {" "}
                  Exportar excel{" "}
                </Button>

                <TableContainer>
                  <Table sx={{ border: "2px solid #ccc" }}>
                    <TableHead sx={{ backgroundColor: "#084720" }}>
                      <TableRow>
                        <TableCell sx={{ color: "#fff" }}>
                          Clave Empresa
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Nombre Empresa
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Tipo Cliente
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Fecha Visita
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Clave Cliente
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Nombre Cliente
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((consola) => (
                        <TableRow key={consola.emp_clave}>
                          <TableCell>{consola.emp_clave}</TableCell>
                          <TableCell>{consola.emp_nomcom}</TableCell>
                          <TableCell>{consola.tip_clave}</TableCell>
                          <TableCell>{consola.tip_nom}</TableCell>
                          <TableCell>{consola.vis_fecha}</TableCell>
                          <TableCell>{consola.cli_clave}</TableCell>
                          <TableCell>{consola.cli_nomcom}</TableCell>
                          <TableCell>{consola.cli_cel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Visitas;
