package ar.edu.unsam.algo3.controller

import ar.edu.unsam.algo3.Ingrediente
import ar.edu.unsam.algo3.dto.IngredienteUsuarioDTO
import ar.edu.unsam.algo3.dto.toUsuarioIngredienteDTO
import ar.edu.unsam.algo3.service.IngredienteService
import ar.edu.unsam.algo3.dto.IngredienteDTO
import ar.edu.unsam.algo3.dto.toDTO
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin("*")
class IngredienteController(val ingredienteService: IngredienteService) {
    @GetMapping("/ingrediente")
    fun listarIngredientes(): List<IngredienteDTO> =
        ingredienteService.getAll().map { it.toDTO() }.toMutableList()

    @GetMapping("/ingrediente/{id}")
    fun ingredientePorId(@PathVariable id: Int): IngredienteDTO = ingredienteService.getById(id).toDTO()

    // para los ingredientes que se muestran en los criterios
    @GetMapping("/ingrediente/criterio")
    fun listarTodosCriterio(): List<IngredienteUsuarioDTO> =
        ingredienteService.getAll().map { it.toUsuarioIngredienteDTO() }.toMutableList()

    @PutMapping("/ingrediente/{id}")
    fun actualizarIngrediente(@PathVariable id: Int, @RequestBody ingredienteBody: Ingrediente): IngredienteDTO {
        return ingredienteService.update(id, ingredienteBody).toDTO()
    }

    @DeleteMapping("/ingrediente/{id}")
    fun eliminar(@PathVariable id: Int): IngredienteDTO = ingredienteService.borrarIngrediente(id).toDTO()

    @PostMapping("/ingrediente")
    fun crearIngrediente(@RequestBody ingredienteBody: Ingrediente): IngredienteDTO =
        ingredienteService.create(ingredienteBody).toDTO()

}