/**
 * The "contract" between the animation controller (Scene) and the character (Avatar).
 * The controller writes these numbers every frame; the Avatar turns them into joint angles.
 *
 * When you replace the placeholder with your real rigged GLB, keep this contract:
 * your new Avatar component just reads the same numbers and drives AnimationActions
 * (idle / walk / sit / type / wave / talk) instead of procedural joints.
 */
export interface Pose {
  time: number; // seconds, always running
  walkPhase: number; // radians, advances while walking
  walk: number; // 0..1 how much walking
  sit: number; // 0 standing .. 1 seated
  type: number; // 0..1 typing on the keyboard
  wave: number; // 0..1 waving envelope
  talk: number; // 0..1 mouth moving
  bagReach: number; // right hand grips the backpack handle
  bagBend: number; // lean and crouch while lowering the bag
  attention: number; // 0 working .. 1 facing the visitor
}

export const makePose = (): Pose => ({
  time: 0,
  walkPhase: 0,
  walk: 0,
  sit: 0,
  type: 0,
  wave: 0,
  talk: 0,
  bagReach: 0,
  bagBend: 0,
  attention: 0,
});
