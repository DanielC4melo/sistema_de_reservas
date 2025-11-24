package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.Equipamento;
import br.com.danielcamelo.sistema_de_reservas.entity.Professor;
import br.com.danielcamelo.sistema_de_reservas.entity.Reserva;
import br.com.danielcamelo.sistema_de_reservas.entity.Sala;
import br.com.danielcamelo.sistema_de_reservas.repository.EquipamentoRepository;
import br.com.danielcamelo.sistema_de_reservas.repository.ProfessorRepository;
import br.com.danielcamelo.sistema_de_reservas.repository.ReservaRepository;
import br.com.danielcamelo.sistema_de_reservas.repository.SalaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private SalaRepository salaRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private EquipamentoRepository equipamentoRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Reserva buscarPorId(Integer id) {
        return reservaRepository.findById(id).orElse(null);
    }

    // O método que o Controller chama
    public List<Reserva> buscarPorProfessor(Integer idProfessor) {
        Professor professor = professorRepository.findById(idProfessor).orElse(null);
        if (professor == null) return Collections.emptyList();
        return reservaRepository.findByProfessor(professor);
    }

    public Reserva criarReserva(Reserva novaReserva) {
        // ... (Busca de Sala, Professor e Equipamento continuam iguais aqui em cima) ...

        // 1. Buscar a Sala Real (Código que já existia)
        if (novaReserva.getSala() != null && novaReserva.getSala().getId() != null) {
            Sala salaReal = salaRepository.findById(novaReserva.getSala().getId())
                    .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
            novaReserva.setSala(salaReal);
        } else {
            throw new RuntimeException("A sala é obrigatória.");
        }

        // ... (Busca de Professor e Equipamento continuam iguais) ...
        if (novaReserva.getProfessor() != null && novaReserva.getProfessor().getIdProfessor() != null) {
            Professor profReal = professorRepository.findById(novaReserva.getProfessor().getIdProfessor())
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            novaReserva.setProfessor(profReal);
        }

        if (novaReserva.getEquipamento() != null && novaReserva.getEquipamento().getId() != null) {
            Equipamento equipReal = equipamentoRepository.findById(novaReserva.getEquipamento().getId())
                    .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));
            novaReserva.setEquipamento(equipReal);
        } else {
            novaReserva.setEquipamento(null);
        }

        // Validação de Data
        if (novaReserva.getDataReserva() == null) {
            throw new RuntimeException("A data da reserva é obrigatória.");
        }

        // --- NOVA REGRA: CONFLITO DE HORÁRIO ---
        // Verifica se JÁ EXISTE uma reserva para esta Sala nesta Data/Hora
        boolean jaReservado = reservaRepository.existsBySalaAndDataReserva(
                novaReserva.getSala(),
                novaReserva.getDataReserva()
        );

        if (jaReservado) {
            throw new RuntimeException("Esta sala já está reservada para este horário!");
        }
        // ---------------------------------------

        // Regra: Limite de 2 reservas (Continua igual)
        List<Reserva> reservasDoProf = reservaRepository.findByProfessor(novaReserva.getProfessor());
        long reservasFuturas = reservasDoProf.stream()
                .filter(r -> r.getDataReserva().isAfter(LocalDateTime.now()))
                .count();

        if (reservasFuturas >= 2) {
            throw new RuntimeException("Este professor já atingiu o limite de 2 reservas futuras.");
        }

        return reservaRepository.save(novaReserva);
    }
    public List<String> buscarHorariosOcupados(Integer idSala, String dataTexto) {
        // dataTexto vem como "2025-11-25"

        // 1. Definir o intervalo do dia (00:00 até 23:59)
        LocalDateTime inicioDia = LocalDateTime.parse(dataTexto + "T00:00:00");
        LocalDateTime fimDia = LocalDateTime.parse(dataTexto + "T23:59:59");

        // 2. Buscar a Sala
        Sala sala = salaRepository.findById(idSala).orElse(null);
        if (sala == null) return Collections.emptyList();

        // 3. Buscar reservas
        List<Reserva> reservas = reservaRepository.findBySalaAndDataReservaBetween(sala, inicioDia, fimDia);

        // 4. Transformar a lista de Reservas apenas numa lista de "HORAS" (ex: "14:00")
        return reservas.stream()
                .map(r -> {
                    // Pega a hora e minuto e formata (Ex: 14:00)
                    String hora = String.format("%02d:%02d", r.getDataReserva().getHour(), r.getDataReserva().getMinute());
                    return hora;
                })
                .toList();
    }

}