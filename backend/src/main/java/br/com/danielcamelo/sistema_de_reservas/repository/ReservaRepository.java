package br.com.danielcamelo.sistema_de_reservas.repository; // O pacote agora está correto

import br.com.danielcamelo.sistema_de_reservas.entity.Reserva; // Importa a sua nova entidade
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

}