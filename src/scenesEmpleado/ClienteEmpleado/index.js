import React,{useState, useEffect} from "react"; 
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../apiConfig";
import companylogo from "../../images/company.png";
import Diversity1Icon from "@mui/icons-material/Diversity1";
const UrlTipoCliente = `${apiUrl}/selectXempct`;
const UrlCampana = `${apiUrl}/selectXempcam`;
const baseUrlPost = `${apiUrl}/agregarCliente`;

const ClienteEmpleado = () => {
  const nombre = localStorage.getItem("nombre");
  const navigate = useNavigate();
  const sucursal = localStorage.getItem("sucursal");
  const empresaSelected = localStorage.getItem("empresa");
  const [dataTipoClientes, setDataTipoClientes]= useState([]);
  const [dataCampana, setDataCampana]= useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmpresa] = useState({
    empresa: empresaSelected,
  });
  const id = localStorage.getItem("id");
//seteo de entidad
const [nuevoCliente, setnuevoCliente]=useState({
  emp_clave: empresaSelected,
  tip_clave: '',
  cli_nomcom:'',
  cli_cel: '',
  cli_correo: '',
  cam_clave: '',
  usu_numctrl: id,
  suc_clave: sucursal,
})

const handleChange=e=>{
    const {name, value}=e.target;
    setnuevoCliente(prevState=>({
      ...prevState,
      [name]: value
    }))
    console.log(nuevoCliente);
  }
  
  //peticiones para llenar los select
  const PeticionGetTipoCliente = async () =>{
    const token = localStorage.getItem("token"); 
     
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.post(UrlTipoCliente,selectedEmpresa, config).then((response) => {
      setDataTipoClientes(response.data.result);
    });
  }
  const PeticionGetCampana = async () =>{
    const token = localStorage.getItem("token"); 
     
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.post(UrlCampana,selectedEmpresa, config).then((response) => {
      setDataCampana(response.data.result);
    });
  }

  const validarTelefono = (telefono) => {
    // Verificar que el teléfono tenga 10 dígitos
    return /^\d{10}$/.test(telefono);
  };

  const validarNombre = (nombre) => {
    // Verificar que el nombre tenga al menos 8 caracteres
    return nombre.length >= 8;
  };

  const validarCorreo = (correo) => {
    // Verificar formato de correo electrónico
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  };

  const validarFormulario = () => {
    const { cli_cel, cli_nomcom, cli_correo, tip_clave, cam_clave } = nuevoCliente;
    if (!validarTelefono(cli_cel)) {
      alert("El teléfono debe tener 10 dígitos.");
      return false;
    }
    if (!validarNombre(cli_nomcom)) {
      alert("El nombre debe tener al menos 8 caracteres.");
      return false;
    }
    if (!validarCorreo(cli_correo)) {
      alert("El correo electrónico no es válido.");
      return false;
    }
    if (!tip_clave || !cam_clave) {
      alert("Por favor selecciona una opción en ambos campos.");
      return false;
    }
    return true;
  };


  const GuardarCliente = async ()=>{
    const token = localStorage.getItem("token"); 
     
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    if (validarFormulario()) {
      try {
        await axios.post(baseUrlPost, nuevoCliente, config).then((response) => {
          setOpenDialog(true);
        });
      } catch (error) {
        console.error("Error al guardar el cliente:", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
     
      await PeticionGetTipoCliente();
      await PeticionGetCampana();
     
    };

    fetchData();
  });

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el diálogo
    navigate("/inicioEmpleado");
  };

  const Incio = () =>{
    navigate("/inicioEmpleado");
  };

  return (
    <>
      <div style={{ paddingTop: "64px", width: "100%", backgroundColor: "#000", height: "120vh" }}>
        <CssBaseline />
        <AppBar sx={{ bgcolor: "black" }}>
          <Toolbar
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <img src={companylogo} style={{ height: "40px" }} alt="logo" />
            <Typography variant="body1" style={{ textAlign: "right" }}>
              Hola! {nombre}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          display="flex"
          flexDirection="column"
          maxWidth={600}
          alignItems="center"
          justifyContent="center"
          margin="auto"
          marginTop={5}
          padding={3}
          bgcolor={"#000"}
          textAlign="center"
        >
            <Typography variant="h3" sx={{ textAlign: "center", color: "#fff" }}>
          Clientes
          <Diversity1Icon
              fontSize="large"
              sx={{ marginLeft: "8px" }}
            />
        </Typography>
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Celular"
            fullWidth
            name="cli_cel"
            onChange={handleChange}
            sx={{ backgroundColor: "#fff" }}
          />
          <TextField
            margin="normal"
            type="text"
            name="cli_nomcom"
            variant="outlined"
            placeholder="Nombre"
            onChange={handleChange}
            sx={{ backgroundColor: "#fff" }}
            fullWidth
          />
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Correo"
            name="cli_correo"
            onChange={handleChange}
            sx={{ backgroundColor: "#fff" }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select" sx={{ marginTop: "15px" }}>
              Tipo de Cliente
            </InputLabel>
            <Select
              labelId="demo-simple-select"
              id="demo-simple-select"
              name="tip_clave"
              margin="normal"
              label="Tipo de Cliente"
              onChange={handleChange}
              sx={{ backgroundColor: "#fff", marginTop: "15px",textAlign: "left" }}
              fullWidth
            >
                {dataTipoClientes.map((tipo) => (
            <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
              {tipo.tip_nom}
            </MenuItem>
          ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select" sx={{ marginTop: "25px" }}>
              Campaña
            </InputLabel>
            <Select
              labelId="demo-simple-select"
              id="demo-simple-select"
              name="cam_clave"
              margin="normal"
              label="Campaña"
              onChange={handleChange}
              sx={{ backgroundColor: "#fff", marginTop: "25px",textAlign: "left" }}
              fullWidth
            >
                 {dataCampana.map((campana) => (
            <MenuItem key={campana.cam_clave} value={campana.cam_clave}>
              {campana.cam_nom}
            </MenuItem>
          ))}
            </Select>
          </FormControl>
         <br/> 
          <Box width="100%">
         
          <Button
            variant="contained"
            onClick={()=>GuardarCliente()}
            sx={{ backgroundColor: "#00ff00", width: "40%", marginRight: "50px" }}
          >
          
            Guardar
          </Button>
          <Button
            variant="contained"
            onClick={()=> Incio()}
            sx={{ backgroundColor: "#00ff00", width: "40%" }}
          >
            Cancelar
          </Button>
        </Box>
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cliente Registrado</DialogTitle>
        <DialogContent>
          <p>El cliente se ha registrado exitosamente.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
};
export default ClienteEmpleado;
