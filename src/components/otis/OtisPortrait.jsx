import { useRef, useState } from 'react'
import { FaceCanvas } from './face/FaceCanvas'
import { faces } from './content'
import './otis.css'

export default function OtisPortrait() {
  const stageRef = useRef(null)
  const [mood, setMood] = useState({ face: 'base', patience: 100, pulls: 0 })

  return (
    <div className="about-otis">
      <div className="otis-heading"><span>MEET OTIS</span><span>PLAY A LITTLE ↗</span></div>
      <div className="otis-playground">
        <div ref={stageRef} className="otis-stage" />
        <FaceCanvas stageRef={stageRef} discColor="#2f4bf0" onMood={setMood} />
      </div>
      <div className="otis-caption">
        <span className="otis-mood">{faces[mood.face]?.mood || 'chill'}</span>
        <p>Grab, stretch, and let go.<br /><span>Or focus the face and press Enter.</span></p>
      </div>
    </div>
  )
}
