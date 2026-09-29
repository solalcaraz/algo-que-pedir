import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { FooterApp, SEPARADOR_FOOTER } from '../footer/footer'

export const AppLayout = () => {
    return (
        <Box>
            <Outlet />
            {/* Reserva el alto del footer fijo para que no tape el final de la página */}
            <Box height= {SEPARADOR_FOOTER} />
            <FooterApp />
        </Box>
    )
}