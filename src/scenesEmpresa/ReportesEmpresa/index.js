import React, { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import SidebarCostumEmpresa from "../../scenes/global/SidebarEmpresa";
import { downloadExcel } from "react-export-table-to-excel";
import TopBar from "../../scenes/global/TopBar";
import axios from "axios";
import apiUrl from "../../apiConfig";
const BuscarEmpresa = `${apiUrl}/selectEmpresa`;
const TiposDeClientesXEmpresa = `${apiUrl}/selectXempct`;
const EmpleadosXEmpresa = `${apiUrl}/selectXempusu`;
const ReporteVisitas = `${apiUrl}/ReporteUsu`;
const ReportesEmpresa = () => {
  const [data, setData] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const empresaUsuario = localStorage.getItem("empresa");
  const [contador, setContador] = useState(0);
  const [dataTipoCliente, setDataTipoCliente] = useState([]);
  const [dataEmpleado, setDataEmpleado] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: empresaUsuario,
  });
  const [aparecerBox, setaparecerBox] = useState(false);
  const [aparecerTabla, setaparecerTabla] = useState(false);
  const [aparecerTablaDos, setaparecerTablaDos] = useState(false);
  const [dataReporte, setDataReporte] = useState({
    empresa: empresaUsuario,
    nuevo: 0,
    usuario: "",
    tipo: "",
    inicio: "",
    fin: "",
  });
  const [generatingReport, setGeneratingReport] = useState(false);

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
      if (selectedEmpresa.empresa) {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          // Realizar ambas peticiones al mismo tiempo
          const [tiposClientesResponse, empleadosResponse] = await Promise.all([
            axios.post(TiposDeClientesXEmpresa, selectedEmpresa, config),
            axios.post(EmpleadosXEmpresa, selectedEmpresa, config),
          ]);

          // Procesar la respuesta de tipos de clientes
          setDataTipoCliente([
            { tip_clave: "0", tip_nom: "Todos" },
            ...tiposClientesResponse.data.result,
          ]);
          setDataEmpleado([
            { usu_numctrl: "0", usu_nombre: "Todos" },
            ...empleadosResponse.data.result,
          ]);

          setaparecerBox(true);

          // Procesar la respuesta de empleados
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      } else {
        setDataTipoCliente([]); // Limpiar los tipos de cliente si no hay empresa seleccionada
        setDataEmpleado([]); // Limpiar los empleados si no hay empresa seleccionada
        setaparecerBox(false);
      }
    };

    fetchData();
  }, [selectedEmpresa]);
  const validateForm = () => {
    const errors = {};
    if (!dataReporte.usuario) {
      errors.usuario = "El usuario es requerido";
    }
    if (!dataReporte.tipo) {
      errors.tipo = "El tipo de cliente es requerido";
    }
    if (!dataReporte.inicio) {
      errors.inicio = "La fecha inicial es requerida";
    }
    if (!dataReporte.fin) {
      errors.fin = "La fecha final es requerida";
    }
    // Puedes agregar más validaciones aquí según tus necesidades
    return errors;
  };
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

      fetchData();
    };
  }, []);

  const peticionPost = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const token = localStorage.getItem("token"); // Obtener el token de localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
        },
      };
      setGeneratingReport(true);
      try {
        await axios
          .post(ReporteVisitas, dataReporte, config)
          .then((response) => {
            setData(response.data.result);
            setContador(response.data.contador);
            if (dataReporte.tipo != 0) {
              setaparecerTabla(true);
            } else {
              setaparecerTablaDos(true);
            }
            console.log(response.data.result);
          });
      } catch (error) {
        console.error("Error al generar reporte:", error);
      } finally {
        setGeneratingReport(false);
      }
    } else {
      alert(Object.values(errors).join("\n"));
    }
  };

  const handleDownloadExcel = (header) => {
    // Copia profunda del array de datos
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
  };

  const handleDownloadExcelDos = (header) => {
    downloadExcel({
      fileName: "reporte",
      sheet: "reporte",
      tablePayload: {
        header,
        body: data,
      },
    });
  };
  const handleNewReport = () => {
    setaparecerTabla(false);
    setaparecerTablaDos(false);
    setData([]);
    setContador(0);
    window.location.reload();
  };
  return (
    <>
      <TopBar />
      <Grid container>
        <Grid>
          {" "}
          <SidebarCostumEmpresa selectedItem="Reportes" />
        </Grid>
        <Grid sx={{ width: "75%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box>
              <Typography variant="h4">Exportar Visitas por empresa</Typography>
              <br />

              <Box sx={{ width: "50%" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-dos">Empleado</InputLabel>
                  <Select
                    labelId="demo-simple-select-dos"
                    id="demo-simple-select-dos"
                    name="usuario"
                    onChange={handleReporte}
                    label="Empleado"
                  >
                    {dataEmpleado.map((tipo) => (
                      <MenuItem key={tipo.usu_numctrl} value={tipo.usu_numctrl}>
                        {tipo.usu_nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <br />
                <br />
                <FormControl fullWidth>
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
                <br />
                <Button
                  variant="contained"
                  disabled={generatingReport}
                  onClick={() => peticionPost()}
                  sx={{ backgroundColor: "#084720" }}
                >
                  Generar
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNewReport}
                  sx={{
                    backgroundColor: "#084720",
                    marginLeft: "40px",
                    visibility:
                      aparecerTabla || aparecerTablaDos ? "visible" : "hidden",
                  }}
                >
                  Nuevo Reporte
                </Button>
              </Box>
            </Box>
            {aparecerTabla && (
              <Box sx={{ width: "100%" }}>
                <Button
                  onClick={() =>
                    handleDownloadExcel([
                      "Fecha",
                      "Nombre Cliente",
                      "Celular",
                      "Tipo Cliente",
                    ])
                  }
                  sx={{
                    backgroundColor: "#084720",
                    paddingTop: "10px",
                    marginLeft: "85%",
                    color: "#fff",
                  }}
                >
                  {" "}
                  Exportar excel{" "}
                </Button>
                <Typography>Numero de Visitas: {contador}</Typography>
                <TableContainer>
                  <Table sx={{ border: "2px solid #ccc" }}>
                    <TableHead sx={{ backgroundColor: "#084720" }}>
                      <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Fecha</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Nombre Cliente
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Tipo Cliente
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((consola) => (
                        <TableRow key={consola.vis_fecha}>
                          <TableCell>{consola.vis_fecha}</TableCell>
                          <TableCell>{consola.cli_nomcom}</TableCell>
                          <TableCell>{consola.cli_cel}</TableCell>
                          <TableCell>{consola.tip_nom}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {aparecerTablaDos && (
              <Box>
                <Button
                  onClick={() => handleDownloadExcelDos(["Usuario", "Visitas"])}
                  sx={{
                    backgroundColor: "#084720",
                    paddingTop: "10px",
                    marginLeft: "85%",
                    color: "#fff",
                  }}
                >
                  {" "}
                  Exportar excel{" "}
                </Button>
                <Typography>Numero de Visitas: {contador}</Typography>
                <TableContainer>
                  <Table sx={{ border: "2px solid #ccc", width: "40%" }}>
                    <TableHead sx={{ backgroundColor: "#084720" }}>
                      <TableRow>
                        <TableCell sx={{ color: "#fff" }}>Usuario</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Visitas</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((consola) => (
                        <TableRow key={consola.usu_nombre}>
                          <TableCell>{consola.usu_nombre}</TableCell>
                          <TableCell>{consola.visitas}</TableCell>
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
export default ReportesEmpresa;
