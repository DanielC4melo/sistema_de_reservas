import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function EsqueciSenha() {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const [email, setEmail] = useState('');

    const styles = {
        container: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.sidebar, fontFamily: 'Arial, sans-serif', transition: '0.3s', position: 'relative' },
        card: { backgroundColor: colors.card, padding: '40px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center', borderTop: '5px solid #5C8A58', border: `1px solid ${colors.cardBorder}` },
        title: { fontSize: '24px', color: colors.text, marginBottom: '15px', fontWeight: 'bold' },
        text: { fontSize: '14px', color: colors.text, marginBottom: '25px', lineHeight: '1.5' },
        input: { width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.inputBorder}`, fontSize: '16px', boxSizing: 'border-box', marginBottom: '20px', backgroundColor: colors.inputBg, color: colors.text },
        button: { width: '100%', padding: '12px', backgroundColor: '#5C8A58', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
        backButton: { marginTop: '20px', background: 'none', border: 'none', color: colors.text, cursor: 'pointer', fontSize: '14px' },
        themeWrapper: { position: 'absolute', top: '20px', right: '20px' }
    };

    const handleRecuperar = () => {
        if (!email) {
            alert("Por favor, digite seu email.");
            return;
        }
        
        // Logica de enviar email viria aqui
        alert(`Se o email ${email} existir em nossa base, você receberá um link de redefinição em instantes.`);
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.themeWrapper}>
                <ThemeToggle />
            </div>

            <div style={styles.card}>
                <h2 style={styles.title}>Redefinir Senha</h2>
                <p style={styles.text}>
                    Digite o email associado à sua conta e enviaremos um link para você criar uma nova senha.
                </p>

                <input 
                    type="email" 
                    placeholder="Seu email cadastrado" 
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button style={styles.button} onClick={handleRecuperar}>
                    ENVIAR EMAIL
                </button>

                <button style={styles.backButton} onClick={() => navigate('/')}>
                    Voltar para o Login
                </button>
            </div>
        </div>
    );
}