import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./index.css";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  //logica
  axios.defaults.withCredentials = true;

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
        const response = await axios.post("http://localhost:5656/login", JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
          
        });

        if (response.data.status === 200) {
          const data = response.data;
          const rol = data.rol;
          const nombre = data.nombre;
          const token = data.token;
          const id = data.clave;
          const empresa = data.empresa;
          localStorage.setItem('IsLogged', true);
          localStorage.setItem('rol', rol);
          localStorage.setItem('nombre', nombre);
          localStorage.setItem('token', token);
          localStorage.setItem('id', id);
          localStorage.setItem('empresa', empresa);
          navigate("/dashboard", { state: { rol, nombre: nombre } });
        } else if(response.data.status === 403){
          setError("Credenciales inválidas");
          
        }
      } catch (error) {
        console.error("error en la petición", error);
        setError("Problema de conexión");
        console.log(JSON.stringify(formData))
      }
    } else {
      setError("Por favor, completa ambos campos.");
    }
  };


  return (
    <div className="backlogin">
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginTop={20}
          padding={3}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          bgcolor={"#f0ede8"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc",
            },
          }}
        >
          <Typography variant="h4" padding={3} textAlign={"center"}>
            Inicio de Sesión
          </Typography>
          <TextField
            margin="normal"
            type="text"
            variant="outlined"
            placeholder="Username"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            type="password"
            variant="outlined"
            placeholder="Password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="primary"
          >
            Aceptar
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default Login;
