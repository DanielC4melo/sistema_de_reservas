package br.com.danielcamelo.sistema_de_reservas.repository;

import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.entity.Sala; // Importe a Sala
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    // Buscar reservas de uma sala em um intervalo de tempo (ex: o dia todo de hoje)
    List<Reserva> findBySalaAndDataReservaBetween(Sala sala, LocalDateTime inicioDia, LocalDateTime fimDia);
    List<Reserva> findByProfessor(Professor professor);

    // --- NOVO MÉTODO DE CHECAGEM ---
    // Retorna "true" se encontrar qualquer reserva com essa sala e data
    boolean existsBySalaAndDataReserva(Sala sala, LocalDateTime dataReserva);
}