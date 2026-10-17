import { useId } from 'react'
import './card.css'

function Card({ name, age, role, bio, focus, interests, image }) {
  const headingId = useId()
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')

  return (
    <article className="profile-card" aria-labelledby={headingId}>
      <div className="profile-card__top">
        <div className="profile-card__avatar" aria-hidden="true">
          <span>{initials}</span>
          {image && (
            <img
              className="profile-card__avatar-image"
              src={image}
              alt=""
              onError={(event) => {
                event.currentTarget.hidden = true
              }}
            />
          )}
        </div>
        <span className="profile-card__eyebrow">PERSONAL PROFILE</span>
      </div>

      <h2 className="profile-card__name" id={headingId}>{name}</h2>
      <p className="profile-card__role">{role}</p>
      <p className="profile-card__bio">{bio}</p>

      <div className="profile-card__details">
        <div className="profile-card__detail">
          <span className="profile-card__detail-label">Age</span>
          <span className="profile-card__detail-value">{age}</span>
        </div>
        <div className="profile-card__detail">
          <span className="profile-card__detail-label">Focus</span>
          <span className="profile-card__detail-value">{focus}</span>
        </div>
      </div>

      <div className="profile-card__skills" aria-label="Areas of interest">
        {interests.map((interest) => (
          <span key={interest}>{interest}</span>
        ))}
      </div>
    </article>
  )
}

export default Card;
