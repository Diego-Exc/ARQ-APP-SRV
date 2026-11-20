// Datos ilustrativos para pantallas aún no respaldadas por el backend
// (ganancias históricas, notificaciones, horario). El flujo real de
// solicitudes/aceptación/estado sí es funcional end-to-end contra la API.

export interface EarningsEntry {
  id: string;
  label: string;
  date: string;
  amount: number;
}

export const earningsSummary = {
  today: 145000,
  week: 820000,
  month: 3120000,
  pendingPayout: 260000,
};

export const earningsHistory: EarningsEntry[] = [
  { id: "e1", label: "Reparación de fuga · Cocina", date: "Hoy, 10:40 AM", amount: 76000 },
  { id: "e2", label: "Cambio de tomacorriente", date: "Ayer, 4:15 PM", amount: 58000 },
  { id: "e3", label: "Destape de tubería", date: "Ayer, 11:02 AM", amount: 62000 },
  { id: "e4", label: "Instalación de grifo", date: "Lun, 2:30 PM", amount: 71000 },
];

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    icon: "cash",
    title: "Pago recibido",
    description: "Se acreditaron $76,000 por tu último servicio.",
    time: "Hace 10 min",
    read: false,
  },
  {
    id: "n2",
    icon: "star",
    title: "Nueva calificación",
    description: "Un cliente te calificó con 5 estrellas.",
    time: "Hace 2 h",
    read: false,
  },
  {
    id: "n3",
    icon: "shield-checkmark",
    title: "Documentos verificados",
    description: "Tu cédula y certificado fueron aprobados.",
    time: "Ayer",
    read: true,
  },
  {
    id: "n4",
    icon: "megaphone",
    title: "Promoción de la semana",
    description: "Gana 10% extra en servicios de electricidad hasta el domingo.",
    time: "Hace 2 días",
    read: true,
  },
];

export const weekSchedule = [
  { day: "Lunes", enabled: true, from: "7:00 AM", to: "6:00 PM" },
  { day: "Martes", enabled: true, from: "7:00 AM", to: "6:00 PM" },
  { day: "Miércoles", enabled: true, from: "7:00 AM", to: "6:00 PM" },
  { day: "Jueves", enabled: true, from: "7:00 AM", to: "6:00 PM" },
  { day: "Viernes", enabled: true, from: "7:00 AM", to: "8:00 PM" },
  { day: "Sábado", enabled: true, from: "8:00 AM", to: "2:00 PM" },
  { day: "Domingo", enabled: false, from: "—", to: "—" },
];

export const documents = [
  { id: "d1", label: "Cédula de ciudadanía", status: "verified" as const },
  { id: "d2", label: "Certificado de antecedentes", status: "verified" as const },
  { id: "d3", label: "Certificación técnica", status: "pending" as const },
];

export const faqItems = [
  { id: "f1", question: "¿Cuándo recibo mis pagos?", answer: "Los pagos se acreditan automáticamente al finalizar y confirmar cada servicio." },
  { id: "f2", question: "¿Cómo cambio mi horario?", answer: "Ve a Mi perfil → Mi horario y ajusta los días y franjas disponibles." },
  { id: "f3", question: "¿Qué hago si un cliente no está en la dirección?", answer: "Repórtalo desde el detalle del servicio con el botón de soporte para registrar la incidencia." },
];
