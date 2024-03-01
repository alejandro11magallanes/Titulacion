import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./index.css";
import { Button, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginImg from "../../images/login.png";
import apiUrl from "../../apiConfig";
const Login = () => {
  //logica
  axios.defaults.withCredentials = true;
  const LoginUrl = `${apiUrl}/login`;
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.correo && formData.contrasena) {
      try {
        const response = await axios.post(LoginUrl, JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.status === 200) {
          const data = response.data;
          const rol = data.rol;
          const nombre = data.nombre;
          const token = data.token;
          const id = data.clave;
          const empresa = data.empresa;
          const empresaNombre = data.nomemp;
          localStorage.setItem("IsLogged", true);
          localStorage.setItem("rol", rol);
          localStorage.setItem("nombre", nombre);
          localStorage.setItem("token", token);
          localStorage.setItem("id", id);
          localStorage.setItem("empresa", empresa);
          localStorage.setItem("nombreEmpresa", empresaNombre);
          navigate("/dashboard", { state: { rol, nombre: nombre } });
        } else if (response.data.status === 403) {
          setError("Credenciales inválidas");
        }
      } catch (error) {
        console.error("error en la petición", error);
        setError("Problema de conexión");
        console.log(JSON.stringify(formData));
      }
    } else {
      setError("Por favor, completa ambos campos.");
    }
  };

  return (
    <Grid container   justifyContent="center">
      <Grid item sx={12} md={8}>
        <img
          src={LoginImg}
          alt="login"
          className="imglogin"
        />
      </Grid>
      <Grid item sx={12} md={4} className="formulario">
        <div >
        <form onSubmit={handleSubmit} >
            <Box
            height={"350px"}
              display="flex"
              flexDirection={"column"}
              alignItems="center"
              justifyContent={"center"}
              margin="auto"
              padding={3}

            >
              <Typography variant="h4" padding={3} textAlign={"left"}>
                Login
              </Typography>
              <TextField
                margin="normal"
                type="text"
                variant="outlined"
                placeholder="Username"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="normal"
                type="password"
                variant="outlined"
                placeholder="Password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                fullWidth
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                sx={{
                  marginTop: 3,
                  borderRadius: 3,
                  width: "100%",
                  backgroundColor: "#00ff00",
                }}
                variant="contained"
                color="primary"
              >
                Aceptar
              </Button>
            </Box>
          </form>
        </div>
         
      </Grid>
    </Grid>
  );
};

export default Login;
