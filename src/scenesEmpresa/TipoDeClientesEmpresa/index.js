import React, { useEffect, useState } from "react";
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
  Grid,
} from "@mui/material";
import SidebarCostumEmpresa from "../../scenes/global/SidebarEmpresa";
import TopBar from "../../scenes/global/TopBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiUrl from "../../apiConfig";

const baseUrlPost = `${apiUrl}/agregarTipoCli`;
const baseUrlPut = `${apiUrl}/editarTipoCli/`;
const baseUrlDelete = `${apiUrl}/eliminarTipoCli/`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpTipCli`;

const TiposDeClienteEmpresa = () => {
  const [data, setData] = useState([]);
  const empresaUsuario = localStorage.getItem("empresa");
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [selectedEmpresa] = useState({
    empresa: empresaUsuario,
  });

  const [modalEliminar, setModalEliminar] = useState(false);
  //seteo de entidad
  const [nuevoTipoUsuario, setnuevoTipoUsuario] = useState({
    emp_clave: empresaUsuario,
    tip_nom: "",
    tip_desc: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoTipoUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!nuevoTipoUsuario.tip_nom) {
      errors.tip_nom = "El nombre es requerido";
    }
    if (!nuevoTipoUsuario.tip_desc) {
      errors.tip_desc = "La descripción es requerida";
    } 
    return errors;
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
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.post(baseUrlPost, nuevoTipoUsuario, config).then((response) => {
      setData(data.concat(response.data.result));
      abrirCerrarModalInsertar();
      setnuevoTipoUsuario({
        emp_clave: empresaUsuario,
        tip_nom: "",
        tip_desc: "",
      })
    });}
    else{
        alert(Object.values(errors).join("\n"));
    }
  };

  const peticionPut = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
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
        setnuevoTipoUsuario({
            emp_clave: empresaUsuario,
            tip_nom: "",
            tip_desc: "",
          })
      });}
      else{
        alert(Object.values(errors).join("\n"));
      }
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
        setnuevoTipoUsuario({
            emp_clave: empresaUsuario,
            tip_nom: "",
            tip_desc: "",
          })
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
      await peticionGet();
    };

    fetchData();
  });

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
        <h3>Agregar Tipo de Cliente</h3>
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
        <h3>Editar Tipo de Cliente</h3>
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
          Estás seguro que deseas eliminar el Tipo de Cliente{" "}
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
      <TopBar />
      <Grid container>
        <Grid>
          <SidebarCostumEmpresa selectedItem="Tipos de Cliente" />
        </Grid>
        <Grid sx={{ width: "90%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h4">Tipos de Clientes</Typography>
              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
            </Box>

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
export default TiposDeClienteEmpresa;
