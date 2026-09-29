import { Box } from '@chakra-ui/react'
import { AlgoQuePedirRouter } from './routes/routes'
import { Toaster } from './components/chakra-toaster/toaster'

const App = () => {
  return (
    <Box>
      <AlgoQuePedirRouter />
      <Toaster />
    </Box>
  )
}

export default App