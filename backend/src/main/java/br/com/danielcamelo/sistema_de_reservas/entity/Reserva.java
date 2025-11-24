package br.com.danielcamelo.sistema_de_reservas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idReserva")
    private Integer id;

    // --- AQUI ESTAVA O ERRO ---
    // O Java precisa que se chame "dataReserva" para o Repository funcionar.
    // Mas no banco chama-se "data". O @Column faz a tradução.
    @Column(name = "data", nullable = false)
    private LocalDateTime dataReserva;
    // --------------------------

    @Column(name = "relatorio")
    private String relatorio;

    @Enumerated(EnumType.STRING)
    @Column(name = "criadaPor", nullable = false)
    private TipoCriador criadaPor;

    // --- RELACIONAMENTOS BLINDADOS ---

    @ManyToOne
    @JoinColumn(name = "fk_IdSala", nullable = false)
    @JsonIgnoreProperties("reservas")
    private Sala sala;

    @ManyToOne
    @JoinColumn(name = "fk_IdProfessor", nullable = false)
    @JsonIgnoreProperties("reservas")
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "fk_IdCoordenacao", nullable = true)
    @JsonIgnoreProperties("reservasCriadas")
    private Coordenacao coordenacao;

    @ManyToOne
    @JoinColumn(name = "fk_IdEquipamento")
    @JsonIgnoreProperties("reservas")
    private Equipamento equipamento;

    public Reserva() {
    }

    // --- Getters e Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDataReserva() { // O Service precisa deste nome!
        return dataReserva;
    }

    public void setDataReserva(LocalDateTime dataReserva) {
        this.dataReserva = dataReserva;
    }

    public String getRelatorio() {
        return relatorio;
    }

    public void setRelatorio(String relatorio) {
        this.relatorio = relatorio;
    }

    public TipoCriador getCriadaPor() {
        return criadaPor;
    }

    public void setCriadaPor(TipoCriador criadaPor) {
        this.criadaPor = criadaPor;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public Coordenacao getCoordenacao() {
        return coordenacao;
    }

    public void setCoordenacao(Coordenacao coordenacao) {
        this.coordenacao = coordenacao;
    }

    public Equipamento getEquipamento() {
        return equipamento;
    }

    public void setEquipamento(Equipamento equipamento) {
        this.equipamento = equipamento;
    }
}