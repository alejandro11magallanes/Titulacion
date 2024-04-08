import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logolinky from "../../images/logolink.PNG";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import apiUrl from "../../apiConfig";
import axios from "axios";
const ImagenEmpresa = `${apiUrl}/traerImg`;
const AgregarCliente = `${apiUrl}/agregarLinkC`;

const QrCliente = () => {
  const currentDate = new Date().toLocaleDateString();
  let { params } = useParams();
  const encriptacion = `${apiUrl}/LinkAgregarCliente/${params}`;
  const [datos, SetDatos] = useState({});
  const [imagenBlob, setImagenBlob] = useState(null);
  const [datosReady, setDatosReady] = useState(false);
  const [datosCliente, setDataCliente] = useState({
    emp_clave:"", 
		tip_clave:"", 
		cli_nomcom: "", 
		cli_cel: "", 
		cli_correo:"", 
		cam_clave:"", 
		usu_numctrl:"", 
		suc_clave: "" 
  });
  useEffect(() => {
    if (datos.empresa) {
      setDataCliente({
        emp_clave: datos.empresa,
        tip_clave: datos.tipocli,
        cli_nomcom: "",
        cli_cel: "",
        cli_correo: "",
        cam_clave: datos.campana,
        usu_numctrl: datos.usuario,
        suc_clave: datos.sucursal
      });
    }
  }, [datos]);
  const peticionEncript = async () => {
    await axios.post(encriptacion, {}).then((response) => {
      SetDatos(response.data);
      setDatosReady(true);
    });
  };

  const peticionPost = async () => {
    try{
      await axios.post(AgregarCliente, datosCliente).then((response) => {
        window.location.href = '/';
      });
    }
    catch(error){
      console.log("ha ocurrido un error", )
    }
   
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionEncript();
    };

    fetchData();
  },[]);


  const Logotipo = async () => {
    const config = {
      responseType: "blob",
    };

    // Verificar si datos.empresa está listo antes de hacer la petición
    if (datosReady && datos.empresa) {
      await axios
        .post(ImagenEmpresa, { empresa: datos.empresa }, config)
        .then((response) => {
          setImagenBlob(response.data);
        });
    }
  };

  useEffect(() => {
    Logotipo();
  }, [datosReady]); // Volver a llamar Logotipo cuando datosReady cambie

   //construccion de entidad
   const handleChange = (e) => {
    const { name, value } = e.target;
    setDataCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(datosCliente);
    console.log(datos.empresa);
  };

  return (
    <>
      <div style={{ paddingTop: "64px", width: "100%", height: "100vh" }}>
        <CssBaseline />
        <AppBar sx={{ bgcolor: "black" }}>
          <Toolbar
            style={{
              width: "100%",
              height: "70px",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <img src={logolinky} alt="logo" />
          </Toolbar>
        </AppBar>

        <Box
          display="flex"
          flexDirection="column"
          maxWidth={400}
          alignItems="center"
          justifyContent="center"
          margin="auto"
          marginTop={2}
          padding={3}
          borderRadius={5}
          textAlign="center" // Alinea el texto y el contenido horizontalmente
        >
          <Typography>Fecha: {currentDate}</Typography>
          {imagenBlob && (
            <img
              src={URL.createObjectURL(imagenBlob)}
              style={{ maxHeight: "200px", marginLeft: "10px" }}
              alt="Logotipo de la empresa"
            />
          )}

          <Typography variant="h5">Gracias por Registrarte como cliente distingido</Typography>
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Nombre"
            name="cli_nomcom"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Celular"
            name="cli_cel"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Correo"
            onChange={handleChange}
            name="cli_correo"
            fullWidth
          />
            <Button
                
                sx={{
                  marginTop: 3,
                  borderRadius: 3,
                  width: "100%",
                  backgroundColor: "#00ff00",
                }}
                variant="contained"
            onClick={()=> peticionPost()}
              >
                Aceptar
              </Button>
          <Box width="100%"></Box>
        </Box>
      </div>
    </>
  );
};
export default QrCliente;
