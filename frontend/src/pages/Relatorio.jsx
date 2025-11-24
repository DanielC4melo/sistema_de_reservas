import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    title: { textAlign: 'right', fontWeight: 'normal', marginBottom: '40px' },
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '40px' },
    card: { flex: 1, padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: '#f9f9f9' },
    number: { fontSize: '36px', fontWeight: 'bold', color: '#5C8A58', margin: '10px 0' },
    label: { color: '#666', fontSize: '14px' }
};

export default function Relatorio() {
    const navigate = useNavigate();
    
    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        futuras: 0,
        salaFavorita: '-'
    });

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) return;
        const usuario = JSON.parse(userStorage);

        api.get(`/reservas/professor/${usuario.id}`)
            .then(res => {
                const reservas = res.data;
                
                // 1. Cálculo do Total
                const total = reservas.length;

                // 2. Cálculo de Reservas Futuras
                const agora = new Date();
                const futuras = reservas.filter(r => new Date(r.dataReserva) > agora).length;

                // 3. Cálculo da Sala Mais Usada
                const contagemSalas = {};
                reservas.forEach(r => {
                    const nome = r.sala ? r.sala.nome : 'Indefinida';
                    contagemSalas[nome] = (contagemSalas[nome] || 0) + 1;
                });

                let salaTop = '-';
                let maxUso = 0;
                for (const [nome, uso] of Object.entries(contagemSalas)) {
                    if (uso > maxUso) {
                        maxUso = uso;
                        salaTop = nome;
                    }
                }

                setEstatisticas({
                    total,
                    futuras,
                    salaFavorita: salaTop
                });
            })
            .catch(console.error);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div>
                    <h1 style={{fontSize: '24px', margin: 0}}>UNIRIO</h1>
                    <p style={{fontSize: '12px'}}>Sistema de Reservas</p>
                </div>
                <div>
                    <div style={{marginBottom: '10px', cursor: 'pointer'}} onClick={() => navigate('/home')}>
                        🏠 PÁGINA INICIAL
                    </div>
                    <div style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>
                        ↩ VOLTAR
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>Relatórios de Uso</h1>

                <div style={styles.statsGrid}>
                    <div style={styles.card}>
                        <h3>Total de Reservas</h3>
                        <p style={styles.number}>{estatisticas.total}</p>
                        <p style={styles.label}>Desde o início</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Agendadas</h3>
                        <p style={styles.number}>{estatisticas.futuras}</p>
                        <p style={styles.label}>Acontecendo em breve</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Sala Favorita</h3>
                        <p style={{...styles.number, fontSize: '24px'}}>{estatisticas.salaFavorita}</p>
                        <p style={styles.label}>Mais utilizada por você</p>
                    </div>
                </div>
            </div>
        </div>
    );
}