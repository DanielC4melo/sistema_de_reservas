package br.com.danielcamelo.sistema_de_reservas.repository;

import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Integer> {

    // --- ESTA É A LINHA MÁGICA QUE FALTAVA ---
    // O Spring cria o SQL automaticamente baseado no nome deste método:
    Professor findByEmailProfessorAndSenhaProfessor(String email, String senha);

}