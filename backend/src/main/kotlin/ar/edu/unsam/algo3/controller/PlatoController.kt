package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Plato
import ar.edu.unsam.algo3.dto.PlatoDTO
import ar.edu.unsam.algo3.dto.toDTO
import ar.edu.unsam.algo3.service.PlatoService
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin("*")
class PlatoController(val platoService: PlatoService) {
    @GetMapping("/plato")
    fun listarPlatos(): Set<PlatoDTO> =
        platoService.getAll().map { it.toDTO() }.toMutableSet()

    @GetMapping("/plato/{id}")
    fun platoPorId(@PathVariable id: Int) = platoService.getById(id)?.toDTO()

    @PostMapping("/plato")
    fun crearPlato(@RequestBody platoBody: Plato, @RequestParam idLocal: Int): PlatoDTO =
        platoService.create(platoBody, idLocal).toDTO()

    @PutMapping("/plato/{id}")
    fun actualizarPlato(@PathVariable id: Int, @RequestBody platoBody: Plato, @RequestParam idLocal: Int): PlatoDTO =
        platoService.update(id, platoBody, idLocal).toDTO()

    @DeleteMapping("/plato/{id}")
    fun borrarPlato(@PathVariable id: Int): List<Plato> =
        platoService.delete(id)
}
