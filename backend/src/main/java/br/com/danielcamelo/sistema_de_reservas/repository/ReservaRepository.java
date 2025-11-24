package br.com.danielcamelo.sistema_de_reservas.repository;

import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.entity.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.com.danielcamelo.sistema_de_reservas.entity.TipoCriador;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    List<Reserva> findByProfessor(Professor professor);

    // Verifica conflito normal (para criar)
    boolean existsBySalaAndDataReserva(Sala sala, LocalDateTime dataReserva);

    boolean existsBySalaAndDataReservaAndIdNot(Sala sala, LocalDateTime dataReserva, Integer id);

    long countBySalaAndDataReservaBetween(Sala sala, LocalDateTime inicio, LocalDateTime fim);

    List<Reserva> findBySalaAndDataReservaBetween(Sala sala, LocalDateTime inicioDia, LocalDateTime fimDia);

    long countByProfessorAndDataReservaAfterAndCriadaPor(
            Professor professor,
            LocalDateTime data,
            TipoCriador criadaPor
    );
}