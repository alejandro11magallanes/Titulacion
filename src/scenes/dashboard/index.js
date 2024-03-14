import { Typography } from "@mui/material";
import * as React from "react";
import SidebarCostum from "../global/Sidebar";
import SidebarCostumEmpresa from "../global/SidebarEmpresa";
import { Box, Grid } from "@mui/material";
import SelectSucursal from "../../scenesEmpleado/SelectSucursal";
import TopBar from "../global/TopBar";
import TopBarSupervisor from "../global/TopBarSupervisor";

const Dashboard = () => {

  const rol = localStorage.getItem("rol");
  if (rol == 1) {
    return (
      <>
        <TopBarSupervisor />
        <Grid container>
          <Grid item >
            <SidebarCostum />
          </Grid>

          <Grid item >
            <Box m="50px">
              
            </Box>
          </Grid>
        </Grid>
      </>
    );
  } else if (rol == 2) {
    return (
      <>
        <TopBar />
        <Grid container>
          <Grid >
            <SidebarCostumEmpresa selectedItem="Inicio" />
          </Grid>
          <Grid >
            <Box m="50px">
              <Typography variant="h4">
             
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  } else if (rol == 3) {
    return (
      <>
        <SelectSucursal />
      </>
    );
  }
};

export default Dashboard;
