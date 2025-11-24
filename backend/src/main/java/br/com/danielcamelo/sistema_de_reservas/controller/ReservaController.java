package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public List<Reserva> listarTodas() {
        return reservaService.listarTodas();
    }

    // Este é o método que a página "Minhas Reservas" precisa
    @GetMapping("/professor/{id}")
    public List<Reserva> listarPorProfessor(@PathVariable Integer id) {
        return reservaService.buscarPorProfessor(id);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Reserva reserva) {
        try {
            Reserva novaReserva = reservaService.criarReserva(reserva);
            return ResponseEntity.ok(novaReserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/ocupadas")
    public List<String> getHorariosOcupados(@RequestParam Integer salaId, @RequestParam String data) {
        return reservaService.buscarHorariosOcupados(salaId, data);
    }
}