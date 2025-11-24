import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    title: { textAlign: 'right', fontWeight: 'normal', marginBottom: '40px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #ddd', color: '#555' },
    td: { padding: '15px', borderBottom: '1px solid #eee' },
    msgVazio: { textAlign: 'center', color: '#666', marginTop: '20px', fontSize: '18px' },
    loading: { textAlign: 'center', color: '#5C8A58', marginTop: '20px', fontSize: '18px' }
};

export default function MinhasReservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Pegar o usuário logado
        const userStorage = localStorage.getItem('user');
        if (!userStorage) {
            navigate('/'); // Se não tiver logado, volta pro login
            return;
        }
        const usuario = JSON.parse(userStorage);

        // 2. Buscar as reservas DESTE professor no Backend
        // ATENÇÃO: O Backend precisa ter o endpoint GET /reservas/professor/{id} criado
        api.get(`/reservas/professor/${usuario.id}`)
            .then(res => {
                setReservas(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar reservas:", err);
                setLoading(false);
            });
    }, []);

    // Formatar data para ficar bonito (Dia/Mês/Ano - Hora:Minuto)
    const formatarData = (dataISO) => {
        if (!dataISO) return "-";
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    };

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
                <h1 style={styles.title}>Minhas Reservas</h1>

                {loading ? (
                    <p style={styles.loading}>Carregando...</p>
                ) : (
                    <>
                        {reservas.length === 0 ? (
                            <p style={styles.msgVazio}>Você ainda não possui reservas cadastradas.</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>ID</th>
                                        <th style={styles.th}>Data/Hora</th>
                                        <th style={styles.th}>Sala</th>
                                        <th style={styles.th}>Equipamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map(reserva => (
                                        <tr key={reserva.id}>
                                            <td style={styles.td}>#{reserva.id}</td>
                                            <td style={styles.td}>{formatarData(reserva.dataReserva)}</td>
                                            {/* O ?. evita erro se a sala for nula */}
                                            <td style={styles.td}>{reserva.sala?.nome || "Sala Removida"}</td> 
                                            <td style={styles.td}>{reserva.equipamento ? reserva.equipamento.nome : "Nenhum"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}