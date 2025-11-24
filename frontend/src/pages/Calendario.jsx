import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' },
    dayLabel: { fontWeight: 'bold', marginBottom: '10px', color: '#555' },
    dayCell: { height: '100px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px', position: 'relative' },
    dayNumber: { fontSize: '18px', fontWeight: 'bold' },
    reservaTag: { backgroundColor: '#B3FFB3', color: '#006400', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', marginTop: 'auto', width: '100%', textAlign: 'center' },
    navButton: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333' }
};

export default function Calendario() {
    const navigate = useNavigate();
    
    const [dataAtual, setDataAtual] = useState(new Date());
    const [diasComReserva, setDiasComReserva] = useState([]); // Agora começa vazio

    // Função para carregar reservas do banco
    const carregarReservas = () => {
        const userStorage = localStorage.getItem('user');
        if (!userStorage) return;
        const usuario = JSON.parse(userStorage);

        api.get(`/reservas/professor/${usuario.id}`)
            .then(res => {
                const reservas = res.data;
                
                // Filtra apenas as reservas do MÊS e ANO atuais da tela
                const diasOcupados = reservas
                    .map(r => new Date(r.dataReserva)) // Converte texto para Data
                    .filter(data => 
                        data.getMonth() === dataAtual.getMonth() && 
                        data.getFullYear() === dataAtual.getFullYear()
                    )
                    .map(data => data.getDate()); // Pega só o dia (ex: 25)

                setDiasComReserva(diasOcupados);
            })
            .catch(console.error);
    };

    // Sempre que mudar o mês (dataAtual), recarrega e filtra
    useEffect(() => {
        carregarReservas();
    }, [dataAtual]);

    // Lógica do calendário
    const getDiasNoMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();
    const getDiaSemanaInicio = (ano, mes) => new Date(ano, mes, 1).getDay();

    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const diasTotais = getDiasNoMes(ano, mes);
    const diaInicio = getDiaSemanaInicio(ano, mes);

    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const mesAnterior = () => setDataAtual(new Date(ano, mes - 1, 1));
    const proximoMes = () => setDataAtual(new Date(ano, mes + 1, 1));

    const vazios = Array.from({ length: diaInicio });
    const dias = Array.from({ length: diasTotais }, (_, i) => i + 1);

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
                <div style={styles.calendarHeader}>
                    <button style={styles.navButton} onClick={mesAnterior}>⬅</button>
                    <h1 style={{margin: 0}}>{meses[mes]} {ano}</h1>
                    <button style={styles.navButton} onClick={proximoMes}>➡</button>
                </div>

                <div style={styles.grid}>
                    {diasSemana.map(d => <div key={d} style={styles.dayLabel}>{d}</div>)}

                    {vazios.map((_, i) => <div key={`vazio-${i}`} style={{...styles.dayCell, border: 'none'}}></div>)}

                    {dias.map(dia => (
                        <div key={dia} style={styles.dayCell}>
                            <span style={styles.dayNumber}>{dia}</span>
                            
                            {/* Se o dia estiver na lista que veio do banco, pinta de verde */}
                            {diasComReserva.includes(dia) && (
                                <div style={styles.reservaTag}>Reservado</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}