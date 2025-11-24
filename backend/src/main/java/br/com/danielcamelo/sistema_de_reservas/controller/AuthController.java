package br.com.danielcamelo.sistema_de_reservas.controller;

import br.com.danielcamelo.sistema_de_reservas.dto.LoginRequest;
import br.com.danielcamelo.sistema_de_reservas.entity.Coordenacao;
import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.repository.CoordenacaoRepository;
import br.com.danielcamelo.sistema_de_reservas.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // Define o endereço base
public class AuthController {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CoordenacaoRepository coordenacaoRepository;

    @PostMapping("/login") // Define a ação de login
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // 1. Tenta achar um Professor
        Professor professor = professorRepository.findByEmailProfessorAndSenhaProfessor(
                loginRequest.getEmail(), loginRequest.getSenha());

        if (professor != null) {
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("tipo", "PROFESSOR");
            resposta.put("id", professor.getIdProfessor());
            resposta.put("nome", professor.getNomeProfessor());
            return ResponseEntity.ok(resposta);
        }

        // 2. Tenta achar Coordenação
        Coordenacao coordenacao = coordenacaoRepository.findByEmailCoordenacaoAndSenhaCoordenacao(
                loginRequest.getEmail(), loginRequest.getSenha());

        if (coordenacao != null) {
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("tipo", "COORDENACAO");
            resposta.put("id", coordenacao.getIdCoordenacao());
            resposta.put("nome", coordenacao.getNomeCoordenacao());
            return ResponseEntity.ok(resposta);
        }

        // 3. Se não achou ninguém
        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
}