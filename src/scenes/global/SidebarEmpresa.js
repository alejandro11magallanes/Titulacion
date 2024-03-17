import React,{ useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import ApartmentIcon from '@mui/icons-material/Apartment';
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio';
import DescriptionIcon from '@mui/icons-material/Description';

import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PeopleIcon from '@mui/icons-material/People';
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import Groups3Icon from "@mui/icons-material/Groups3";
import "./styles.css";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <Tooltip title={title} placement="right">
       
    <MenuItem
      component={<Link to={to} />}
      active={selected === title}
      style={{
        backgroundColor: selected === title ? 'transparent' : 'inherit',
        color:selected === title ? 'rgb(45, 196, 45)': 'inherit',
      }}
      onClick={() => setSelected(title)}
   
    >
       {icon}
        <div
          style={{
            width: selected === title ? '10%' : 0,
            backgroundColor: 'rgb(45, 196, 45)',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            transition: 'width 0.3s ease',
          }}
        ></div>
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
              title="Empresa"
              to="/tuempresa"
              icon={<ApartmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usuarios"
              to="/tususuarios"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sucursales"
              to="/tusucursales"
              icon={<AddBusinessIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Clientes"
              to="/tusclientes"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tipos de Cliente"
              to="/tustiposdecliente"
              icon={<Groups3Icon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Campañas"
              to="/tuscampanas"
              icon={<SpatialAudioIcon />}
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
