import React, { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SidebarCostumEmpresa from "../../scenes/global/SidebarEmpresa";
import TopBar from "../../scenes/global/TopBar";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
//url de las apis
import apiUrl from "../../apiConfig";

const baseUrlPost = `${apiUrl}/agregarCampana`;
const baseUrlPut = `${apiUrl}/editarCampana/`;
const TiposDeClientesXEmpresa = `${apiUrl}/selectXempct`;
const baseUrlDelete = `${apiUrl}/eliminarCampana/`;
const baseUrlBuscarEmpresa = `${apiUrl}/EmpCam`;
const urlImagenCampana = `${apiUrl}/traerImgCam`;

const CampanaEmpresa = () => {
  const [data, setData] = useState([]);
  const currentDate = new Date().toLocaleDateString();
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [dataTipoCli, setDataTipoCli] = useState([]);
  const empresaUsuario = localStorage.getItem("empresa");
  const [imgCampana, setImgCampana] = useState(null);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [imagenBlob, setImagenBlob] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  //seteo de entidad
  const [nuevaCampana, setnuevaCampana] = useState({
    emp_clave: empresaUsuario,
    tip_clave: "",
    cam_nom: "",
    cam_desc: "",
    cam_lanza: "",
    cam_mensaje: "",
    cam_imagen: null,
    cam_estatus: true,
  });
  const [selectedEmpresa, setSelectedEmpresa] = useState({
    empresa: empresaUsuario,
  });
  //cierro seteo de entidad
  //logica para la fecha
  const [minDate, setMinDate] = useState("");

  // Función para obtener la fecha actual
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Formato ISO: YYYY-MM-DD
  };

  // Función para establecer la fecha mínima permitida
  const setMinSelectableDate = () => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2); // Añadir 2 días
    setMinDate(twoDaysLater.toISOString().split("T")[0]);
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
  };

  const Logotipo = async (emp_clave) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    };
    await axios
      .post(urlImagenCampana, { campana: emp_clave }, config)
      .then((response) => {
        setImagenBlob(response.data);
      });
  };

  const peticionGetTipoCli = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .post(TiposDeClientesXEmpresa, selectedEmpresa, config)
      .then((response) => {
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
    const formData = new FormData();
    formData.append("tip_clave", nuevaCampana.tip_clave);
    formData.append("cam_nom", nuevaCampana.cam_nom);
    formData.append("cam_desc", nuevaCampana.cam_desc);
    formData.append("cam_lanza", nuevaCampana.cam_lanza);
    formData.append("cam_mensaje", nuevaCampana.cam_mensaje);
    formData.append("emp_clave", nuevaCampana.emp_clave);
    formData.append("cam_estatus", nuevaCampana.cam_estatus);
    formData.append("cam_imagen", imgCampana);
    await axios.post(baseUrlPost, formData, config).then((response) => {
      setData(data.concat(response.data.result));
      abrirCerrarModalInsertar();
    });
    setnuevaCampana({
      emp_clave: empresaUsuario,
      tip_clave: "",
      cam_nom: "",
      cam_desc: "",
      cam_lanza: "",
      cam_mensaje: "",
      cam_imagen: null,
      cam_estatus: true,
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
  const seleccionarUsuario = async (usuario, caso) => {
    setnuevaCampana(usuario);
    caso === "Editar" && setModalEditar(true);
    await Logotipo(usuario.cam_clave);
  };

  useEffect(() => {
    const fetchData = async () => {
      await peticionGet();
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
    setPreviewImage(null);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };
  //cierro efectos de modal
  //construccion de modal
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImgCampana(selectedFile);
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
              onChange={handleChange}
              name="cam_lanza"
            />
          </Box>
          <TextField
            margin="normal"
            fullWidth
            id="outlined-multiline-static"
            label="Mensaje"
            name="cam_mensaje"
            onChange={handleChange}
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
          <span>
            *Se recomienda que la imagen no supere estas medidas (1920 x 1080)
          </span>
          <br />
          <br />
          <input
            style={{ margin: "auto" }}
            type="file"
            placeholder="Se recomienda que la imagen no supere estas medidas (1080 x 1080)"
            accept="image/png"
            onChange={handleImageChange}
          />
          <Box sx={{ display: "flex", marginTop: "10px" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#084720", margin: "auto" }}
              onClick={() => peticionPost()}
            >
              Insertar
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#084720", margin: "auto" }}
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
        width: 700,
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
          fullWidth
          onChange={handleChange}
          value={nuevaCampana && nuevaCampana.cam_desc}
        />
        <Typography>Lanzamiento: {nuevaCampana.cam_lanza}</Typography>
      </Box>
      <br />
      <Grid container>
        <Grid md={6}>
          <Typography>Actualmente tu logo de campaña es este:</Typography>
          {imagenBlob && (
            <img
              src={URL.createObjectURL(imagenBlob)}
              style={{ maxHeight: "200px", marginLeft: "50px" }}
              alt="Logotipo de la empresa"
            />
          )}
        </Grid>
        <Grid md={6}>
        <Typography>¿Deseas Modificarlo?</Typography>
        
        </Grid>
      </Grid>

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
  return (
    <>
      <TopBar />
      <Grid container>
        <Grid>
          <SidebarCostumEmpresa selectedItem="Campañas" />
        </Grid>
        <Grid sx={{ width: "85%" }}>
          <Box m="20px" sx={{ width: "100%" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h3">Campañas</Typography>
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
export default CampanaEmpresa;
