package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Sala;
import br.com.danielcamelo.sistema_de_reservas.service.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @GetMapping
    public List<Sala> listarTodasSalas() {
        return salaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sala> buscarSalaPorId(@PathVariable Integer id) {
        Sala sala = salaService.buscarPorId(id);
        if (sala != null) {
            return ResponseEntity.ok(sala);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Sala criarSala(@RequestBody Sala sala) {
        return salaService.salvar(sala);
    }
}