import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import BarLogo from "../../images/logolink.PNG"
import axios from "axios";
import apiUrl from "../../apiConfig";

const nombre = localStorage.getItem("nombre");
const UrlTLogout = `${apiUrl}/logout`;


const TopBarSupervisor = () => {
  const CerrarSesion = async () =>{
 
    const token = localStorage.getItem("token"); 
     
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.post(UrlTLogout,{}, config).then((response) => {
      localStorage.clear();
    });
  }
  const navigate = useNavigate();
  const Logout = () => {
    
    
    CerrarSesion()
    window.location.href = '/';
    
  };
  return (
    <Box p={2} sx={{backgroundColor: "black", color: "white", width: "97%", height:"30px"}}>
      <Box display="flex" justifyContent="space-between">
        <img src={BarLogo} alt="logoimg" style={{maxHeight: "30px"}}/>
        <Box display="flex" alignItems="center"> {/* Contenedor para alinear los elementos a la derecha */}
          <Typography marginRight={2}>{nombre}</Typography> {/* Añade un margen derecho */}
          <Button variant="contained" onClick={()=> Logout()} sx={{ backgroundColor: "#084720" }}>Cerrar Sesion</Button>
        </Box>
      </Box>
    </Box>
  );
};
export default TopBarSupervisor;
