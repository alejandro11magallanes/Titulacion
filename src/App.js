import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './scenes/login';
import Dashboard from './scenes/dashboard';
import Empresas from './scenes/empresas';
import Usuarios from './scenes/usuarios';
import Sucursales from './scenes/sucursales';
import TipoClientes from './scenes/tipoclientes';
import Clientes from './scenes/registroclientes';
import Campanas from './scenes/campanas';
import Visitas from './scenes/visitas';
import InicioEmpleado from './scenesEmpleado/InicioEmpleado';
import ClienteEmpleado from './scenesEmpleado/ClienteEmpleado';
import VisitasEmpleado from './scenesEmpleado/VisitasEmpleado';
import Reportes from './scenes/Reportes';

function App() {
  return (
    <div className="App">        
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/empresas' element={<Empresas />} />
      <Route path='/usuarios' element={<Usuarios />} />
      <Route path='/sucursales' element={<Sucursales />} />
      <Route path='/tipoclientes' element={<TipoClientes />} />
      <Route path='/registroclientes' element={<Clientes />} />
      <Route path='/campanas' element={<Campanas />} />
      <Route path='/registrovisitas' element={<Visitas />} />
      <Route path='/reportes' element={<Reportes />} />
      <Route path='/inicioEmpleado' element={<InicioEmpleado />} />
      <Route path='/clienteEmpleado' element={<ClienteEmpleado />} />
      <Route path='/visitasEmpleado' element={<VisitasEmpleado />} />
    </Routes> 
   
    </div>
  );
}

export default App;
