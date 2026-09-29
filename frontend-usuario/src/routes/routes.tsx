// RUTAS DE LA PAGINA [React Routes]
import { CheckoutPedido } from '@/pages/checkout-pedido/Checkout'
import { PerfilUsuario } from '@/pages/usuario/Perfil'
import { CriteriosBusqueda } from '@/pages/usuario/preferencias/criteriosBusqueda'
import { IngredientesEvitar, IngredientesPreferidos } from '@/pages/usuario/preferencias/ingredientes'
import { AppLayout } from '@/components/layout/AppLayout'
import { DetalleLocal } from '@/pages/detalle-local/DetalleLocal'
import { ListaPedidos } from '@/pages/detalle-pedido/ListaPedidos'
import { PaginaDetallePedido } from '@/pages/detalle-pedido/DetallePedido'
import { LocalesView } from '@/pages/home/home'
import { InformacionPersonal } from '@/pages/usuario/formulario/InformacionPersonal'
import { LoginUsuario } from '@/pages/login/login'
import { RegisterUsuario } from '@/pages/register/register'
import { CalificacionesView } from '@/pages/calificar-local/Calificar'

import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { CarritoLayout } from '@/pages/layout-carrito/CarritoLayout'
import CalificarLocalView from '@/pages/calificar-local/CalificarLocal'

const ProtectedRoute = () => {
    const estaLogueado = !!localStorage.getItem('idUsuario')

    return estaLogueado ? <Outlet /> : <Navigate to="/loginUsuario" replace />
}


export const AQPRoutes = () =>
    <Routes>
        {/*Son las RUTAS PUBLICAS para el usuario*/}
        <Route path="/loginUsuario" element={<LoginUsuario />} />
        <Route path="/registroUsuario" element={<RegisterUsuario />} />

        {/*RUTAS PRIVADAS que solo podes ver si estas logueado*/}
        <Route element={<ProtectedRoute />}>
            {/* El layout envuelve al resto de las paginas*/}
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to={'/home'} replace />} />
                {/* <Route path="*" element={<Navigate to={'/home'} replace/>} />                            */}
                <Route path="home" element={<LocalesView />} />                    {/* Home */}

                <Route path="perfil-usuario" element={<PerfilUsuario />}>              {/* Pags de Usuario */}
                    <Route index element={<InformacionPersonal />} />
                    <Route path="criterios-busqueda" element={<CriteriosBusqueda />} />
                    <Route path="ingredientes-preferidos" element={<IngredientesPreferidos />} />
                    <Route path="ingredientes-evitar" element={<IngredientesEvitar />} />
                </Route>

                {/* Layout compartido entre vista donde se crea el pedido + el checkout */}
                <Route element={<CarritoLayout />}>                                                         {/* Armado y checkout del pedido */}
                    <Route path="/local/:idLocal/platos" element={<DetalleLocal />} />
                    <Route path="/checkout-pedido/" element={<CheckoutPedido />}> </Route>
                </Route>
              
                <Route path="/calificar-local" element={ <CalificacionesView/> } />
                <Route path="/calificar/:localId" element={<CalificarLocalView />} />
              
                <Route path="/detalle-pedido">                  {/* Detalle del pedido */}
                    <Route index element={<ListaPedidos />} />
                    <Route path=":id" element={<PaginaDetallePedido />} />
                </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/loginUsuario" replace />} />
        </Route>

    </Routes>

export const AlgoQuePedirRouter = () =>
    <Router>
        <AQPRoutes />
    </Router>