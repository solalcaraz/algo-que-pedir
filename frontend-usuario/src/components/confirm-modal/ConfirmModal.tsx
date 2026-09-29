import {
  Drawer,
  Button,
  Portal,
  CloseButton
} from '@chakra-ui/react'

interface ConfirmDrawerProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export const ConfirmDrawer = ({
  open,
  onConfirm,
  onCancel,
  message,
}: ConfirmDrawerProps) => {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onCancel()} placement="bottom">
      <Portal>
        <Drawer.Backdrop onClick={onCancel} />
        <Drawer.Positioner>
          <Drawer.Content roundedTop="l3"  maxW="80%" mx="auto">
            
            <Drawer.Header>
              <Drawer.Title>Confirmación</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
              {message}
            </Drawer.Body>

            <Drawer.Footer gap="3">
              <Button variant="outline" onClick={onCancel}>
                No
              </Button>

              <Button colorPalette="blue" onClick={onConfirm}>
                Sí
              </Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton onClick={onCancel}/>
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}