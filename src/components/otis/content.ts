export const faces = {
  base: {src: '/otis/faces/base.webp', mood: 'chill'},
  l_left: {src: '/otis/faces/l_left.webp', mood: 'watching you'},
  l_right: {src: '/otis/faces/l_right.webp', mood: 'watching you'},
  x_cross: {src: '/otis/faces/x_cross.webp', mood: 'suspicious'},
  x_tongue: {src: '/otis/faces/x_tongue.webp', mood: 'goofy'},
  x_shock: {src: '/otis/faces/x_shock.webp', mood: 'startled'},
  x_laugh: {src: '/otis/faces/x_laugh.webp', mood: 'cackling'},
  x_skeptic: {src: '/otis/faces/x_skeptic.webp', mood: 'unconvinced'},
  x_whistle: {src: '/otis/faces/x_whistle.webp', mood: 'innocent'},
  x_smug: {src: '/otis/faces/x_smug.webp', mood: 'smug'},
  x_dizzy: {src: '/otis/faces/x_dizzy.webp', mood: 'seeing stars'},
  g_grimace: {src: '/otis/faces/g_grimace.webp', mood: 'being squeezed'},
  g_ouch: {src: '/otis/faces/g_ouch.webp', mood: 'OW'},
  g_squish: {src: '/otis/faces/g_squish.webp', mood: 'pinched'},
} as const;

export type FaceKey = keyof typeof faces;

/** Faces dealt at random when a stretch is let go. */
export const releaseFaces: FaceKey[] = ['x_tongue', 'x_laugh', 'x_skeptic', 'x_whistle', 'x_smug', 'x_cross'];

/**
 * Landmarks in image UV (0–1, v from the top) measured on the prepared faces
 * (2:3 busts padded to square, so the sweater spans u 0.167–0.833 and meets
 * the frame edge from v 0.845 down). The disc is drawn in the same space and
 * sized so its arc clips the shoulders before they reach those edges.
 */
export const rig = {
  disc: {x: 0.5, y: 0.58, r: 0.41},
  nose: {x: 0.505, y: 0.505, r: 0.04},
  cheeks: [
    {x: 0.385, y: 0.53},
    {x: 0.625, y: 0.53},
  ],
  face: {x: 0.5, y: 0.51, rx: 0.175, ry: 0.23},
  hairLine: 0.26,
  /** |u − 0.5| beyond which a grab above the jaw is the ears / side hair. */
  sides: 0.19,
};
