import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import Groups3Icon from "@mui/icons-material/Groups3";
import "./styles.css";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Tooltip title={title} placement="right">
       
    <MenuItem
      component={<Link to={to} />}
      active={selected === title}
      style={{ backgroundColor: selected === title ? 'rgb(45, 196, 45)' : 'inherit',
      color: selected === title ? 'white' : 'inherit' }}
      onClick={() => setSelected(title)}
     icon={icon}
    >
    </MenuItem>
    </Tooltip>
  );
};

const SidebarCostumEmpresa = ({selectedItem}) => {
  const [selected, setSelected] = useState(selectedItem);

  return (
    <Box>
      <Sidebar collapsed={true}>
        <Menu iconShape="square">
          <Box sx={{height: "100vh"}}>
            <Item
              title="Inicio"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usuarios"
              to="/tususuarios"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sucursales"
              to="/sucursales"
              icon={<AddBusinessIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Registro de Clientes"
              to="/registroclientes"
              icon={<Groups3Icon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Registro de Visitas"
              to="/registrovisitas"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Campañas"
              to="/campanas"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Campañas X Cliente"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Clientes X Tipo"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Reporte Clientes"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};
export default SidebarCostumEmpresa;
