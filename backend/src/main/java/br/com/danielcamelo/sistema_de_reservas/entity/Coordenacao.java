package br.com.danielcamelo.sistema_de_reservas.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "COORDENACAO")
public class Coordenacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCoordenacao;

    @Column(name = "nomeCoordenacao", nullable = false)
    private String nomeCoordenacao;

    @Column(name = "emailCoordenacao", nullable = false, unique = true)
    private String emailCoordenacao;

    @Column(name = "senhaCoordenacao", nullable = false)
    private String senhaCoordenacao;

    @OneToMany(mappedBy = "coordenacao")
    private Set<Reserva> reservasCriadas;

    public Coordenacao() {
    }


    public Integer getIdCoordenacao() {
        return idCoordenacao;
    }

    public void setIdCoordenacao(Integer idCoordenacao) {
        this.idCoordenacao = idCoordenacao;
    }

    public String getNomeCoordenacao() {
        return nomeCoordenacao;
    }

    public void setNomeCoordenacao(String nomeCoordenacao) {
        this.nomeCoordenacao = nomeCoordenacao;
    }

    public String getEmailCoordenacao() {
        return emailCoordenacao;
    }

    public void setEmailCoordenacao(String emailCoordenacao) {
        this.emailCoordenacao = emailCoordenacao;
    }

    public String getSenhaCoordenacao() {
        return senhaCoordenacao;
    }

    public void setSenhaCoordenacao(String senhaCoordenacao) {
        this.senhaCoordenacao = senhaCoordenacao;
    }

    public Set<Reserva> getReservasCriadas() {
        return reservasCriadas;
    }

    public void setReservasCriadas(Set<Reserva> reservasCriadas) {
        this.reservasCriadas = reservasCriadas;
    }
}