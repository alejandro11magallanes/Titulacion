import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { Box ,Tooltip } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import BusinessIcon from '@mui/icons-material/Business';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import GroupsIcon from '@mui/icons-material/Groups';
import Groups3Icon from '@mui/icons-material/Groups3';
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

const SidebarCostum = ({selectedItem}) => {
  const [selected, setSelected] = useState(selectedItem);

  return (
    <Box
      className="backsidebar"
    >
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
              title="Empresas"
              to="/empresas"
              icon={<BusinessIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Usuarios"
              to="/usuarios"
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
              title="Tipo de Cliente"
              to="/tipoclientes"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Clientes"
              to="/registroclientes"
              icon={<Groups3Icon />}
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
              title="Exportacion de Visitas"
              to="/registrovisitas"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
            <Item
               title="Reportes de Visitas"
              to="/reportes"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};
export default SidebarCostum;
