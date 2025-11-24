package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.*;
import br.com.danielcamelo.sistema_de_reservas.repository.*;
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

    public List<Reserva> buscarPorProfessor(Integer idProfessor) {
        Professor professor = professorRepository.findById(idProfessor).orElse(null);
        if (professor == null) return Collections.emptyList();
        return reservaRepository.findByProfessor(professor);
    }

    public List<Integer> buscarDiasLotados(Integer idSala, int mes, int ano) {
        Sala sala = salaRepository.findById(idSala).orElse(null);
        if (sala == null) return Collections.emptyList();
        List<Integer> diasLotados = new java.util.ArrayList<>();
        int totalDias = java.time.YearMonth.of(ano, mes).lengthOfMonth();
        for (int dia = 1; dia <= totalDias; dia++) {
            LocalDateTime inicioDia = LocalDateTime.of(ano, mes, dia, 0, 0);
            LocalDateTime fimDia = LocalDateTime.of(ano, mes, dia, 23, 59);
            if (reservaRepository.countBySalaAndDataReservaBetween(sala, inicioDia, fimDia) >= 4) diasLotados.add(dia);
        }
        return diasLotados;
    }

    public List<String> buscarHorariosOcupados(Integer idSala, String dataTexto) {
        LocalDateTime inicioDia = LocalDateTime.parse(dataTexto + "T00:00:00");
        LocalDateTime fimDia = LocalDateTime.parse(dataTexto + "T23:59:59");
        Sala sala = salaRepository.findById(idSala).orElse(null);
        if (sala == null) return Collections.emptyList();
        return reservaRepository.findBySalaAndDataReservaBetween(sala, inicioDia, fimDia).stream()
                .map(r -> String.format("%02d:%02d", r.getDataReserva().getHour(), r.getDataReserva().getMinute()))
                .toList();
    }

    public Reserva criarReserva(Reserva novaReserva) {
        if (novaReserva.getDataReserva().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Não é possível realizar reservas em datas passadas.");
        }

        validarDadosReserva(novaReserva);

        if (reservaRepository.existsBySalaAndDataReserva(novaReserva.getSala(), novaReserva.getDataReserva())) {
            throw new RuntimeException("Esta sala já está reservada para este horário!");
        }

        validarLimiteProfessor(novaReserva);

        return reservaRepository.save(novaReserva);
    }

    public Reserva atualizarReserva(Integer id, Reserva dadosAtualizados) {
        Reserva reservaExistente = buscarPorId(id);
        if (reservaExistente == null) throw new RuntimeException("Reserva não encontrada.");

        validarDadosReserva(dadosAtualizados);

        reservaExistente.setSala(dadosAtualizados.getSala());
        reservaExistente.setEquipamento(dadosAtualizados.getEquipamento());

        if (reservaRepository.existsBySalaAndDataReservaAndIdNot(dadosAtualizados.getSala(), reservaExistente.getDataReserva(), id)) {
            throw new RuntimeException("A nova sala escolhida já está ocupada neste horário!");
        }

        return reservaRepository.save(reservaExistente);
    }

    private void validarDadosReserva(Reserva r) {
        if (r.getSala() != null && r.getSala().getId() != null) {
            r.setSala(salaRepository.findById(r.getSala().getId()).orElseThrow(() -> new RuntimeException("Sala não encontrada")));
        }
        if (r.getEquipamento() != null && r.getEquipamento().getId() != null) {
            r.setEquipamento(equipamentoRepository.findById(r.getEquipamento().getId()).orElseThrow(() -> new RuntimeException("Equipamento não encontrado")));
        } else {
            r.setEquipamento(null);
        }
        if (r.getProfessor() != null && r.getProfessor().getIdProfessor() != null) {
            r.setProfessor(professorRepository.findById(r.getProfessor().getIdProfessor()).orElseThrow(() -> new RuntimeException("Professor não encontrado")));
        }
    }

    private void validarLimiteProfessor(Reserva r) {
        long reservasFuturas = reservaRepository.findByProfessor(r.getProfessor()).stream()
                .filter(res -> res.getDataReserva().isAfter(LocalDateTime.now()))
                .count();
        if (reservasFuturas >= 2) throw new RuntimeException("Limite de 2 reservas atingido.");
    }

    public void cancelarReserva(Integer idReserva, boolean isCoordenacao) {
        Reserva reserva = reservaRepository.findById(idReserva).orElseThrow(() -> new RuntimeException("Não encontrada"));
        if (!isCoordenacao && LocalDateTime.now().plusHours(24).isAfter(reserva.getDataReserva())) {
            throw new RuntimeException("Cancelamento não permitido (regra 24h).");
        }
        reservaRepository.delete(reserva);
    }
}