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
  Select,
  InputLabel,
  MenuItem,
  Grid,
  FormControl,
} from "@mui/material";
import SidebarCostumEmpresa from "../../scenes/global/SidebarEmpresa";
import TopBar from "../../scenes/global/TopBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiUrl from "../../apiConfig";
const baseUrlPost = `${apiUrl}/agregarUsuario`;
const baseUrlPut = `${apiUrl}/editarUsuario/`;
const baseUrlDelete = `${apiUrl}/eliminarUsuario/`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpUsu`;

const UsuariosEmpresa = () => {
  const [data, setData] = useState([]);
  const empresaUsuario = localStorage.getItem("empresa");
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: empresaUsuario,
  });
  //seteo de entidad
  const [nuevaUsuario, setnuevoUsuario] = useState({
    emp_clave: empresaUsuario,
    usu_correo: "",
    usu_nombre: "",
    usu_contra: "",
    usu_tipo: "3",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevoUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  
  };

  const validateForm = () => {
    const errors = {};
    if (!nuevaUsuario.usu_nombre) {
      errors.usu_nombre = "El nombre es requerido";
    } else if (!validarNombre(nuevaUsuario.usu_nombre)) {
      errors.usu_nombre = "El nombre debe tener minimo 8 caracteres";
    }
    if (!nuevaUsuario.usu_correo) {
      errors.usu_correo = "El correo es requerido";
    } else if (!isValidEmail(nuevaUsuario.usu_correo)) {
      errors.usu_correo = "El correo electrónico no es válido";
    }
    if (!nuevaUsuario.usu_contra) {
      errors.usu_contra = "La contraseña es requerida";
    } else if (!validarContra(nuevaUsuario.usu_contra)) {
      errors.usu_contra = "La contraseña debe tener minimo 6 caracteres";
    }

    // Puedes agregar más validaciones aquí según tus necesidades
    return errors;
  };
  const isValidEmail = (email) => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validarNombre = (nombre) => {
    // Verificar que el nombre tenga al menos 8 caracteres
    return nombre.length >= 8;
  };
  const validarContra = (password) => {
    // Verificar que el nombre tenga al menos 8 caracteres
    return password.length >= 6;
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
      await axios.post(baseUrlPost, nuevaUsuario, config).then((response) => {
        setData(data.concat(response.data.result));
        abrirCerrarModalInsertar();
        setnuevoUsuario({
          emp_clave: empresaUsuario,
          usu_correo: "",
          usu_nombre: "",
          usu_contra: "",
          usu_tipo: "3",
        });
      });
    } else {
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
      .put(baseUrlPut + nuevaUsuario.usu_numctrl, nuevaUsuario, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevaUsuario.usu_numctrl === consola.usu_numctrl) {
            consola.usu_nombre = nuevaUsuario.usu_nombre;
            consola.usu_correo = nuevaUsuario.usu_correo;
            consola.usu_contra = nuevaUsuario.usu_contra;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
        setnuevoUsuario({
          emp_clave: empresaUsuario,
          usu_correo: "",
          usu_nombre: "",
          usu_contra: "",
          usu_tipo: "3",
        });
      });
    }else {
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
      .delete(baseUrlDelete + nuevaUsuario.usu_numctrl, config)
      .then((response) => {
        setData(
          data.filter(
            (consola) => consola.usu_numctrl !== nuevaUsuario.usu_numctrl
          )
        );
        abrirCerrarModalEliminar();
        setnuevoUsuario({
          emp_clave: empresaUsuario,
          usu_correo: "",
          usu_nombre: "",
          usu_contra: "",
          usu_tipo: "3",
        });
      });
      
  };

  const seleccionarUsuario = (usuario, caso) => {
    setnuevoUsuario(usuario);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionGet();
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

  const bodyInsertar = (
    <div
      style={{
        position: "absolute",
        width: 750,
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
        <h3>Agregar un Nuevo Usuario Empleado</h3>
        <TextField
          margin="normal"
          name="usu_correo"
          label="Correo"
          onChange={handleChange}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          name="usu_nombre"
          label="Nombre"
          onChange={handleChange}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          name="usu_contra"
          label="Contraseña"
          onChange={handleChange}
          autoComplete="off"
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
        width: 750,
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
        <h3>Editar Usuario</h3>
        <TextField
          margin="normal"
          name="usu_correo"
          label="Correo"
          onChange={handleChange}
          value={nuevaUsuario && nuevaUsuario.usu_correo}
        />
        <TextField
          margin="normal"
          name="usu_nombre"
          label="Nombre"
          onChange={handleChange}
          value={nuevaUsuario && nuevaUsuario.usu_nombre}
        />
        <TextField
          margin="normal"
          name="usu_contra"
          label="Contraseña"
          onChange={handleChange}
          value={nuevaUsuario && nuevaUsuario.usu_contra}
        />
        
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionPut()}
        >
          Guardar
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
        
      >
        <p>
          Estás seguro que deseas eliminar al Usuario{" "}
          <b>{nuevaUsuario && nuevaUsuario.usu_nombre}</b> ?{" "}
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
          sx={{ backgroundColor: "#084720", marginLeft: "10%" }}
          onClick={() => abrirCerrarModalEliminar()}
        >
          Cancelar
        </Button>
      </Box>
    </div>
  );

  return (
    <>
      <TopBar />
      <Grid container>
        <Grid>
          <SidebarCostumEmpresa selectedItem="Usuarios" />
        </Grid>
        <Grid sx={{ width: "90%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h4">Usuarios</Typography>
              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
            </Box>

            <TableContainer>
              <Table sx={{ border: "2px solid #ccc" }}>
                <TableHead sx={{ backgroundColor: "#084720" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>Correo</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Contraseña</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Tipo</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((consola) => (
                    <TableRow key={consola.usu_numctrl}>
                      <TableCell>{consola.usu_correo}</TableCell>
                      <TableCell>{consola.usu_nombre}</TableCell>
                      <TableCell>{consola.usu_contra}</TableCell>
                      <TableCell>{consola.usu_tipo}</TableCell>
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
export default UsuariosEmpresa;
