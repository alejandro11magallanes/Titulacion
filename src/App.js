import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
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
import UsuariosEmpresa from './scenesEmpresa/UsuariosEmpresa';
import EmpresaIndividual from './scenesEmpresa/EmpresarioEmpresa';
import SucuralesEmpresa from './scenesEmpresa/SucuralesEmpresa';
import TiposDeClienteEmpresa from './scenesEmpresa/TipoDeClientesEmpresa';
import ClientesEmpresa from './scenesEmpresa/ClientesEmpresa';
import CampanaEmpresa from './scenesEmpresa/CampanasEmpresa';
function App() {
  
    const isLogged = localStorage.getItem("IsLogged") === "true";

  return (
    <div className="App">      

    <Routes>
    
      <Route path='/' element={isLogged ? <Navigate to="dashboard"/>: <Login/>} />
      <Route path='/dashboard' element={isLogged ? <Dashboard /> : <Navigate to="/" />} />
      <Route path='/empresas' element={isLogged ? <Empresas /> : <Navigate to="/" />} />
      <Route path='/usuarios' element={isLogged ? <Usuarios /> : <Navigate to="/" />}/>
      <Route path='/sucursales' element={isLogged ? <Sucursales /> : <Navigate to="/" />} />
      <Route path='/tipoclientes' element={isLogged ? <TipoClientes /> : <Navigate to="/" />}/>
      <Route path='/registroclientes' element={isLogged ? <Clientes /> : <Navigate to="/" />} />
      <Route path='/campanas' element={isLogged ? <Campanas /> : <Navigate to="/" />} />
      <Route path='/registrovisitas' element={isLogged ? <Visitas /> : <Navigate to="/" />} />
      <Route path='/reportes' element={isLogged ? <Reportes /> : <Navigate to="/" />} />
      <Route path='/inicioEmpleado' element={isLogged ? <InicioEmpleado /> : <Navigate to="/" />} />
      <Route path='/clienteEmpleado' element={isLogged ? <ClienteEmpleado /> : <Navigate to="/" />} />
      <Route path='/visitasEmpleado' element={isLogged ? <VisitasEmpleado /> : <Navigate to="/" />} />
      {/* rutas de usuario empresa */}
      <Route path='/tususuarios' element={isLogged ? <UsuariosEmpresa /> : <Navigate to="/" />} />
      <Route path='/tuempresa' element={isLogged ? <EmpresaIndividual /> : <Navigate to="/" />} />
      <Route path='/tusucursales' element={isLogged ? <SucuralesEmpresa /> : <Navigate to="/" />} />
      <Route path='/tusclientes' element={isLogged ? <ClientesEmpresa /> : <Navigate to="/" />} />
      <Route path='/tustiposdecliente' element={isLogged ? <TiposDeClienteEmpresa /> : <Navigate to="/" />} />
      <Route path='/tuscampanas' element={isLogged ? <CampanaEmpresa /> : <Navigate to="/" />} />
    </Routes> 
 
    </div>
  );
}

export default App;
