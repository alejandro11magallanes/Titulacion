import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../apiConfig";
import {
  Box,
  Typography,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import "./index.css";
const baseUrl =`${apiUrl}/selectXempsuc`;
const UrlTLogout = `${apiUrl}/logout`;


const SelectSucursal = () => {
const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre");
  const empresaSelect = localStorage.getItem("empresa");
  const empresaNombre = localStorage.getItem("nombreEmpresa");
  const [dataSucursal, setDataSucursal]= useState([]);
  const [selectedSucursales] = useState({
    empresa: empresaSelect,
  });
  const [selectedSucursal, setSelectedSucursal] = useState(null); 

  const PeticionGetSucursales = async () => {
    const token = localStorage.getItem("token"); 
     
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    await axios.post(baseUrl,selectedSucursales, config).then((response) => {
      setDataSucursal(response.data.result);
    });
  };
  useEffect(() => {
    const fetchData = async () => {
     
      await PeticionGetSucursales();
     
    };

    fetchData();
  });

  
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
  const Logout = () => {
    CerrarSesion()
    navigate("/");
    
  };
  const handleClick = () => {
    if (selectedSucursal) {
      const sucursalSeleccionada = dataSucursal.find(
        (sucursal) => sucursal.suc_clave === selectedSucursal
      );
      if (sucursalSeleccionada) {
        // Guarda tanto el ID como el nombre de la sucursal seleccionada en localStorage
        localStorage.setItem("sucursal", selectedSucursal);
        localStorage.setItem("sucursalNombre", sucursalSeleccionada.suc_nom);
        navigate("/inicioEmpleado");
      }
    } else {
      alert("Por favor, selecciona una sucursal"); // Muestra un mensaje de alerta si no se ha seleccionado ninguna sucursal
    }
  };


  return (
    <div className="back">
      <Box
        display="flex"
        flexDirection={"column"}
        maxWidth={600}
        alignItems="center"
        justifyContent={"center"}
        margin="auto"
        marginTop={20}
        padding={3}
      
      >
        <Typography variant="h4" sx={{ textAlign: "center", color: "#fff" }}>
          Hola! {nombre}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center", color: "#fff" }}>
          Empresa: {empresaNombre}
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center", color: "#fff"}}>
          Selecciona la Sucursal en donde te encuentras
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select" >Sucursal</InputLabel>
          <Select
            labelId="demo-simple-select"
            id="demo-simple-select"
            name="empresa"
            label="Sucursal"
            sx={{ backgroundColor: "#fff"}}
            value={selectedSucursal} // Asigna el valor seleccionado al estado
            onChange={(e) => setSelectedSucursal(e.target.value)}
            
          >
             {dataSucursal.map((sucursal) => (
            <MenuItem key={sucursal.suc_clave} value={sucursal.suc_clave}>
              {sucursal.suc_nom}
            </MenuItem>
          ))}
          </Select>
        </FormControl>
        <br />
        <Button variant="contained" sx={{ backgroundColor: "#00ff00", width: "50%" }} onClick={handleClick}>
          Listo
        </Button>
        <br />
        <Button variant="contained" sx={{ backgroundColor: "#00ff00", width: "50%" }} onClick={()=>Logout()}>
          Salir
        </Button>
      </Box>
    </div>
  );
};
export default SelectSucursal;
