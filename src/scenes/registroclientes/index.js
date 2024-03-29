import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCostum from "../global/Sidebar";
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
  Modal,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiUrl from "../../apiConfig";
import TopBarSupervisor from "../global/TopBarSupervisor";
//url de las apis

const baseUrlPost = `${apiUrl}/agregarCliente`;
const baseUrlPut = `${apiUrl}/editarCliente/`;
const baseUrlDelete = `${apiUrl}/eliminarCliente/`;
const baseUrlEmpresasSelect = `${apiUrl}/selectEmpresa`;
const baseUrlTipoSelect = `${apiUrl}/selectXempct`;
const baseUrlCampanaSelect = `${apiUrl}/selectXempcam`;
const baseUrlSucursalSelect = `${apiUrl}/selectXempsuc`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpCli`;

const Clientes = () => {
  //declaraciones de useState
  const [data, setData] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [dataTipoCli, setDataTipoCli] = useState([]);
  const [dataCampana, setDataCampana] = useState([]);
  const [dataSucursal, setDataSucursal] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: "",
  });
  const id = localStorage.getItem("id");
  //seteo de entidad
  const [nuevoCliente, setnuevoCliente] = useState({
    emp_clave: "",
    tip_clave: "",
    cli_nomcom: "",
    cli_cel: "",
    cli_correo: "",
    cam_clave: "",
    usu_numctrl: id,
    suc_clave: "",
  });
  //cierro seteo de entidad

  //construccion de entidad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(nuevoCliente);
  };
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
  const peticionGetCampanas = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlCampanaSelect, selectedEmpresa, config)
      .then((response) => {
        setDataCampana(response.data.result);
      });
  };
  const peticionGetSucursales = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlSucursalSelect, selectedEmpresa, config)
      .then((response) => {
        setDataSucursal(response.data.result);
      });
  };
  const peticionGetTipoCli = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlTipoSelect, selectedEmpresa, config)
      .then((response) => {
        setDataTipoCli(response.data.result);
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
        setData(response.data.result);
      });
  };

  const peticionPost = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.post(baseUrlPost, nuevoCliente, config).then((response) => {
      setData(data.concat(response.data.result));
      abrirCerrarModalInsertar();
    });
  };

  const peticionPut = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios
      .put(baseUrlPut + nuevoCliente.cli_clave, nuevoCliente, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevoCliente.cli_clave === consola.cli_clave) {
            consola.cli_nomcom = nuevoCliente.cli_nomcom;
            consola.tip_clave = nuevoCliente.tip_clave;
            consola.cli_cel = nuevoCliente.cli_cel;
            consola.cli_correo = nuevoCliente.cli_correo;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
      });
  };

  const peticionDelete = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios
      .delete(baseUrlDelete + nuevoCliente.cli_clave, config)
      .then((response) => {
        setData(
          data.filter((consola) => consola.cli_clave !== nuevoCliente.cli_clave)
        );
        abrirCerrarModalEliminar();
      });
  };
  //cierro peticiones a la api
  //efectos de modal
  const seleccionarUsuario = (usuario, caso) => {
    setnuevoCliente(usuario);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionGetEmpresas();
    };

    fetchData();
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };
  //cierro efectos de modal
  //construccion de modal

  const bodyInsertar = (
    <div
      style={{
        position: "absolute",
        width: 500,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
      >
        <h3>Agregar un Nuevo Cliente</h3>

        <TextField
          margin="normal"
          name="cli_nomcom"
          label="Nombre"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="cli_correo"
          label="Correo"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="cli_cel"
          label="Celular"
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select">Empresa</InputLabel>
          <Select
            labelId="demo-simple-select"
            id="demo-simple-select"
            name="emp_clave"
            onChange={handleChange}
            label="Empresa"
          >
            {dataEmpresas.map((empresa) => (
              <MenuItem key={empresa.emp_clave} value={empresa.emp_clave}>
                {empresa.emp_nomcom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-dos">Tipo de Cliente</InputLabel>
          <Select
            labelId="demo-simple-select-dos"
            id="demo-simple-select-dos"
            name="tip_clave"
            onChange={handleChange}
            label="Tipo de Cliente"
          >
            {dataTipoCli.map((tipo) => (
              <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
                {tipo.tip_nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select">Campaña</InputLabel>
          <Select
            labelId="demo-simple-select"
            id="demo-simple-select"
            name="cam_clave"
            onChange={handleChange}
            label="Empresa"
          >
            {dataCampana.map((empresa) => (
              <MenuItem key={empresa.cam_clave} value={empresa.cam_clave}>
                {empresa.cam_nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select">Sucursal</InputLabel>
          <Select
            labelId="demo-simple-select"
            id="demo-simple-select"
            name="suc_clave"
            onChange={handleChange}
            label="Empresa"
          >
            {dataSucursal.map((empresa) => (
              <MenuItem key={empresa.suc_clave} value={empresa.suc_clave}>
                {empresa.suc_nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionPost()}
        >
          Insertar
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Cancelar
        </Button>
      </Box>
    </div>
  );

  const bodyEditar = (
    <div
      style={{
        position: "absolute",
        width: 500,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
      >
        <h3>Editar Cliente</h3>
        <TextField
          margin="normal"
          name="cli_nomcom"
          label="Nombre"
          onChange={handleChange}
          value={nuevoCliente && nuevoCliente.cli_nomcom}
        />
        <TextField
          margin="normal"
          name="cli_correo"
          label="Correo"
          onChange={handleChange}
          value={nuevoCliente && nuevoCliente.cli_correo}
        />
        <TextField
          margin="normal"
          name="cli_cel"
          label="Celular"
          onChange={handleChange}
          value={nuevoCliente && nuevoCliente.cli_cel}
        />
        <br />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-dos">Tipo de Cliente</InputLabel>
          <Select
            labelId="demo-simple-select-dos"
            id="demo-simple-select-dos"
            name="tip_clave"
            onChange={handleChange}
            label="Tipo de Cliente"
          >
            {dataTipoCli.map((tipo) => (
              <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
                {tipo.tip_nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionPut()}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => abrirCerrarModalEditar()}
        >
          Cancelar
        </Button>
      </Box>
    </div>
  );

  const bodyEliminar = (
    <div
      div
      style={{
        position: "absolute",
        width: 500,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
      >
        <p>
          Estás seguro que deseas eliminar al Cliente{" "}
          <b>{nuevoCliente && nuevoCliente.cli_nomcom}</b> ?{" "}
        </p>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionDelete()}
        >
          Si
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => abrirCerrarModalEliminar()}
        >
          Cancelar
        </Button>
      </Box>
    </div>
  );
  //cierro construccion de modal
  return (
    <>
      <TopBarSupervisor />
      <Grid container>
        <Grid>
          {" "}
          <SidebarCostum selectedItem="Clientes"/>
        </Grid>
        <Grid sx={{width: "90%"}}>
          {" "}
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h3">Clientes</Typography>
              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
            </Box>
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
                    <TableCell sx={{ color: "#fff" }}>Clave</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Cliente</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Celular</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Tipo</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((consola) => (
                    <TableRow key={consola.cli_clave}>
                      <TableCell>{consola.cli_clave}</TableCell>
                      <TableCell>{consola.cli_nomcom}</TableCell>
                      <TableCell>{consola.cli_cel}</TableCell>
                      <TableCell>{consola.tip_nom}</TableCell>
                      <TableCell>
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => seleccionarUsuario(consola, "Editar")}
                        />
                        &nbsp;
                        <DeleteIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            seleccionarUsuario(consola, "Eliminar")
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
              open={modalInsertar}
              onClose={() => abrirCerrarModalInsertar()}
            >
              {bodyInsertar}
            </Modal>
            <Modal open={modalEditar} onClose={() => abrirCerrarModalEditar()}>
              {bodyEditar}
            </Modal>
            <Modal
              open={modalEliminar}
              onClose={() => abrirCerrarModalEliminar()}
            >
              {bodyEliminar}
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Clientes;
