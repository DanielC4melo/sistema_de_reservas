package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Equipamento;
import br.com.danielcamelo.sistema_de_reservas.service.EquipamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipamentos")
public class EquipamentoController {

    @Autowired
    private EquipamentoService equipamentoService;

    @GetMapping
    public List<Equipamento> listarTodosEquipamentos() {
        return equipamentoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipamento> buscarEquipamentoPorId(@PathVariable Integer id) {
        Equipamento equipamento = equipamentoService.buscarPorId(id);
        if (equipamento != null) {
            return ResponseEntity.ok(equipamento);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Equipamento criarEquipamento(@RequestBody Equipamento equipamento) {
        return equipamentoService.salvar(equipamento);
    }
}