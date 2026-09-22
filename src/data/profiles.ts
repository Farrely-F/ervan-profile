/**
 * Profile source of truth.
 *
 * Every professional fact here is transcribed or arithmetically derived from
 * `docs/irvan-baihaqi.md` and `docs/enrico-dwidhanto-indrawan.md` (LinkedIn
 * exports, ~2026-10). Nothing is inferred beyond those documents: no tools,
 * employers, projects or achievements are invented. Prose marked as `voice`
 * is deliberate *world fiction* — it frames the presentation, it never
 * asserts an unlisted fact.
 */

export type World = "irvan" | "enrico";

export type Rift = {
  /** three.js-friendly hex ramp for the WebGL rift field. */
  a: string;
  b: string;
  c: string;
  void: string;
};

export type Signal = {
  value: string;
  label: string;
  /** Where the number comes from — reported, or counted from the record. */
  basis: string;
};

export type ChronicleEntry = {
  id: string;
  kind: "role" | "study";
  title: string;
  org: string;
  location: string | null;
  /** Verbatim date range as reported by the export. */
  dates: string;
  duration: string | null;
  startYear: number | null;
  /** null = ongoing at export time. */
  endYear: number | null;
  domain: string;
  note?: string;
};

export type LoadoutEntry = {
  /** Position in the subject's own list — never a proficiency claim. */
  index: number;
  name: string;
  spec: string | null;
};

export type ProofEntry = {
  id: string;
  name: string;
  issuer: string | null;
  field: string | null;
  detail: string;
};

export type Profile = {
  id: World;
  world: {
    code: string;
    name: string;
    /** Abbreviation for narrow headers. */
    short: string;
    tagline: string;
    /** Real coordinates of the listed location — not invented chrome. */
    coordinates: string;
    epoch: string;
  };
  name: string;
  monogram: string;
  headline: string;
  location: string;
  summary: string;
  contact: { email: string | null; linkedin: string };
  signals: Signal[];
  chronicle: ChronicleEntry[];
  loadout: LoadoutEntry[];
  proof: ProofEntry[];
  copy: {
    arrival: { eyebrow: string; voice: string; sub: string };
    brief: { eyebrow: string; title: string; voice: string };
    chronicle: { eyebrow: string; title: string; voice: string };
    loadout: { eyebrow: string; title: string; voice: string };
    proof: { eyebrow: string; title: string; voice: string; footnote: string };
    transmission: { eyebrow: string; title: string; voice: string; note: string };
    crossover: { eyebrow: string; title: string; voice: string; cta: string };
  };
};

const IRVAN: Profile = {
  id: "irvan",
  world: {
    code: "GRID-01",
    name: "The Grid",
    short: "Grid",
    tagline: "Uptime, kept by hand.",
    coordinates: "-6.2088° S / 106.8456° E",
    epoch: "2017 → present",
  },
  name: "Irvan Baihaqi",
  monogram: "IB",
  headline: "IT Infrastructure Engineer",
  location: "Area DKI Jakarta, Indonesia",
  summary:
    "IT infrastructure engineer with 9+ years across infrastructure engineering and IT/desktop support roles in Jakarta. Currently responsible for infrastructure engineering at SLTR Group; previously delivered desktop support and IT support engineering at PT Berca Hardayaperkasa and PT. Graha Karya Informasi. Holds MikroTik (MTCNA) and Fortinet (FCA) certifications.",
  contact: {
    email: "irvanbaihaqi2028@gmail.com",
    linkedin: "https://www.linkedin.com/in/irvan-baihaqi",
  },
  signals: [
    { value: "9+", label: "Years in service", basis: "as stated by the subject" },
    { value: "03", label: "Roles held", basis: "counted from dated posts" },
    { value: "02", label: "Certifications", basis: "counted from the list" },
    { value: "05", label: "Logged skills", basis: "counted from the list" },
  ],
  chronicle: [
    {
      id: "smk",
      kind: "study",
      title: "SMK Satya Bhakti 1",
      org: "Vocational secondary school",
      location: null,
      dates: "Dates not given",
      duration: null,
      startYear: null,
      endYear: null,
      domain: "Teknik Komputer dan Jaringan",
      note: "Computer and Network Engineering.",
    },
    {
      id: "graha",
      kind: "role",
      title: "Information Technology Support Engineer",
      org: "PT. Graha Karya Informasi",
      location: "Area DKI Jakarta, Indonesia",
      dates: "January 2017 – January 2018",
      duration: "1 year 1 month",
      startYear: 2017,
      endYear: 2018,
      domain: "IT support",
    },
    {
      id: "berca",
      kind: "role",
      title: "Desktop Support Engineer",
      org: "PT Berca Hardayaperkasa",
      location: "Jakarta Raya, Indonesia",
      dates: "March 2018 – December 2020",
      duration: "2 years 10 months",
      startYear: 2018,
      endYear: 2020,
      domain: "Desktop support",
    },
    {
      id: "sltr",
      kind: "role",
      title: "Infrastructure Engineer",
      org: "SLTR Group",
      location: "Jakarta Raya, Indonesia",
      dates: "December 2020 – Present",
      duration: "5 years 10 months",
      startYear: 2020,
      endYear: null,
      domain: "Infrastructure engineering",
    },
  ],
  loadout: [
    {
      index: 1,
      name: "Linux Server",
      spec: null,
    },
    { index: 2, name: "Docker", spec: null },
    {
      index: 3,
      name: "Google Workspace",
      spec: null,
    },
    {
      index: 4,
      name: "Infrastructure Engineering",
      spec: null,
    },
    {
      index: 5,
      name: "IT / Desktop Support",
      spec: null,
    },
  ],
  proof: [
    {
      id: "mtcna",
      name: "MikroTik Certified Network Associate",
      issuer: "MTCNA",
      field: "Networking",
      detail: "Certification held",
    },
    {
      id: "fca",
      name: "Fortinet Certified Associate",
      issuer: "FCA",
      field: "Network security",
      detail: "Certification held",
    },
    {
      id: "smk1",
      name: "SMK Satya Bhakti 1",
      issuer: "Vocational secondary school (SMK)",
      field: "Teknik Komputer dan Jaringan",
      detail: "Computer and Network Engineering · dates not given",
    },
  ],
  copy: {
    arrival: {
      eyebrow: "World 01 · The Grid",
      voice: "Someone has to keep the lights on.",
      sub: "Infrastructure, networks and uptime across Jakarta since 2017.",
    },
    brief: {
      eyebrow: "01 · Signal",
      title: "Who is holding the line",
      voice: "Nine years of it is in the wiring, not the slide deck.",
    },
    chronicle: {
      eyebrow: "02 · The Rail",
      title: "Three posts, one continuous shift",
      voice: "Support, then desktop, then the infrastructure underneath both.",
    },
    loadout: {
      eyebrow: "03 · Loadout",
      title: "Declared, in order",
      voice: "This is the list as the operator wrote it.",
    },
    proof: {
      eyebrow: "04 · Proof",
      title: "Stamped and kept",
      voice: "Two certifications and the school that started it.",
      footnote:
        "Issuing bodies and fields as given.",
    },
    transmission: {
      eyebrow: "05 · Transmission",
      title: "Open a channel",
      voice: "Direct line, always monitored.",
      note: "Preferred: email. LinkedIn for everything else.",
    },
    crossover: {
      eyebrow: "06 · Crossover",
      title: "The seam is opening",
      voice: "Another world runs on the same rift.",
      cta: "Cross into The Green March",
    },
  },
};

const ENRICO: Profile = {
  id: "enrico",
  world: {
    code: "MARCH-02",
    name: "The Green March",
    short: "March",
    tagline: "From terrain to tables.",
    coordinates: "-7.3274° S / 108.2207° E",
    epoch: "2011 → present",
  },
  name: "Enrico Dwidhanto Indrawan",
  monogram: "ED",
  headline: "Backend Developer",
  location: "Kota Tasikmalaya, West Java, Indonesia",
  summary:
    "Full-stack developer with a JavaScript bootcamp background. Interested in working on and developing skills in software development programming. Familiar with both front-end and back-end. Adapts to new environments; able to work independently and as part of a team.",
  contact: {
    email: null,
    linkedin:
      "https://www.linkedin.com/in/enrico-dwidhanto-indrawan-253637201",
  },
  signals: [
    {
      value: "5+",
      label: "Years in software",
      basis: "derived from dated posts",
    },
    { value: "04", label: "Roles logged", basis: "counted from dated posts" },
    { value: "02", label: "Institutions", basis: "counted from studies" },
    { value: "04", label: "Logged skills", basis: "counted from the list" },
  ],
  chronicle: [
    {
      id: "itb",
      kind: "study",
      title: "Institut Teknologi Bandung",
      org: "Bachelor of Science (BS)",
      location: null,
      dates: "2011 – 2016",
      duration: "5 years",
      startYear: 2011,
      endYear: 2016,
      domain: "Geodesy and Geomatics Engineering",
      note: "Charted the physical world first.",
    },
    {
      id: "saxo",
      kind: "role",
      title: "Project Coordinator",
      org: "PT. Saxo Global Investama",
      location: null,
      dates: "August 2017 – July 2020",
      duration: "3 years",
      startYear: 2017,
      endYear: 2020,
      domain: "Coordination",
      note: "Non-engineering role; held before the transition into software development.",
    },
    {
      id: "hacktiv8",
      kind: "study",
      title: "Hacktiv8 Indonesia",
      org: "Full Stack JavaScript",
      location: null,
      dates: "August 2020 – December 2020",
      duration: "5 months",
      startYear: 2020,
      endYear: 2020,
      domain: "Bootcamp",
      note: "The turn: from coordinating projects to writing them.",
    },
    {
      id: "kontrak",
      kind: "role",
      title: "Back End Developer",
      org: "Kontrak Hukum",
      location: "Indonesia",
      dates: "May 2021 – November 2021",
      duration: "7 months",
      startYear: 2021,
      endYear: 2021,
      domain: "Back end",
    },
    {
      id: "binar",
      kind: "role",
      title: "Back End Developer",
      org: "Binar Academy",
      location: null,
      dates: "December 2021 – October 2022",
      duration: "11 months",
      startYear: 2021,
      endYear: 2022,
      domain: "Back end",
    },
    {
      id: "solitaire",
      kind: "role",
      title: "Back End Developer",
      org: "Solitaire",
      location: "Jakarta, Indonesia",
      dates: "November 2022 – Present",
      duration: "3 years 11 months",
      startYear: 2022,
      endYear: null,
      domain: "Back end",
    },
  ],
  loadout: [
    { index: 1, name: "Go", spec: "Programming Language" },
    { index: 2, name: "MySQL", spec: null },
    {
      index: 3,
      name: "Software Development",
      spec: null,
    },
    {
      index: 4,
      name: "JavaScript",
      spec: "full-stack, per summary and education",
    },
  ],
  proof: [
    {
      id: "hacktiv8-cert",
      name: "Hacktiv8 Indonesia",
      issuer: "Full Stack JavaScript",
      field: "Bootcamp",
      detail: "August 2020 – December 2020",
    },
    {
      id: "itb-cert",
      name: "Institut Teknologi Bandung",
      issuer: "Bachelor of Science (BS)",
      field: "Geodesy and Geomatics Engineering",
      detail: "2011 – 2016",
    },
  ],
  copy: {
    arrival: {
      eyebrow: "World 02 · The Green March",
      voice: "He charted the ground before he charted the data.",
      sub: "Back end in Go and MySQL, written from West Java.",
    },
    brief: {
      eyebrow: "01 · Signal",
      title: "The one who changed maps",
      voice: "Bootcamp-trained, comfortable on both ends of the stack.",
    },
    chronicle: {
      eyebrow: "02 · The Rail",
      title: "Geodesy, coordination, then code",
      voice: "The pivot is a date, not a rumour: a bootcamp in late 2020.",
    },
    loadout: {
      eyebrow: "03 · Loadout",
      title: "The stack, as declared",
      voice: "Four entries, exactly as declared.",
    },
    proof: {
      eyebrow: "04 · Proof",
      title: "Where the trade was learned",
      voice: "A geodesy degree, then five months that changed the direction.",
      footnote: "Programmes and dates as given.",
    },
    transmission: {
      eyebrow: "05 · Transmission",
      title: "Open a channel",
      voice: "One channel published. Use it.",
      note: "No email address is published — LinkedIn is the route.",
    },
    crossover: {
      eyebrow: "06 · Crossover",
      title: "The seam is opening",
      voice: "Another world runs on the same rift.",
      cta: "Cross into The Grid",
    },
  },
};

export const PROFILES: Record<World, Profile> = {
  irvan: IRVAN,
  enrico: ENRICO,
};

export const WORLDS: World[] = ["irvan", "enrico"];

/** three.js hex ramps for the WebGL rift field. */
export const RIFTS: Record<World | "rift", Rift> = {
  irvan: { a: "#2fe6ff", b: "#ff3ea5", c: "#8b6bff", void: "#070a1a" },
  enrico: { a: "#ffcd6b", b: "#43d68a", c: "#e0824a", void: "#160e07" },
  rift: { a: "#5ad8ff", b: "#ff5fb0", c: "#ffc46b", void: "#05060f" },
};

export const otherWorld = (world: World): World =>
  world === "irvan" ? "enrico" : "irvan";
