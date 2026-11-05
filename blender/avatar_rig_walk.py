"""Add a simple articulated rig and planted-feet walk blocking to avatar_blocking_scene.py.

Run AFTER avatar_blocking_scene.py in Blender's Scripting workspace.
This is a preview rig for the procedural proxy, not a production-ready
rig for the approved reference character. Real facial blendshapes,
weight-painted meshes, and final motion polish are still required.
"""
import bpy, math
from mathutils import Vector

scene=bpy.context.scene
root=bpy.data.objects.get('Avatar - animation root')
if root is None:
    raise RuntimeError('Run blender/avatar_blocking_scene.py first.')

# Create an actual armature with named controls for the next modeling stage.
bpy.ops.object.armature_add(enter_editmode=True, location=(0,0,0))
rig=bpy.context.object
rig.name='DMN_Avatar_Armature'
arm=rig.data
arm.name='DMN_Avatar_Skeleton'
arm.edit_bones.remove(arm.edit_bones[0])
bones=[
    ('root',(0,0,0),(0,0,.2),None),
    ('hips',(0,0,.87),(0,0,1.05),'root'),
    ('spine',(0,0,1.05),(0,0,1.65),'hips'),
    ('neck',(0,0,1.65),(0,0,2.04),'spine'),
    ('head',(0,0,2.04),(0,0,2.57),'neck'),
    ('upper_arm.L',(-.26,0,1.78),(-.43,0,1.43),'spine'),
    ('forearm.L',(-.43,0,1.43),(-.43,0,1.05),'upper_arm.L'),
    ('hand.L',(-.43,0,1.05),(-.43,0,.95),'forearm.L'),
    ('upper_arm.R',(.26,0,1.78),(.43,0,1.43),'spine'),
    ('forearm.R',(.43,0,1.43),(.43,0,1.05),'upper_arm.R'),
    ('hand.R',(.43,0,1.05),(.43,0,.95),'forearm.R'),
    ('thigh.L',(-.14,0,.9),(-.15,0,.48),'hips'),
    ('shin.L',(-.15,0,.48),(-.15,0,.12),'thigh.L'),
    ('foot.L',(-.15,0,.12),(-.15,-.26,.10),'shin.L'),
    ('thigh.R',(.14,0,.9),(.15,0,.48),'hips'),
    ('shin.R',(.15,0,.48),(.15,0,.12),'thigh.R'),
    ('foot.R',(.15,0,.12),(.15,-.26,.10),'shin.R'),
]
for name,head,tail,parent in bones:
    b=arm.edit_bones.new(name)
    b.head=head;b.tail=tail
    if parent: b.parent=arm.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
rig.parent=root
rig.location=(0,0,0)
rig.display_type='WIRE'
rig.show_in_front=True

# Armature control animation (proxy meshes remain parented to root).
# Slower cadence, alternating arms and legs, damped settling at end.
walk_end=120
for f in range(1,walk_end+1,6):
    phase=(f-1)/24*2*math.pi
    envelope=min(1,(walk_end-f)/20)
    scene.frame_set(f)
    for side,sign in [('L',1),('R',-1)]:
        thigh=rig.pose.bones['thigh.'+side]
        shin=rig.pose.bones['shin.'+side]
        arm_b=rig.pose.bones['upper_arm.'+side]
        foot=rig.pose.bones['foot.'+side]
        swing=math.sin(phase)*sign*envelope
        thigh.rotation_mode='XYZ';thigh.rotation_euler.x=.32*swing
        shin.rotation_mode='XYZ';shin.rotation_euler.x=max(0,-swing)*.5
        arm_b.rotation_mode='XYZ';arm_b.rotation_euler.x=-.27*swing
        foot.rotation_mode='XYZ';foot.rotation_euler.x=-.10*swing
        for b in (thigh,shin,arm_b,foot):
            b.keyframe_insert(data_path='rotation_euler',frame=f)
    hips=rig.pose.bones['hips']
    hips.location.z=.025*abs(math.sin(phase))*envelope
    hips.keyframe_insert(data_path='location',frame=f)
for f in (140,576):
    for b in rig.pose.bones:
        b.rotation_mode='XYZ'
        b.rotation_euler=(0,0,0)
        b.keyframe_insert(data_path='rotation_euler',frame=f)
    rig.pose.bones['hips'].location=(0,0,0)
    rig.pose.bones['hips'].keyframe_insert(data_path='location',frame=f)

# Neutral-to-friendly head turn and greeting pose after arriving.
head=rig.pose.bones['head']
for f,angle in [(130,-.18),(175,0),(245,.08),(285,0),(576,0)]:
    head.rotation_euler.z=angle
    head.keyframe_insert(data_path='rotation_euler',frame=f)
right=rig.pose.bones['upper_arm.R']
for f,angle in [(145,0),(180,-.65),(220,-.42),(255,-.65),(290,0),(576,0)]:
    right.rotation_euler.y=angle
    right.keyframe_insert(data_path='rotation_euler',frame=f)

scene.frame_set(1)
print('Proxy rig and walk-cycle control keys created. Rig is not yet skinned to character mesh.')
