package br.com.danielcamelo.sistema_de_reservas.repository;

import br.com.danielcamelo.sistema_de_reservas.entity.Coordenacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordenacaoRepository extends JpaRepository<Coordenacao, Integer> {

    // Adicione esta linha lá também:
    Coordenacao findByEmailCoordenacaoAndSenhaCoordenacao(String email, String senha);

}