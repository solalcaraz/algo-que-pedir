import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { FooterApp, SEPARADOR_FOOTER } from '../footer/footer'

export const AppLayout = () => {
    return (
        <Box>
            <Outlet />
            <Box height= {SEPARADOR_FOOTER} /> {/*Es para que el footer no se "coma" parte de la pagina*/}
            <FooterApp />
        </Box>
    )
}