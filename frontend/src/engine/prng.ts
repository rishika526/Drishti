/**
 * Mulberry32 32-bit stateful PRNG generator.
 * Produces deterministic pseudorandom numbers between 0 (inclusive) and 1 (exclusive).
 */
export class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** Returns next float in range [0, 1) */
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns random float in range [min, max) */
  public nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** Returns random integer in range [min, max] inclusive */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  /** Selects random item from array */
  public choice<T>(array: T[]): T {
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }

  /** Returns true with given probability (0 to 1) */
  public chance(prob: number): boolean {
    return this.next() < prob;
  }
}

/**
 * Creates a seeded PRNG instance
 */
export function createPRNG(seed: number): Mulberry32 {
  return new Mulberry32(seed);
}
