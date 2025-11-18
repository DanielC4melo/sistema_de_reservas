package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.Sala;
import br.com.danielcamelo.sistema_de_reservas.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    public List<Sala> listarTodas() {
        return salaRepository.findAll();
    }

    public Sala buscarPorId(Integer id) {
        return salaRepository.findById(id).orElse(null);
    }

    public Sala salvar(Sala sala) {
        return salaRepository.save(sala);
    }
}