import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function GerenciarUsuarios() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        api.get('/professores').then(res => setUsuarios(res.data));
    }, []);

    const usuariosFiltrados = usuarios.filter(u => 
        u.nomeProfessor.toLowerCase().includes(busca.toLowerCase())
    );

    const deletarUsuario = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este professor?")) {
            try {
                await api.delete(`/professores/${id}`);
                alert("Usuário excluído!");
                setUsuarios(usuarios.filter(u => u.idProfessor !== id));
            } catch (error) {
                alert("Erro ao excluir. Verifique se ele possui reservas ativas.");
            }
        }
    };

    const styles = {
        container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.background, transition: '0.3s', alignItems: 'center', justifyContent: 'center' },
        card: { width: '900px', height: '600px', backgroundColor: colors.card, borderRadius: '10px', display: 'flex', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)', border: `1px solid ${colors.cardBorder}` },
        leftSide: { width: '250px', backgroundColor: colors.sidebar, padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: colors.sidebarText, transition: '0.3s' },
        rightSide: { flex: 1, padding: '30px', backgroundColor: colors.card },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
        searchBar: { padding: '8px', borderRadius: '15px', border: `1px solid ${colors.inputBorder}`, width: '300px', backgroundColor: colors.inputBg, color: colors.text },
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
        th: { textAlign: 'left', borderBottom: `2px solid ${colors.cardBorder}`, padding: '10px', color: colors.text },
        td: { padding: '10px', borderBottom: `1px solid ${colors.cardBorder}`, color: colors.text },
        navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' },
        btnEdit: { marginRight:'5px', cursor:'pointer', background: 'none', border: 'none', fontSize: '16px' },
        btnDelete: { color:'#d9534f', cursor:'pointer', border:'none', background:'none', fontSize: '16px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.leftSide}>
                    <div>
                        <h2 style={{margin: '0 0 10px 0'}}>UNIRIO</h2>
                        <p style={{fontSize: '12px', margin: 0}}>Gestão de Usuários</p>
                    </div>
                    
                    <div>
                        <div style={styles.navLink} onClick={() => navigate('/home-coordenacao')}>🏠 PÁGINA INICIAL</div>
                        <div style={styles.navLink} onClick={() => navigate(-1)}>↩ VOLTAR</div>
                        
                        <div style={{marginTop: '20px'}}>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
                
                <div style={styles.rightSide}>
                    <div style={styles.header}>
                        <h2 style={{color: colors.text, fontWeight: 'normal', margin: 0}}>Gerenciar Usuários</h2>
                    </div>
                    
                    <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <label style={{color: colors.text}}>Buscar:</label>
                        <input 
                            style={styles.searchBar} 
                            placeholder="Digite o nome..." 
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div style={{height: '400px', overflowY: 'auto'}}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Nome</th>
                                    <th style={styles.th}>Matrícula</th>
                                    <th style={styles.th}>E-mail</th>
                                    <th style={styles.th}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosFiltrados.map(u => (
                                    <tr key={u.idProfessor}>
                                        <td style={styles.td}>{u.idProfessor}</td>
                                        <td style={styles.td}>{u.nomeProfessor}</td>
                                        <td style={styles.td}>{u.matriculaProfessor}</td>
                                        <td style={styles.td}>{u.emailProfessor}</td>
                                        <td style={styles.td}>
                                            <button style={styles.btnEdit} onClick={() => navigate(`/editar-usuario/${u.idProfessor}`)}>✏️</button>
                                            <button style={styles.btnDelete} onClick={() => deletarUsuario(u.idProfessor)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}