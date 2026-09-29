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
        <Route path="/loginUsuario" element={<LoginUsuario />} />
        <Route path="/registroUsuario" element={<RegisterUsuario />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to={'/home'} replace />} />
                <Route path="home" element={<LocalesView />} />

                <Route path="perfil-usuario" element={<PerfilUsuario />}>
                    <Route index element={<InformacionPersonal />} />
                    <Route path="criterios-busqueda" element={<CriteriosBusqueda />} />
                    <Route path="ingredientes-preferidos" element={<IngredientesPreferidos />} />
                    <Route path="ingredientes-evitar" element={<IngredientesEvitar />} />
                </Route>

                {/* El carrito vive en este layout para que el detalle del local y el checkout compartan el mismo pedido */}
                <Route element={<CarritoLayout />}>
                    <Route path="/local/:idLocal/platos" element={<DetalleLocal />} />
                    <Route path="/checkout-pedido/" element={<CheckoutPedido />}> </Route>
                </Route>
              
                <Route path="/calificar-local" element={ <CalificacionesView/> } />
                <Route path="/calificar/:localId" element={<CalificarLocalView />} />
              
                <Route path="/detalle-pedido">
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