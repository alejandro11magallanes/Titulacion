import React,{useState, useEffect} from "react";
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
    FormControl
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

  //url de las apis
const baseUrl = "http://localhost:5656/verSucursal";
const baseUrlPost = "http://localhost:5656/agregarSucursal";
const baseUrlPut = "http://localhost:5656/editarSucursal/";
const baseUrlDelete = "http://localhost:5656/eliminarSucursal/";
const baseUrlEmpresasSelect = "http://localhost:5656/selectEmpresa";
const baseUrlBuscarEmpresa = "http://localhost:5656/EmpSuc";

const Sucursales = () =>{

    //declaraciones de useState
const [data, setData] = useState([]);
const [dataEmpresas, setDataEmpresas] = useState([]);
const [modalInsertar, setModalInsertar] = useState(false);
const [modalEditar, setModalEditar]=useState(false);
const [modalEliminar, setModalEliminar]=useState(false);
const [selectedEmpresa, setSelectedEmpresa] = useState({
  empresa: '',
});
const [busquedaRealizada, setBusquedaRealizada] = useState(false);
//seteo de entidad
const [nuevaSucursal, setnuevaSucursal]=useState({
  emp_clave: '',
  suc_nom: '',
  suc_tel:'',
  suc_conta: '',
  suc_cel:'',
  suc_calle: '',
  suc_col: '',
})
//cierro seteo de entidad

//construccion de entidad 
const handleChange=e=>{
    const {name, value}=e.target;
    setnuevaSucursal(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(nuevaSucursal);
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
   
 
    await axios.post(baseUrlBuscarEmpresa,selectedEmpresa , config).then((response) => {
      setData(response.data.result);
      setBusquedaRealizada(true);
    });
  };

  
  
    const peticionPost=async()=>{
      const token = localStorage.getItem("token"); // Obtener el token de localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
        },
      };
      await axios.post(baseUrlPost, nuevaSucursal, config)
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
      await axios.put(baseUrlPut+nuevaSucursal.suc_clave, nuevaSucursal, config)
      .then(response=>{
        var dataNueva=data;
        dataNueva.map(consola=>{
          if(nuevaSucursal.suc_clave===consola.suc_clave){
            consola.suc_nom=nuevaSucursal.suc_nom;
            consola.suc_tel=nuevaSucursal.suc_tel;
            consola.suc_conta=nuevaSucursal.suc_conta;
            consola.suc_cel=nuevaSucursal.suc_cel;
            consola.suc_calle=nuevaSucursal.suc_calle;
            consola.suc_col=nuevaSucursal.suc_col;
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
      await axios.delete(baseUrlDelete+nuevaSucursal.suc_clave, config)
      .then(response=>{
        setData(data.filter(consola=>consola.suc_clave!==nuevaSucursal.suc_clave));
        abrirCerrarModalEliminar();
      })
    }
  //cierro peticiones a la api
  //efectos de modal
  const seleccionarSucursal=(sucursal, caso)=>{
      setnuevaSucursal(sucursal);
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
        <h3>Agregar Nueva Sucursal</h3>
        <TextField  margin="normal" name="suc_nom" label="Nombre" onChange={handleChange} />
        <TextField  margin="normal" name="suc_tel" label="Telefono" onChange={handleChange} />
        <TextField  margin="normal" name="suc_conta" label="Contacto" onChange={handleChange}/>
        <TextField  margin="normal" name="suc_cel" label="Celular" onChange={handleChange}/>
        <TextField  margin="normal" name="suc_calle" label="Calle" onChange={handleChange}/>
        <TextField  margin="normal" name="suc_col" label="Colonia" onChange={handleChange}/>
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
        <h3>Editar Sucursal</h3>
        <TextField  margin="normal" name="suc_nom" label="Nombre" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_nom}/>
        <TextField  margin="normal" name="suc_tel" label="Telefono" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_tel}/>
        <TextField  margin="normal" name="suc_conta" label="Contacto" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_conta}/>
        <TextField  margin="normal" name="suc_cel" label="Celular" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_cel}/>
        <TextField  margin="normal" name="suc_calle" label="Calle" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_calle}/>
        <TextField  margin="normal" name="suc_col" label="Colonia" onChange={handleChange} value={nuevaSucursal && nuevaSucursal.suc_col}/>
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
      <p>Estás seguro que deseas eliminar la Sucursal <b>{nuevaSucursal && nuevaSucursal.suc_nom}</b> ? </p>
      <Button variant="contained" sx={{backgroundColor: "#084720"}} onClick={() =>peticionDelete()}>Si</Button>
        <Button variant="contained" sx={{backgroundColor: "#084720"}}   onClick={() => abrirCerrarModalEliminar()}>Cancelar</Button>
        </Box>
    </div>
  );
  //cierro construccion de modal
return(
    <>
    <SidebarCostum/>
    <Box m="20px">
      <Box sx={{ display: "flex" }}>
        <Typography variant="h3">Sucursales</Typography>
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
              <TableCell sx={{color: "#fff"}}>Clave</TableCell>
              <TableCell sx={{color: "#fff"}}>Nombre</TableCell>
              <TableCell sx={{color: "#fff"}}>Telefono</TableCell>
              <TableCell sx={{color: "#fff"}}>Contacto</TableCell>
              <TableCell sx={{color: "#fff"}}>Celular</TableCell>
              <TableCell sx={{color: "#fff"}}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((consola) => (
              <TableRow key={consola.suc_clave}>
                <TableCell>{consola.suc_clave}</TableCell>
                <TableCell>{consola.suc_nom}</TableCell>
                <TableCell>{consola.suc_tel}</TableCell>
                <TableCell>{consola.suc_conta}</TableCell>
                <TableCell>{consola.emp_nomcom}</TableCell>
                <TableCell>
                  <EditIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarSucursal(consola, 'Editar')}/>
                  &nbsp;
                  <DeleteIcon sx={{cursor: "pointer" }} onClick={() =>seleccionarSucursal(consola, 'Eliminar')}/>
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
export default Sucursales;