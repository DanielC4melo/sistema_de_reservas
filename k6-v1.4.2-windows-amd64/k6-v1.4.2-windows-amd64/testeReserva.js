import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "20s", target: 60 },
    { duration: "40s", target: 120 },
    { duration: "40s", target: 200 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.25"],
    http_req_duration: ["p(95)<3000"],
  },
};

// CONFIG
const BASE_URL = "http://localhost:8080/api";
const salas = [1,2,3,4,5,6,7,8];
const professores = Array.from({ length: 29 }, (_, i) => i + 1);

// gera horário seguro (menos colisões)
function randomHour() {
  const hour = Math.floor(Math.random() * 10) + 8; // 08:00 - 18:00
  return `${hour.toString().padStart(2, "0")}:00`;
}

export default function () {

  // LOGIN
  const login = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: "fabricio@edu.unirio.br",
    senha: "123456",
  }), { headers: { "Content-Type": "application/json" }});

  check(login, { "login OK": (r) => r.status === 200 });
  if (login.status !== 200) return;

  const token = login.json("token");

  const authHeaders = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // DADOS ALEATÓRIOS
  const salaId = salas[Math.floor(Math.random() * salas.length)];
  const profId = professores[Math.floor(Math.random() * professores.length)];

  const inicio = randomHour();
  const fim = `${(Number(inicio.split(":")[0]) + 1).toString().padStart(2, "0")}:00`;

  const dataReserva = "2025-01-25"; // data futura, sempre válida

  const payload = JSON.stringify({
    sala: { id: salaId },
    professor: { idProfessor: profId },
    equipamento: null,
    dataReserva: `${dataReserva}T${inicio}:00`
  });

  const res = http.post(`${BASE_URL}/reservas`, payload, authHeaders);

  check(res, {
    "reserva criada": (r) => r.status === 201,
    "reserva rejeitada (válido)": (r) => r.status === 409 || r.status === 500,
  });

  sleep(0.2);
}
