export interface PaisaSuggestion {
  id: string;
  emoji: string;
  text: string;
  description: string;
}

// Sugerencias con sabor paisa para que el bot ("Don Repuesto") le ayude al
// cliente a describir el problema sin tener que pensar mucho (ADR-0005:
// diagnóstico simulado, pero el tono sí es 100% antioqueño).
export const PAISA_SUGGESTIONS: PaisaSuggestion[] = [
  { id: "s1", emoji: "🚰", text: "Se me tapó el caño del lavaplatos, parce", description: "Se me tapó el caño del lavaplatos, parce" },
  { id: "s2", emoji: "🕳️", text: "Tengo un hueco en el techo, resáneme eso", description: "Tengo un hueco en el techo, necesito que me lo resanen" },
  { id: "s3", emoji: "⚡", text: "El breaker se baja a cada rato, ome", description: "El breaker (taco de la luz) se baja a cada rato" },
  { id: "s4", emoji: "💧", text: "Hay una gotera en el baño que no para", description: "Hay una gotera en el techo del baño que no para de gotear" },
  { id: "s5", emoji: "🔑", text: "Perdí las llaves, no puedo ni entrar", description: "Perdí las llaves de la puerta principal y no puedo entrar a la casa" },
  { id: "s6", emoji: "🧊", text: "La nevera no está enfriando nada, ome", description: "La nevera no está enfriando nada" },
  { id: "s7", emoji: "🎨", text: "Se cayó la pintura, quedó toda fea", description: "Se cayó la pintura de la pared y quedó toda descascarada" },
  { id: "s8", emoji: "🔌", text: "Se quemó el tomacorriente de la cocina", description: "Se quemó el tomacorriente de la cocina, huele a quemado" },
  { id: "s9", emoji: "🚪", text: "Se dañó la cerradura, no cierra bien", description: "Se dañó la cerradura de la puerta y no cierra bien" },
  { id: "s10", emoji: "🧺", text: "La lavadora no centrifuga, quedó maluca", description: "La lavadora no está centrifugando bien, quedó maluca" },
  { id: "s11", emoji: "🚽", text: "El inodoro no deja de correr agua", description: "El inodoro no deja de correr agua todo el día" },
  { id: "s12", emoji: "🪟", text: "Se me rompió un vidrio de la ventana", description: "Se me rompió un vidrio de la ventana" },
  { id: "s13", emoji: "🔥", text: "La estufa no prende ni a las patadas", description: "La estufa no prende ni a las patadas" },
  { id: "s14", emoji: "🧱", text: "Quiero pintar un cuarto completo", description: "Necesito pintar un cuarto completo, ¿cuánto me vale?" },
  { id: "s15", emoji: "💡", text: "Se fundió un bombillo y no prende nada", description: "Se fundió un bombillo y toda esa parte de la casa no prende" },
  { id: "s16", emoji: "🚿", text: "La ducha no bota sino agua fría", description: "La ducha no está calentando, solo bota agua fría" },
  { id: "s17", emoji: "🪚", text: "Se dañó una bisagra de la puerta", description: "Se dañó una bisagra de la puerta y quedó chueca" },
  { id: "s18", emoji: "📺", text: "El microondas no prende, ya revisé el totomoto", description: "El microondas no prende, ya revisé el totomoto y sigue igual" },
];
