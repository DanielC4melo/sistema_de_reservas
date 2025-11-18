package br.com.danielcamelo.sistema_de_reservas.service;

import br.com.danielcamelo.sistema_de_reservas.entity.Coordenacao;
import br.com.danielcamelo.sistema_de_reservas.repository.CoordenacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordenacaoService {

    @Autowired
    private CoordenacaoRepository coordenacaoRepository;

    public List<Coordenacao> listarTodos() {
        return coordenacaoRepository.findAll();
    }

    public Coordenacao buscarPorId(Integer id) {
        return coordenacaoRepository.findById(id).orElse(null);
    }

    public Coordenacao salvar(Coordenacao coordenacao) {
        return coordenacaoRepository.save(coordenacao);
    }
}