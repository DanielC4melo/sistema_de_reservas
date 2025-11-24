import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function CadastrarUsuario() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [form, setForm] = useState({ nomeProfessor: '', matriculaProfessor: '', emailProfessor: '', senhaProfessor: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await api.post('/professores', form);
            alert("USUÁRIO CADASTRADO COM SUCESSO! ✅");
            navigate('/home-coordenacao');
        } catch (error) {
            alert("FALHA AO CADASTRAR USUÁRIO! ❌\nVerifique as informações.");
        }
    };

    const styles = {
        container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, fontFamily: 'Arial', transition: '0.3s' },
        card: { display: 'flex', width: '800px', height: '500px', backgroundColor: colors.card, boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${colors.cardBorder}` },
        leftSide: { flex: 1, backgroundColor: colors.sidebar, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: colors.sidebarText, transition: '0.3s' },
        rightSide: { flex: 1.5, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.card },
        title: { textAlign: 'right', fontSize: '24px', marginBottom: '30px', color: colors.text },
        inputGroup: { marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
        label: { marginRight: '10px', fontWeight: 'bold', color: colors.text },
        input: { padding: '8px', borderRadius: '15px', border: `1px solid ${colors.inputBorder}`, width: '200px', backgroundColor: colors.inputBg, color: colors.text },
        btnConfirmar: { backgroundColor: '#88B083', color: '#fff', border: 'none', padding: '10px 40px', borderRadius: '20px', fontSize: '16px', cursor: 'pointer', alignSelf: 'flex-end', marginTop: '20px' },
        navLink: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '10px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.leftSide}>
                    <div>
                        <h2 style={{margin:0}}>UNIRIO</h2>
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
                    <h2 style={styles.title}>Cadastrar Usuários</h2>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome:</label>
                        <input name="nomeProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Matrícula:</label>
                        <input name="matriculaProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail:</label>
                        <input name="emailProfessor" style={styles.input} onChange={handleChange} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha:</label>
                        <input name="senhaProfessor" type="password" style={styles.input} onChange={handleChange} />
                    </div>

                    <button style={styles.btnConfirmar} onClick={handleSubmit}>Confirmar</button>
                </div>
            </div>
        </div>
    );
}