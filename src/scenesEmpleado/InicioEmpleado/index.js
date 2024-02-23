import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import companylogo from "../../images/company.png";
import { useNavigate } from "react-router-dom";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

function MyScreen() {
  const theme = useTheme();
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");
  const nombreSucursal = localStorage.getItem("sucursalNombre");

  const RedirectToClienteEmpleado = () => {
    navigate("/clienteEmpleado");
  };
  const RedirectToVisitasEmpleado = () => {
    navigate("/visitasEmpleado");
  };

  return (
    <div style={{ paddingTop: "64px", width: "100%", backgroundColor: "#000", height: "100vh" }}>
      <CssBaseline />
      <AppBar sx={{ bgcolor: "black" }}>
        <Toolbar
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <img src={companylogo} style={{ height: "40px" }} />
          <Typography variant="body1" style={{ textAlign: "right" }}>
            Hola! {nombre}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        display="flex"
        flexDirection="column"
        maxWidth={400}
        alignItems="center"
        justifyContent="center"
        margin="auto"
        marginTop={20}
        padding={3}
        borderRadius={5}
        textAlign="center" // Alinea el texto y el contenido horizontalmente
      >
        <Typography variant="h6" sx={{color: "#fff", textAlign: "left"}}>Surcursal: {nombreSucursal}</Typography>
        <br/>
        <Box width="100%">
          
          <Button
            variant="contained"
            onClick={() => RedirectToClienteEmpleado()}
            sx={{ backgroundColor: "#00ff00", width: "100%", height: "70px" }}
          >
            <Diversity1Icon
              fontSize="large"
             
              sx={{ marginRight: "8px" }}
            />
            Clientes
          </Button>
          <br />
          <br />
          <Button
           onClick={() => RedirectToVisitasEmpleado()}
            variant="contained"
            sx={{ backgroundColor: "#00ff00", width: "100%", height: "70px" }}
          >
            <AddLocationAltIcon fontSize="large" sx={{ marginRight: "8px" }} />
            Visitas
          </Button>
          <br />
          <br />
          <br />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#00ff00", width: "100%", height: "70px" }}
          >
            Salir
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default MyScreen;
