// DRISHTI: Drishti Academy Curriculum, Verified Video Library & Interactive Modules
// Stage 4: Drishti Academy, AAR & Performance Analytics

import {
  AcademyCategory,
  EducationalVideoLesson,
  InteractiveLearningModule,
} from '../types/academy';

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  'All',
  'Counter-Drone Fundamentals',
  'Drone Recognition and Classification',
  'Airspace Observation',
  'FPV Flight Fundamentals',
  'Sensor Awareness and Low-Visibility Observation',
  'Aerial Observation and Reporting',
  'Simulation Safety and Decision-Making',
];

// -------------------------------------------------------------
// 1. Verified Educational Video Lessons (Genuine YouTube Sources)
// -------------------------------------------------------------

export const ACADEMY_VIDEO_LESSONS: EducationalVideoLesson[] = [
  {
    id: 'vid-dynamics',
    title: 'Drones | The Complete Flight Dynamics',
    channelName: 'Lesics',
    youtubeId: 'C0KBu2ihp-s',
    embedUrl: 'https://www.youtube-nocookie.com/embed/C0KBu2ihp-s',
    watchUrl: 'https://www.youtube.com/watch?v=C0KBu2ihp-s',
    duration: '10:14',
    category: 'Drone Recognition and Classification',
    difficulty: 'Beginner',
    description:
      'Detailed mechanical and aerodynamic engineering breakdown of quadcopter rotor dynamics, differential motor torque, roll, pitch, and yaw stabilization.',
    keyTopics: ['Differential Rotor Torque', 'Electronic Speed Controllers', 'Pitch and Roll Physics'],
  },
  {
    id: 'vid-faa-safety',
    title: 'FAA Safety Briefing: Drone Safety in the National Airspace',
    channelName: 'Federal Aviation Administration (FAA)',
    youtubeId: 'zezbqGiSP5c',
    embedUrl: 'https://www.youtube-nocookie.com/embed/zezbqGiSP5c',
    watchUrl: 'https://www.youtube.com/watch?v=zezbqGiSP5c',
    duration: '4:32',
    category: 'Simulation Safety and Decision-Making',
    difficulty: 'Beginner',
    description:
      'Official FAA regulatory briefing detailing National Airspace System (NAS) safety, flight corridor limits, visual line-of-sight standards, and unauthorized drone reporting.',
    keyTopics: ['Airspace Classification', 'Visual Line of Sight (VLOS)', 'Incident Reporting Protocols'],
  },
  {
    id: 'vid-nasa-aero',
    title: 'Exploring Drone Aerodynamics With Computers',
    channelName: 'NASA Ames Research Center',
    youtubeId: 'hywBEaGiO4k',
    embedUrl: 'https://www.youtube-nocookie.com/embed/hywBEaGiO4k',
    watchUrl: 'https://www.youtube.com/watch?v=hywBEaGiO4k',
    duration: '3:48',
    category: 'Sensor Awareness and Low-Visibility Observation',
    difficulty: 'Intermediate',
    description:
      'NASA computational fluid dynamics (CFD) supercomputer visualization revealing complex rotor vortex interactions, fuselage turbulence, and aerodynamic drag profiles.',
    keyTopics: ['Computational Fluid Dynamics', 'Rotor Downwash Vortices', 'Acoustic Signature Origins'],
  },
  {
    id: 'vid-fpv-basics',
    title: 'How to Fly an FPV Drone (Beginner Guide)',
    channelName: 'Alec Searle',
    youtubeId: 'AXTtgPLoQrA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/AXTtgPLoQrA',
    watchUrl: 'https://www.youtube.com/watch?v=AXTtgPLoQrA',
    duration: '14:22',
    category: 'FPV Flight Fundamentals',
    difficulty: 'Beginner',
    description:
      'Comprehensive walkthrough of First-Person View (FPV) flight controls, radio transmitter stick layout, throttle management, stabilized vs acro modes, and spatial orientation.',
    keyTopics: ['Radio Transmitter Controls', 'Acro vs Angle Mode', 'Spatial Muscle Memory'],
  },
  {
    id: 'vid-lockheed-cuas',
    title: 'Sanctum™ vs. the Swarm: Next-Gen Counter-UAS in Action',
    channelName: 'Lockheed Martin',
    youtubeId: 'h6lu7DL0MDE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/h6lu7DL0MDE',
    watchUrl: 'https://www.youtube.com/watch?v=h6lu7DL0MDE',
    duration: '2:50',
    category: 'Counter-Drone Fundamentals',
    difficulty: 'Intermediate',
    description:
      'Multi-layered counter-UAS architecture demonstrating layered radar/RF detection, target correlation, threat prioritization, and coordinated multi-threat mitigation.',
    keyTopics: ['Layered Air Defense', 'Multi-Sensor Fusion', 'Swarm Countermeasures'],
  },
  {
    id: 'vid-nato-cuas',
    title: 'NATO Tests Counter-Drone Technology (C-UAS TIE Exercise)',
    channelName: 'NATO',
    youtubeId: 'sjNk-NCs3-A',
    embedUrl: 'https://www.youtube-nocookie.com/embed/sjNk-NCs3-A',
    watchUrl: 'https://www.youtube.com/watch?v=sjNk-NCs3-A',
    duration: '3:15',
    category: 'Airspace Observation',
    difficulty: 'Advanced',
    description:
      'Field footage from the NATO Technical Interoperability Exercise demonstrating multinational acoustic, radar, and RF sensor networks tracking rogue unmanned systems.',
    keyTopics: ['Interoperability Standards', 'Acoustic Arrays', 'Joint Command Correlation'],
  },
];

// -------------------------------------------------------------
// 2. Interactive Learning Modules with Quizzes & Instant Feedback
// -------------------------------------------------------------

export const INTERACTIVE_MODULES: InteractiveLearningModule[] = [
  {
    id: 'mod-recognition-basics',
    code: 'ACAD-101',
    title: 'Drone Recognition & Airframe Fundamentals',
    subtitle: 'Multirotor vs Fixed-Wing Silhouette Discrimination',
    category: 'Drone Recognition and Classification',
    difficulty: 'Beginner',
    durationMinutes: 15,
    description:
      'Master the visual and acoustic differentiation of commercial multirotors, tactical fixed-wing platforms, and loitering attack munitions.',
    objectives: [
      'Identify multirotor configurations (quad, hexa, octo) and their flight envelopes.',
      'Differentiate fixed-wing loitering munitions from commercial camera platforms.',
      'Correlate motor count and rotor geometry with payload capacity and speed bands.',
    ],
    slides: [
      {
        title: 'Platform Classification: Multirotor vs Fixed-Wing',
        subtitle: 'Structural Configurations & Aerodynamic Principles',
        paragraphs: [
          'Unmanned Aerial Systems (UAS) operate across two primary aerodynamic configurations: rotary-wing (multirotor) and fixed-wing airframes.',
          'Multirotors rely on differential rotor thrust for lift, translation, and yaw. They possess omnidirectional hover capability, low-to-medium cruise speeds (12-25 m/s), and high maneuverability in urban or confined airspace.',
          'Fixed-wing systems generate lift through forward airspeed across airfoils. They demonstrate superior range, high cruise speeds (35-75+ m/s), and extended loiter endurance, making them the standard airframe for one-way attack (OWA) munitions.',
        ],
        keyTakeaways: [
          'Multirotors: Vertical takeoff/landing (VTOL), hover capability, short-to-medium radius.',
          'Fixed-Wing: High forward momentum, continuous forward flight required, extended operational depth.',
        ],
      },
      {
        title: 'Visual Aspect Ratio & Silhouette Analysis',
        subtitle: 'Discriminating Payload Modifications & Hostile Intent',
        paragraphs: [
          'Air defense operators must scrutinize airframe aspect ratios and external modifications under optical magnification.',
          'Standard commercial platforms exhibit clean, symmetrical airframes with central integrated gimbal enclosures and visible navigational LEDs.',
          'Modified or weaponized airframes frequently display: 1) Structural asymmetry from ad-hoc release servos, 2) Taped or disabled anti-collision lighting (blackout flight), and 3) Underslung cylindrical or mortar-tube payload containers.',
        ],
        keyTakeaways: [
          'Clean central gimbal = Standard commercial inspection or photography.',
          'Blackout lighting + underslung irregular payload = Elevated suspicion / hostile intent.',
        ],
      },
      {
        title: 'Acoustic & Thermal Signatures',
        subtitle: 'Sensor Integration Beyond Visual Line of Sight',
        paragraphs: [
          'Small drones produce distinct frequency spectra based on their propulsion mechanisms.',
          'Electric multirotors emit a characteristic high-frequency buzz (~150-350 Hz) generated by high-RPM carbon-fiber rotor blades displacing air.',
          'Internal combustion fixed-wing loitering munitions emit a loud, continuous two-stroke engine drone audible at several kilometers, accompanied by a concentrated thermal exhaust bloom (>450K) easily visible on thermal FLIR sensors.',
        ],
        keyTakeaways: [
          'High-pitched blade-pass tone = Electric multirotor.',
          'Loud two-stroke internal combustion engine = Tactical fixed-wing munition.',
        ],
      },
    ],
    passingScorePct: 75,
    quiz: [
      {
        id: 'q1',
        question:
          'Which primary flight characteristic immediately differentiates a multirotor from a standard fixed-wing drone?',
        options: [
          'Multirotors can maintain stationary hover and fly omnidirectionally.',
          'Multirotors always fly at twice the airspeed of fixed-wing platforms.',
          'Multirotors do not require battery or fuel power to sustain altitude.',
          'Multirotors cannot be tracked by radar sensors.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! Multirotors utilize differential rotor thrust, granting them the ability to hover stationary and translate omnidirectionally, whereas fixed-wing aircraft must maintain forward airspeed to generate aerodynamic lift.',
      },
      {
        id: 'q2',
        question:
          'An operator spots an unidentified quadcopter operating near a facility boundary at dusk with all navigational LEDs blacked out and an irregular underslung canister. What does this profile suggest?',
        options: [
          'Authorized civil surveying drone operating under normal flight clearance.',
          'Potentially suspicious drone modified for unauthorized delivery or reconnaissance.',
          'Emergency medical blood transport drone.',
          'A military transport aircraft transiting high-altitude corridors.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! Intentional blackout of standard collision lights combined with irregular underslung attachments strongly indicates unauthorized tampering or potential hostile delivery mechanisms.',
      },
      {
        id: 'q3',
        question:
          'What acoustic profile is most characteristic of an electric quadcopter in low-altitude hover?',
        options: [
          'Deep low-frequency turbine rumble below 20 Hz.',
          'High-pitch rotor blade-pass tone between 150 and 350 Hz.',
          'Loud intermittent backfiring from a two-stroke piston engine.',
          'Completely silent with zero acoustic emission.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! High-RPM brushless electric motors and multi-blade propellers produce a distinctive high-frequency blade-pass tone typically centered between 150 Hz and 350 Hz.',
      },
      {
        id: 'q4',
        question:
          'Why do fixed-wing loitering munitions pose a different tactical challenge than commercial quadcopters?',
        options: [
          'They fly much faster, carry heavier payloads, and have significantly longer operational range.',
          'They cannot be detected by thermal imaging sensors.',
          'They only operate indoors inside buildings.',
          'They are made entirely of radar-invisible wood.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! Fixed-wing platforms achieve speeds of 40-75+ m/s with operational radii of tens of kilometers, compressing the operator decision timeline compared to slower commercial quadcopters.',
      },
    ],
  },

  {
    id: 'mod-threat-classification',
    code: 'ACAD-202',
    title: 'Observation & Multi-Sensor Threat Classification',
    subtitle: 'Correlating Radar, RF Telemetry, Optics & Transponders',
    category: 'Sensor Awareness and Low-Visibility Observation',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    description:
      'Learn how to fuse radar returns, radio frequency (RF) signal packet analysis, optical silhouettes, and flight corridors to classify contacts accurately.',
    objectives: [
      'Interpret Radar Cross Section (RCS) values for micro-UAS vs birds vs aircraft.',
      'Analyze 2.4 GHz and 5.8 GHz FHSS telemetry signals for drone control links.',
      'Verify transponder squawk codes (Mode-S / Mode-5) against authorized airspace manifests.',
    ],
    slides: [
      {
        title: 'Multi-Sensor Data Fusion',
        subtitle: 'Overcoming Single-Sensor Limitations in Counter-UAS',
        paragraphs: [
          'No single sensor technology is sufficient for dependable drone classification. Radar detects movement and velocity but can confuse small drones with large birds or blowing debris.',
          'Radio Frequency (RF) direction finders intercept command uplinks and video downlinks (2.4 GHz, 5.8 GHz, 915 MHz), revealing drone brand and serial identifiers, but are useless against autonomous drones operating in radio blackout.',
          'Electro-Optical and Infrared (EO/IR) cameras provide visual confirmation of airframe silhouette, payload attachments, and thermal exhaust blooms, closing the loop on identification.',
        ],
        keyTakeaways: [
          'Radar = Airspace volume scan & kinematics.',
          'RF Analyzer = Control link telemetry & protocol classification.',
          'EO/IR Optic = Visual verification of airframe, payload, and intent.',
        ],
      },
      {
        title: 'Radar Cross Section (RCS) & Micro-Doppler',
        subtitle: 'Distinguishing Drones from Environmental Clutter',
        paragraphs: [
          'Small commercial quadcopters present a minute Radar Cross Section (RCS), typically between 0.01 m² and 0.035 m².',
          'To separate drones from birds, modern C-UAS pulse-Doppler radars analyze "Micro-Doppler" frequency modulation: the rapid spinning of propeller blades imparts distinct harmonic sidebands onto the reflected radar wave.',
          'Birds flap wings at 2-6 Hz, whereas drone propellers rotate at 80-250 Hz, providing an unmistakable digital fingerprint in the radar spectrum.',
        ],
        keyTakeaways: [
          'RCS of micro-drone: 0.01 - 0.035 m².',
          'Micro-Doppler harmonics from spinning blades reliably distinguish drones from birds.',
        ],
      },
      {
        title: 'Airspace Corridors & Transponder Verification',
        subtitle: 'Mode-S, Mode-5, and Pre-Filed Flight Plans',
        paragraphs: [
          'Authorized civil aircraft and registered commercial delivery drones broadcast cooperative transponder signals (Mode-S, ADS-B Out, or Remote ID squawks) pre-cleared by regional air traffic control.',
          'When a radar contact enters a sector without active transponder correlation or matching flight corridor clearance, it is initially categorized as an Unknown Drone.',
          'If the airframe actively avoids established civilian transit paths and hugs terrain contours, its classification escalates to Potentially Suspicious.',
        ],
        keyTakeaways: [
          'Active transponder + filed flight plan = Authorized / Known Aircraft.',
          'No squawk + unfiled entry = Unknown Drone (Requires active investigation).',
        ],
      },
    ],
    passingScorePct: 75,
    quiz: [
      {
        id: 'q1',
        question:
          'How does modern counter-drone radar distinguish a small drone from a bird with similar physical size?',
        options: [
          'By measuring the micro-Doppler modulation caused by fast-spinning propeller blades.',
          'By listening to radio music broadcast by the drone.',
          'By waiting for the object to land.',
          'By measuring air temperature directly beneath the contact.',
        ],
        correctIndex: 0,
        explanation:
          'Correct! The high-speed rotation of propeller blades generates high-frequency micro-Doppler sidebands (80-250 Hz) that distinctly separate drone returns from flapping bird wings (2-6 Hz).',
      },
      {
        id: 'q2',
        question:
          'An unknown target appears on radar with an RCS of 0.02 m². The RF detector intercepts active 2.4 GHz Frequency-Hopping Spread Spectrum (FHSS) packets. What is the most likely platform?',
        options: [
          'A military fighter jet at 10,000 meters.',
          'A commercial COTS multirotor communicating with a hand controller.',
          'A flock of geese migrating south.',
          'A weather balloon.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! An RCS of ~0.02 m² combined with 2.4 GHz FHSS telemetry packets is the standard signature of commercial off-the-shelf (COTS) multirotor control uplinks.',
      },
      {
        id: 'q3',
        question:
          'What happens to RF sensor detection capabilities if an adversary drone is flying on an autonomous, pre-programmed GPS waypoint path with transmitters turned off (RF blackout)?',
        options: [
          'RF sensors detect the drone even faster.',
          'RF sensors cannot detect the drone; operators must rely on radar, optical, and acoustic sensors.',
          'The drone automatically falls out of the sky.',
          'The drone transmits a loud siren.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! If an autonomous drone does not emit RF command or video signals, RF sensors cannot acquire it. Layered air defense relies on radar, EO/IR optics, and acoustic sensors in such conditions.',
      },
      {
        id: 'q4',
        question:
          'What is the expected transponder status for an Authorized / Known Aircraft operating within controlled airspace?',
        options: [
          'Transponder disabled to preserve battery.',
          'Active Mode-S, Mode-5, or Remote ID squawk correlated with a filed municipal or military flight clearance.',
          'Transponder broadcasting random encrypted numbers without registry.',
          'Flashing bright strobe lights only.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! Authorized aircraft broadcast cooperative transponder signals that match registered flight clearances filed with regional airspace management.',
      },
    ],
  },

  {
    id: 'mod-defensive-decision',
    code: 'ACAD-303',
    title: 'Rules of Engagement (ROE) & Defensive Decision-Making',
    subtitle: 'Proportionality, Containment Protocols & Countermeasures',
    category: 'Simulation Safety and Decision-Making',
    difficulty: 'Intermediate',
    durationMinutes: 18,
    description:
      'Understand the doctrine governing counter-drone response escalation, from passive sector logging to electronic warfare (EW) jamming and airspace containment.',
    objectives: [
      'Master the 5-tiered ROE response escalation matrix.',
      'Apply proportionality and collateral safety checks over civilian buffer zones.',
      'Differentiate soft-kill electronic countermeasures from hard-kill kinetic neutralization.',
    ],
    slides: [
      {
        title: 'The Defensive ROE Escalation Matrix',
        subtitle: 'Calm, Doctrinal Escalation Without Panic',
        paragraphs: [
          'Defensive counter-drone operations adhere to strict Rules of Engagement (ROE). Unnecessary alerts cause panic and disrupt legitimate operations, while delayed escalation endangers facilities.',
          'The five standardized defensive response options in Drishti doctrine are:',
          '1. Continue Passive Monitoring: Target is authorized or outside perimeter of concern; maintain surveillance.',
          '2. Record & Report to Sector Logbook: Routine unauthorized or unknown drone; formal documentation without broad alarm.',
          '3. Issue Training Alert to Perimeter Security: Intruder approaching sensitive boundaries; alert watchtowers to establish visual line-of-sight.',
          '4. Escalate to Designated Command Authority: Coordinated threat or swarm activity; regional airspace coordination required.',
          '5. Execute Airspace Safety & Containment Procedure: Imminent hazard or direct terminal dive; initiate automated shelter and perimeter lockdown.',
        ],
        keyTakeaways: [
          'Proportional response prevents alarm panic while maintaining operational integrity.',
          'Every decision must be documented with timestamp, telemetry, and rationale.',
        ],
      },
      {
        title: 'Proportionality & Civilian Buffer Safety',
        subtitle: 'Why Kinetic Neutralization is Strictly Restricted',
        paragraphs: [
          'Disabling a drone while in mid-air causes the airframe, lithium-ion battery, and potential payload to fall to the ground.',
          'In urban, rural populated, or industrial chemical facilities, kinetic destruction (missiles, gunfire, lasers) poses severe collateral injury hazards to personnel and infrastructure.',
          'Unless an active lethal attack is underway, counter-drone doctrine mandates non-destructive containment, directional RF jamming, or tracking to find the remote operator on the ground.',
        ],
        keyTakeaways: [
          'Kinetic neutralization carries high falling debris and battery fire hazards.',
          'Electronic soft-kill or operator location is always preferred near civilian buffers.',
        ],
      },
      {
        title: 'Soft-Kill EW Jamming vs Hard-Kill Neutralization',
        subtitle: 'Understanding Countermeasure Mechanisms',
        paragraphs: [
          'Soft-kill countermeasures target the electromagnetic spectrum. Directional RF jammers flood the drone receiver with noise on 2.4 GHz, 5.8 GHz, and GNSS satellite bands, triggering the drone fail-safe to hover in place or execute a return-to-home (RTH) sequence.',
          'GNSS spoofing feeds fake coordinate signals to safely steer the drone away from sensitive zones.',
          'Hard-kill effectors (High-Energy Lasers, kinetic micro-missiles, drone-hunting nets) physically disable the airframe and are strictly authorized only during verified lethal strikes or high-level military authorization.',
        ],
        keyTakeaways: [
          'Soft-Kill: Non-destructive RF/GNSS jamming; triggers fail-safe hover or RTH.',
          'Hard-Kill: Physical destruction (lasers, nets, kinetic); restricted to extreme lethal threats.',
        ],
      },
    ],
    passingScorePct: 75,
    quiz: [
      {
        id: 'q1',
        question:
          'An unknown hobbyist drone is hovering 300 meters outside a rural training perimeter without entering restricted airspace. What is the most appropriate initial defensive response?',
        options: [
          'Immediately fire a surface-to-air missile at the drone.',
          'Record the sighting, timestamp, and telemetry in the Sector Logbook and maintain passive observation.',
          'Evacuate the entire base and call national emergency services.',
          'Turn off all radar sensors.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! When an unknown drone is outside restricted airspace without hostile indicators, the doctrinal response is to document the contact in the sector logbook and maintain passive observation without premature alert panic.',
      },
      {
        id: 'q2',
        question:
          'Why is firing kinetic projectiles or high-energy lasers strictly prohibited over urban civilian buffer zones during routine drone incursions?',
        options: [
          'Lasers consume too much electricity.',
          'Falling debris, unexploded munitions, and burning lithium batteries present extreme collateral hazard to civilians and infrastructure.',
          'Drones cannot be damaged by lasers.',
          'The FAA does not allow radar in cities.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! Kinetic neutralization causes uncontrolled falling debris and battery fires, posing high collateral risk to civilians and critical infrastructure. Soft-kill or tracking is prioritized.',
      },
      {
        id: 'q3',
        question:
          'What happens to a standard commercial drone when its control link is disrupted by a directional RF jammer?',
        options: [
          'The drone instantly explodes.',
          'The drone initiates its programmed fail-safe behavior: typically hovering in place, landing safely, or returning to home.',
          'The drone flies to maximum altitude into outer space.',
          'The drone begins transmitting radio music.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! Commercial drone flight controllers are programmed with loss-of-signal fail-safes. When jammed, they either hover in place, slowly auto-land, or execute a return-to-home sequence.',
      },
      {
        id: 'q4',
        question:
          'When is it appropriate to escalate an incident directly to Designated Command Authority (Phase D response)?',
        options: [
          'When an authorized civilian airliner is flying in its high-altitude corridor.',
          'When multiple coordinated drones, potential swarm formations, or critical infrastructure masking are detected.',
          'Every time a bird appears on radar.',
          'Only after the base has been completely evacuated.',
        ],
        correctIndex: 1,
        explanation:
          'Correct! Multi-drone coordinated activity, swarm formations, or suspicious loitering over critical assets require regional airspace correlation and immediate escalation to higher command.',
      },
    ],
  },
];

// Featured Academy Module
export const FEATURED_MODULE = INTERACTIVE_MODULES[0];
