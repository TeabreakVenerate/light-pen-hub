export type PersonaKey = "Light Pen" | "Author Eliora" | "Heavenly_Daoist";

export type PersonaTheme = {
  id: PersonaKey;
  displayName: string;
  variant: "gradient" | "inkdrop";
};

export const PERSONAS: PersonaTheme[] = [
  {
    id: "Light Pen",
    displayName: "Light Pen",
    variant: "gradient"
  },
  {
    id: "Author Eliora",
    displayName: "Author Eliora",
    variant: "gradient"
  },
  {
    id: "Heavenly_Daoist",
    displayName: "Heavenly_Daoist",
    variant: "inkdrop"
  }
];

export function getPersonaTheme(persona: PersonaKey | null | undefined) {
  return (
    PERSONAS.find((p) => p.id === persona) ?? PERSONAS[0]
  );
}

