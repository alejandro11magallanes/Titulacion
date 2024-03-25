import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BarLogo from "../../images/logolink.PNG";
import axios from "axios";
import apiUrl from "../../apiConfig";

const nombre = localStorage.getItem("nombre");
const nombreEmpresa = localStorage.getItem("nombreEmpresa");
const emp = localStorage.getItem("empresa");
const UrlTLogout = `${apiUrl}/logout`;
const ImagenEmpresa = `${apiUrl}/traerImg`;

const TopBar = () => {
  const [imagenBlob, setImagenBlob] = useState(null);

  const CerrarSesion = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try{
      await axios.post(UrlTLogout, {}, config).then((response) => {
        localStorage.clear();
      });
    }
   catch(error){
    console.log(error)
    localStorage.clear();
    window.location.href = '/';
   }
  }
  const Logotipo = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    };
    try{
      await axios
      .post(ImagenEmpresa, { empresa: emp }, config)
      .then((response) => {
        setImagenBlob(response.data);
       
      });
    }
    catch(error){
      console.log("hay este error:", error);
    }
    
  };

  useEffect(() => {
    const fetchData = async () => {
      await Logotipo();
    };

    fetchData();
  }, []);


  const Logout = async() => {
    await CerrarSesion();
    window.location.href = '/';
  
  };
  return (
    <Box
      p={2}
      sx={{
        backgroundColor: "black",
        color: "white",
        width: "97%",
        height: "30px",
      }}
    >
      <Box display="flex" justifyContent="space-between">
        <div style={{ display: "flex", alignItems: "center", marginLeft: "50px" }}>
          <img src={BarLogo} alt="logoimg" style={{ maxHeight: "30px" }} />
          {imagenBlob && (
            <img
              src={URL.createObjectURL(imagenBlob)}
              style={{ maxHeight: "30px", marginLeft: "10px" }}
              alt="Logotipo de la empresa"
            />
          )}
          <Typography marginLeft="35px">{nombreEmpresa}</Typography>
        </div>
        <Box display="flex" alignItems="center">
         
          <Typography marginRight={2}>{nombre}</Typography>{" "}
        
          <Button
            variant="contained"
            onClick={() => Logout()}
            sx={{ backgroundColor: "#084720" }}
          >
            Cerrar Sesion
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default TopBar;
