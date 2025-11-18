package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.entity.Coordenacao;
import br.com.danielcamelo.sistema_de_reservas.service.CoordenacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordenacao")
public class CoordenacaoController {

    @Autowired
    private CoordenacaoService coordenacaoService;

    @GetMapping
    public List<Coordenacao> listarTodaCoordenacao() {
        return coordenacaoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coordenacao> buscarCoordenacaoPorId(@PathVariable Integer id) {
        Coordenacao coordenacao = coordenacaoService.buscarPorId(id);
        if (coordenacao != null) {
            return ResponseEntity.ok(coordenacao);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Coordenacao criarCoordenacao(@RequestBody Coordenacao coordenacao) {
        return coordenacaoService.salvar(coordenacao);
    }
}