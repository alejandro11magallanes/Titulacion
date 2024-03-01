import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import companylogo from "../../images/company.png";
import apiUrl from "../../apiConfig";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
const UrlCampana = `${apiUrl}/selectXempcam`;
const UrlBusqueda = `${apiUrl}/busquedaXcel`;
const urlVisitas = `${apiUrl}/agregarVisita`;

const VisitasEmpleado = () => {
  const nombre = localStorage.getItem("nombre");
  const navigate = useNavigate();
  const sucursal = localStorage.getItem("sucursal");
  const empresaSelected = localStorage.getItem("empresa");
  const [dataCampana, setDataCampana] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogdos, setOpenDialogdos] = useState(false);
  const [openBox, setOpenBox] = useState(false);
  const [nombreCliente, setnombreCliente] = useState("");
  const [celularInp, setCelularInp] = useState({
    cli_cel: "",
  });
  const [selectedEmpresa] = useState({
    empresa: empresaSelected,
  });
  const id = localStorage.getItem("id");
  //seteo de entidad
  const [nuevaVisita, setnuevaVisita] = useState({
    usu_numctrl: id,
    suc_clave: sucursal,
    cli_clave: "",
    vis_cam: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevaVisita((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(nuevaVisita);
  };

  const handleChangeCelular = (e) => {
    const { name, value } = e.target;
    setCelularInp((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //peticiones para llenar los select

  const PeticionGetCampana = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(UrlCampana, selectedEmpresa, config).then((response) => {
      setDataCampana(response.data.result);
    });
  };

  const validarTelefono = (telefono) => {
    return telefono.length === 10 && /^\d+$/.test(telefono);
  };

  const GuardarVisita = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (!nuevaVisita.vis_cam) {
      alert("Por favor, seleccione una campaña antes de guardar la visita.");
      return;
    }
    await axios.post(urlVisitas, nuevaVisita, config).then((response) => {
      setOpenDialogdos(true);
    });
  };

  const BuscarCliente = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (!validarTelefono(celularInp.cli_cel)) {
      alert("Por favor, ingrese un número de teléfono válido (10 dígitos).");
      return;
    }

    try {
      const response = await axios.post(UrlBusqueda, celularInp, config);
      const result = response.data.result;

      if (result && result.length > 0) {
        setOpenBox(true);
        const clienteEncontrado = result[0];
        setnombreCliente(clienteEncontrado.cli_nomcom);
        setnuevaVisita((prevState) => ({
          ...prevState,
          cli_clave: clienteEncontrado.cli_clave,
        }));
      } else {
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error al buscar el cliente:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await PeticionGetCampana();
    };

    fetchData();
  });

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el diálogo
    navigate("/inicioEmpleado");
  };

  const handleCloseDialogdos = () => {
    setOpenDialogdos(false); // Cierra el diálogo
    navigate("/visitasEmpleado");
  };
  const volverVisitas = ()=>{
    setOpenDialog(false); // Cierra el diálogo
    navigate("/visitasEmpleado");
  }
  const redirectRegistro = () => {
    navigate("/clienteEmpleado");
  };

  const volver = () => {
    navigate("/inicioEmpleado");
  };

  return (
    <>
      <div
        style={{
          paddingTop: "64px",
          width: "100%",
          backgroundColor: "#000",
          height: "120vh",
        }}
      >
        <CssBaseline />
        <AppBar sx={{ bgcolor: "black" }}>
          <Toolbar
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <img src={companylogo} style={{ height: "40px" }} alt="logo"/>
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
            Visitas
            <AddLocationAltIcon fontSize="large" sx={{ marginLeft: "8px" }} />
          </Typography>
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Celular"
            fullWidth
            name="cli_cel"
            onChange={handleChangeCelular}
            sx={{ backgroundColor: "#fff" }}
          />
          <br />
          <Box width="100%">
            <Button
              variant="contained"
              onClick={() => BuscarCliente()}
              sx={{
                backgroundColor: "#00ff00",
                width: "60%",
                alignItems: "center",
              }}
            >
              Buscar
            </Button>
          </Box>
          <br />
          {openBox && (
            <Box textAlign="left" width="80%">
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Nombre:
              </Typography>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                {nombreCliente}
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select" sx={{ marginTop: "25px" }}>
                  Campaña
                </InputLabel>
                <Select
                  labelId="demo-simple-select"
                  id="demo-simple-select"
                  name="vis_cam"
                  margin="normal"
                  label="Campaña"
                  onChange={handleChange}
                  sx={{ backgroundColor: "#fff", marginTop: "25px" }}
                  fullWidth
                >
                  {dataCampana.map((campana) => (
                    <MenuItem key={campana.cam_clave} value={campana.cam_clave}>
                      {campana.cam_nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <br />
              <Box width="100%">
                <Button
                  variant="contained"
                  onClick={()=>GuardarVisita()}
                  sx={{
                    backgroundColor: "#00ff00",
                    width: "40%",
                    marginRight: "50px",
                  }}
                >
                  Guardar
                </Button>
                <Button
                  variant="contained"
                  onClick={()=>volver()}
                  sx={{ backgroundColor: "#00ff00", width: "40%" }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>No se encontro al Cliente</DialogTitle>
          
          <DialogActions>
            <Button onClick={redirectRegistro}  variant="contained"  sx={{ backgroundColor: "#00ff00", marginRight: "40px" }}>
              Registrar
            </Button>
            <Button onClick={volverVisitas}  variant="contained"  sx={{ backgroundColor: "#00ff00" }}>
              Volver
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialogdos} onClose={handleCloseDialogdos}>
          <DialogTitle>Visita Registrada</DialogTitle>
  
          <DialogActions>
            <Button onClick={handleCloseDialog} variant="contained"  sx={{ backgroundColor: "#00ff00" }}>
              Listo
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
export default VisitasEmpleado;
