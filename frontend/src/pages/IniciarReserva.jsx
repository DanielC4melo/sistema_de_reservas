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
    ocupado: { backgroundColor: '#FFB3B3', color: '#333', cursor: 'not-allowed' },
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

    const horariosFixos = [
        { inicio: '14:00', fim: '16:00' },
        { inicio: '16:00', fim: '18:00' },
        { inicio: '18:00', fim: '20:00' },
        { inicio: '20:00', fim: '22:00' }
    ];

    useEffect(() => {
        const userStorage = localStorage.getItem('user');
        if (userStorage) {
            setUsuario(JSON.parse(userStorage));
        } else {
            navigate('/');
        }

        api.get('/salas')
            .then(res => setSalas(res.data))
            .catch(err => console.log(err));

        api.get('/equipamentos')
            .then(res => setEquipamentosLista(res.data))
            .catch(err => console.log(err));
    }, []);

    const selecionarHorario = (horario) => {
        if (!salaSelecionada || !dataSelecionada) {
            alert("Por favor, selecione uma Sala e uma Data antes de escolher o horário.");
            return;
        }
        setHorarioSelecionado(horario);
    };

    const confirmarReserva = async () => {
        if (!salaSelecionada || !dataSelecionada || !horarioSelecionado) {
            alert("Preencha todos os dados!");
            return;
        }

        if (equipamento && !equipamentoSelecionado) {
            alert("Você marcou que quer equipamento, mas não selecionou qual!");
            return;
        }

        const dataISO = `${dataSelecionada}T${horarioSelecionado}:00`;
        
        const payload = {
            dataReserva: dataISO,
            sala: { id: salaSelecionada }, 
            
            professor: { idProfessor: usuario.id },
            criadaPor: "PROFESSOR",
            
            equipamento: (equipamento && equipamentoSelecionado) ? { id: equipamentoSelecionado } : null
        };
        // ---------------------------

        try {
            await api.post('/reservas', payload);
            alert("Reserva realizada com sucesso!");
            navigate('/home');
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
                    <p style={{fontSize: '12px'}}>Universidade Federal do Estado do Rio de Janeiro</p>
                </div>
                <div>
                    <div style={{marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate('/home')}>
                        <span>🏠</span> PÁGINA INICIAL
                    </div>
                    <div style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} onClick={() => navigate(-1)}>
                        <span>↩</span> VOLTAR
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                {!horarioSelecionado ? (
                    <>
                        <h1 style={{textAlign: 'right', fontWeight: 'normal', marginBottom: '40px'}}>Realizar Reserva</h1>
                        
                        <div style={styles.header}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <span style={{fontSize: '18px'}}>Sala:</span>
                                <select 
                                    style={{padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: '#D9D9D9'}}
                                    onChange={(e) => setSalaSelecionada(e.target.value)}
                                    value={salaSelecionada}
                                >
                                    <option value="">Selecione...</option>
                                    {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <span style={{fontSize: '18px'}}>Dia:</span>
                                <input 
                                    type="date" 
                                    style={{padding: '5px 10px', borderRadius: '15px', border: '1px solid #ccc', backgroundColor: '#D9D9D9'}}
                                    onChange={(e) => setDataSelecionada(e.target.value)} 
                                    value={dataSelecionada}
                                />
                            </div>
                        </div>

                        <div>
                            {horariosFixos.map((h, index) => (
                                <div 
                                    key={index} 
                                    style={{...styles.slot, ...styles.vago}}
                                    onClick={() => selecionarHorario(h.inicio)}
                                >
                                    <span style={{fontSize: '18px'}}>{h.inicio}</span>
                                    <span style={{fontSize: '18px'}}>Vago</span>
                                    <span></span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                        <div style={styles.modal}>
                            <h1 style={{textAlign: 'right', fontWeight: 'normal'}}>Realizar Reserva</h1>
                            
                            <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 0', fontSize: '18px'}}>
                                <span>Sala {salas.find(s => s.id == salaSelecionada)?.nome}</span>
                                <span>Data: {dataSelecionada} {horarioSelecionado}</span>
                            </div>

                            <div style={{backgroundColor: '#D9D9D9', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <span>Reservar Equipamento:</span>
                                    <div style={{display: 'flex', gap: '5px'}}>
                                        <button onClick={() => setEquipamento(true)} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}>✅</button>
                                        <button onClick={() => setEquipamento(false)} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}>❎</button>
                                    </div>
                                </div>
                                
                                {equipamento && (
                                    <select 
                                        style={{padding: '10px', borderRadius: '10px', border: 'none'}}
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
                                <div style={{marginTop: '10px'}}>
                                    <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => setHorarioSelecionado(null)}>Cancelar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}