import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function ReservaCoordenacao() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    
    const [salas, setSalas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [equipamentosLista, setEquipamentosLista] = useState([]);

    const [salaSelecionada, setSalaSelecionada] = useState('');
    const [professorSelecionado, setProfessorSelecionado] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    
    const [equipamento, setEquipamento] = useState(false);
    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('');
    
    const [horariosOcupados, setHorariosOcupados] = useState([]);

    const styles = {
        container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.background, color: colors.text, transition: '0.3s' },
        sidebar: { width: '250px', backgroundColor: colors.sidebar, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: colors.sidebarText, transition: '0.3s' },
        content: { flex: 1, padding: '40px', backgroundColor: colors.background, overflowY: 'auto' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        slot: { padding: '15px', margin: '10px 0', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', alignItems: 'center', border: `1px solid ${colors.cardBorder}` },
        vago: { backgroundColor: colors.card, color: colors.text },
        ocupado: { backgroundColor: '#FFB3B3', color: '#333', cursor: 'not-allowed' },
        modal: { backgroundColor: colors.card, padding: '40px', borderRadius: '20px', border: `1px solid ${colors.cardBorder}`, maxWidth: '600px', margin: '0 auto', color: colors.text },
        btnConfirmar: { backgroundColor: '#88B083', padding: '10px 30px', border: 'none', borderRadius: '20px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px', color: '#fff' },
        input: { padding: '5px 10px', borderRadius: '15px', border: `1px solid ${colors.inputBorder}`, backgroundColor: colors.inputBg, color: colors.text }
    };

    const horariosFixos = [
        { inicio: '14:00', fim: '16:00' },
        { inicio: '16:00', fim: '18:00' },
        { inicio: '18:00', fim: '20:00' },
        { inicio: '20:00', fim: '22:00' }
    ];

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (userStorage) setUsuarioLogado(JSON.parse(userStorage));
        else navigate('/');

        api.get('/salas').then(res => setSalas(res.data));
        api.get('/equipamentos').then(res => setEquipamentosLista(res.data));
        api.get('/professores').then(res => setProfessores(res.data));
    }, []);

    useEffect(() => {
        if (salaSelecionada && dataSelecionada) {
            api.get(`/reservas/ocupadas?salaId=${salaSelecionada}&data=${dataSelecionada}`)
                .then(res => setHorariosOcupados(res.data))
                .catch(() => setHorariosOcupados([]));
        } else {
            setHorariosOcupados([]);
        }
    }, [salaSelecionada, dataSelecionada]);

    const selecionarHorario = (horario) => {
        if (horariosOcupados.includes(horario)) {
            alert("Este horário já está reservado!");
            return;
        }
        if (!salaSelecionada || !dataSelecionada || !professorSelecionado) {
            alert("Selecione Sala, Professor e Data primeiro.");
            return;
        }
        setHorarioSelecionado(horario);
    };

    const confirmarReserva = async () => {
        if (!salaSelecionada || !dataSelecionada || !horarioSelecionado || !professorSelecionado) {
            alert("Preencha todos os dados!"); return;
        }

        if (equipamento && !equipamentoSelecionado) {
            alert("Você marcou que quer equipamento, mas não selecionou qual!");
            return;
        }

        const dataISO = `${dataSelecionada}T${horarioSelecionado}:00`;

        const payload = {
            dataReserva: dataISO,
            sala: { id: salaSelecionada },
            professor: { idProfessor: professorSelecionado },
            coordenacao: { idCoordenacao: usuarioLogado.id },
            criadaPor: "COORDENACAO",
            equipamento: (equipamento && equipamentoSelecionado) ? { id: equipamentoSelecionado } : null
        };

        try {
            await api.post('/reservas', payload);
            alert("Reserva realizada com sucesso pela Coordenação!");
            navigate('/home-coordenacao');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || "Erro ao realizar reserva.";
            alert(msg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div>
                    <h1 style={{fontSize: '24px', margin: 0}}>UNIRIO</h1>
                    <p style={{fontSize: '12px'}}>Área da Coordenação</p>
                </div>
                <div>
                    <div style={{marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate('/home-coordenacao')}>
                        <span>🏠</span> PÁGINA INICIAL
                    </div>
                    <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate(-1)}>
                        <span>↩</span> VOLTAR
                    </div>
                    <div style={{marginTop: '20px'}}>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                {!horarioSelecionado ? (
                    <>
                        <h1 style={{textAlign: 'right', fontWeight: 'normal', marginBottom: '40px'}}>Reserva Administrativa</h1>
                        
                        <div style={styles.header}>
                            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                <span style={{fontSize: '16px'}}>Professor Responsável:</span>
                                <select 
                                    style={{...styles.input, width: '200px'}}
                                    onChange={(e) => setProfessorSelecionado(e.target.value)}
                                    value={professorSelecionado}
                                >
                                    <option value="">Selecione...</option>
                                    {professores.map(p => <option key={p.idProfessor} value={p.idProfessor}>{p.nomeProfessor}</option>)}
                                </select>
                            </div>

                            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                <span style={{fontSize: '16px'}}>Sala:</span>
                                <select 
                                    style={{...styles.input, width: '200px'}}
                                    onChange={(e) => setSalaSelecionada(e.target.value)}
                                    value={salaSelecionada}
                                >
                                    <option value="">Selecione...</option>
                                    {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>

                            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                <span style={{fontSize: '16px'}}>Data:</span>
                                <input 
                                    type="date" 
                                    style={styles.input}
                                    min={new Date().toISOString().split('T')[0]} 
                                    onChange={(e) => setDataSelecionada(e.target.value)} 
                                    value={dataSelecionada} 
                                />
                            </div>
                        </div>

                        <div>
                            {horariosFixos.map((h, index) => {
                                const estaOcupado = horariosOcupados.includes(h.inicio);
                                return (
                                    <div 
                                        key={index} 
                                        style={{...styles.slot, ...(estaOcupado ? styles.ocupado : styles.vago)}}
                                        onClick={() => selecionarHorario(h.inicio)}
                                    >
                                        <span style={{fontSize: '18px'}}>{h.inicio}</span>
                                        <span style={{fontSize: '18px'}}>{estaOcupado ? "OCUPADO" : "Disponível"}</span>
                                        <span></span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <div style={styles.modal}>
                            <h1 style={{textAlign: 'right', fontWeight: 'normal'}}>Confirmar (Coordenação)</h1>
                            <p><b>Professor:</b> {professores.find(p => p.idProfessor == professorSelecionado)?.nomeProfessor}</p>
                            <p><b>Sala:</b> {salas.find(s => s.id == salaSelecionada)?.nome}</p>
                            <p><b>Data:</b> {dataSelecionada} às {horarioSelecionado}</p>
                            
                            <div style={{backgroundColor: colors.inputBg, border: `1px solid ${colors.inputBorder}`, padding: '15px', borderRadius: '10px', margin: '20px 0'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px'}}>
                                    <span>Reservar Equipamento?</span>
                                    <button onClick={() => setEquipamento(true)} style={{cursor:'pointer', border:`1px solid ${colors.text}`, background: equipamento ? '#88B083' : 'transparent', color: colors.text}}>SIM</button>
                                    <button onClick={() => setEquipamento(false)} style={{cursor:'pointer', border:`1px solid ${colors.text}`, background: !equipamento ? '#FFB3B3' : 'transparent', color: colors.text}}>NÃO</button>
                                </div>
                                
                                {equipamento && (
                                    <select 
                                        style={{...styles.input, width: '100%'}}
                                        onChange={(e) => setEquipamentoSelecionado(e.target.value)}
                                        value={equipamentoSelecionado}
                                    >
                                        <option value="">Selecionar Equipamento</option>
                                        {equipamentosLista.map(eq => (
                                            <option key={eq.id} value={eq.id}>{eq.nome}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div style={{textAlign: 'center'}}>
                                <button style={styles.btnConfirmar} onClick={confirmarReserva}>Confirmar</button>
                                <button onClick={() => setHorarioSelecionado(null)} style={{display:'block', margin:'10px auto', border:'none', background:'none', textDecoration:'underline', cursor:'pointer', color: colors.text}}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}