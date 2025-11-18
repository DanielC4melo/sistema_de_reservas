package br.com.danielcamelo.sistema_de_reservas.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "SALA")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome", nullable = false) // "nullable = false" diz que este campo é obrigatório
    private String nome;

    @Column(name = "capacidade")
    private Integer capacidade;

    @OneToMany(mappedBy = "sala")
    private Set<Reserva> reservas;

    public Sala() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }

    public Set<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(Set<Reserva> reservas) {
        this.reservas = reservas;
    }
}