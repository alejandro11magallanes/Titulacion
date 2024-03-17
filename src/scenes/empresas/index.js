import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarCostum from "../global/Sidebar";
import TopBarSupervisor from "../global/TopBarSupervisor";

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
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import apiUrl from "../../apiConfig";
//url de las apis
const baseUrl = `${apiUrl}/verEmpresa`;
const baseUrlPost = `${apiUrl}/agregarEmpresa`;
const baseUrlPut = `${apiUrl}/editarEmpresa/`;
const baseUrlDelete = `${apiUrl}/eliminarEmpresa/`;
const ImagenEmpresa = `${apiUrl}/traerImg`;

const Empresas = () => {
  //declaraciones de useState
  const [data, setData] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [imgEmpresa, setImgEmpresa] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [imagenBlob, setImagenBlob] = useState(null);
  //seteo de entidad
  const [nuevaEpresa, setnuevaEmpresa] = useState({
    emp_nomcom: "",
    emp_razon: "",
    emp_cp: "",
    emp_calle: "",
    emp_col: "",
    emp_cd: "",
    emp_conta1: "",
    emp_cel1: "",
    emp_conta2: "",
    emp_cel2: "",
    emp_status: 1,
    emp_logo: null,
  });
  //cierro seteo de entidad
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImgEmpresa(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  //construccion de entidad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevaEmpresa((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //cierro construccion de entidad

  //Peticiones a la api
  const Logotipo = async (emp_clave) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    };
    await axios
      .post(ImagenEmpresa, { empresa: emp_clave }, config)
      .then((response) => {
        setImagenBlob(response.data);
      });
  };

  const peticionGet = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.get(baseUrl, config).then((response) => {
      setData(response.data.result);
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!nuevaEpresa.emp_nomcom) {
      errors.emp_nomcom = "El nombre es requerido";
    }
    if (!nuevaEpresa.emp_razon) {
      errors.emp_nomcom = "La razon social es requerida";
    }
    if (!nuevaEpresa.emp_cd) {
      errors.emp_nomcom = "La ciudad es requerida";
    }
    if (!nuevaEpresa.emp_cel1) {
      errors.emp_cel1 = "El teléfono 1 es requerido";
    } else if (!/^\d{10}$/.test(nuevaEpresa.emp_cel1)) {
      errors.emp_cel1 = "El teléfono 1 debe tener 10 dígitos";
    }
    if (nuevaEpresa.emp_cel2 && !/^\d{10}$/.test(nuevaEpresa.emp_cel2)) {
      errors.emp_cel2 = "El teléfono 2 debe tener 10 dígitos";
    }
    if (!nuevaEpresa.emp_cp) {
      errors.emp_cp = "El código postal es requerido";
    } else if (!/^\d{5}$/.test(nuevaEpresa.emp_cp)) {
      errors.emp_cp = "El código postal debe tener 5 dígitos";
    }
    // Puedes agregar más validaciones aquí según tus necesidades
    return errors;
  };

  const peticionPost = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const token = localStorage.getItem("token"); // Obtener el token de localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
        },
      };
      const formData = new FormData();
      formData.append("emp_logo", imgEmpresa);
      formData.append("emp_nomcom", nuevaEpresa.emp_nomcom);
      formData.append("emp_razon", nuevaEpresa.emp_razon);
      formData.append("emp_cp", nuevaEpresa.emp_cp);
      formData.append("emp_calle", nuevaEpresa.emp_calle);
      formData.append("emp_cd", nuevaEpresa.emp_cd);
      formData.append("emp_conta1", nuevaEpresa.emp_conta1);
      formData.append("emp_cel1", nuevaEpresa.emp_cel1);
      formData.append("emp_conta2", nuevaEpresa.emp_conta2);
      formData.append("emp_cel2", nuevaEpresa.emp_cel2);
      formData.append("emp_col", nuevaEpresa.emp_col);
      console.log(formData);
      await axios.post(baseUrlPost, formData, config).then((response) => {
        setData(data.concat(response.data.result));
        abrirCerrarModalInsertar();
      });
    } else {
      alert(Object.values(errors).join("\n"));
    }
  };

  const peticionPut = async () => {
    const token = localStorage.getItem("token"); 
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    };
    const formData = new FormData();
    formData.append("emp_nomcom", nuevaEpresa.emp_nomcom);
  formData.append("emp_razon", nuevaEpresa.emp_razon);
  formData.append("emp_cp", nuevaEpresa.emp_cp);
  formData.append("emp_calle", nuevaEpresa.emp_calle);
  formData.append("emp_col", nuevaEpresa.emp_col);
  formData.append("emp_cd", nuevaEpresa.emp_cd);
  formData.append("emp_conta1", nuevaEpresa.emp_conta1);
  formData.append("emp_cel1", nuevaEpresa.emp_cel1);
  formData.append("emp_conta2", nuevaEpresa.emp_conta2);
  formData.append("emp_cel2", nuevaEpresa.emp_cel2);
  if (imgEmpresa) {
    formData.append("emp_logo", imgEmpresa);
  }
  else {
    // Si no se selecciona una nueva imagen, enviar la imagenBlob
    formData.append("emp_logo", imagenBlob);
  }
    await axios
      .put(baseUrlPut + nuevaEpresa.emp_clave, formData, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevaEpresa.emp_clave === consola.emp_clave) {
            consola.emp_nomcom = nuevaEpresa.emp_nomcom;
            consola.emp_razon = nuevaEpresa.emp_razon;
            consola.emp_cp = nuevaEpresa.emp_cp;
            consola.emp_calle = nuevaEpresa.emp_calle;
            consola.emp_col = nuevaEpresa.emp_col;
            consola.emp_cd = nuevaEpresa.emp_cd;
            consola.emp_conta1 = nuevaEpresa.emp_conta1;
            consola.emp_cel1 = nuevaEpresa.emp_cel1;
            consola.emp_conta2 = nuevaEpresa.emp_conta2;
            consola.emp_cel2 = nuevaEpresa.emp_cel2;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
      });
  };

  const peticionDelete = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios
      .delete(baseUrlDelete + nuevaEpresa.emp_clave, config)
      .then((response) => {
        setData(
          data.filter((consola) => consola.emp_clave !== nuevaEpresa.emp_clave)
        );
        abrirCerrarModalEliminar();
      });
  };
  //cierro peticiones a la api

  //efectos de modal
  const seleccionarEmpresa = async (empresa, caso) => {
    setnuevaEmpresa(empresa);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    await Logotipo(empresa.emp_clave);
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionGet();
    };

    fetchData();
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    setPreviewImage(null);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
    setPreviewImage(null);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  //cierro efectos de modal

  //construccion de modal

  const bodyInsertar = (
    <div
      style={{
        position: "absolute",
        width: 1200,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          "& > :not(style) > :not(style)": { width: "100%" },
        }}
      >
        <h3>Agregar Nueva Empresa</h3>
        <TextField
          margin="normal"
          name="emp_nomcom"
          label="Nombre"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_razon"
          label="Razón"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_cp"
          label="Codigo Postal"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_calle"
          label="Calle"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_col"
          label="Colonia"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_cd"
          label="Ciudad"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_conta1"
          label="Contacto 1"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_cel1"
          label="Telefono 1"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_conta2"
          label="Contacto 2"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          name="emp_cel2"
          label="Telefono 2"
          onChange={handleChange}
        />
      </Box>
      <Box m="20px">
        <Typography sx={{ width: "100%" }} variant="h6">
          Sube el logo de la empresa
        </Typography>
        <br />
        <span>
          *Si no subes una imagen por defecto se subira una imagen generica
        </span>
        <br />
        <br />
        <Box>
          <input type="file" accept="image/png" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                marginLeft: "100px",
              }}
            />
          )}
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#084720" }}
            onClick={() => peticionPost()}
          >
            Insertar
          </Button>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#084720", marginLeft: "50px" }}
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </div>
  );

  const bodyEditar = (
    <div
      style={{
        position: "absolute",
        width: 1200,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
          "& > :not(style) > :not(style)": { width: "100%" },
        }}
      >
        <h3>Edita la Empresa</h3>
        <TextField
          margin="normal"
          name="emp_nomcom"
          label="Nombre"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_nomcom}
        />
        <TextField
          margin="normal"
          name="emp_razon"
          label="Razón"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_razon}
        />
        <TextField
          margin="normal"
          name="emp_cp"
          label="Codigo Postal"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_cp}
        />
        <TextField
          margin="normal"
          name="emp_calle"
          label="Calle"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_calle}
        />
        <TextField
          margin="normal"
          name="emp_col"
          label="Colonia"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_col}
        />
        <TextField
          margin="normal"
          name="emp_cd"
          label="Ciudad"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_cd}
        />
        <TextField
          margin="normal"
          name="emp_conta1"
          label="Contacto 1"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_conta1}
        />
        <TextField
          margin="normal"
          name="emp_cel1"
          label="Telefono 1"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_cel1}
        />
        <TextField
          margin="normal"
          name="emp_conta2"
          label="Contacto 2"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_conta2}
        />
        <TextField
          margin="normal"
          name="emp_cel2"
          label="Telefono 2"
          onChange={handleChange}
          value={nuevaEpresa && nuevaEpresa.emp_cel2}
        />
         </Box>
         <Grid sx={{display: "flex", justifyContent: "center"}} >
          <Grid sx={{alignItems: "center"}} md={4} >
          <Box m="20px">
          <Typography>Actualmente tu logo es este:</Typography>
          {imagenBlob && (
            <img
              src={URL.createObjectURL(imagenBlob)}
              style={{ maxHeight: "200px", marginLeft: "10px" }}
              alt="Logotipo de la empresa"
            />
          )}
         </Box>
          </Grid>
          <Grid sx={{alignItems: "center"}}  md={5}>
          <Box m="20px">
          <Typography>Si deseas cambiar la imagen sube una</Typography>
          <input type="file" accept="image/png" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                marginTop: "40px",
                maxWidth: "100px",
                maxHeight: "300px",
                marginLeft: "100px",
              }}
            />
          )}
         </Box>
          </Grid>
         </Grid>
         <Box sx={{ width: "100%"}}>
         <Button
          variant="contained"
          sx={{ backgroundColor: "#084720", marginLeft: "30%" }}
          onClick={() => peticionPut()}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720", marginLeft: "20%" }}
          onClick={() => abrirCerrarModalEditar()}
        >
          Cancelar
        </Button>
         </Box>
        
     
       
     
    </div>
  );

  const bodyEliminar = (
    <div
      div
      style={{
        position: "absolute",
        width: 500,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        m="10px"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
      >
        <p>
          Estás seguro que deseas eliminar la empresa{" "}
          <b>{nuevaEpresa && nuevaEpresa.emp_nomcom}</b> ?{" "}
        </p>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionDelete()}
        >
          Si
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => abrirCerrarModalEliminar()}
        >
          Cancelar
        </Button>
      </Box>
    </div>
  );
  //cierro construccion de modal

  //renderizado

  return (
    <>
      <TopBarSupervisor />
      <Grid container>
        <Grid>
          <SidebarCostum selectedItem="Empresas"/>
        </Grid>
        <Grid sx={{ width: "90%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h3">Empresas</Typography>
              <Button onClick={() => abrirCerrarModalInsertar()}>
                <AddCircleOutlineIcon fontSize="large" />
              </Button>
            </Box>
            <TableContainer>
              <Table sx={{ border: "2px solid #ccc" }}>
                <TableHead sx={{ backgroundColor: "#084720" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>Clave</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Contacto 1</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Telefono 1</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((consola) => (
                    <TableRow key={consola.emp_clave}>
                      <TableCell>{consola.emp_clave}</TableCell>
                      <TableCell>{consola.emp_nomcom}</TableCell>
                      <TableCell>{consola.emp_conta1}</TableCell>
                      <TableCell>{consola.emp_cel2}</TableCell>
                      <TableCell>
                        <EditIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() => seleccionarEmpresa(consola, "Editar")}
                        />
                        &nbsp;
                        <DeleteIcon
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            seleccionarEmpresa(consola, "Eliminar")
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
              open={modalInsertar}
              onClose={() => abrirCerrarModalInsertar()}
            >
              {bodyInsertar}
            </Modal>
            <Modal open={modalEditar} onClose={() => abrirCerrarModalEditar()}>
              {bodyEditar}
            </Modal>
            <Modal
              open={modalEliminar}
              onClose={() => abrirCerrarModalEliminar()}
            >
              {bodyEliminar}
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Empresas;
