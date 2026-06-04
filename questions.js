// ============================================================
// Facts, or Faith? — question bank
//
// Each item:
//   id          stable number used as topicId in the vote backend
//               (NOT the display position — array order below is)
//   tag         short category line
//   text        the claim shown to the audience
//   verdict     'facts'  = supported by peer-reviewed evidence
//               'faith'  = sounds plausible but lacks robust backing
//   oneLiner    short verdict summary (presenter screen)
//   explanation longer rationale (presenter screen, on reveal)
//   refs        array of reference strings (may contain <em>/<a> HTML)
//
// The ARRAY ORDER below is the presentation order. Reorder freely;
// keep each id unique and stable so existing votes still aggregate.
// ============================================================

const QUESTIONS = [
  {
    id: 11,
    tag: 'Animal behaviour · locomotion',
    text: 'On steep, slippery slopes, penguins observe a right-of-way rule in which birds climbing uphill are given priority over those heading down.',
    verdict: 'faith',
    oneLiner: 'An appealing, orderly-sounding rule — but there is no peer-reviewed evidence that penguins follow an uphill right-of-way convention.',
    explanation: 'Penguins do form well-worn paths ("penguin highways"), travel in single file, and there is genuine work on the biomechanics of their gait and the traffic-like dynamics of huddles. But a formal social rule granting uphill climbers priority over descenders has not been documented. The claim borrows the plausibility of human traffic norms and real penguin trail-following to dress up a convention that, as stated, lacks empirical support.',
    refs: ['Zitterbart et al., <em>PLoS ONE</em> 6 (2011), e20260 — traveling-wave dynamics of emperor-penguin huddles (real coordinated movement; not an uphill-priority rule).']
  },
  {
    id: 9,
    tag: 'Reproductive biology · microchimerism',
    text: 'Cells from a fetus can cross into the mother during pregnancy and persist in her tissues — including her brain — for decades afterward.',
    verdict: 'facts',
    oneLiner: 'Fetal cells routinely enter the maternal circulation and engraft in maternal organs; male (Y-chromosome) DNA has been detected in women decades later, including in post-mortem brain.',
    explanation: 'Cells traffic in both directions across the placenta, so a mother acquires genetically distinct fetal cells and the fetus acquires maternal cells — fetomaternal microchimerism. These cells can persist for decades; a standard assay detects male DNA in the blood and tissues of women who have borne sons. Microchimeric cells have been found in maternal organs and are studied for roles in wound healing, autoimmunity, and cancer — including persistence in the maternal brain.',
    refs: [
      'Bianchi et al., <em>PNAS</em> 93 (1996), 705–708 — fetal cells persist in maternal blood for years.',
      'Chan et al., <em>PLoS ONE</em> 7 (2012), e45592 — male microchimerism in the female human brain.'
    ]
  },
  {
    id: 4,
    tag: 'Behaviour · evolutionary psychology',
    text: 'The facial width-to-height ratio (fWHR) of adult human males is a reliable signature of aggressive behaviour.',
    verdict: 'faith',
    oneLiner: 'A widely cited but increasingly contested claim. Original effects do not survive pre-registration, larger samples, or controls for body size and sex.',
    explanation: 'Early reports (Carré &amp; McCormick, 2008) found fWHR correlated with penalty minutes in hockey players. Subsequent meta-analyses and pre-registered replications report effect sizes near zero once confounds — body mass, age, photo quality, rater — are controlled. The sexual-dimorphism premise has also been challenged: adult fWHR is not reliably larger in men than women.',
    refs: [
      'Kosinski, <em>Psych. Sci.</em> 28 (2017), 1675–1682 — large-sample non-replication.',
      'Caton, Hannan &amp; Dixson, <em>Psychol. Bull.</em> 148 (2022), 33–60 — meta-analysis.'
    ]
  },
  {
    id: 3,
    tag: 'Genome biology · endogenous retroviruses',
    text: 'Roughly 8% of the human genome consists of DNA left behind by ancient retroviruses that infected our ancestors.',
    verdict: 'facts',
    oneLiner: 'Human endogenous retroviruses (HERVs) and their remnants make up about 8% of our nuclear DNA — a permanent genetic fossil record of past germ-line infections.',
    explanation: 'When a retrovirus integrates into a germ-line cell, the provirus can be inherited by all descendants. Over tens of millions of years this happened repeatedly, leaving HERVs and their solo long-terminal-repeats across the genome — several times more sequence than all protein-coding exons combined (~1.5%). Some retain functional elements the host has domesticated, including the placental fusion protein syncytin, which derives from a retroviral envelope gene.',
    refs: [
      'International Human Genome Sequencing Consortium (Lander et al.), <em>Nature</em> 409 (2001), 860–921.',
      'Bannert &amp; Kurth, <em>PNAS</em> 101 (2004), 14572–14579 — review of HERVs.'
    ]
  },
  {
    id: 6,
    tag: 'Neuroscience · organelle traffic',
    text: 'In the adult mammalian brain, healthy neurons routinely donate mitochondria to damaged neighbours through tunneling nanotubes, restoring their metabolic function.',
    verdict: 'faith',
    oneLiner: 'Tunneling nanotubes are real in culture; routine, functionally rescuing mitochondrial transfer between adult neurons in vivo is not established.',
    explanation: 'TNTs were described by Rustom et al. (2004), and mitochondrial transfer via TNTs has been shown in cell culture and between astrocytes and neurons in stroke models. The leap to "routinely, between neurons, in the intact adult brain, as a rescue mechanism" is not supported: direct in vivo imaging of neuron-to-neuron TNT-mediated transfer in mammals is lacking, and structures seen in vivo are often blebs or filopodia rather than bona fide TNTs.',
    refs: [
      'Rustom et al., <em>Science</em> 303 (2004), 1007–1010 — original TNT description.',
      'Hayakawa et al., <em>Nature</em> 535 (2016), 551–555 — astrocyte→neuron transfer in stroke (vesicle-mediated, not TNT).',
      'Cordero Cervantes &amp; Zurzolo, <em>EMBO J.</em> 40 (2021), e105789 — review of TNTs in the nervous system.'
    ]
  },
  {
    id: 8,
    tag: 'Neuroscience · adult plasticity',
    text: 'Adult hippocampal neurogenesis is a robust, lifelong phenomenon in humans and contributes substantively to learning and memory.',
    verdict: 'faith',
    oneLiner: 'A textbook claim that is much less settled than it sounds. The most stringent studies find human dentate-gyrus neurogenesis undetectable in adults, and the functional contribution to memory has never been directly shown in humans.',
    explanation: 'Adult neurogenesis is well established in rodents; extending it to humans is shakier. Sorrells et al. (2018) found neuroblasts essentially absent after age ~13. Moreno-Jiménez et al. (2019) and Boldrini et al. (2018) reported the opposite using different fixation protocols, and the debate is unresolved. Critically, even studies arguing neurogenesis persists do not demonstrate a causal contribution to memory in humans — that leap is the faith part.',
    refs: [
      'Sorrells et al., <em>Nature</em> 555 (2018), 377–381 — "drops to undetectable levels in adults".',
      'Moreno-Jiménez et al., <em>Nat. Med.</em> 25 (2019), 554–560 — counter-evidence, fixation-dependent.',
      'Kempermann et al., <em>Cell Stem Cell</em> 23 (2018), 25–30 — joint statement.'
    ]
  },
  {
    id: 5,
    tag: 'Physiology · metabolism',
    text: 'Healthy adult humans retain deposits of metabolically active brown fat that burn energy to generate heat — tissue long thought to disappear after infancy.',
    verdict: 'facts',
    oneLiner: 'PET–CT and biopsy studies confirmed depots of functional, cold-activated brown adipose tissue in adults, burning glucose and fat to produce heat.',
    explanation: 'Brown adipose tissue (BAT) dissipates chemical energy as heat through the mitochondrial uncoupling protein UCP1. It was long believed to vanish after infancy, but in 2009 several groups independently used 18F-FDG PET–CT to image cold-activated, UCP1-positive BAT in the supraclavicular and paravertebral regions of healthy adults. BAT activity is inversely correlated with BMI and is a target for metabolic-disease research.',
    refs: [
      'Cypess et al., <em>N. Engl. J. Med.</em> 360 (2009), 1509–1517.',
      'van Marken Lichtenbelt et al., <em>NEJM</em> 360 (2009), 1500–1508.',
      'Virtanen et al., <em>NEJM</em> 360 (2009), 1518–1525.'
    ]
  },
  {
    id: 7,
    tag: 'Human genetics · disease resistance',
    text: 'A natural mutation in the CCR5 gene (Δ32) makes people who inherit two copies almost completely resistant to infection by the common strain of HIV.',
    verdict: 'facts',
    oneLiner: 'Homozygous CCR5-Δ32 carriers lack a working CCR5 co-receptor, which most HIV-1 strains need to enter cells, and are highly resistant to infection.',
    explanation: 'CCR5 is the chemokine co-receptor that R5-tropic HIV-1 uses, alongside CD4, to enter T cells. The Δ32 allele is a 32-bp deletion producing a truncated receptor that never reaches the cell surface. People homozygous for Δ32 (~1% of European ancestry) are strongly protected against R5-strain infection; heterozygotes progress more slowly. This is the basis of the only confirmed HIV cures — the "Berlin" and "London" patients, who received bone-marrow transplants from Δ32/Δ32 donors.',
    refs: [
      'Samson et al., <em>Nature</em> 382 (1996), 722–725.',
      'Liu et al., <em>Cell</em> 86 (1996), 367–377 — Δ32 homozygotes resist HIV-1.',
      'Hütter et al., <em>NEJM</em> 360 (2009), 692–698 — the Berlin patient.'
    ]
  },
  {
    id: 1,
    tag: 'Cell biology · stress response',
    text: 'When cells are stressed, ribosomes are protected by forming inactive ribosome dimers.',
    verdict: 'facts',
    oneLiner: 'Stress-induced ribosome dimerisation is a conserved, structurally characterised way to preserve translation machinery during starvation and other insults.',
    explanation: 'The 2024 cryo-EM structure of the stress-induced mammalian 100S-like dimer showed how two 80S ribosomes inactivate each other at their decoding centres, preserving the pool for rapid recovery once stress is relieved. Bacterial 100S particles have been known for longer.',
    refs: ['Karki et al., <em>Science</em> 384 (2024), doi:10.1126/science.adr4287']
  }
];
