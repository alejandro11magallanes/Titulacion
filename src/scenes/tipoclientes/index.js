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
import TopBarSupervisor from "../global/TopBarSupervisor";
import apiUrl from "../../apiConfig";

//url de las apis
const baseUrl = `${apiUrl}/verTipoCli`;
const baseUrlPost = `${apiUrl}/agregarTipoCli`;
const baseUrlPut = `${apiUrl}//editarTipoCli/`;
const baseUrlDelete = `${apiUrl}/eliminarTipoCli/`;
const baseUrlEmpresasSelect = `${apiUrl}/selectEmpresa`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpTipCli`;

const TipoClientes = () => {
  //declaraciones de useState
  const [data, setData] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: "",
  });

  const [modalEliminar, setModalEliminar] = useState(false);
  //seteo de entidad
  const [nuevoTipoUsuario, setnuevoTipoUsuario] = useState({
    emp_clave: "",
    tip_nom: "",
    tip_desc: "",
  });
  //cierro seteo de entidad

  //construccion de entidad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoTipoUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(nuevoTipoUsuario);
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
    await axios.post(baseUrlPost, nuevoTipoUsuario, config).then((response) => {
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
      .put(baseUrlPut + nuevoTipoUsuario.tip_clave, nuevoTipoUsuario, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevoTipoUsuario.tip_clave === consola.tip_clave) {
            consola.tip_nom = nuevoTipoUsuario.tip_nom;
            consola.tip_desc = nuevoTipoUsuario.tip_desc;
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
      .delete(baseUrlDelete + nuevoTipoUsuario.tip_clave, config)
      .then((response) => {
        setData(
          data.filter(
            (consola) => consola.tip_clave !== nuevoTipoUsuario.tip_clave
          )
        );
        abrirCerrarModalEliminar();
      });
  };
  //cierro peticiones a la api
  //efectos de modal
  const seleccionarSucursal = (sucursal, caso) => {
    setnuevoTipoUsuario(sucursal);
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
        <h3>Agregar Tipo de Usuario</h3>
        <TextField
          margin="normal"
          name="tip_nom"
          label="Nombre"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="tip_desc"
          label="Descripcion"
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
        <h3>Editar Tipo de Usuario</h3>
        <TextField
          margin="normal"
          name="tip_nom"
          label="Nombre"
          onChange={handleChange}
          value={nuevoTipoUsuario && nuevoTipoUsuario.tip_nom}
        />
        <TextField
          margin="normal"
          name="tip_desc"
          label="Descuento"
          onChange={handleChange}
          value={nuevoTipoUsuario && nuevoTipoUsuario.tip_desc}
        />
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
          Estás seguro que deseas eliminar el Tipo de Usuario{" "}
          <b>{nuevoTipoUsuario && nuevoTipoUsuario.tip_nom}</b> ?{" "}
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
          <SidebarCostum selectedItem="Tipo de Cliente"/>
        </Grid>
        <Grid sx={{width: "90%"}}>
          {" "}
          <Box m="20px">
            <Box sx={{ display: "flex" }}>
              <Typography variant="h3">Tipo De Cliente</Typography>

              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
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
                    <TableCell sx={{ color: "#fff" }}>Clave</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((consola) => (
                    <TableRow key={consola.tip_clave}>
                      <TableCell>{consola.tip_clave}</TableCell>
                      <TableCell>{consola.tip_nom}</TableCell>
                      <TableCell>
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => seleccionarSucursal(consola, "Editar")}
                        />
                        &nbsp;
                        <DeleteIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            seleccionarSucursal(consola, "Eliminar")
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
export default TipoClientes;
