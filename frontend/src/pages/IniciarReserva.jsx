import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    sidebar: { width: '250px', backgroundColor: '#A8CFA0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    content: { flex: 1, padding: '40px', backgroundColor: '#fff' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    slot: { padding: '15px', margin: '10px 0', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold', alignItems: 'center' },
    vago: { backgroundColor: '#E0E0E0', color: '#333' },
    ocupado: { backgroundColor: '#FFB3B3', color: '#cc0000', cursor: 'not-allowed', border: '1px solid red' }, // ESTILO VERMELHO
    modal: { backgroundColor: '#F0FFF4', padding: '40px', borderRadius: '20px', border: '1px solid #ccc', maxWidth: '600px', margin: '0 auto' },
    btnConfirmar: { backgroundColor: '#88B083', padding: '10px 30px', border: 'none', borderRadius: '20px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }
};

export default function IniciarReserva() {
    const navigate = useNavigate();
    
    const [salas, setSalas] = useState([]);
    const [salaSelecionada, setSalaSelecionada] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const [equipamento, setEquipamento] = useState(false);
    const [equipamentosLista, setEquipamentosLista] = useState([]);
    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('');
    const [usuario, setUsuario] = useState(null);
    
    // Estado novo para guardar quais horas já foram pegas
    const [horariosOcupados, setHorariosOcupados] = useState([]); 

    const horariosFixos = [
        { inicio: '14:00', fim: '16:00' },
        { inicio: '16:00', fim: '18:00' },
        { inicio: '18:00', fim: '20:00' },
        { inicio: '20:00', fim: '22:00' }
    ];

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (userStorage) setUsuario(JSON.parse(userStorage));
        else navigate('/');

        api.get('/salas').then(res => setSalas(res.data));
        api.get('/equipamentos').then(res => setEquipamentosLista(res.data));
    }, []);

    // --- EFEITO MÁGICO: Roda sempre que muda a Sala ou Data ---
    useEffect(() => {
        if (salaSelecionada && dataSelecionada) {
            // Pergunta ao backend: Quais horários estão tomados?
            api.get(`/reservas/ocupadas?salaId=${salaSelecionada}&data=${dataSelecionada}`)
                .then(res => {
                    console.log("Horários ocupados:", res.data);
                    setHorariosOcupados(res.data); // Ex: ["14:00", "18:00"]
                })
                .catch(console.error);
        } else {
            setHorariosOcupados([]);
        }
    }, [salaSelecionada, dataSelecionada]);
    // -----------------------------------------------------------

    const selecionarHorario = (horario) => {
        // Validação extra no clique
        if (horariosOcupados.includes(horario)) {
            alert("Este horário já está reservado!");
            return;
        }
        if (!salaSelecionada || !dataSelecionada) {
            alert("Selecione Sala e Data primeiro.");
            return;
        }
        setHorarioSelecionado(horario);
    };

    const confirmarReserva = async () => {
        // ... (mesma lógica de antes)
        if (!salaSelecionada || !dataSelecionada || !horarioSelecionado) {
            alert("Preencha todos os dados!"); return;
        }
        const dataISO = `${dataSelecionada}T${horarioSelecionado}:00`;
        const payload = {
            dataReserva: dataISO,
            sala: { id: salaSelecionada },
            professor: { idProfessor: usuario.id },
            criadaPor: "PROFESSOR",
            equipamento: (equipamento && equipamentoSelecionado) ? { id: equipamentoSelecionado } : null
        };

        try {
            await api.post('/reservas', payload);
            alert("Reserva realizada com sucesso!");
            navigate('/home');
        } catch (error) {
            const msg = error.response?.data || "Erro ao realizar reserva.";
            alert(msg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div>
                    <h1 style={{fontSize: '24px', margin: 0}}>UNIRIO</h1>
                    <p style={{fontSize: '12px'}}>Universidade Federal do Estado do Rio de Janeiro</p>
                </div>
                <div>
                    <div style={{marginBottom: '10px', cursor: 'pointer'}} onClick={() => navigate('/home')}>🏠 PÁGINA INICIAL</div>
                    <div style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>↩ VOLTAR</div>
                </div>
            </div>

            <div style={styles.content}>
                {!horarioSelecionado ? (
                    <>
                        <h1 style={{textAlign: 'right', fontWeight: 'normal', marginBottom: '40px'}}>Realizar Reserva</h1>
                        
                        <div style={styles.header}>
                            <div>
                                <span style={{fontSize: '18px'}}>Sala: </span>
                                <select onChange={(e) => setSalaSelecionada(e.target.value)} value={salaSelecionada}>
                                    <option value="">Selecione...</option>
                                    {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <span style={{fontSize: '18px'}}>Dia: </span>
                                <input type="date" onChange={(e) => setDataSelecionada(e.target.value)} value={dataSelecionada} />
                            </div>
                        </div>

                        <div>
                            {horariosFixos.map((h, index) => {
                                // Verifica se este horário está na lista de ocupados
                                const estaOcupado = horariosOcupados.includes(h.inicio);
                                
                                return (
                                    <div 
                                        key={index} 
                                        // Aplica estilo vermelho se ocupado, cinza se vago
                                        style={{
                                            ...styles.slot, 
                                            ...(estaOcupado ? styles.ocupado : styles.vago)
                                        }}
                                        onClick={() => selecionarHorario(h.inicio)}
                                    >
                                        <span style={{fontSize: '18px'}}>{h.inicio}</span>
                                        <span style={{fontSize: '18px'}}>{estaOcupado ? "OCUPADO" : "Vago"}</span>
                                        <span></span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    // ... (O MODAL DE CONFIRMAÇÃO CONTINUA IGUAL AO ANTERIOR) ...
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <div style={styles.modal}>
                            <h1 style={{textAlign: 'right'}}>Confirmar Reserva</h1>
                            <p>Sala: {salas.find(s => s.id == salaSelecionada)?.nome}</p>
                            <p>Data: {dataSelecionada} às {horarioSelecionado}</p>
                            
                            {/* Botão simples para resumir o código aqui */}
                            <button style={styles.btnConfirmar} onClick={confirmarReserva}>Confirmar</button>
                            <button onClick={() => setHorarioSelecionado(null)} style={{display:'block', margin:'10px auto', border:'none', background:'none', textDecoration:'underline', cursor:'pointer'}}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}