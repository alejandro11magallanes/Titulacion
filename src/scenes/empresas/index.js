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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//url de las apis
const baseUrl = "http://localhost:5656/verEmpresa";
const baseUrlPost = "http://localhost:5656/agregarEmpresa";
const baseUrlPut = "http://localhost:5656/editarEmpresa/";
const baseUrlDelete = "http://localhost:5656/eliminarEmpresa/";


const Empresas = () => {
//declaraciones de useState
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
//seteo de entidad
  const [nuevaEpresa, setnuevaEmpresa]=useState({
    emp_nomcom: '',
    emp_razon:'',
    emp_cp: '',
    emp_calle: '',
    emp_col: '',
    emp_cd:'',
    emp_conta1: '',
    emp_cel1: '',
    emp_conta2: '',
    emp_cel2: '',
    emp_status: 1
  })
//cierro seteo de entidad

//construccion de entidad 
  const handleChange=e=>{
    const {name, value}=e.target;
    setnuevaEmpresa(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(nuevaEpresa);
  }

//cierro construccion de entidad

//Peticiones a la api
  const peticionGet = async () => {
    const token = localStorage.getItem("token"); 
   
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.get(baseUrl, config).then((response) => {
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
    await axios.post(baseUrlPost, nuevaEpresa, config)
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
    await axios.put(baseUrlPut+nuevaEpresa.emp_clave, nuevaEpresa, config)
    .then(response=>{
      var dataNueva=data;
      dataNueva.map(consola=>{
        if(nuevaEpresa.emp_clave===consola.emp_clave){
          consola.emp_nomcom=nuevaEpresa.emp_nomcom;
          consola.emp_razon=nuevaEpresa.emp_razon;
          consola.emp_cp=nuevaEpresa.emp_cp;
          consola.emp_calle=nuevaEpresa.emp_calle;
          consola.emp_col=nuevaEpresa.emp_col;
          consola.emp_cd=nuevaEpresa.emp_cd;
          consola.emp_conta1=nuevaEpresa.emp_conta1;
          consola.emp_cel1=nuevaEpresa.emp_cel1;
          consola.emp_conta2=nuevaEpresa.emp_conta2;
          consola.emp_cel2=nuevaEpresa.emp_cel2;
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
    await axios.delete(baseUrlDelete+nuevaEpresa.emp_clave, config)
    .then(response=>{
      setData(data.filter(consola=>consola.emp_clave!==nuevaEpresa.emp_clave));
      abrirCerrarModalEliminar();
    })
  }
//cierro peticiones a la api

//efectos de modal
  const seleccionarEmpresa=(empresa, caso)=>{
    setnuevaEmpresa(empresa);
    (caso === 'Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }

  useEffect(() => {
    const fetchData = async () => {
      await peticionGet();
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
        <h3>Agregar Nueva Empresa</h3>
        <TextField  margin="normal" name="emp_nomcom" label="Nombre" onChange={handleChange} />
        <TextField  margin="normal" name="emp_razon" label="Razón" onChange={handleChange} />
        <TextField  margin="normal" name="emp_cp" label="Codigo Postal" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_calle" label="Calle" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_col" label="Colonia" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_cd" label="Ciudad" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_conta1" label="Contacto 1" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_cel1" label="Telefono 1" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_conta2" label="Contacto 2" onChange={handleChange}/>
        <TextField  margin="normal" name="emp_cel2" label="Telefono 2" onChange={handleChange}/>
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
        <h3>Edita la Empresa</h3>
        <TextField  margin="normal" name="emp_nomcom" label="Nombre" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_nomcom}/>
        <TextField  margin="normal" name="emp_razon" label="Razón" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_razon}/>
        <TextField  margin="normal" name="emp_cp" label="Codigo Postal" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_cp}/>
        <TextField  margin="normal" name="emp_calle" label="Calle" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_calle}/>
        <TextField  margin="normal" name="emp_col" label="Colonia" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_col}/>
        <TextField  margin="normal" name="emp_cd" label="Ciudad" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_cd}/>
        <TextField  margin="normal" name="emp_conta1" label="Contacto 1" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_conta1}/>
        <TextField  margin="normal" name="emp_cel1" label="Telefono 1" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_cel1}/>
        <TextField  margin="normal" name="emp_conta2" label="Contacto 2" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_conta2}/>
        <TextField  margin="normal" name="emp_cel2" label="Telefono 2" onChange={handleChange} value={nuevaEpresa && nuevaEpresa.emp_cel2}/>
        <label>Subir Imagen</label>
        <input  type="file" name="emp_img" accept="image/png" onChange={handleChange}/>
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
      <p>Estás seguro que deseas eliminar la empresa <b>{nuevaEpresa && nuevaEpresa.emp_nomcom}</b> ? </p>
      <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionDelete()}>Si</Button>
        <Button variant="contained" sx={{backgroundColor: "#084720"}}   onClick={() => abrirCerrarModalEliminar()}>Cancelar</Button>
        </Box>
    </div>
  );
//cierro construccion de modal

//renderizado

  return (
    <>
    <SidebarCostum/>
    <Box m="20px">
      <Box sx={{ display: "flex" }}>
        <Typography variant="h3">Empresas</Typography>
        <Button onClick={() =>abrirCerrarModalInsertar()}>
          <AddCircleOutlineIcon fontSize="large" />
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{border: "2px solid #ccc"}}>
          <TableHead sx={{backgroundColor: "#084720"}}>
            <TableRow >
              <TableCell sx={{color: "#fff"}}>Clave</TableCell>
              <TableCell sx={{color: "#fff"}}>Nombre</TableCell>
              <TableCell sx={{color: "#fff"}}>Contacto 1</TableCell>
              <TableCell sx={{color: "#fff"}}>Telefono 1</TableCell>
              <TableCell sx={{color: "#fff"}}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((consola) => (
              <TableRow key={consola.emp_clave}>
                <TableCell>{consola.emp_clave}</TableCell>
                <TableCell>{consola.emp_nomcom}</TableCell>
                <TableCell>{consola.emp_conta1}</TableCell>
                <TableCell>{consola.emp_cel2}</TableCell>
                <TableCell>
                  <EditIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarEmpresa(consola, 'Editar')}/>
                  &nbsp;
                  <DeleteIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarEmpresa(consola, 'Eliminar')}/>
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
     <Modal
     open={modalEliminar}
     onClose={()=>abrirCerrarModalEliminar()}>
        {bodyEliminar}
     </Modal>
    </Box>
    </>
  );
};

export default Empresas;