import { Typography } from "@mui/material";
import * as React from "react";
import SidebarCostum from "../global/Sidebar";
import SidebarCostumEmpresa from "../global/SidebarEmpresa";
import { Box } from "@mui/material";
import SelectSucursal from "../../scenesEmpleado/SelectSucursal";
const Dashboard = () => {

  const nombre = localStorage.getItem("nombre");
  const rol = localStorage.getItem("rol");
  if(rol == 1){
    return (
      <>
      <SidebarCostum/>
      <Box m="50px">
        <Typography variant="h4">
          Bienvenido a la plataforma {nombre}
        </Typography>
        
      </Box>
      </>
    );
  }
  else if(rol == 2){
    return (
      <>
      <SidebarCostumEmpresa/>
      <Box m="50px">
        <Typography variant="h4">
          Bienvenido a la plataforma {nombre}
        </Typography>
        
      </Box>
      </>
    );
  }
  else if(rol == 3){
    return (
      <>
    
      <SelectSucursal/>
      </>
    );
  }
 
};

export default Dashboard;
