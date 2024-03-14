import { Grid, Typography, Box } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import apiUrl from "../../apiConfig";
import ImgClientes from "../../images/4043277_avatar_person_pilot_traveller_icon.png";
import ImgVisitas from "../../images/1342941_building_city_citycons_corporate_icon.png";
import ImgCampanas from "../../images/3533399_analytic_campaign_follow up_marketing_online_icon.png";
import ImgSucursales from "../../images/3305208_architecture_building_busy_city_landscape_icon.png";
const urlInformacion = `${apiUrl}/CVCS`;
const urlGrafica1 = `${apiUrl}/GraficaVis`;
const urlGrafica2 = `${apiUrl}/AnalisisCamp`;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Graficos = () => {
  const emp = localStorage.getItem("empresa");
  const [dataInformativo, setDataInformativo] = useState([]);
  const [dataGraficaUno, setDataGraficaUno] = useState([]);
  const [dataGraficaDos, setDataGraficaDos] = useState([]);
  const [dataGraficaBarra, setDataGraficaBarra] = useState([]);
  const [infoGraficas] = useState({
    empresa: emp,
    select: 1,
    inicio: "2024-01-1",
    fin: "2024-01-31",
  });
  const [infoGraficaBarra] = useState({
    empresa: emp,
    campana: 2,
    inicio: "2024-01-1",
    fin: "2024-01-31",
  });

  var midata = {
    labels: dataGraficaUno.map((item) => item.Fecha),
    datasets: [
      // Cada una de las líneas del gráfico
      {
        label: "Recurrentes",
        data: dataGraficaUno.map((item) => item.total),
        tension: 0,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        pointRadius: 2,
        pointBorderColor: "rgba(255, 99, 132)",
        pointBackgroundColor: "rgba(255, 99, 132)",
      },
      {
        label: "Nuevos",
        data: dataGraficaDos.map((item) => item.total),
        borderColor: "rgb(35, 99, 132)",
        backgroundColor: "rgb(35, 99, 132, 5)",
      },
    ],
  };

  var midataBarra = {
    labels: dataGraficaBarra.map((item) => item.cam_nom),
    datasets: [
      {
        label: "Impactos de las Campañas",
        data: dataGraficaBarra.map((item) => item.respuesta),
        backgroundColor: "rgba(0, 220, 195, 0.5)",
      },
    ],
  };

  var misoptions = {
    scales: {
      y: {
        ticks: {
          precision: 0, // Esto establece la precisión a 0 para que solo se muestren números enteros
          beginAtZero: true, // Esto asegura que el eje y comience en 0
        },
      },
      x: {
        ticks: { color: "#000" },
      },
    },
  };

  const PeticionGetToInformacion = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios
        .post(urlInformacion, { empresa: emp }, config)
        .then((response) => {
          setDataInformativo(response.data);
        });
    } catch (error) {
      console.log("ocurrio un error");
    }
  };

  const PeticionGetGraficaUno = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(urlGrafica1, infoGraficas, config).then((response) => {
        setDataGraficaUno(response.data.result);
        setDataGraficaDos(response.data.result2);
      });
    } catch (error) {
      console.log("ocurrio un error");
    }
  };

  const PeticionGetGraficaBarra = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios
        .post(urlGrafica2, infoGraficaBarra, config)
        .then((response) => {
          setDataGraficaBarra(response.data.result);
        });
    } catch (error) {
      console.log("ocurrio un error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await PeticionGetToInformacion();
      await PeticionGetGraficaUno();
      await PeticionGetGraficaBarra();
    };

    fetchData();
  });

  return (
    <>
      <Grid container>
        <Box sx={{ width: "100%", display: "flex", gap: "20px" }}>
          <Box
            sx={{
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "10px 10px 10px 10px",
              display: "flex",
            }}
          >
            <img src={ImgClientes} alt="clientes" style={{ width: "50%" }} />
            <Box sx={{ justifyContent: "center", alignContent: "center" }}>
              <Typography variant="h5" sx={{ paddingTop: "30px" }}>
                Clientes
              </Typography>
              <Typography variant="h5" sx={{ paddingLeft: "5px" }}>
                {dataInformativo.Clientes}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "10px 10px 10px 10px",
              display: "flex",
            }}
          >
            <img src={ImgVisitas} alt="Visitas" style={{ width: "50%" }} />
            <Box sx={{ justifyContent: "center", alignContent: "center" }}>
              <Typography variant="h5" sx={{ paddingTop: "30px" }}>
                Visitas
              </Typography>
              <Typography variant="h5" sx={{ paddingLeft: "5px" }}>
                {dataInformativo.Visitas}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "10px 10px 10px 10px",
              display: "flex",
            }}
          >
            <img src={ImgCampanas} alt="Campañas" style={{ width: "50%" }} />
            <Box sx={{ justifyContent: "center", alignContent: "center" }}>
              <Typography variant="h5" sx={{ paddingTop: "30px" }}>
                Campañas
              </Typography>
              <Typography variant="h5" sx={{ paddingLeft: "5px" }}>
                {dataInformativo.Campaña}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "10px 10px 10px 10px",
              display: "flex",
            }}
          >
            <img
              src={ImgSucursales}
              alt="Sucursales"
              style={{ width: "50%" }}
            />
            <Box sx={{ justifyContent: "center", alignContent: "center" }}>
              <Typography variant="h5" sx={{ paddingTop: "30px" }}>
                Sucursales
              </Typography>
              <Typography variant="h5" sx={{ paddingLeft: "5px" }}>
                {dataInformativo.Sucursal}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <br />
      <Grid container>
        <Box sx={{ width: "100%", display: "flex", gap: "5px" }}>
          <Box
            sx={{
              width: "50%",
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "5px 5px 5px 5px",
            }}
          >
            <Typography variant="h5">Formulario para las graficas</Typography>
            <Line data={midata} options={misoptions} />
          </Box>
          <Box
            sx={{
              width: "50%",
              borderColor: "#ccc",
              borderStyle: "solid",
              padding: "5px 5px 5px 5px",
            }}
          >
            <Bar data={midataBarra} options={misoptions}/>
          </Box>
        </Box>
      </Grid>
    </>
  );
};
export default Graficos;
