import { Box, Flex, VStack, Image, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

import home from '/home.svg'
import ticketRecibo from '/ticketRecibo.svg'
import perfil from '/perfil.svg'
import estrellaPuntuacion  from '/estrellaPuntuacion.svg'

//Hay que agregar las rutas aca y en el routes.tsx
const linksFooter = [
    { link: '/home', label:'Inicio', icon: home },
    { link: '/detalle-pedido/', label: 'Pedidos', icon: ticketRecibo },
    { link: '/calificar-local  ', label: 'Calificar', icon: estrellaPuntuacion },
    { link: '/perfil-usuario', label: 'Perfil', icon: perfil }
]

export const SEPARADOR_FOOTER = '5rem'

export const FooterApp = () => {
    return (
        <Box as="footer" bgColor="fondo" position="fixed" bottom="0" width="100%" p="0.5rem" borderTop="1px solid" borderColor="red.100">
            <Flex direction="row" className="rutas-footer" justifyContent="space-around">
                { linksFooter.map((item) => (
                    <RouterLink to={item.link} key={item.label}>
                        <VStack gap={1.5}>
                            <Image height="30px" width="30px" src={item.icon} alt={item.label}/>
                            <Text textStyle="sm">{item.label}</Text>
                        </VStack >
                    </RouterLink>
                 ))}
            </Flex>
        </Box>
    )
}