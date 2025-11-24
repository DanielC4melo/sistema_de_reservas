import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function HomeCoordenacao() {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const styles = {
        container: { minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: colors.background, transition: '0.3s' },
        header: { backgroundColor: colors.sidebar, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.sidebarText, transition: '0.3s' },
        logoSection: { display: 'flex', alignItems: 'center', gap: '15px' },
        logoText: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
        subText: { fontSize: '12px', margin: 0 },
        title: { fontSize: '24px', fontWeight: 'normal' },
        grid: { display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '80px', flexWrap: 'wrap' },
        card: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '10px', width: '150px' },
        iconCircle: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: colors.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: `1px solid ${colors.cardBorder}`, transition: '0.3s' },
        label: { fontSize: '16px', textAlign: 'center', color: colors.text },
        btnLogout: { backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginLeft: '20px' }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logoSection}>
                    <div style={{borderRight: `2px solid ${colors.sidebarText}`, paddingRight: '15px'}}>
                        <h1 style={styles.logoText}>UNIRIO</h1>
                        <p style={styles.subText}>Universidade Federal do<br/>Estado do Rio de Janeiro</p>
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <h2 style={styles.title}>Sistema de Reservas Coordenação</h2>
                    
                    <ThemeToggle />
                    
                    <button style={styles.btnLogout} onClick={handleLogout}>SAIR</button>
                </div>
            </header>

            <div style={styles.grid}>
                {/* REMOVIDO O CARD DE CALENDÁRIO DAQUI */}

                <div style={styles.card} onClick={() => navigate('/reserva-coordenacao')}>
                    <div style={styles.iconCircle}>💻</div>
                    <span style={styles.label}>Iniciar reserva</span>
                </div>

                <div style={styles.card} onClick={() => navigate('/gerenciar-usuarios')}>
                    <div style={styles.iconCircle}>👥</div>
                    <span style={styles.label}>Gerenciar usuários</span>
                </div>

                <div style={styles.card} onClick={() => navigate('/cadastrar-usuario')}>
                    <div style={styles.iconCircle}>🆔</div>
                    <span style={styles.label}>Cadastrar usuários</span>
                </div>
                
                <div style={styles.card} onClick={() => navigate('/relatorios')}>
                    <div style={styles.iconCircle}>📈</div>
                    <span style={styles.label}>Relatório</span>
                </div>
            </div>
        </div>
    );
}