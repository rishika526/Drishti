// DRISHTI: Operator Training Curriculum Data
// Stage 3: Operator Training Experiences

import {
  OperatorExperienceDefinition,
  FPVCheckpointGate,
  IndoorTargetObject,
  AerialLandmarkTarget,
} from '../types/operatorTraining';

export const OPERATOR_EXPERIENCES: Record<string, OperatorExperienceDefinition> = {
  'fpv-flight': {
    id: 'fpv-flight',
    code: 'EXP-A',
    title: 'FPV Flight Familiarization',
    subtitle: 'First-Person Piloting & Checkpoint Course Navigation',
    difficulty: 'Beginner',
    duration: '8-12 mins',
    skills: [
      'First-Person Spatial Awareness',
      'Throttle & Pitch Balance',
      'Yaw Alignment & Momentum Control',
      'Collision Recovery & Boundary Tracking',
    ],
    description:
      'Master simulated first-person drone handling through an open tactical training course. Learn 6-DOF drone maneuvering, pass through illuminated aerial checkpoint gates, maintain altitude stability, and build basic piloting reflexes.',
    briefing: {
      operationalRole: 'Simulated Drone Pilot Trainee',
      context:
        'Tactical drone operators must achieve muscle-memory familiarity with first-person perspective (FPV) flight dynamics before operating specialized observation or inspection payloads.',
      primaryDirective:
        'Navigate the simulated quadcopter sequentially through all 5 illuminated aerial checkpoint gates across Sector 4 Proving Grounds without ground or structure collision.',
      objectives: [
        'Engage drone propulsion and attain stable hover at 3 to 10 meters altitude.',
        'Fly through Checkpoint Gates 1 through 5 in sequential order.',
        'Maintain stable attitude during bank turns and directional course changes.',
        'Complete the familiarization course safely and review flight telemetry.',
      ],
      instructions: [
        'Use [W] and [S] to pitch forward and backward; [A] and [D] to strafe left and right.',
        'Hold [SPACE] to ascend; hold [LEFT SHIFT] to descend.',
        'Use [Q] and [E] (or Left / Right Arrow keys) to yaw/rotate the airframe.',
        'Watch your altitude and artificial horizon HUD indicators.',
        'Align your crosshair with the active illuminated gate ring and fly through its center.',
      ],
      controls: [
        { key: 'W / S', label: 'Pitch', action: 'Move Forward / Reverse' },
        { key: 'A / D', label: 'Roll / Strafe', action: 'Translate Left / Right' },
        { key: 'Space', label: 'Throttle Up', action: 'Ascend' },
        { key: 'Shift', label: 'Throttle Down', action: 'Descend' },
        { key: 'Q / E', label: 'Yaw', action: 'Rotate Left / Right' },
        { key: 'P', label: 'Pause', action: 'Pause / Resume Simulation' },
      ],
    },
  },

  'indoor-inspection': {
    id: 'indoor-inspection',
    code: 'EXP-B',
    title: 'Indoor Drone Inspection',
    subtitle: 'Confined Space Reconnaissance & Hazard Verification',
    difficulty: 'Intermediate',
    duration: '10-15 mins',
    skills: [
      'Confined Space Navigation',
      'Low-Visibility Optical Inspection',
      'Proximity Sensor Awareness',
      'Defect & Hazard Documentation',
    ],
    description:
      'Operate a specialized camera-equipped micro-drone inside a multi-room training structure under reduced visibility. Navigate corridors, clear doorways, inspect critical facility infrastructure, and report findings on key targets.',
    briefing: {
      operationalRole: 'Confined Space Remote Inspection Specialist',
      context:
        'Remote inspection of enclosed industrial buildings, suspected compromised outposts, or utility bunkers requires careful indoor navigation, light management, and methodical target observation without risking personnel.',
      primaryDirective:
        'Pilot the camera drone through the 3 connected facility zones (Utility Bay, Server Operations, Logistics Hold), locate and inspect the 3 designated target objects, and log condition reports.',
      objectives: [
        'Navigate the central corridor and transition smoothly between connected rooms.',
        'Toggle the drone inspection spotlight [F] to illuminate low-light interior spaces.',
        'Position the camera within 5 meters of each target object to unlock the inspection scanner.',
        'Inspect and log the status of: 1) Electrical Main Breaker, 2) Server Bay Dossier, and 3) Logistics Crate Seal.',
        'Submit the consolidated inspection report with correct condition ratings.',
      ],
      instructions: [
        'Use [W/A/S/D] for horizontal movement and [Space/Shift] for vertical altitude control.',
        'Use [Q/E] or Arrow Keys to rotate the drone camera view toward rooms and target placards.',
        'Press [F] to toggle the forward high-intensity inspection flashlight.',
        'Approach each designated inspection target until the HUD displays "TARGET IN RANGE".',
        'Press [E] or click "INSPECT & LOG FINDING" to record your visual assessment.',
      ],
      controls: [
        { key: 'W / S', label: 'Forward / Back', action: 'Corridor Translation' },
        { key: 'A / D', label: 'Strafe', action: 'Lateral Movement' },
        { key: 'Space / Shift', label: 'Elevation', action: 'Ascend / Descend' },
        { key: 'Q / E', label: 'Camera Yaw', action: 'Pan Left / Right' },
        { key: 'F', label: 'Searchlight', action: 'Toggle Inspection Spotlight' },
        { key: 'E / Click', label: 'Inspect', action: 'Log Observation Dossier' },
      ],
    },
  },

  'aerial-observation': {
    id: 'aerial-observation',
    code: 'EXP-C',
    title: 'Aerial Observation Training',
    subtitle: 'High-Altitude Landscape Reconnaissance & Landmark Identification',
    difficulty: 'Intermediate',
    duration: '10-15 mins',
    skills: [
      'Gimbal Camera Manipulation',
      'Grid Coordinate Localization',
      'Visual Silhouette Identification',
      'Reconnaissance Intelligence Reporting',
    ],
    description:
      'Conduct wide-area aerial observation from a high-altitude surveillance drone over a tactical landscape. Use multi-mode camera optics (oblique recon orbit vs. nadir top-down), optical zoom, and coordinate grids to locate and verify strategic landmarks.',
    briefing: {
      operationalRole: 'Aerial Surveillance & Reconnaissance Operator',
      context:
        'Aerial reconnaissance demands methodical scanning across wide operational sectors, rapid recognition of infrastructure and vehicle silhouettes, and accurate intelligence dissemination to command elements.',
      primaryDirective:
        'Systematically survey Sectors Alpha, Bravo, and Charlie. Locate the 3 assigned landmarks (Northern Radar Mast, Camouflaged Supply Convoy, and Perimeter Fuel Storage Tanks) and record verified intelligence reports.',
      objectives: [
        'Switch between 45° Tactical Recon Angle and 90° Overhead Nadir Satellite view.',
        'Utilize optical zoom steps (1x, 2x, 4x) to examine ground structures.',
        'Pan across the terrain grid and correlate visual landmarks with sector coordinate markers.',
        'Inspect and verify each of the 3 specified targets.',
        'Submit a comprehensive aerial reconnaissance debriefing for command review.',
      ],
      instructions: [
        'Use mouse drag or [W/A/S/D] to pan the aerial surveillance sensor over the terrain.',
        'Use the Zoom buttons [1x / 2x / 4x] or mouse wheel to adjust optical magnification.',
        'Toggle between "Tactical Oblique" and "Overhead Nadir" perspective in the HUD.',
        'Click on ground landmarks or select them from the target list to inspect optical feeds.',
        'Confirm the correct identity and status in the observation debriefing panel.',
      ],
      controls: [
        { key: 'Mouse Drag / W-A-S-D', label: 'Sensor Pan', action: 'Scan Airspace / Ground Grid' },
        { key: 'Scroll / 1-2-4x', label: 'Optical Zoom', action: '1x Wide to 4x Telephoto' },
        { key: 'V', label: 'View Mode', action: 'Toggle Oblique / Overhead Nadir' },
        { key: 'Click Landmark', label: 'Acquire Target', action: 'Lock & Inspect Landmark' },
      ],
    },
  },
};

// Checkpoint gates for Experience A: FPV Flight
export const FPV_CHECKPOINT_GATES: FPVCheckpointGate[] = [
  {
    id: 1,
    label: 'GATE 01: Low Altitude Departure',
    position: [0, 4, -18],
    rotationY: 0,
    cleared: false,
  },
  {
    id: 2,
    label: 'GATE 02: Pylon Slalom Entry',
    position: [14, 6, -38],
    rotationY: Math.PI / 6,
    cleared: false,
  },
  {
    id: 3,
    label: 'GATE 03: Perimeter Tower Flyby',
    position: [6, 9, -62],
    rotationY: -Math.PI / 8,
    cleared: false,
  },
  {
    id: 4,
    label: 'GATE 04: Hangar Ridge Descent',
    position: [-16, 6, -48],
    rotationY: -Math.PI / 4,
    cleared: false,
  },
  {
    id: 5,
    label: 'GATE 05: Landing Corridor Final',
    position: [-4, 4, -20],
    rotationY: Math.PI / 4,
    cleared: false,
  },
];

// Target objects for Experience B: Indoor Inspection
export const INDOOR_INSPECTION_TARGETS: IndoorTargetObject[] = [
  {
    id: 'elec_breaker',
    name: 'Main Utility Breaker & Junction Box',
    room: 'Utility Room (West Wing)',
    position: [-10, 2.0, -8],
    description:
      'High-voltage distribution panel providing power to facility perimeter sensors. Thermal imaging shows severe scorch marks around terminal bus bars.',
    hazardCondition: 'Hazardous',
    inspected: false,
  },
  {
    id: 'server_dossier',
    name: 'Unsecured Operations Briefcase & Terminal',
    room: 'Server Operations Room (North Wing)',
    position: [0, 1.2, -14],
    description:
      'Hardened courier briefcase left open beside active server cabinet #3. Cable splices indicate unauthorized data tap in progress.',
    hazardCondition: 'Compromised',
    inspected: false,
  },
  {
    id: 'logistics_crate',
    name: 'Emergency Backup Battery Pallet',
    room: 'Logistics Storage Bay (East Wing)',
    position: [10, 1.4, -8],
    description:
      'Standard military-spec lithium-ion battery rack with intact tamper-evident security seals and normal nominal status LED indicators.',
    hazardCondition: 'Normal',
    inspected: false,
  },
];

// Landmarks for Experience C: Aerial Observation
export const AERIAL_OBSERVATION_LANDMARKS: AerialLandmarkTarget[] = [
  {
    id: 'radar_mast',
    name: 'Sector Alpha Communications & Radar Array',
    gridSector: 'GRID-A2 [NORTH QUADRANT]',
    position: [0, 4, -40],
    description:
      '30-meter parabolic radar mast with dual frequency microwave links and generator shelter.',
    expectedObservation: 'Radar dish active and rotating; perimeter security fencing intact.',
    observationOptions: [
      'Radar dish active and rotating; perimeter security fencing intact.',
      'Antenna collapsed; evidence of recent structural fire or blast.',
      'Facility abandoned; heavy vegetation overgrowth on access road.',
    ],
    observed: false,
  },
  {
    id: 'supply_convoy',
    name: 'Sector Bravo Camouflaged Transport Vehicle',
    gridSector: 'GRID-B4 [EAST PASS]',
    position: [28, 1.5, -15],
    description:
      '6x6 heavy tactical logistics truck parked under modular camouflage netting along the eastern service route.',
    expectedObservation: 'Parked transport with low thermal signature; cargo secured under shade netting.',
    observationOptions: [
      'Parked transport with low thermal signature; cargo secured under shade netting.',
      'Moving at high speed westbound toward main gate.',
      'Decoy mockup made of wood frames and canvas.',
    ],
    observed: false,
  },
  {
    id: 'fuel_depot',
    name: 'Sector Charlie Hardened Fuel Storage Facility',
    gridSector: 'GRID-C1 [SOUTHWEST SECTOR]',
    position: [-30, 2.5, -25],
    description:
      'Dual cylindrical bulk fuel storage tanks surrounded by reinforced earthen containment berms.',
    expectedObservation: 'Tanks secure with zero containment breach or thermal pooling detected.',
    observationOptions: [
      'Tanks secure with zero containment breach or thermal pooling detected.',
      'Active liquid spill pool forming adjacent to northern pump manifold.',
      'Unattended civilian vehicle parked inside the secondary containment barrier.',
    ],
    observed: false,
  },
];
