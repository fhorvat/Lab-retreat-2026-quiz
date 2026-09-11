// ============================================================
// Facts, or Myth? — question bank
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
//   media       (optional) supporting material shown on the PRESENTER screen.
//               Array of { when, type, url, caption?, label? } where
//                 when : 'before'  (shown while the question is live, pre-reveal)
//                      | 'after'   (shown as part of the revealed answer)
//                 type : 'youtube' (embed; watch / youtu.be / shorts URLs all work)
//                      | 'image'   (figure; url = image path, caption optional)
//                      | 'link'    (article/resource link; label = button text)
//
// The ARRAY ORDER below is the presentation order. Reorder freely;
// keep each id unique and stable so existing votes still aggregate.
// ============================================================

const QUESTIONS = [
  {
    id: 1,
    tag: 'Animal physiology · diving reflex',
    text: 'Sloths can hold their breath underwater longer than dolphins.',
    verdict: 'facts',
    oneLiner: 'Three-toed sloths can slash their heart rate by two-thirds and hold their breath for up to 40 minutes — most dolphins need to resurface every 10–15 minutes.',
    explanation: 'Sloths are surprisingly capable swimmers, and their diving reflex lets them drop their heart rate to roughly a third of its resting value, conserving oxygen far more efficiently than most mammals. This lets them stay submerged for up to about 40 minutes at a stretch, longer than most dolphin species, which typically need to surface for air every 10 to 15 minutes.',
    refs: ['Widely documented sloth diving physiology and swimming behavior; figures are commonly cited across wildlife organizations and popular science outlets (e.g. the Sloth Conservation Foundation, BBC Earth) rather than a single dedicated peer-reviewed study.'],
    media: [
      { when: 'before', type: 'youtube', url: 'https://www.youtube.com/shorts/dXyRTcr3kt0', caption: 'A sloth swimming — watch before revealing.' }
    ]
  },
  {
    id: 2,
    tag: 'Comparative physiology · digestion',
    text: 'Frogs cannot vomit. Instead, they turn their stomachs inside out and push them out through their mouths, wipe off the bad stuff with their feet, and slurp the stomach back into their body.',
    verdict: 'facts',
    oneLiner: 'Full gastric eversion lets frogs (and some other vertebrates, like sharks) forcibly expel and clean their entire stomach through the mouth.',
    explanation: 'Because frogs lack the mammalian vomiting reflex, some species instead perform full gastric eversion: the stomach is pushed out through the mouth, exposed contents and irritants are wiped away using the forelimbs, and the organ is then swallowed back into place. It is an extreme but effective way to clear out toxins, parasites, or indigestible material.',
    refs: [
      'Full gastric eversion is documented across several amphibian and elasmobranch (shark) species as a recognized mechanism for expelling gastric contents; see general herpetological and vertebrate physiology references on gastric eversion.',
    ],
    media: [
      { when: 'after', type: 'youtube', url: 'https://www.youtube.com/shorts/NBR1-6NQGzE', caption: 'Full gastric eversion in a frog.' },
    ]
  },
  {
    id: 3,
    tag: 'Marsupial physiology · digestion',
    text: 'Wombats produce cube-shaped poop to keep their territory markers from rolling away.',
    verdict: 'facts',
    oneLiner: 'Non-uniform elasticity along the wombat intestine molds feces into cubes, which stay put on the elevated rocks and logs wombats use to mark territory.',
    explanation: 'A 2021 biomechanics study found that wombat intestines have regions of varying stiffness around their circumference, shaping the final feces into distinct cube-like blocks rather than the usual cylindrical form. Because wombats deposit these droppings on top of rocks and logs as scent-marking territory signals, the flat sides stop them rolling away - a functional payoff for an unusual shape.',
    refs: [
      'Yang, P.J., Lee, S.J., Lee, S., Chang, D.C., Hu, D.L. &amp; Sharp, S.A. et al., <em>Soft Matter</em> 17 (2021), 475–488 — Intestines of non-uniform stiffness mold the shape of wombat feces.'
    ],
  },
  {
    id: 4,
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
    id: 5,
    tag: 'Comparative cognition · medical diagnostics',
    text: 'People are better the pidgeons in recognizing tumors in microscope images.',
    verdict: 'myth',
    oneLiner: 'Trained pigeons matched human performance distinguishing cancerous from healthy breast tissue in a controlled study.',
    explanation: "In a 2015 study, pigeons were trained by operant conditioning to discriminate benign from malignant breast histopathology images and mammograms. Individual pigeons reached about 85% accuracy, and pooling responses from a small flock ('flock sourcing') pushed accuracy close to 99% — on par with expert human pathologists on the same image sets.",
    refs: [
      'Levenson, R.M., Krupinski, E.A., Navarro, V.M. &amp; Wasserman, E.A., <em>PLOS ONE</em> 10 (2015), e0141357 — Pigeons (Columba livia) as Trainable Observers of Pathology and Radiology Breast Cancer Images.'
    ],
  },
  {
    id: 6,
    tag: 'Human genetics · sensory reflex',
    text: 'Autosomal-dominant Compelling Helio-Ophthalmic Outburst (ACHOO) syndrome is an inherited condition that causes sneezing when looking at bright lights.',
    verdict: 'facts',
    oneLiner: 'Also called the photic sneeze reflex, it affects roughly a quarter of people and follows an autosomal dominant inheritance pattern.',
    explanation: 'The photic sneeze reflex causes sudden sneezing triggered by exposure to bright light, most often sunlight. Family studies found it segregates as an autosomal dominant trait — a single copy of the associated variant is enough to produce the reflex — and it affects an estimated 18–35% of people.',
    refs: [
      'Peroutka, S.J. &amp; Peroutka, L.A., <em>New England Journal of Medicine</em> 310 (1984), 599–600 — Autosomal dominant transmission of the photic sneeze reflex.'
    ],
  },
  {
    id: 8,
    tag: 'Microbiome',
    text: 'Bacterial cells outnumber human cells in your body 10 to 1.',
    verdict: 'myth',
    oneLiner: 'A 2016 recalculation found the true ratio is close to 1:1 — the "10:1" figure traces to an unsupported 1970s estimate.',
    explanation: "The '10 bacterial cells for every human cell' figure has been repeated for decades, but it traces back to a rough, never-rigorously-sourced 1970s estimate. A careful 2016 recalculation using updated cell-count data for both bacteria and human tissues found the actual ratio is close to 1:1 — though bacteria still vastly outnumber human cells in total gene content and metabolic diversity.",
    refs: [
      'Sender, R., Fuchs, S. &amp; Milo, R., <em>PLOS Biology</em> 14 (2016), e1002533 — "Revised Estimates for the Number of Human and Bacteria Cells in the Body."'
    ],
  },
  {
    id: 9,
    tag: 'Genome biology',
    text: 'The human genome contains over 100 genes acquired directly from bacteria through horizontal gene transfer.',
    verdict: 'myth',
    oneLiner: 'This claim from the original 2001 draft genome paper was largely retracted after follow-up analyses.',
    explanation: 'The initial 2001 draft human genome sequencing paper proposed that over 100 genes had been acquired directly from bacteria via horizontal gene transfer. More rigorous follow-up phylogenetic analyses showed that most of these genes were actually ancestral genes independently lost in the other lineages used for comparison, rather than genuinely new bacterial acquisitions — one of the most cited examples of an early genomic claim being substantially walked back.',
    refs: [
      'Salzberg, S.L., White, O., Peterson, J. &amp; Eisen, J.A., <em>Science</em> 292 (2001), 1903–1906 — "Microbial genes in the human genome: lateral transfer or gene loss?"',
      'Stanhope, M.J. et al., <em>Nature</em> 411 (2001), 940–944 — "Phylogenetic analyses do not support horizontal gene transfers from bacteria to vertebrates."'
    ]
  },
  {
    id: 10,
    tag: 'Glycobiology · infant nutrition',
    text: 'The third most abundant solid component of human breast milk is a class of complex sugars that a baby\'s own digestive enzymes cannot break down.',
    verdict: 'facts',
    oneLiner: 'Human milk oligosaccharides (HMOs) pass through infants undigested, acting instead as prebiotics that feed beneficial gut bacteria.',
    explanation: 'After lactose and fat, human milk oligosaccharides are the third most abundant solid component of breast milk, yet infants lack the enzymes needed to break most of them down. Instead, HMOs act as prebiotics, selectively nourishing beneficial gut bacteria such as <em>Bifidobacterium longum</em> subsp. <em>infantis</em>, helping shape the infant gut microbiome and support immune system development.',
    refs: [
      'Bode, L., <em>Glycobiology</em> 22 (2012), 1147–1162 — "Human milk oligosaccharides: every baby needs a sugar mama."'
    ]
  },
  {
    id: 12,
    tag: 'Neuroscience · memory',
    text: 'Some cells use prions to store memories.',
    verdict: 'facts',
    oneLiner: 'The neuronal protein CPEB forms self-templating, prion-like aggregates at synapses that are needed to maintain long-term memory.',
    explanation: 'Prion-like protein aggregation is normally associated with disease, but neurons appear to have repurposed the same trick for a beneficial function. The neuronal protein CPEB forms self-templating, prion-like aggregates at synapses, and this aggregated state is required to maintain long-term memory — demonstrated in <em>Aplysia</em> and <em>Drosophila</em> studies.',
    refs: [
      'Si, K., Lindquist, S. &amp; Kandel, E.R., <em>Cell</em> 115 (2003), 893–904 — "A neuronal isoform of CPEB is required for local protein synthesis and stabilization of synapse-specific long-term facilitation."',
      'Majumdar, A. et al., <em>Cell</em> 148 (2012), 515–529 — "Critical Role of Amyloid-like Oligomers of Drosophila Orb2 in the Persistence of Memory."'
    ]
  },
  {
    id: 13,
    tag: "Comparative oncology",
    text: 'Elephants, despite having far more cells than humans and thus more chances for any single cell to become cancerous, get cancer at roughly the same rate as humans.',
    verdict: 'facts',
    oneLiner: "Known as Peto's Paradox — resolved in elephants partly by ~20 extra copies of the tumor-suppressor gene TP53.",
    explanation: "Cancer risk should scale with the number of cells an organism has and how long it lives, yet large, long-lived animals like elephants don't show proportionally higher cancer rates — a discrepancy epidemiologist Richard Peto first noted, hence \"Peto's Paradox.\" Elephants carry around 20 copies of the tumor-suppressor gene TP53, versus one gene pair in humans, sharpening their cells' apoptotic response to DNA damage and eliminating dangerously damaged cells more aggressively before they can become cancerous.",
    refs: [
      'Abegglen, L.M. et al., <em>JAMA</em> 314 (2015), 1850–1860 — "Potential Mechanisms for Cancer Resistance in Elephants and Comparative Cellular Response to DNA Damage in Humans."'
    ]
  },
  {
    id: 14,
    tag: 'Reproductive biology · cross-species cloning',
    text: 'There is a documented case of a queen ant giving birth to males of a completely different species.',
    verdict: 'facts',
    oneLiner: 'Iberian harvester ant queens (Messor ibericus) store sperm from another species (M. structor) and then delete their own genetic material from certain eggs, effectively cloning that other species\' males — a phenomenon the discoverers named "xenoparity."',
    explanation: 'Iberian harvester ant queens (<em>Messor ibericus</em>) mate with and store sperm from a distantly related species, <em>M. structor</em> (lineages split ~5 million years ago). To produce the <em>M. structor</em> males her colony needs, she strips her own genetic material from certain eggs before fertilization, effectively cloning the stored foreign sperm into full males of the other species. Researchers coined the term "xenoparity" ("foreign birth") for this newly described reproductive strategy.',
    refs: [
      'Juvé, Y., Lutrat, C., Ha, A. et al., <em>Nature</em> (2025) — "One mother for two species via obligate cross-species cloning in ants," doi:10.1038/s41586-025-09425-w.'
    ],
    media: [
      { when: 'after', type: 'link', url: 'https://www.smithsonianmag.com/smart-news/these-ant-queens-seem-to-defy-biology-they-lay-eggs-that-hatch-into-another-species-180987292/', label: 'Smithsonian Magazine — coverage of the xenoparity discovery' }
    ]
  }
];
