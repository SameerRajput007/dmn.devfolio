import { memo, useEffect, useMemo, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';
import type { Pose } from './lib/pose';
import { AVATAR_SCALE, SEAT_TOP } from './lib/layout';

const MODEL_PATH = '/models/avatar_walking_complete.glb';
const WALK_CLIP = 'WalkingWhileTexting_Retargeted';
// Match the character's leg length to the existing chair and desk.
const HEIGHT = 2.35;

function Avatar({ pose, bagTarget }: { pose: MutableRefObject<Pose>; bagTarget: MutableRefObject<THREE.Vector3> }) {
  const gltf = useGLTF(MODEL_PATH);
  const rig = useMemo(() => {
    const avatar = clone(gltf.scene);
    const bones = new Map<string, THREE.Bone>();
    const rest = new Map<THREE.Bone, { q: THREE.Quaternion; p: THREE.Vector3 }>();
    avatar.traverse(object => {
      if (object instanceof THREE.Bone) {
        bones.set(object.name, object);
        rest.set(object, { q: object.quaternion.clone(), p: object.position.clone() });
      }
      if (object instanceof THREE.Mesh) object.castShadow = object.receiveShadow = true;
    });
    const bounds = new THREE.Box3().setFromObject(avatar);
    const scale = HEIGHT / Math.max(bounds.max.y - bounds.min.y, 0.001);
    const hips = bones.get('Hips');
    const hipPosition = hips ? avatar.worldToLocal(hips.getWorldPosition(new THREE.Vector3())) : new THREE.Vector3(0, 1, 0);
    const mixer = new THREE.AnimationMixer(avatar);
    const clip = gltf.animations.find(item => item.name === WALK_CLIP);
    // Forward travel belongs to Scene; remove horizontal root travel from the clip.
    const walking = clip?.clone();
    walking?.tracks.forEach(track => {
      if (track.name === 'Hips.position') {
        for (let i = 0; i < track.values.length; i += 3) {
          track.values[i] = hipPosition.x;
          track.values[i + 2] = hipPosition.z;
        }
      }
    });
    const action = walking ? mixer.clipAction(walking) : null;
    return { avatar, bones, rest, mixer, action, scale, hipPosition, bounds,
      axis: new THREE.Vector3(1, 0, 0), rotation: new THREE.Quaternion(),
      direction: new THREE.Vector3(), parentRotation: new THREE.Quaternion(),
      target: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0) };
  }, [gltf]);

  useEffect(() => {
    rig.action?.setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(0).play();
    return () => { rig.mixer.stopAllAction(); rig.mixer.uncacheRoot(rig.avatar); };
  }, [rig]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = pose.current;
    const sit = THREE.MathUtils.clamp(p.sit, 0, 1);
    const walk = sit > 0 ? 0 : THREE.MathUtils.clamp(p.walk, 0, 1);
    // Start from a neutral pose, not the previous animation frame.
    rig.rest.forEach((value, bone) => {
      bone.quaternion.copy(value.q);
      bone.position.copy(value.p);
    });
    rig.action?.setEffectiveWeight(walk);
    if (rig.action) rig.action.paused = walk < 0.001;
    rig.mixer.update(dt);

    const rotate = (name: string, angle: number, before = false) => {
      const bone = rig.bones.get(name);
      if (!bone) return;
      rig.rotation.setFromAxisAngle(rig.axis, angle);
      if (before) bone.quaternion.premultiply(rig.rotation);
      else bone.quaternion.multiply(rig.rotation);
    };
    // Thighs come forward while shins fold down; no walking survives seating.
    for (const side of ['Left', 'Right']) {
      rotate(`${side}UpLeg`, -Math.PI / 2 * sit - p.bagBend * 0.35, true);
      rotate(`${side}Leg`, -Math.PI / 2 * sit - p.bagBend * 0.7);
    }
    rotate('Spine', p.bagBend * 0.5 + Math.sin(Math.PI * sit) * 0.18 + p.type * 0.035 + Math.sin(p.time * 1.7) * 0.006);

    // Aim the arm bones in character space, accounting for their imported axes.
    const aim = (name: string, x: number, y: number, z: number, blend: number) => {
      const bone = rig.bones.get(name);
      if (!bone?.parent || blend <= 0) return;
      rig.avatar.updateWorldMatrix(true, true);
      rig.direction.set(x, y, z).normalize().transformDirection(rig.avatar.matrixWorld);
      bone.parent.getWorldQuaternion(rig.parentRotation).invert();
      rig.direction.applyQuaternion(rig.parentRotation);
      rig.target.setFromUnitVectors(rig.up, rig.direction);
      bone.quaternion.slerp(rig.target, blend);
    };
    const neutral = 1 - walk;
    for (const [side, sign] of [['Left', 1], ['Right', -1]] as const) {
      aim(`${side}Arm`, sign * 0.12, -1, sit * 0.16, neutral);
      aim(`${side}ForeArm`, 0, -1 + sit * 0.85, sit * (0.7 + p.type * 0.3), neutral);
      rotate(`${side}Hand`, Math.sin(p.time * 11 + sign) * 0.025 * p.type * sit);
    }
    if (p.wave > 0.001) {
      aim('RightArm', -0.7, 0.65, 0.15, p.wave);
      aim('RightForeArm', Math.sin(p.time * 7) * 0.3, 1, 0.1, p.wave);
    }
    rotate('Head', p.type * 0.05);

    // Place the pelvis on the seat using the skeleton, rather than lowering a
    // standing body by an arbitrary offset (which leaves feet inside the floor).
    const standingY = -rig.bounds.min.y * rig.scale;
    const seatedY = SEAT_TOP / AVATAR_SCALE + 0.075 - rig.hipPosition.y * rig.scale;
    rig.avatar.position.set(
      -(rig.bounds.min.x + rig.bounds.max.x) * 0.5 * rig.scale,
      THREE.MathUtils.lerp(standingY, seatedY, sit) - p.bagBend * 0.22 / AVATAR_SCALE,
      -(rig.bounds.min.z + rig.bounds.max.z) * 0.5 * rig.scale,
    );
    if (p.bagReach > 0.001) {
      const upper = rig.bones.get('RightArm');
      const lower = rig.bones.get('RightForeArm');
      const hand = rig.bones.get('RightHand');
      if (upper && lower && hand) {
        rig.avatar.updateWorldMatrix(true, true);
        const shoulder = upper.getWorldPosition(new THREE.Vector3());
        const elbow = lower.getWorldPosition(new THREE.Vector3());
        const wrist = hand.getWorldPosition(new THREE.Vector3());
        const a = shoulder.distanceTo(elbow);
        const b = elbow.distanceTo(wrist);
        const direction = bagTarget.current.clone().sub(shoulder);
        const distance = THREE.MathUtils.clamp(direction.length(), Math.abs(a - b) + 0.001, a + b - 0.001);
        direction.normalize();
        const along = (a * a - b * b + distance * distance) / (2 * distance);
        const bend = new THREE.Vector3(0, 0, 1).transformDirection(rig.avatar.matrixWorld);
        bend.addScaledVector(direction, -bend.dot(direction)).normalize();
        const elbowTarget = shoulder.clone().addScaledVector(direction, along)
          .addScaledVector(bend, Math.sqrt(Math.max(0, a * a - along * along)));
        const pointBone = (bone: THREE.Bone, target: THREE.Vector3) => {
          rig.avatar.updateWorldMatrix(true, true);
          rig.direction.copy(target).sub(bone.getWorldPosition(new THREE.Vector3())).normalize();
          bone.parent!.getWorldQuaternion(rig.parentRotation).invert();
          rig.direction.applyQuaternion(rig.parentRotation);
          rig.target.setFromUnitVectors(rig.up, rig.direction);
          bone.quaternion.slerp(rig.target, p.bagReach);
        };
        pointBone(upper, elbowTarget);
        pointBone(lower, bagTarget.current);
      }
    }
  });

  return <group scale={AVATAR_SCALE}><primitive object={rig.avatar} scale={rig.scale} /></group>;
}

useGLTF.preload(MODEL_PATH);
export default memo(Avatar);
