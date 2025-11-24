import { useNavigate } from 'react-router-dom';

const styles = {
    container: { minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' },
    header: { backgroundColor: '#A8CFA0', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    logoText: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
    subText: { fontSize: '12px', margin: 0 },
    title: { fontSize: '24px', fontWeight: 'normal' },
    grid: { display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '80px', flexWrap: 'wrap' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '10px', width: '150px' },
    iconCircle: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    label: { fontSize: '18px', textAlign: 'center', color: '#000' },
    btnLogout: { backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', marginLeft: '20px' }
};

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Limpa a memória do navegador
        localStorage.removeItem('user');
        // 2. Manda de volta para o Login
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logoSection}>
                    <div style={{borderRight: '2px solid #333', paddingRight: '15px'}}>
                        <h1 style={styles.logoText}>UNIRIO</h1>
                        <p style={styles.subText}>Universidade Federal do<br/>Estado do Rio de Janeiro</p>
                    </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h2 style={styles.title}>SISTEMA DE RESERVAS</h2>
                    {/* BOTÃO DE SAIR AQUI */}
                    <button style={styles.btnLogout} onClick={handleLogout}>SAIR</button>
                </div>
            </header>

            <div style={styles.grid}>
                <div style={styles.card} onClick={() => navigate('/calendario')}>
                    <div style={styles.iconCircle}>📅</div>
                    <span style={styles.label}>Calendário</span>
                </div>

                <div style={styles.card} onClick={() => navigate('/reservar')}>
                    <div style={styles.iconCircle}>💻</div>
                    <span style={styles.label}>Iniciar reserva</span>
                </div>

                <div style={styles.card} onClick={() => navigate('/minhas-reservas')}>
                    <div style={styles.iconCircle}>🕒</div>
                    <span style={styles.label}>Minhas reservas</span>
                </div>

                <div style={styles.card} onClick={() => navigate('/relatorios')}>
                    <div style={styles.iconCircle}>📈</div>
                    <span style={styles.label}>Relatório</span>
                </div>
            </div>
        </div>
    );
}