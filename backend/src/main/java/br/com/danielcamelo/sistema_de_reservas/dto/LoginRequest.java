package br.com.danielcamelo.sistema_de_reservas.dto;

public class LoginRequest {

    // Estas são as variáveis onde os dados vão ficar guardados
    private String email;
    private String senha;

    // --- Getters e Setters (Os "puxadores" para o Java pegar os dados) ---

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}