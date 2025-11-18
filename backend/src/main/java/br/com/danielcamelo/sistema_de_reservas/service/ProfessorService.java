package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    public List<Professor> listarTodos() {
        return professorRepository.findAll();
    }

    public Professor buscarPorId(Integer id) {

        return professorRepository.findById(id).orElse(null);
    }


    public Professor salvar(Professor professor) {
        return professorRepository.save(professor);
    }
}