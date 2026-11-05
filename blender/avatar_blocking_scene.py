"""Blender 4.x: procedural 3D blocking scene for the DMN avatar Hero.
Run in Blender's Scripting workspace. Creates camera, lighting, desk,
a simple articulated stylized character, and a 24-second walk-in preview.
This is BLOCKING ONLY: the approved 2D avatar must still be modeled,
rigged and facially animated before the final production render.
"""
import bpy, math
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE_NEXT'
scene.render.resolution_x=1920
scene.render.resolution_y=1080
scene.render.resolution_percentage=60
scene.render.fps=24
scene.frame_start=1
scene.frame_end=576
scene.world.color=(0.055,0.045,0.06)

def mat(name, color, metallic=0, roughness=.65, emission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1)
    m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metallic
    bs.inputs['Roughness'].default_value=roughness
    if emission:
        bs.inputs['Emission Color'].default_value=(*color,1)
        bs.inputs['Emission Strength'].default_value=emission
    return m
skin=mat('warm skin',(.49,.26,.17)); hair=mat('dark wavy hair',(.035,.025,.027))
shirt=mat('black tee',(.027,.03,.035)); pants=mat('dark trousers',(.07,.075,.085))
shoe=mat('clean sneakers',(.8,.77,.71)); wood=mat('desk walnut',(.28,.14,.075))
metal=mat('matte dark metal',(.095,.105,.12),.4)
screen=mat('code screen',(.015,.14,.12),emission=1.8)
orange=mat('warm orange accent',(.95,.32,.09),emission=1.5)

def cube(name, loc, scale, material, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    ob=bpy.context.object; ob.name=name; ob.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.data.materials.append(material)
    if parent: ob.parent=parent
    return ob
def sphere(name,loc,scale,material,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,location=loc)
    ob=bpy.context.object;ob.name=name;ob.scale=scale;ob.data.materials.append(material)
    if parent: ob.parent=parent
    return ob

cube('floor',(0,0,-.08),(12,7,.16),mat('studio floor',(.065,.063,.075)))
cube('desk surface',(2.05,.65,1.02),(2.7,.95,.13),wood)
for x in (1,3.1):
    for y in (.32,1.0):
        cube('desk leg',(x,y,.5),(.09,.09,1),metal)
cube('coding monitor',(2.05,.95,1.85),(1.28,.09,.77),metal)
cube('illuminated code screen',(2.05,.884,1.85),(1.15,.015,.63),screen)
cube('monitor neck',(2.05,.94,1.36),(.1,.1,.33),metal)
cube('laptop',(1.25,.20,1.22),(.64,.05,.44),metal)
cube('keyboard',(2.04,.12,1.1),(.92,.3,.035),metal)
sphere('coffee mug',(3.02,.22,1.17),(.13,.13,.15),shoe)
cube('desk lamp base',(3.24,.87,1.13),(.32,.32,.07),metal)
cube('desk lamp arm',(3.24,.87,1.59),(.055,.055,.88),metal)
sphere('warm lamp',(3.22,.85,2.06),(.25,.25,.13),orange)
cube('chair seat',(3.2,-.64,.62),(.75,.65,.12),metal)
cube('chair back',(3.2,-.32,1.16),(.72,.1,1),metal)

# Avatar root with separately animated limbs; clean-shaven and slim.
root=bpy.data.objects.new('Avatar - animation root',None)
bpy.context.collection.objects.link(root)
root.location=(-4,-.45,0)
sphere('torso',(0,0,1.45),(.34,.22,.53),shirt,root)
sphere('neck',(0,0,1.99),(.105,.11,.14),skin,root)
sphere('head',(0,-.02,2.28),(.31,.27,.37),skin,root)
for i,(x,y,z) in enumerate([(-.22,-.01,2.59),(-.1,.06,2.67),(.07,.04,2.69),(.21,.02,2.58)]):
    sphere('hair curl %s'%i,(x,y,z),(.15,.18,.13),hair,root)
for x in (-.12,.12):
    sphere('eye',(x,-.263,2.32),(.038,.024,.043),hair,root)
sphere('subtle smile',(0,-.277,2.16),(.10,.012,.017),hair,root)
limbs=[]
for side,x in [('L',-.38),('R',.38)]:
    arm=sphere('arm '+side,(x,0,1.43),(.105,.11,.42),shirt,root)
    hand=sphere('hand '+side,(x,0,1.03),(.09,.095,.12),skin,root)
    leg=sphere('leg '+side,(x*.42,0,.60),(.145,.15,.57),pants,root)
    foot=sphere('sneaker '+side,(x*.42,-.12,.12),(.16,.28,.12),shoe,root)
    limbs.append((arm,leg,side))
# Walk-in from left, decelerate and face camera.
for frame,x in [(1,-4),(35,-3.2),(65,-2.1),(95,-1.3),(120,-1.1),(576,-1.1)]:
    root.location.x=x;root.keyframe_insert(data_path='location',frame=frame,index=0)
for arm,leg,side in limbs:
    sign=1 if side=='L' else -1
    for frame in range(1,121,12):
        angle=math.sin((frame-1)/12*math.pi)*sign*.18
        arm.rotation_euler.y=angle; leg.rotation_euler.y=-angle
        arm.keyframe_insert(data_path='rotation_euler',frame=frame,index=1)
        leg.keyframe_insert(data_path='rotation_euler',frame=frame,index=1)
    arm.rotation_euler.y=0;leg.rotation_euler.y=0
    arm.keyframe_insert(data_path='rotation_euler',frame=145,index=1)
    leg.keyframe_insert(data_path='rotation_euler',frame=145,index=1)
# Right-hand greeting after the walk.
right_arm=next(a for a,l,s in limbs if s=='R')
for frame,angle in [(150,0),(180,-.7),(215,-.35),(245,-.7),(275,0)]:
    right_arm.rotation_euler.y=angle
    right_arm.keyframe_insert(data_path='rotation_euler',frame=frame,index=1)

def point(obj,target):
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(0,-8.8,3.15))
camera=bpy.context.object;point(camera,(0,.15,1.35));scene.camera=camera
def area(name,loc,color,power,size):
    bpy.ops.object.light_add(type='AREA',location=loc)
    ob=bpy.context.object;ob.name=name;ob.data.energy=power;ob.data.color=color;ob.data.shape='DISK';ob.data.size=size
    point(ob,(0,0,1))
area('warm key',(-3,-4,5),(1,.57,.3),800,5)
area('cool fill',(3,-3,4),(.4,.5,1),550,4)
area('orange rim',(2,3,4),(1,.31,.09),850,3)
scene.frame_set(1)
print('DMN blocking scene created. Save as .blend; approved avatar is NOT modeled yet.')
