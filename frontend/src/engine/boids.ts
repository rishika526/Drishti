import { ContactEntity } from '../types';

export interface BoidParameters {
  separationDistance: number;
  neighborDistance: number;
  maxSpeed: number;
  maxForce: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  goalWeight: number;
}

export const DEFAULT_SWARM_CONFIG: BoidParameters = {
  separationDistance: 35,
  neighborDistance: 120,
  maxSpeed: 38,
  maxForce: 1.8,
  separationWeight: 2.2,
  alignmentWeight: 1.2,
  cohesionWeight: 1.0,
  goalWeight: 1.5,
};

/**
 * Calculates Euclidean distance between 3D points
 */
function dist3D(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Normalizes vector with max clamp
 */
function limitVector(v: [number, number, number], maxVal: number): [number, number, number] {
  const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (mag > maxVal && mag > 0.0001) {
    return [(v[0] / mag) * maxVal, (v[1] / mag) * maxVal, (v[2] / mag) * maxVal];
  }
  return v;
}

/**
 * Updates positions and velocities of swarm elements using Boids + Roles + Jamming reactions
 */
export function updateSwarmBoids(
  swarmDrones: ContactEntity[],
  baseTarget: [number, number, number] = [0, 25, 0],
  dt: number = 0.05,
  params: BoidParameters = DEFAULT_SWARM_CONFIG
): void {
  const activeDrones = swarmDrones.filter(
    (d) => d.status === 'active' || d.status === 'jammed'
  );

  activeDrones.forEach((drone) => {
    // If jammed, break cohesion and scatter away or descend
    if (drone.status === 'jammed') {
      drone.velocity[0] += (Math.random() - 0.5) * 8 * dt;
      drone.velocity[1] -= 9.8 * 0.4 * dt; // slow descent
      drone.velocity[2] += (Math.random() - 0.5) * 8 * dt;

      drone.position[0] += drone.velocity[0] * dt;
      drone.position[1] = Math.max(5, drone.position[1] + drone.velocity[1] * dt);
      drone.position[2] += drone.velocity[2] * dt;
      return;
    }

    let sepX = 0, sepY = 0, sepZ = 0, sepCount = 0;
    let alignX = 0, alignY = 0, alignZ = 0, alignCount = 0;
    let cohX = 0, cohY = 0, cohZ = 0, cohCount = 0;

    activeDrones.forEach((other) => {
      if (other.id === drone.id) return;
      const d = dist3D(drone.position, other.position);

      // Separation
      if (d > 0 && d < params.separationDistance) {
        const diffX = drone.position[0] - other.position[0];
        const diffY = drone.position[1] - other.position[1];
        const diffZ = drone.position[2] - other.position[2];
        const weight = 1 / Math.max(1, d);
        sepX += diffX * weight;
        sepY += diffY * weight;
        sepZ += diffZ * weight;
        sepCount++;
      }

      // Alignment & Cohesion within neighbor distance
      if (d > 0 && d < params.neighborDistance) {
        alignX += other.velocity[0];
        alignY += other.velocity[1];
        alignZ += other.velocity[2];
        alignCount++;

        cohX += other.position[0];
        cohY += other.position[1];
        cohZ += other.position[2];
        cohCount++;
      }
    });

    // Compute steer forces
    let forceX = 0, forceY = 0, forceZ = 0;

    if (sepCount > 0) {
      forceX += (sepX / sepCount) * params.separationWeight;
      forceY += (sepY / sepCount) * params.separationWeight;
      forceZ += (sepZ / sepCount) * params.separationWeight;
    }

    if (alignCount > 0) {
      forceX += (alignX / alignCount - drone.velocity[0]) * params.alignmentWeight;
      forceY += (alignY / alignCount - drone.velocity[1]) * params.alignmentWeight;
      forceZ += (alignZ / alignCount - drone.velocity[2]) * params.alignmentWeight;
    }

    if (cohCount > 0) {
      const avgPosX = cohX / cohCount;
      const avgPosY = cohY / cohCount;
      const avgPosZ = cohZ / cohCount;
      forceX += (avgPosX - drone.position[0]) * params.cohesionWeight * 0.05;
      forceY += (avgPosY - drone.position[1]) * params.cohesionWeight * 0.05;
      forceZ += (avgPosZ - drone.position[2]) * params.cohesionWeight * 0.05;
    }

    // Role-based behavior tree
    let targetX = baseTarget[0];
    let targetY = baseTarget[1];
    let targetZ = baseTarget[2];

    if (drone.swarmRole === 'scout') {
      // Scouts loiter at a perimeter radius around base (e.g. 700m)
      const angle = (Date.now() / 4000 + drone.heading) % (Math.PI * 2);
      targetX = Math.cos(angle) * 700;
      targetY = 140;
      targetZ = Math.sin(angle) * 700;
    } else if (drone.swarmRole === 'decoy') {
      // Decoys weave erratic lateral paths to draw fire
      targetX = baseTarget[0] + Math.sin(Date.now() / 800) * 200;
      targetY = 100 + Math.cos(Date.now() / 1000) * 30;
      targetZ = baseTarget[2] + Math.cos(Date.now() / 800) * 200;
    } else {
      // Striker: direct descent onto target
      targetY = Math.max(15, drone.position[1] - dt * 5);
    }

    // Goal steer
    const toGoalX = targetX - drone.position[0];
    const toGoalY = targetY - drone.position[1];
    const toGoalZ = targetZ - drone.position[2];
    const goalDist = Math.sqrt(toGoalX * toGoalX + toGoalY * toGoalY + toGoalZ * toGoalZ);

    if (goalDist > 1) {
      forceX += (toGoalX / goalDist) * params.goalWeight * 10;
      forceY += (toGoalY / goalDist) * params.goalWeight * 6;
      forceZ += (toGoalZ / goalDist) * params.goalWeight * 10;
    }

    // Apply limited force to velocity
    const limitedForce = limitVector([forceX, forceY, forceZ], params.maxForce);
    drone.velocity[0] += limitedForce[0] * dt;
    drone.velocity[1] += limitedForce[1] * dt;
    drone.velocity[2] += limitedForce[2] * dt;

    // Clamp to max speed
    drone.velocity = limitVector(drone.velocity, params.maxSpeed);

    // Update position
    drone.position[0] += drone.velocity[0] * dt;
    drone.position[1] = Math.max(10, drone.position[1] + drone.velocity[1] * dt);
    drone.position[2] += drone.velocity[2] * dt;

    // Recalculate distance to base & heading
    drone.distanceToBase = Math.sqrt(
      drone.position[0] * drone.position[0] +
      drone.position[2] * drone.position[2]
    );

    const rad = Math.atan2(drone.position[0], drone.position[2]);
    drone.bearing = Math.round(((rad * 180) / Math.PI + 360) % 360);
    drone.heading = Math.round(
      ((Math.atan2(drone.velocity[0], drone.velocity[2]) * 180) / Math.PI + 360) % 360
    );
  });
}
