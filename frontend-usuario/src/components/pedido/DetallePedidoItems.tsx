import React from "react"
import { VStack, HStack, Text, Heading } from "@chakra-ui/react"

export interface ResumenData {
  titulo?: string
  items: {
    label: string
    value: number
    bold?: boolean
  }[]
}

export const ResumenDetallePedido: React.FC<ResumenData> = ({ titulo = "Resumen", items }) => {
  return (
    <VStack align="stretch" mb={6}>
      <Heading as="h2" size="xl" mb={3}>{titulo}</Heading>

      {items.map((item, i) => (
        <HStack
          key={i}
          justify="space-between"
          mb={1}
          fontWeight={item.bold ? "bold" : "normal"}
        >
          <Text>{item.label}</Text>
          <Text>${item.value.toFixed(2)}</Text>
        </HStack>
      ))}
    </VStack>
  )
}

export default ResumenDetallePedido
