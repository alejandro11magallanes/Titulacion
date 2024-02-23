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
  FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//url de las apis
const baseUrl = "http://localhost:5656/verUsuario";
const baseUrlPost = "http://localhost:5656/agregarUsuario";
const baseUrlPut = "http://localhost:5656/editarUsuario/";
const baseUrlDelete = "http://localhost:5656/eliminarUsuario/";
const baseUrlEmpresasSelect = "http://localhost:5656/selectEmpresa";
const baseUrlBuscarEmpresa = "http://localhost:5656/EmpUsu";



const Usuarios = () =>{
//declaraciones de useState
const [data, setData] = useState([]);
const [dataEmpresas, setDataEmpresas] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEditar, setModalEditar]=useState(false);
const [modalEliminar, setModalEliminar]=useState(false);
const [selectedEmpresa, setSelectedEmpresa] = useState({
  empresa: '',
});
//seteo de entidad
const [nuevaUsuario, setnuevoUsuario]=useState({
  emp_clave: '',
  usu_correo: '',
  usu_nombre:'',
  usu_contra: '',
  usu_estatus: true,
  usu_tipo: '',
})
//cierro seteo de entidad

//construccion de entidad 
const handleChange=e=>{
  const {name, value}=e.target;
  setnuevoUsuario(prevState=>({
    ...prevState,
    [name]: value
  }))
  console.log(nuevaUsuario);
}
const handleEmpresaChange =e => {
  const {name, value}=e.target;
  setSelectedEmpresa(prevState=>({
    ...prevState,
    [name]: value
  }))
  console.log(selectedEmpresa);
};
//Peticiones a la api

const peticionGetEmpresas = async () =>{
  const token = localStorage.getItem("token"); 
   
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  };
  await axios.get(baseUrlEmpresasSelect, config).then((response) => {
    setDataEmpresas(response.data.result);
  });
}

  const peticionGet = async () => {
    const token = localStorage.getItem("token"); 
   
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.post(baseUrlBuscarEmpresa,selectedEmpresa, config).then((response) => {
      setData(response.data.result);
    });
  };

  const peticionPost=async()=>{
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.post(baseUrlPost, nuevaUsuario, config)
    .then(response=>{
      setData(data.concat(response.data.result))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut=async()=>{
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.put(baseUrlPut+nuevaUsuario.usu_numctrl, nuevaUsuario, config)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(nuevaUsuario.usu_numctrl===consola.usu_numctrl){
          consola.usu_correo=nuevaUsuario.usu_nombre;
          consola.usu_correoemp_razon=nuevaUsuario.usu_correo;
          consola.usu_contra=nuevaUsuario.usu_contra;
          consola.usu_tipo=nuevaUsuario.usu_tipo;
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.delete(baseUrlDelete+nuevaUsuario.usu_numctrl, config)
    .then(response=>{
      setData(data.filter(consola=>consola.usu_numctrl!==nuevaUsuario.usu_numctrl));
      abrirCerrarModalEliminar();
    })
  }
//cierro peticiones a la api
//efectos de modal
const seleccionarUsuario=(usuario, caso)=>{
    setnuevoUsuario(usuario);
    (caso === 'Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(() => {
    const fetchData = async () => {
    
      await peticionGetEmpresas();
    };

    fetchData();
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }
//cierro efectos de modal
//construccion de modal

const bodyInsertar = (
  <div style={{
      position: "absolute",
      width: 500,
      backgroundColor: "white",
      border: "2px solid #ccc",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
      padding: "10px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}>
    <Box m="10px"   sx={{
      '& > :not(style)': { m: 1, width: '25ch' },
    }}
    >
      <h3>Agregar un Nuevo Usuario</h3>
      <TextField  margin="normal" name="usu_correo" label="Correo" onChange={handleChange} />
      <TextField  margin="normal" name="usu_nombre" label="Nombre" onChange={handleChange} />
      <TextField  margin="normal" name="usu_contra" label="Contraseña" onChange={handleChange}/>
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Tipo de Usuario</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name="usu_tipo"
        onChange={handleChange}
        label="Tipo de Usuario"
      >
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={3}>3</MenuItem>
      </Select>
      </FormControl>
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
      <br/>
      <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionPost()}>Insertar</Button>
      <Button variant="contained" sx={{backgroundColor: "#084720"}}   onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
     
    </Box>
  </div>
);

const bodyEditar = (
  <div style={{
      position: "absolute",
      width: 500,
      backgroundColor: "white",
      border: "2px solid #ccc",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
      padding: "10px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}>
    <Box m="10px"   sx={{
      '& > :not(style)': { m: 1, width: '25ch' },
    }}
    >
      <h3>Editar Usuario</h3>
      <TextField  margin="normal" name="usu_correo" label="Correo" onChange={handleChange} value={nuevaUsuario && nuevaUsuario.usu_correo}/>
      <TextField  margin="normal" name="usu_nombre" label="Nombre" onChange={handleChange} value={nuevaUsuario && nuevaUsuario.usu_nombre}/>
      <TextField  margin="normal" name="usu_contra" label="Contraseña" onChange={handleChange} value={nuevaUsuario && nuevaUsuario.usu_contra}/>
      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Tipo de Usuario</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name="usu_tipo"
        onChange={handleChange}
        label="Tipo de Usuario"
        value={nuevaUsuario && nuevaUsuario.usu_tipo}
      >
        <MenuItem value={2}>Empresa</MenuItem>
        <MenuItem value={3}>Empleado</MenuItem>
      </Select>
      </FormControl> 
      <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionPut()}>Editar</Button>
      <Button variant="contained" sx={{backgroundColor: "#084720"}}   onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
     
    </Box>
  </div>
);

const bodyEliminar=(
  <div div style={{
    position: "absolute",
    width: 500,
    backgroundColor: "white",
    border: "2px solid #ccc",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
    padding: "10px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }}>
  <Box m="10px"   sx={{
    '& > :not(style)': { m: 1, width: '25ch' },
  }}>
    <p>Estás seguro que deseas eliminar al Usuario <b>{nuevaUsuario && nuevaUsuario.usu_nombre}</b> ? </p>
    <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionDelete()}>Si</Button>
      <Button variant="contained" sx={{backgroundColor: "#084720"}}   onClick={() => abrirCerrarModalEliminar()}>Cancelar</Button>
      </Box>
  </div>
);
//cierro construccion de modal
return (
  <>
  <SidebarCostum/>
    <Box m="20px">
      <Box sx={{ display: "flex" }}>
        <Typography variant="h3">Usuarios</Typography>
        <Button onClick={() =>abrirCerrarModalInsertar()}>
          <AddCircleOutlineIcon fontSize="large" />
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
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
        <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionGet()}>Buscar</Button>
      </Box>
      <br/>
      <br/>
      <TableContainer>
        <Table sx={{border: "2px solid #ccc"}}>
          <TableHead sx={{backgroundColor: "#084720"}}>
            <TableRow >
              <TableCell sx={{color: "#fff"}}>Correo</TableCell>
              <TableCell sx={{color: "#fff"}}>Nombre</TableCell>
              <TableCell sx={{color: "#fff"}}>Contraseña</TableCell>
              <TableCell sx={{color: "#fff"}}>Tipo</TableCell>
              <TableCell sx={{color: "#fff"}}>Acciones</TableCell>
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
                  <EditIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarUsuario(consola, 'Editar')}/>
                  &nbsp;
                  <DeleteIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarUsuario(consola, 'Eliminar')}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalInsertar} onClose={() =>abrirCerrarModalInsertar()}>
        {bodyInsertar}
      </Modal>
      <Modal
     open={modalEditar}
     onClose={() =>abrirCerrarModalEditar()}>
        {bodyEditar}
     </Modal>
    </Box>
    <Modal
     open={modalEliminar}
     onClose={()=>abrirCerrarModalEliminar()}>
        {bodyEliminar}
     </Modal>
    </>
  );
};

export default Usuarios;