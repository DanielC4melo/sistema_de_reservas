package br.com.danielcamelo.sistema_de_reservas.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "RESERVA")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(name = "status")
    private String status;


    @ManyToOne
    @JoinColumn(name = "id_sala") // Nome da sua coluna de chave estrangeira para a sala
    private Sala sala;

    @ManyToMany
    @JoinTable(
            name = "RESERVA_EQUIPAMENTO", // O nome exato da sua tabela de ligação no DDL
            joinColumns = @JoinColumn(name = "id_reserva"), // Coluna que aponta para Reserva
            inverseJoinColumns = @JoinColumn(name = "id_equipamento") // Coluna que aponta para Equipamento
    )
    private Set<Equipamento> equipamentos;

    public Reserva() {
    }

    @ManyToOne
    @JoinColumn(name = "id_professor", nullable = false) // nullable = false torna obrigatório
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "id_coordenacao", nullable = true) // nullable = true torna opcional
    private Coordenacao coordenacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "criadaPor", nullable = false)
    private TipoCriador criadaPor; // (Este é o Enum que criámos)

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Set<Equipamento> getEquipamentos() {
        return equipamentos;
    }

    public void setEquipamentos(Set<Equipamento> equipamentos) {
        this.equipamentos = equipamentos;
    }

    public Coordenacao getCoordenacao() {
        return coordenacao;
    }

    public void setCoordenacao(Coordenacao coordenacao) {
        this.coordenacao = coordenacao;
    }

    public TipoCriador getCriadaPor() {
        return criadaPor;
    }

    public void setCriadaPor(TipoCriador criadaPor) {
        this.criadaPor = criadaPor;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }
}