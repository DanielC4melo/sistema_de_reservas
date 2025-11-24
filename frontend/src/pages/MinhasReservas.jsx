import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function MinhasReservas() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const styles = {
        container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.background, color: colors.text, transition: '0.3s' },
        sidebar: { width: '250px', backgroundColor: colors.sidebar, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: colors.sidebarText, transition: '0.3s' },
        content: { flex: 1, padding: '40px', backgroundColor: colors.background, overflowY: 'auto' },
        title: { textAlign: 'right', fontWeight: 'normal', marginBottom: '40px' },
        table: { width: '100%', borderCollapse: 'collapse', backgroundColor: colors.card, borderRadius: '8px' },
        th: { textAlign: 'left', padding: '15px', borderBottom: `2px solid ${colors.cardBorder}`, color: colors.text },
        td: { padding: '15px', borderBottom: `1px solid ${colors.cardBorder}`, color: colors.text },
        btnCancelar: { backgroundColor: '#FFB3B3', border: 'none', padding: '5px 15px', borderRadius: '10px', cursor: 'pointer', color: '#333' },
        msgVazio: { textAlign: 'center', color: colors.text, marginTop: '20px', fontSize: '18px' },
        loading: { textAlign: 'center', color: '#5C8A58', marginTop: '20px', fontSize: '18px' },
        navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
        btnLogout: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6b6b', fontWeight: 'bold', marginTop: '10px' }
    };

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) {
            navigate('/'); return;
        }
        const usuario = JSON.parse(userStorage);

        api.get(`/reservas/professor/${usuario.id}`)
            .then(res => {
                setReservas(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleCancelar = async (id) => {
        if (!window.confirm("Deseja cancelar esta reserva?")) return;

        try {
            await api.delete(`/reservas/${id}`);
            alert("Reserva cancelada!");
            setReservas(reservas.filter(r => r.id !== id));
        } catch (error) {
            alert(error.response?.data || "Erro ao cancelar");
        }
    };

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
                    <div style={styles.navLink} onClick={() => navigate('/home')}>
                        <span>🏠</span> PÁGINA INICIAL
                    </div>
                    <div style={styles.navLink} onClick={() => navigate(-1)}>
                        <span>↩</span> VOLTAR
                    </div>
                    <div style={styles.btnLogout} onClick={handleLogout}>
                        <span>🚪</span> SAIR
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                <h1 style={styles.title}>Minhas Reservas</h1>
                
                {loading ? (
                    <p style={styles.loading}>Carregando suas reservas...</p>
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
                                        <th style={styles.th}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map(reserva => (
                                        <tr key={reserva.id}>
                                            <td style={styles.td}>#{reserva.id}</td>
                                            <td style={styles.td}>{formatarData(reserva.dataReserva)}</td>
                                            <td style={styles.td}>{reserva.sala?.nome || "Sala Removida"}</td>
                                            <td style={styles.td}>
                                                <button style={styles.btnCancelar} onClick={() => handleCancelar(reserva.id)}>
                                                    Cancelar
                                                </button>
                                            </td>
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