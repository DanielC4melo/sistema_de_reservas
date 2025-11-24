import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Calendario() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    
    const [dataAtual, setDataAtual] = useState(new Date());
    const [salas, setSalas] = useState([]);
    const [salaSelecionada, setSalaSelecionada] = useState('');
    
    const [minhasReservasDias, setMinhasReservasDias] = useState([]);
    const [diasLotados, setDiasLotados] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const styles = {
        container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.background, color: colors.text, transition: '0.3s' },
        sidebar: { width: '250px', backgroundColor: colors.sidebar, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: colors.sidebarText, transition: '0.3s' },
        content: { flex: 1, padding: '40px', backgroundColor: colors.background, overflowY: 'auto' },
        calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        controls: { marginBottom: '20px', padding: '15px', backgroundColor: colors.card, borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', border: `1px solid ${colors.cardBorder}` },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' },
        dayLabel: { fontWeight: 'bold', marginBottom: '10px', color: colors.text },
        dayCell: { height: '100px', border: `1px solid ${colors.cardBorder}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px', position: 'relative', backgroundColor: colors.card },
        dayNumber: { fontSize: '18px', fontWeight: 'bold' },
        reservaVerde: { backgroundColor: '#B3FFB3', color: '#006400', fontSize: '12px', padding: '2px', borderRadius: '4px', width: '100%', marginTop: '2px' },
        reservaVermelha: { backgroundColor: '#FFB3B3', color: '#8B0000', fontSize: '12px', padding: '2px', borderRadius: '4px', width: '100%', marginTop: '2px' },
        navButton: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: colors.text },
        navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
        btnLogout: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6b6b', fontWeight: 'bold', marginTop: '10px' },
        select: { padding: '5px', borderRadius: '5px', backgroundColor: colors.inputBg, color: colors.text, border: `1px solid ${colors.inputBorder}` }
    };

    useEffect(() => {
        api.get('/salas').then(res => setSalas(res.data));
    }, []);

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) return;
        const usuario = JSON.parse(userStorage);
        const mes = dataAtual.getMonth();
        const ano = dataAtual.getFullYear();

        api.get(`/reservas/professor/${usuario.id}`).then(res => {
            const dias = res.data
                .map(r => new Date(r.dataReserva))
                .filter(d => d.getMonth() === mes && d.getFullYear() === ano)
                .map(d => d.getDate());
            setMinhasReservasDias(dias);
        });

        if (salaSelecionada) {
            api.get(`/reservas/lotacao?salaId=${salaSelecionada}&mes=${mes + 1}&ano=${ano}`)
                .then(res => {
                    setDiasLotados(res.data);
                })
                .catch(() => setDiasLotados([]));
        } else {
            setDiasLotados([]);
        }

    }, [dataAtual, salaSelecionada]);

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasTotais = new Date(ano, mes + 1, 0).getDate();
    const diaInicio = new Date(ano, mes, 1).getDay();
    const vazios = Array.from({ length: diaInicio });
    const dias = Array.from({ length: diasTotais }, (_, i) => i + 1);

    const mesAnterior = () => setDataAtual(new Date(ano, mes - 1, 1));
    const proximoMes = () => setDataAtual(new Date(ano, mes + 1, 1));

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
                <div style={styles.controls}>
                    <label>Ver disponibilidade da Sala:</label>
                    <select 
                        onChange={(e) => setSalaSelecionada(e.target.value)} 
                        value={salaSelecionada}
                        style={styles.select}
                    >
                        <option value="">Nenhuma (Ver apenas minhas reservas)</option>
                        {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </select>
                </div>

                <div style={styles.calendarHeader}>
                    <button style={styles.navButton} onClick={mesAnterior}>⬅</button>
                    <h1 style={{margin: 0}}>{meses[mes]} {ano}</h1>
                    <button style={styles.navButton} onClick={proximoMes}>➡</button>
                </div>

                <div style={styles.grid}>
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d} style={styles.dayLabel}>{d}</div>)}
                    
                    {vazios.map((_, i) => <div key={`vazio-${i}`}></div>)}

                    {dias.map(dia => {
                        const souEu = minhasReservasDias.includes(dia);
                        const estaLotado = diasLotados.includes(dia);

                        return (
                            <div key={dia} style={styles.dayCell}>
                                <span style={styles.dayNumber}>{dia}</span>
                                {souEu && <div style={styles.reservaVerde}>Minha Reserva</div>}
                                {estaLotado && <div style={styles.reservaVermelha}>LOTADO</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}