export type FieldRule = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea";
  required: boolean;
  options?: string[];
};

export type FormStep = { title: string; fields: FieldRule[] };

export const site = {
  company: {
    name: "Molina Express",
    legalName: "Molina Express Ltd",
    url: "https://mexpress.uk.com",
    email: "TODO_commercial_email",
    recruitingEmail: "recruiting@mexpress.uk",
    whatsappUrl: "TODO_whatsapp_link",
    trackingUrl: "TODO_external_tracking_url",
    replyTimeHours: "TODO_reply_time_hours",
    address: {
      // Divergência entre fontes: site atual diz "Russel House, Elton Business Park",
      // docs GTM dizem "Elton Park Business Centre". Confirmar antes de publicar.
      street: "TODO_confirm_street_address",
      city: "Ipswich",
      postcode: "IP2 0DD",
      country: "GB",
    },
    coverage: ["Norfolk", "Suffolk", "Essex"],
  },

  nav: {
    links: [
      { label: "Services", href: "/#services" },
      { label: "Fulfilment", href: "/fulfilment" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Drive with us", href: "/drivers" },
    ],
    cta: { label: "Get a quote", href: "/#quote" },
  },

  hero: {
    title: "Your delivery, on time. If anything slips, you hear it from us first.",
    subtitle:
      "Same-day and next-day parcel delivery across Norfolk, Suffolk and Essex, run by a local fleet on prepared routes.",
    ctaPrimary: { label: "Get a quote", href: "#quote" },
    ctaSecondary: { label: "Track a delivery", href: "#tracking" },
    image: {
      src: "/images/hero-operation.svg",
      alt: "Molina Express driver loading labelled parcels into a branded van at first light",
      status: "TODO_replace_with_generated_photo",
    },
  },

  proof: {
    metrics: [
      { value: "TODO_deliveries_per_month", label: "deliveries a month" },
      { value: "TODO_on_time_rate", label: "delivered on time" },
      { value: "TODO_avg_pickup_minutes", label: "average pickup time" },
      { value: "TODO_towns_covered", label: "towns covered" },
    ],
  },

  services: {
    title: "Built around what you ship",
    items: [
      {
        name: "Same-day",
        useCase: "A pharmacy order placed at noon reaches the patient before 6pm.",
        sla: "Collected within TODO_sameday_pickup_window",
      },
      {
        name: "Next-day",
        useCase: "Your online orders picked up this evening, on doorsteps tomorrow.",
        sla: "Cut-off at TODO_nextday_cutoff",
      },
      {
        name: "Contract routes",
        useCase: "A fixed daily run between your depot and your stores, same driver, same window.",
        sla: "Weekly schedule agreed up front",
      },
      {
        name: "Collections and returns",
        useCase: "Failed fitting? We collect from the customer and bring it back to you.",
        sla: "Booked into your next route",
      },
    ],
  },

  howItWorks: {
    title: "How it works",
    steps: [
      { name: "Book", detail: "Send the job by form or WhatsApp. We confirm the pickup window." },
      { name: "Pickup", detail: "A uniformed driver collects at the agreed time and scans every parcel." },
      { name: "Track", detail: "You get a link with live status. So does your customer." },
      { name: "Delivered", detail: "Photo proof of delivery, straight to your inbox." },
    ],
  },

  tracking: {
    title: "Know where every parcel is",
    body: "Type a tracking code and see status, route and proof of delivery.",
    inputLabel: "Tracking code",
    buttonLabel: "Track",
    image: {
      src: "/images/tracking-mock.svg",
      alt: "Molina Express tracking screen showing a live map with driver position and delivery status",
      status: "TODO_replace_with_generated_mock",
    },
  },

  cases: {
    title: "Numbers from real routes",
    items: [
      {
        headline: "TODO_case1_headline_with_number",
        body: "TODO_case1_paragraph",
        client: "TODO_case1_client_name",
      },
      {
        headline: "TODO_case2_headline_with_number",
        body: "TODO_case2_paragraph",
        client: "TODO_case2_client_name",
      },
    ],
    logos: ["TODO_client_logo_list"],
  },

  sectors: {
    title: "Sectors we deliver for",
    items: ["E-commerce", "Pharmacy and health", "Food", "Documents", "Fashion"],
  },

  quoteForm: {
    title: "Get a quote",
    subtitle: "Two quick steps. We reply within TODO_reply_time_hours working hours.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "email", label: "Work email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "About your deliveries",
        fields: [
          { name: "volume", label: "Parcels per day (estimate)", type: "text", required: true },
          { name: "pickup_area", label: "Pickup town or area", type: "text", required: true },
          {
            name: "source",
            label: "How did you hear about us?",
            type: "select",
            required: false,
            options: ["Search", "Recommendation", "Social media", "Other"],
          },
        ],
      },
    ] as FormStep[],
    submitLabel: "Request quote",
  },

  driverForm: {
    title: "Apply to drive",
    subtitle: "Two quick steps. We reply within TODO_reply_time_hours working hours.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "Your experience",
        fields: [
          {
            name: "right_to_work",
            label: "Do you have the right to work in the UK?",
            type: "select",
            required: true,
            options: ["Yes", "No"],
          },
          { name: "licence_years", label: "Years holding a UK/EU driving licence", type: "text", required: true },
          {
            name: "preferred_area",
            label: "Preferred area",
            type: "select",
            required: true,
            options: ["Norfolk", "Suffolk", "Essex"],
          },
          { name: "availability", label: "Availability (days per week)", type: "text", required: true },
        ],
      },
    ] as FormStep[],
    submitLabel: "Send application",
  },

  fulfilment: {
    hero: {
      title: "Fulfilment from Ipswich, run by people who deliver",
      subtitle:
        "Operator-led 3PL on the Ipswich-Felixstowe corridor. 126 installed pallet positions, live capacity now, and a team that already runs delivery routes every day.",
      cta: { label: "Get a fulfilment quote", href: "#fulfilment-quote" },
      image: {
        src: "/images/hero-fulfilment.svg",
        alt: "Racked pallet positions inside the Molina Fulfilment warehouse in Ipswich",
        status: "TODO_replace_with_generated_photo",
      },
    },
    services: {
      title: "One warehouse, the whole operation",
      items: [
        { name: "Inbound receiving", detail: "Container and carton receiving, checked and put away the same day." },
        { name: "Pallet and carton storage", detail: "Racked storage with live stock counts." },
        { name: "Pick and pack", detail: "Single and multi-item orders picked to your packing spec." },
        { name: "UK parcel dispatch", detail: "Daily carrier collections from the warehouse door." },
        { name: "Returns", detail: "Received, inspected and back into stock with a report." },
        { name: "Rework and kitting", detail: "Bundles, inserts and product kits built to order." },
        { name: "Relabelling", detail: "Barcodes and compliance labels applied per unit." },
        { name: "Amazon FBA prep", detail: "Carton prep and labels to Amazon inbound spec." },
        { name: "B2B dispatch", detail: "Pallet and carton despatch to stores and wholesalers." },
      ],
    },
    capacity: {
      title: "East of England stockholding",
      body: "The warehouse sits minutes from the A14 on the Ipswich-Felixstowe corridor, with 126 installed pallet positions ready now. Import through Felixstowe, hold stock with us, dispatch across the UK.",
      points: ["126 installed pallet positions", "Ipswich-Felixstowe corridor", "Capacity available now"],
    },
    audience: {
      title: "Built for",
      items: [
        "UK and overseas e-commerce brands",
        "Importers landing stock at Felixstowe",
        "Shopify, Amazon, eBay and TikTok Shop sellers",
        "SMEs that need East of England stockholding",
      ],
    },
  },

  fulfilmentForm: {
    title: "Get a fulfilment quote",
    subtitle:
      "We price your operation from three numbers: pallets held, monthly orders and items per order. Two quick steps.",
    steps: [
      {
        title: "About you",
        fields: [
          { name: "name", label: "Your name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: true },
          { name: "email", label: "Work email", type: "email", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
        ],
      },
      {
        title: "Your operation",
        fields: [
          { name: "pallets", label: "Average pallets held", type: "text", required: true },
          { name: "orders_month", label: "Orders per month", type: "text", required: true },
          { name: "items_per_order", label: "Average items per order", type: "text", required: true },
          {
            name: "channels",
            label: "Main sales channel",
            type: "select",
            required: true,
            options: ["Shopify", "Amazon", "eBay", "TikTok Shop", "B2B / wholesale", "Other"],
          },
          { name: "product_type", label: "Product type (e.g. apparel, beauty, homeware)", type: "text", required: false },
        ],
      },
    ] as FormStep[],
    submitLabel: "Request fulfilment quote",
  },

  drivers: {
    hero: {
      title: "Drive with Molina Express",
      subtitle:
        "A 3.5-tonne van, fuel, insurance and prepared routes, all provided. You bring the work ethic.",
      cta: { label: "Apply now", href: "#apply" },
      image: {
        src: "/images/hero-drivers.svg",
        alt: "Molina Express driver in uniform closing the rear door of a long-wheelbase van",
        status: "TODO_replace_with_generated_photo",
      },
    },
    story: {
      title: "Started behind the wheel",
      body: "Our founder ran delivery routes before he owned a single van. That is why drivers here get prepared routes, paid training and a straight answer when something goes wrong. We grew from one driver to a fleet by keeping four habits: loyalty to the team, fair decisions, keeping our word, and character when the day gets hard.",
    },
    benefits: {
      title: "What you get",
      items: [
        "Long-wheelbase 3.5t van provided",
        "No fuel or insurance costs",
        "Uniform provided",
        "Secure parking at or near the depot",
        "Full paid training",
        "Prepared routes",
        "Performance bonuses",
        "Self-employed, with accountants available to help",
      ],
    },
    expectations: {
      title: "What we expect",
      items: [
        "Load, unload and drive with safety first",
        "Deliver to homes and businesses",
        "Treat every customer with patience and a smile",
        "Follow delivery procedures to the letter",
        "Take instructions well and ask when unsure",
        "Stay calm and professional in public",
      ],
    },
  },

  thanks: {
    title: "Got it. We are on it.",
    body: "Your message is with the team. We reply within TODO_reply_time_hours working hours.",
    backLabel: "Back to home",
  },

  seo: {
    home: {
      title: "Molina Express - Same-day and next-day delivery in East Anglia",
      description:
        "Parcel delivery across Norfolk, Suffolk and Essex. Local fleet, prepared routes, live tracking and photo proof of delivery.",
    },
    drivers: {
      title: "Drive with Molina Express - Delivery driver openings",
      description:
        "Van, fuel, insurance and routes provided. Paid training and performance bonuses. Apply to deliver in Norfolk, Suffolk or Essex.",
    },
    fulfilment: {
      title: "Molina Fulfilment - 3PL warehouse in Ipswich, Suffolk",
      description:
        "Operator-led fulfilment on the Ipswich-Felixstowe corridor. Receiving, storage, pick and pack, returns and Amazon FBA prep. 126 pallet positions, capacity available now.",
    },
    thanks: { title: "Thanks - Molina Express", description: "We received your message." },
    ogImage: "/images/og.jpg",
    ogImageStatus: "TODO_generate_og_image",
  },

  footer: {
    note: "Registered in England. TODO_company_number",
  },
} as const;
