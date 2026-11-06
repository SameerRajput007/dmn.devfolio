import * as THREE from "three";

// World units are metres. +x is the right of the screen, +z is toward the camera.

export const AVATAR_SCALE = 0.78;
export const STAND_Y = 1.005; // pelvis height when standing (avatar units)
export const SIT_Y = 0.572; // pelvis height when seated (avatar units)
export const SEAT_TOP = 0.47; // chair seat height (world)
export const DESK_TOP = 0.835; // desk surface height (world)

export const DESK_POS = new THREE.Vector3(2.9, 0, -1.5);
export const DESK_YAW = -0.72;

// The chair sits on the desk's local +z side, about a metre away.
const toChair = new THREE.Vector3(Math.sin(DESK_YAW), 0, Math.cos(DESK_YAW));
export const CHAIR_POS = DESK_POS.clone().addScaledVector(toChair, 0.95);

/** Facing the monitor. */
export const WORK_YAW = DESK_YAW + Math.PI;
/** Facing the visitor (slightly turned, like your reference). */
export const CAM_YAW = 0.25;
/** The chair starts turned toward the door so he can walk up and sit. */
export const CHAIR_INIT_YAW = -Math.PI / 2;

/** Where he stops before turning round and sitting. */
export const STAND_POINT = CHAIR_POS.clone().add(new THREE.Vector3(-0.58, 0, 0));
export const DOOR_X = -3.4;
export const DOOR_HINGE_X = -3.9;
export const WALL_Z = -2.5;

export const BAG_REST = new THREE.Vector3(CHAIR_POS.x - 0.85, 0.23, CHAIR_POS.z + 0.35);
