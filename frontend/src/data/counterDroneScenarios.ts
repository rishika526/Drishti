// DRISHTI: Core Counter-Drone Scenario Engine
// Stage 2: Core Counter-Drone Threat Simulation

import { ScenarioDefinition } from '../types/simulation';

export const COUNTER_DRONE_SCENARIOS: Record<string, ScenarioDefinition> = {
  'rural-day-unknown': {
    id: 'rural-day-unknown',
    title: 'Single Unknown Drone — Rural Daylight',
    codename: 'VERDANT SHIELD',
    difficulty: 'Beginner',
    category: ['Rural', 'Day', 'Single Drone'],
    environment: 'rural_day',
    location: 'Sector 4 Outpost Proving Grounds',
    estimatedDurationSec: 90,
    briefing: {
      description: 'An unidentified aerial contact has entered the perimeter approach corridor over open farmland. Maintain visual surveillance, record the contact, inspect sensor signatures, and log your defensive assessment.',
      threatContext: 'Outer perimeter radar picked up a faint low-altitude Doppler track moving inbound from the southern valley.',
      objectives: [
        'Observe the 3D airspace and detect the inbound object.',
        'Inspect optical silhouette, Doppler speed, and RF emissions.',
        'Classify the object based on civilian versus unauthorized characteristics.',
        'Select an appropriate defensive protocol according to sector doctrine.',
      ],
      traineeInstructions: [
        'Use mouse drag to pan and rotate the observation camera.',
        'Click the "Detect / Report Object" button immediately once you acquire visual contact.',
        'Analyze the observation dossier before submitting your classification.',
      ],
    },
    targets: [
      {
        id: 'tgt-rural-01',
        label: 'CONTACT ALPHA-01',
        modelType: 'quadcopter',
        spawnDelaySec: 2,
        visualColor: '#475569',
        initialHeadingDeg: 215,
        path: [
          { pos: [-130, 32, 110], speedMs: 14 },
          { pos: [-85, 26, 75], speedMs: 13 },
          { pos: [-45, 22, 38], speedMs: 12 },
          { pos: [-10, 20, 15], speedMs: 10 },
          { pos: [15, 20, 0], speedMs: 6 },
          { pos: [25, 21, -25], speedMs: 8 },
        ],
      },
    ],
    sensorIntel: {
      visualDescription: 'White/grey 4-rotor quadcopter. Standard commercial civilian frame (approx 45cm diameter). No visible slung munitions or external wire harnesses.',
      flightBehavior: 'Steady forward transit along the valley road at moderate speed with minor altitude holds.',
      estimatedSpeedBand: '12 – 14 m/s (Standard civilian transit speed)',
      estimatedAltitudeBand: '20 – 32 meters AGL',
      rfTelemetry: '2.4 GHz spread spectrum control protocol detected. Periodic unencrypted video downlink packet bursts.',
      acousticProfile: 'Consistent high-pitch rotor frequency (~185 Hz). Matches off-the-shelf electric brushless motors.',
      thermalProfile: 'Low-to-moderate thermal signature (~310K) concentrated around battery compartment.',
      sensorConfidencePct: 92,
    },
    expectedClassification: 'unknown_drone',
    classificationRationale: 'The airframe exhibits standard civilian multirotor characteristics operating without active squawk in a regulated corridor. It is unverified, making "Unknown drone" the correct classification.',
    expectedResponse: 'record_and_report',
    responseRationale: 'Per standard rural sector ROE, an unarmed unknown civilian drone in the buffer zone requires formal logging in the sector flight logbook and passive tracking while maintaining safety perimeter.',
    classificationOptionsExpl: {
      authorized_aircraft: {
        title: 'Authorized / Known Aircraft',
        rationale: 'Incorrect. There is no pre-filed flight clearance or authorized transponder squawk for this object.',
        accurate: false,
      },
      unknown_drone: {
        title: 'Unknown Drone',
        rationale: 'Correct. Unregistered commercial-grade quadcopter operating without active transponder authorization.',
        accurate: true,
      },
      suspicious_drone: {
        title: 'Potentially Suspicious Drone',
        rationale: 'Sub-optimal. While unauthorized, the airframe does not display external payload delivery mechanisms or aggressive evasive maneuvering.',
        accurate: false,
      },
      swarm_activity: {
        title: 'Multiple-Drone / Swarm Activity',
        rationale: 'Incorrect. Only a solitary airframe is present in the monitored sector.',
        accurate: false,
      },
    },
    responseOptionsExpl: {
      continue_monitoring: {
        title: 'Continue Passive Monitoring',
        rationale: 'Sub-optimal. Observation should be recorded officially in the sector logbook, not simply ignored.',
        quality: 'suboptimal',
      },
      record_and_report: {
        title: 'Record and Report Observation to Sector Log',
        rationale: 'Optimal. Standard operating procedure for unauthorized civilian drones operating in outer perimeter buffer zones.',
        quality: 'optimal',
      },
      issue_alert: {
        title: 'Issue Training Alert to Perimeter Posts',
        rationale: 'Excessive for an unarmed commercial quadcopter maintaining steady altitude outside restricted perimeter.',
        quality: 'suboptimal',
      },
      escalate_command: {
        title: 'Escalate to Designated Command Authority',
        rationale: 'Premature. Command escalation is reserved for hostile vectors, armed airframes, or jammed frequencies.',
        quality: 'inappropriate',
      },
      safety_procedure: {
        title: 'Execute Airspace Safety & Lockdown Procedure',
        rationale: 'Inappropriate escalation. Airspace lockdown disrupts regular training operations without verified threat presence.',
        quality: 'inappropriate',
      },
    },
    improvementTips: [
      'Focus on observing target flight behavior along roads and natural terrain before assuming malicious intent.',
      'Always log unauthorized airspace intrusions in the formal sector flight record.',
    ],
  },

  'urban-day-suspicious': {
    id: 'urban-day-suspicious',
    title: 'Suspicious Drone — Urban Environment',
    codename: 'CONCRETE SHADOW',
    difficulty: 'Intermediate',
    category: ['Urban', 'Day', 'Single Drone'],
    environment: 'urban_day',
    location: 'Metropolitan Substation & Warehouse Grid',
    estimatedDurationSec: 90,
    briefing: {
      description: 'An unidentified dark-painted drone has been detected weaving at low altitude between multi-story buildings and electrical infrastructure. Building sightlines create intermittent visual obstruction.',
      threatContext: 'Security cameras at the substation reported an anomalous low-hum audio signature hugging the alleyways.',
      objectives: [
        'Track the target as it maneuvers between building corridors.',
        'Inspect potential improvised payload attachments and RF signatures.',
        'Classify the suspicious maneuvering profile.',
        'Select the appropriate security alert escalation.',
      ],
      traineeInstructions: [
        'Urban structures obstruct direct line-of-sight. Reposition your camera or anticipate street gaps.',
        'Register your detection as soon as the drone appears between building gaps.',
        'Evaluate the proximity to electrical grid transformers.',
      ],
    },
    targets: [
      {
        id: 'tgt-urban-01',
        label: 'CONTACT BRAVO-04',
        modelType: 'quadcopter',
        spawnDelaySec: 3,
        visualColor: '#1E293B',
        initialHeadingDeg: 140,
        path: [
          { pos: [90, 18, -100], speedMs: 16 },
          { pos: [55, 15, -60], speedMs: 14 },
          { pos: [28, 12, -25], speedMs: 11 },
          { pos: [-15, 14, 10], speedMs: 9 },
          { pos: [-35, 13, 40], speedMs: 7 },
          { pos: [-50, 15, 65], speedMs: 10 },
        ],
      },
    ],
    sensorIntel: {
      visualDescription: 'Matte black heavy-lift multirotor. Rectangular carbon payload box slung underneath center plate with quick-release actuator visible. Anti-collision strobes intentionally disabled.',
      flightBehavior: 'Low-altitude terrain/building masking (12-18m). Aggressive corner banking around substation fences.',
      estimatedSpeedBand: '14 – 18 m/s (Fast tactical maneuvering)',
      estimatedAltitudeBand: '12 – 18 meters AGL (Below rooftop level)',
      rfTelemetry: 'Frequency-hopping spread spectrum (FHSS) on 5.8 GHz. Directional high-gain antenna uplink pattern.',
      acousticProfile: 'Suppressed rotor harmonics. Heavy airframe displacement hum.',
      thermalProfile: 'Elevated thermal signature (~345K) indicating high motor current draw (heavy payload weight).',
      sensorConfidencePct: 88,
    },
    expectedClassification: 'suspicious_drone',
    classificationRationale: 'The airframe is intentionally darkened, lacks active beacons, carries a distinct slung payload box, and maneuvers low through urban corridors near critical infrastructure. This fits the definition of "Potentially suspicious drone".',
    expectedResponse: 'issue_alert',
    responseRationale: 'Urban security doctrine dictates immediately issuing a training alert to perimeter ground posts to establish physical cordon around the substation while tracking the target.',
    classificationOptionsExpl: {
      authorized_aircraft: {
        title: 'Authorized / Known Aircraft',
        rationale: 'Incorrect. No commercial or municipal permits exist for low-altitude night/blackout drone flights over the substation.',
        accurate: false,
      },
      unknown_drone: {
        title: 'Unknown Drone',
        rationale: 'Sub-optimal. The presence of slung payloads and deliberate light blackout elevates this beyond an ordinary unknown drone.',
        accurate: false,
      },
      suspicious_drone: {
        title: 'Potentially Suspicious Drone',
        rationale: 'Correct. Darkened airframe, slung payload box, and tactical flight path near key infrastructure warrant suspicious classification.',
        accurate: true,
      },
      swarm_activity: {
        title: 'Multiple-Drone / Swarm Activity',
        rationale: 'Incorrect. Only one airframe is maneuvering through the urban blocks.',
        accurate: false,
      },
    },
    responseOptionsExpl: {
      continue_monitoring: {
        title: 'Continue Passive Monitoring',
        rationale: 'Dangerous. Inaction while a suspicious payload drone maneuvers near critical power infrastructure creates unacceptable risk.',
        quality: 'inappropriate',
      },
      record_and_report: {
        title: 'Record and Report Observation to Sector Log',
        rationale: 'Insufficient. Mere logging does not warn ground security posts of an active perimeter penetration.',
        quality: 'suboptimal',
      },
      issue_alert: {
        title: 'Issue Training Alert to Perimeter Security Posts',
        rationale: 'Optimal. Immediate perimeter alert mobilizes ground security to establish visual line-of-sight and secure assets.',
        quality: 'optimal',
      },
      escalate_command: {
        title: 'Escalate to Designated Command Authority',
        rationale: 'Acceptable secondary response, but immediate local alert takes precedence to prevent immediate ground breach.',
        quality: 'suboptimal',
      },
      safety_procedure: {
        title: 'Execute Full Facility Evacuation Procedure',
        rationale: 'Premature. Perimeter alert and visual confirmation should precede general evacuation.',
        quality: 'inappropriate',
      },
    },
    improvementTips: [
      'Look for deliberate light blackout and slung payload attachments when operating in urban zones.',
      'Anticipate building occlusions by shifting to high-angle or rooftop camera perspectives.',
    ],
  },

  'night-low-vis': {
    id: 'night-low-vis',
    title: 'Low-Visibility Observation — Night',
    codename: 'DARK HORIZON',
    difficulty: 'Intermediate',
    category: ['Rural', 'Night', 'Single Drone'],
    environment: 'border_night',
    location: 'Border Outpost Echo Ridge',
    estimatedDurationSec: 90,
    briefing: {
      description: 'Under starlight conditions, a fixed-wing reconnaissance drone has penetrated high-altitude airspace above the border ridgeline. Visual identification relies on silhouette analysis and navigation beacon strobes.',
      threatContext: 'Passive acoustic listening posts along Ridge Kestrel triangulated a high-speed transit heading west-southwest.',
      objectives: [
        'Detect the blinking strobe against starlight and mountain backdrop.',
        'Examine fixed-wing flight dynamics and continuous cruising altitude.',
        'Classify the long-range reconnaissance airframe.',
        'Escalate observation to sector command authority.',
      ],
      traineeInstructions: [
        'Scan the upper horizon for periodic white/amber strobe reflections.',
        'Toggle Night Observation optics if needed to highlight thermal contrast.',
        'Notice the difference in cruising speed between fixed-wing and multirotor drones.',
      ],
    },
    targets: [
      {
        id: 'tgt-night-01',
        label: 'CONTACT CHARLIE-09',
        modelType: 'fixed_wing',
        spawnDelaySec: 2,
        visualColor: '#334155',
        initialHeadingDeg: 280,
        path: [
          { pos: [110, 48, -90], speedMs: 38 },
          { pos: [50, 46, -60], speedMs: 36 },
          { pos: [-10, 44, -20], speedMs: 34 },
          { pos: [-65, 42, 20], speedMs: 35 },
          { pos: [-110, 44, 70], speedMs: 36 },
        ],
      },
    ],
    sensorIntel: {
      visualDescription: 'Fixed-wing twin-boom reconnaissance pusher-prop drone (approx 2.2m wingspan). Periodic white navigation strobe on wingtips visible under starlight.',
      flightBehavior: 'High-speed linear cruising at 45m AGL with smooth elevation stability. Long-range fixed-wing glide trajectory.',
      estimatedSpeedBand: '34 – 38 m/s (High-speed fixed-wing cruise)',
      estimatedAltitudeBand: '42 – 48 meters AGL',
      rfTelemetry: 'High-frequency telemetry downlink on 1.4 GHz. Encrypted digital packets with intermittent beacon squawks.',
      acousticProfile: 'Two-stroke engine combustion hum (~140 Hz) distinct from multirotor electric whines.',
      thermalProfile: 'Pronounced engine exhaust thermal bloom (~460K) prominent on FLIR optics.',
      sensorConfidencePct: 85,
    },
    expectedClassification: 'unknown_drone',
    classificationRationale: 'The airframe is an unverified long-range fixed-wing reconnaissance UAV. Classified as "Unknown drone" awaiting transponder verification.',
    expectedResponse: 'escalate_command',
    responseRationale: 'High-altitude fixed-wing border surveillance penetrates beyond local sector jurisdiction and must be escalated to the designated Command Authority for radar correlation.',
    classificationOptionsExpl: {
      authorized_aircraft: {
        title: 'Authorized / Known Aircraft',
        rationale: 'Incorrect. No friendly flight corridor clearance exists for this fixed-wing trajectory.',
        accurate: false,
      },
      unknown_drone: {
        title: 'Unknown Drone',
        rationale: 'Correct. Unidentified fixed-wing reconnaissance aircraft operating in border corridor.',
        accurate: true,
      },
      suspicious_drone: {
        title: 'Potentially Suspicious Drone',
        rationale: 'Acceptable alternative given the border crossing, but formal doctrine marks unverified fixed-wings as Unknown until command review.',
        accurate: true,
      },
      swarm_activity: {
        title: 'Multiple-Drone / Swarm Activity',
        rationale: 'Incorrect. Only a solitary fixed-wing airframe is airborne.',
        accurate: false,
      },
    },
    responseOptionsExpl: {
      continue_monitoring: {
        title: 'Continue Passive Monitoring',
        rationale: 'Inadequate. Border ridgeline penetrations require active reporting before the airframe clears sector radar horizons.',
        quality: 'inappropriate',
      },
      record_and_report: {
        title: 'Record and Report Observation to Sector Log',
        rationale: 'Sub-optimal. High-speed border penetrations require immediate command escalation, not merely post-mission logging.',
        quality: 'suboptimal',
      },
      issue_alert: {
        title: 'Issue Training Alert to Perimeter Security Posts',
        rationale: 'Secondary. Ground perimeter posts cannot engage or intercept high-altitude fixed-wing reconnaissance.',
        quality: 'suboptimal',
      },
      escalate_command: {
        title: 'Escalate to Designated Command Authority',
        rationale: 'Optimal. Protocol mandates escalating border sector penetrations immediately to the regional Air Defense Command center.',
        quality: 'optimal',
      },
      safety_procedure: {
        title: 'Execute Airspace Safety & Lockdown Procedure',
        rationale: 'Premature without confirmation of inbound ordnance.',
        quality: 'suboptimal',
      },
    },
    improvementTips: [
      'Observe the linear, continuous glide trajectory characteristic of fixed-wing airframes.',
      'Escalate high-speed border intrusions to command authority without delay.',
    ],
  },

  'swarm-awareness': {
    id: 'swarm-awareness',
    title: 'Multiple Drone Activity — Swarm Awareness',
    codename: 'SCATTERED GALE',
    difficulty: 'Advanced',
    category: ['Rural', 'Day', 'Swarm'],
    environment: 'rural_day',
    location: 'Sector 3 Proving Grounds',
    estimatedDurationSec: 100,
    briefing: {
      description: 'Multiple micro-drones have entered the airspace simultaneously in coordinated formation. Recognize multi-object presence, evaluate inter-drone spacing, and execute safety protocol.',
      threatContext: 'Acoustic arrays picked up a wide-area dispersed buzzing pattern moving from the northern forest grove.',
      objectives: [
        'Recognize that multiple aerial objects are maneuvering in the sector.',
        'Observe formation cohesion and multi-axis movement.',
        'Classify the activity as multiple-drone / swarm activity.',
        'Execute the predefined airspace safety and containment procedure.',
      ],
      traineeInstructions: [
        'Do not focus on only one contact; scan the surrounding airspace for formation wingmen.',
        'Register your detection as soon as you identify the clustered group.',
        'Notice synchronized turns between the lead and trail units.',
      ],
    },
    targets: [
      {
        id: 'tgt-swarm-01',
        label: 'SWARM NODE #1 (LEAD)',
        modelType: 'micro_boid',
        spawnDelaySec: 2,
        visualColor: '#0F766E',
        initialHeadingDeg: 220,
        path: [
          { pos: [110, 28, -120], speedMs: 22 },
          { pos: [65, 24, -80], speedMs: 20 },
          { pos: [20, 22, -40], speedMs: 18 },
          { pos: [-25, 20, 0], speedMs: 16 },
          { pos: [-70, 22, 40], speedMs: 18 },
        ],
      },
      {
        id: 'tgt-swarm-02',
        label: 'SWARM NODE #2 (PORT WING)',
        modelType: 'micro_boid',
        spawnDelaySec: 2.5,
        visualColor: '#0F766E',
        initialHeadingDeg: 220,
        path: [
          { pos: [120, 29, -112], speedMs: 22 },
          { pos: [75, 25, -72], speedMs: 20 },
          { pos: [30, 23, -32], speedMs: 18 },
          { pos: [-15, 21, 8], speedMs: 16 },
          { pos: [-60, 23, 48], speedMs: 18 },
        ],
      },
      {
        id: 'tgt-swarm-03',
        label: 'SWARM NODE #3 (STARBOARD WING)',
        modelType: 'micro_boid',
        spawnDelaySec: 2.5,
        visualColor: '#0F766E',
        initialHeadingDeg: 220,
        path: [
          { pos: [100, 27, -128], speedMs: 22 },
          { pos: [55, 23, -88], speedMs: 20 },
          { pos: [10, 21, -48], speedMs: 18 },
          { pos: [-35, 19, -8], speedMs: 16 },
          { pos: [-80, 21, 32], speedMs: 18 },
        ],
      },
      {
        id: 'tgt-swarm-04',
        label: 'SWARM NODE #4 (TRAIL)',
        modelType: 'micro_boid',
        spawnDelaySec: 3.2,
        visualColor: '#0F766E',
        initialHeadingDeg: 220,
        path: [
          { pos: [125, 31, -135], speedMs: 22 },
          { pos: [80, 27, -95], speedMs: 20 },
          { pos: [35, 25, -55], speedMs: 18 },
          { pos: [-10, 23, -15], speedMs: 16 },
          { pos: [-55, 25, 25], speedMs: 18 },
        ],
      },
      {
        id: 'tgt-swarm-05',
        label: 'SWARM NODE #5 (TRAIL OUTLIER)',
        modelType: 'micro_boid',
        spawnDelaySec: 3.5,
        visualColor: '#0F766E',
        initialHeadingDeg: 220,
        path: [
          { pos: [95, 26, -142], speedMs: 22 },
          { pos: [50, 22, -102], speedMs: 20 },
          { pos: [5, 20, -62], speedMs: 18 },
          { pos: [-40, 18, -22], speedMs: 16 },
          { pos: [-85, 20, 18], speedMs: 18 },
        ],
      },
    ],
    sensorIntel: {
      visualDescription: 'Group of 5 micro-drones flying in a cohesive V-formation with dynamic separation (8-14m). Synchronized heading adjustments indicate decentralized boids mesh coordination.',
      flightBehavior: 'Formation maneuvering with leader-follower alignment. High agility and sudden synchronized vector shifts.',
      estimatedSpeedBand: '18 – 22 m/s (Fast swarm transit)',
      estimatedAltitudeBand: '20 – 31 meters AGL',
      rfTelemetry: 'Ad-hoc peer-to-peer 5.8 GHz mesh packets. Ultra-wideband (UWB) inter-node ranging chirps detected.',
      acousticProfile: 'Complex multi-source acoustic drone hum forming wide auditory envelope.',
      thermalProfile: 'Dispersed multi-point thermal returns across a 40m area.',
      sensorConfidencePct: 95,
    },
    expectedClassification: 'swarm_activity',
    classificationRationale: 'Multiple independent airframes maintaining synchronized formation spacing and inter-node mesh communications confirm "Multiple-drone / swarm activity".',
    expectedResponse: 'safety_procedure',
    responseRationale: 'Swarm intrusions saturate single-point responses. Protocol dictates immediately executing the predefined Airspace Safety & Containment procedure and sounding the sector alarm.',
    classificationOptionsExpl: {
      authorized_aircraft: {
        title: 'Authorized / Known Aircraft',
        rationale: 'Incorrect. Unregistered multi-drone mesh formations are strictly prohibited in the proving grounds.',
        accurate: false,
      },
      unknown_drone: {
        title: 'Unknown Drone (Single)',
        rationale: 'Incorrect. Failing to recognize the multi-drone formation overlooks the coordinated swarm nature of the threat.',
        accurate: false,
      },
      suspicious_drone: {
        title: 'Potentially Suspicious Drone',
        rationale: 'Partially true, but the specific tactical classification is Swarm Activity, which triggers specialized countermeasures.',
        accurate: false,
      },
      swarm_activity: {
        title: 'Multiple-Drone / Swarm Activity',
        rationale: 'Correct. 5 coordinated micro-airframes maneuvering with boids mesh dynamics.',
        accurate: true,
      },
    },
    responseOptionsExpl: {
      continue_monitoring: {
        title: 'Continue Passive Monitoring',
        rationale: 'Dangerous. Saturation swarms can breach perimeters rapidly; passive monitoring allows complete penetration.',
        quality: 'inappropriate',
      },
      record_and_report: {
        title: 'Record and Report Observation to Sector Log',
        rationale: 'Inadequate for active multi-drone saturation underway.',
        quality: 'inappropriate',
      },
      issue_alert: {
        title: 'Issue Training Alert to Perimeter Posts',
        rationale: 'Sub-optimal. A simple post alert is insufficient; full facility safety containment is required for swarms.',
        quality: 'suboptimal',
      },
      escalate_command: {
        title: 'Escalate to Designated Command Authority',
        rationale: 'Necessary in parallel, but immediate local safety and airspace containment procedures must be initiated first.',
        quality: 'suboptimal',
      },
      safety_procedure: {
        title: 'Execute Airspace Safety & Containment Procedure',
        rationale: 'Optimal. Immediate safety procedure triggers automated perimeter containment and prepares wide-area countermeasures.',
        quality: 'optimal',
      },
    },
    improvementTips: [
      'Expand visual scan radius when encountering multiple contacts to count formation members.',
      'Swarm activity requires systemic containment rather than single-target reporting.',
    ],
  },
};

export function getCounterDroneScenario(id?: string): ScenarioDefinition {
  if (!id) return COUNTER_DRONE_SCENARIOS['rural-day-unknown'];
  // Handle /sim/orientation as alias to rural-day-unknown
  if (id === 'orientation') return COUNTER_DRONE_SCENARIOS['rural-day-unknown'];
  return COUNTER_DRONE_SCENARIOS[id] || COUNTER_DRONE_SCENARIOS['rural-day-unknown'];
}
