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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import SidebarCostumEmpresa from "../../scenes/global/SidebarEmpresa";
import TopBar from "../../scenes/global/TopBar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiUrl from "../../apiConfig";

const baseUrlPost = `${apiUrl}/agregarCliente`;
const baseUrlPut = `${apiUrl}/editarCliente/`;
const baseUrlDelete = `${apiUrl}/eliminarCliente/`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpCli`;
const baseUrlTiposdeClienteEmpresa = `${apiUrl}/selectXempct`;
const baseUrlSucursalesEmpresa = `${apiUrl}/selectXempsuc`;
const baseUrlCampanasEmpresa = `${apiUrl}/selectXempcam`;

const ClientesEmpresa = () => {
  const [data, setData] = useState([]);
  const [dataTipoCli, setDataTipoCli] = useState([]);
  const [dataCampana, setDataCampana] = useState([]);
  const [dataSucursal, setDataSucursal] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const empresaUsuario = localStorage.getItem("empresa");
  const [selectedEmpresa] = useState({
    empresa: empresaUsuario,
  });
  const id = localStorage.getItem("id");
  //seteo de entidad
  const [nuevoCliente, setnuevoCliente] = useState({
    emp_clave: empresaUsuario,
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

  //peticiones para llenar los select en base a la empresa

  const peticionGetCampanas = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlCampanasEmpresa, selectedEmpresa, config)
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
      .post(baseUrlSucursalesEmpresa, selectedEmpresa, config)
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
      .post(baseUrlTiposdeClienteEmpresa, selectedEmpresa, config)
      .then((response) => {
        setDataTipoCli(response.data.result);
      });
  };
  //peticiones de crud normal
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

  const validateForm = () => {
    const errors = {};
    if (!nuevoCliente.cli_nomcom) {
      errors.usu_nombre = "El nombre es requerido";
    } else if (!validarNombre(nuevoCliente.cli_nomcom)) {
      errors.cli_nomcom = "El nombre debe tener minimo 8 caracteres";
    }
    if (!nuevoCliente.cli_correo) {
      errors.usu_correo = "El correo es requerido";
    } else if (!isValidEmail(nuevoCliente.cli_correo)) {
      errors.cli_correo = "El correo electrónico no es válido";
    }
    if (!nuevoCliente.cli_cel) {
      errors.cli_cel = "El celular es requerido";
    } else if(!validarTelefono(nuevoCliente.cli_cel)){
        errors.cli_cel = "El numero debe de tener 10 digitos";
    }
    if (!nuevoCliente.tip_clave || !nuevoCliente.suc_clave || !nuevoCliente.cam_clave) {
        errors.tip_clave = "Por favor completa todos los campos";
        
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
  const validarTelefono = (telefono) => {
    // Verificar que el teléfono tenga 10 dígitos
    return /^\d{10}$/.test(telefono);
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
    await axios.post(baseUrlPost, nuevoCliente, config).then((response) => {
      setData(data.concat(response.data.result));
      abrirCerrarModalInsertar();
      setnuevoCliente({
        emp_clave: empresaUsuario,
        tip_clave: "",
        cli_nomcom: "",
        cli_cel: "",
        cli_correo: "",
        cam_clave: "",
        usu_numctrl: id,
        suc_clave: "",
      });
    });}
    else{
        alert(Object.values(errors).join("\n"));
    }
  };

  const peticionPut = async () => {

    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    try{
      await axios
      .put(baseUrlPut + nuevoCliente.cli_clave, nuevoCliente, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevoCliente.cli_clave === consola.cli_clave) {
            consola.cli_nomcom = nuevoCliente.cli_nomcom;
            consola.cli_cel = nuevoCliente.cli_cel;
            consola.cli_correo = nuevoCliente.cli_correo;
          }
        });
        setData(dataNueva);
        
        setnuevoCliente({
            emp_clave: empresaUsuario,
            tip_clave: "",
            cli_nomcom: "",
            cli_cel: "",
            cli_correo: "",
            cam_clave: "",
            usu_numctrl: id,
            suc_clave: "",
          });
      });
      abrirCerrarModalEditar();
    }
    catch(error){
      console.log(error);
      abrirCerrarModalEditar();
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
      .delete(baseUrlDelete + nuevoCliente.cli_clave, config)
      .then((response) => {
        setData(
          data.filter((consola) => consola.cli_clave !== nuevoCliente.cli_clave)
        );
       
        setnuevoCliente({
            emp_clave: empresaUsuario,
            tip_clave: "",
            cli_nomcom: "",
            cli_cel: "",
            cli_correo: "",
            cam_clave: "",
            usu_numctrl: id,
            suc_clave: "",
          });
      });
  };
  //cierro peticiones a la api
  //efectos de modal
  

  useEffect(() => {
    const fetchData = async () => {
      await peticionGet();
      await peticionGetCampanas();
      await peticionGetSucursales();
      await peticionGetTipoCli();
    };

    fetchData();
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };
  const seleccionarUsuario =  (usuario, caso) => {
    setnuevoCliente(usuario);
    (caso === "Editar")&&setModalEditar(true);
 
  };
  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
 
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
        <h3>Edita al Cliente Cliente</h3>

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

       <br/>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionPut()}
        >
          Actualizar
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
  
  return (
    <>
      <TopBar />
      <Grid container>
        <Grid>
          <SidebarCostumEmpresa selectedItem="Clientes" />
        </Grid>
        <Grid sx={{ width: "90%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h4">Clientes</Typography>
              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
            </Box>

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
            <Modal
              open={modalEditar}
              onClose={() => abrirCerrarModalEditar()}
            >
              {bodyEditar}
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default ClientesEmpresa;
