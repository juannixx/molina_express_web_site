export interface LeadPayload {
  kind: "quote" | "driver" | "fulfilment";
  fields: Record<string, string>;
}

export interface LeadProvider {
  submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }>;
}

export const noopProvider: LeadProvider = {
  async submitLead(payload) {
    console.info("[lead]", payload.kind, payload.fields);
    return { ok: true };
  },
};

// Trocar por emailProvider/hubspotProvider no futuro sem tocar nos componentes.
export const leadProvider: LeadProvider = noopProvider;
