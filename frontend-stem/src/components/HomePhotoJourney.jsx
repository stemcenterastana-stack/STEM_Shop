// Static masks crossfade over identical pixels; no polygon is rebuilt while scrolling.
export default function HomePhotoJourney() {
  return (
    <div className="stem-photo-journey" aria-hidden="true">
      {['start', 'end'].map(frame => (
        <div className={`stem-photo-journey__frame stem-photo-journey__frame--${frame}`} key={frame}>
          <div className="stem-photo-journey__viewport">
            <img src="/img/home/stem-classroom.png" alt="" width="1536" height="1024" />
          </div>
        </div>
      ))}
    </div>
  )
}
