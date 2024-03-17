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
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//url de las apis

const baseUrlPost = "http://localhost:5656/agregarCampana";
const baseUrlPut = "http://localhost:5656/editarCampana/";
const baseUrlDelete = "http://localhost:5656/eliminarCampana/";
const baseUrlEmpresasSelect = "http://localhost:5656/selectEmpresa";
const baseUrlTipoSelect = "http://localhost:5656/selectTipoCli";
const baseUrlBuscarEmpresa = "http://localhost:5656/EmpCam";

const Campanas = () => {
  //declaraciones de useState
  const [data, setData] = useState([]);
  const currentDate = new Date().toLocaleDateString();
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [dataTipoCli, setDataTipoCli] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  //seteo de entidad
  const [nuevaCampana, setnuevaCampana] = useState({
    emp_clave: "",
    tip_clave: "",
    cam_nom: "",
    cam_desc: "",
  });
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: "",
  });
  //cierro seteo de entidad
//logica para la fecha
const [minDate, setMinDate] = useState('');

  // Función para obtener la fecha actual
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato ISO: YYYY-MM-DD
  };

  // Función para establecer la fecha mínima permitida
  const setMinSelectableDate = () => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2); // Añadir 2 días
    setMinDate(twoDaysLater.toISOString().split('T')[0]);
  };
  useEffect(() => {
    setMinSelectableDate();
  }, []);

  //construccion de entidad
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnuevaCampana((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(nuevaCampana);
  };
  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmpresa((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(selectedEmpresa);
  };
  //Peticiones a la api

  const peticionGetEmpresas = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.get(baseUrlEmpresasSelect, config).then((response) => {
      setDataEmpresas(response.data.result);
    });
  };
  const peticionGetTipoCli = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.get(baseUrlTipoSelect, config).then((response) => {
      setDataTipoCli(response.data.result);
    });
  };

  const peticionGet = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(baseUrlBuscarEmpresa, selectedEmpresa, config)
      .then((response) => {
        setData(response.data.result);
      });
  };

  const peticionPost = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios.post(baseUrlPost, nuevaCampana, config).then((response) => {
      setData(data.concat(response.data.result));
      abrirCerrarModalInsertar();
    });
  };

  const peticionPut = async () => {
    const token = localStorage.getItem("token"); // Obtener el token de localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado de autorización
      },
    };
    await axios
      .put(baseUrlPut + nuevaCampana.cam_clave, nuevaCampana, config)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((consola) => {
          if (nuevaCampana.cam_clave === consola.cam_clave) {
            consola.cam_nom = nuevaCampana.cam_nom;
            consola.tip_clave = nuevaCampana.tip_clave;
            consola.cam_desc = nuevaCampana.cam_desc;
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
      .delete(baseUrlDelete + nuevaCampana.cam_clave, config)
      .then((response) => {
        setData(
          data.filter((consola) => consola.cam_clave !== nuevaCampana.cam_clave)
        );
        abrirCerrarModalEliminar();
      });
  };
  //cierro peticiones a la api
  //efectos de modal
  const seleccionarUsuario = (usuario, caso) => {
    setnuevaCampana(usuario);
    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionGetEmpresas();
      await peticionGetTipoCli();
    };

    fetchData();
  }, []);

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
    setPreviewImage(null);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };
  //cierro efectos de modal
  //construccion de modal
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const bodyInsertar = (
    <div
      style={{
        position: "absolute",
        width: 1200,
        backgroundColor: "white",
        border: "2px solid #ccc",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", // Puedes ajustar la sombra según tus preferencias
        padding: "5px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Grid container>
        <Grid item xs={6} md={8}>
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            name="cam_nom"
            label="Nombre"
            onChange={handleChange}
          />
          <br />
          <TextField
            sx={{ width: "100%" }}
            margin="normal"
            name="cam_desc"
            label="Descripcion"
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select">Empresa</InputLabel>
            <Select
              labelId="demo-simple-select"
              id="demo-simple-select"
              name="emp_clave"
              onChange={handleChange}
              label="Empresa"
            >
              {dataEmpresas.map((empresa) => (
                <MenuItem key={empresa.emp_clave} value={empresa.emp_clave}>
                  {empresa.emp_nomcom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ margin: "auto", display: "flex" }}>
            <Typography>Fecha de Creacion: {currentDate}</Typography>
            <Typography sx={{ marginLeft: "23%" }}>
              Fecha de Lanzamiento:
            </Typography>
            <input
              style={{ marginLeft: "10px" }}
              type="date"
              id="fecha"
              min={minDate}
              name="fin"
            />
          </Box>
          <TextField
            margin="normal"
            fullWidth
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={3}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-dos">Tipo de Cliente</InputLabel>
            <Select
              labelId="demo-simple-select-dos"
              id="demo-simple-select-dos"
              name="tip_clave"
              onChange={handleChange}
              label="Tipo de Cliente"
            >
              {dataTipoCli.map((tipo) => (
                <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
                  {tipo.tip_nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography>Selecciona una imagen para tu campaña </Typography>
          <span>*Se recomienda que la imagen no supere estas medidas (1920 x 1080)</span>
          <br/><br/>
          <input
            style={{ margin: "auto" }}
            type="file"
            placeholder="Se recomienda que la imagen no supere estas medidas (1080 x 1080)"
            accept="image/png"
            onChange={handleImageChange}
          />
          <Box sx={{display: "flex", marginTop: "10px"}}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#084720", margin: "auto" }}
              onClick={() => peticionPost()}
            >
              Insertar
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#084720" ,margin: "auto"}}
              onClick={() => abrirCerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "50%",
                maxHeight: "600px",
                marginLeft: "100px",
                marginTop: "150px",
              }}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );

  const bodyEditar = (
    <div
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
        <h3>Editar Campaña</h3>
        <TextField
          margin="normal"
          name="cam_nom"
          label="Nombre"
          onChange={handleChange}
          value={nuevaCampana && nuevaCampana.cam_nom}
        />

        <TextField
          margin="normal"
          name="cam_desc"
          label="Descripcion"
          onChange={handleChange}
          value={nuevaCampana && nuevaCampana.cam_desc}
        />
        <br />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-dos">Tipo de Cliente</InputLabel>
          <Select
            labelId="demo-simple-select-dos"
            id="demo-simple-select-dos"
            name="tip_clave"
            onChange={handleChange}
            label="Tipo de Cliente"
          >
            {dataTipoCli.map((tipo) => (
              <MenuItem key={tipo.tip_clave} value={tipo.tip_clave}>
                {tipo.tip_nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
          onClick={() => peticionPut()}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#084720" }}
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
          Estás seguro que deseas eliminar la Campaña{" "}
          <b>{nuevaCampana && nuevaCampana.cam_nom}</b> ?{" "}
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
  return (
    <>
   <TopBarSupervisor/>
    <Grid container>
      <Grid>
      <SidebarCostum selectedItem="Campañas"/>
      </Grid>
      <Grid sx={{ width: "90%" }}>
      <Box m="20px" sx={{ width: "100%" }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h3">Campañas</Typography>
          <Button onClick={() => abrirCerrarModalInsertar()}>
            <AddCircleOutlineIcon fontSize="large" />
          </Button>
        </Box>
        <Box sx={{ display: "flex", width: "40%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select">Empresa</InputLabel>
            <Select
              labelId="demo-simple-select"
              id="demo-simple-select"
              name="empresa"
              onChange={handleEmpresaChange}
              label="Empresa"
            >
              {dataEmpresas.map((empresa) => (
                <MenuItem key={empresa.emp_clave} value={empresa.emp_clave}>
                  {empresa.emp_nomcom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#084720", marginLeft: "20px" }}
            onClick={() => peticionGet()}
          >
            Buscar
          </Button>
        </Box>
        <br />
        <br />
        <TableContainer>
          <Table sx={{ border: "2px solid #ccc" }}>
            <TableHead sx={{ backgroundColor: "#084720" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Clave</TableCell>
                <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
                <TableCell sx={{ color: "#fff" }}>Lanzamiento</TableCell>
                <TableCell sx={{ color: "#fff" }}>Tipo</TableCell>
                <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((consola) => (
                <TableRow key={consola.cam_clave}>
                  <TableCell>{consola.cam_clave}</TableCell>
                  <TableCell>{consola.cam_nom}</TableCell>

                  <TableCell>{consola.cam_lanza}</TableCell>
                  <TableCell>{consola.tip_nom}</TableCell>
                  <TableCell>
                    <EditIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => seleccionarUsuario(consola, "Editar")}
                    />
                    &nbsp;
                    <DeleteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => seleccionarUsuario(consola, "Eliminar")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={modalInsertar} onClose={() => abrirCerrarModalInsertar()}>
          {bodyInsertar}
        </Modal>
        <Modal open={modalEditar} onClose={() => abrirCerrarModalEditar()}>
          {bodyEditar}
        </Modal>
      </Box>
      <Modal open={modalEliminar} onClose={() => abrirCerrarModalEliminar()}>
        {bodyEliminar}
      </Modal>
      </Grid>
    </Grid>
      
      
    </>
  );
};

export default Campanas;
