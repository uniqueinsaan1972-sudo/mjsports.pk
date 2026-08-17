const FACEBOOK_URL = "https://www.facebook.com/people/MJ-Sports/61554667569001/";
const TIKTOK_URL = "https://www.tiktok.com/@mj.sports99";

export default function SocialSection() {
  return (
    <section className="section" id="follow">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Join The Family</div>
          <h2>Follow MJ Sports</h2>
          <p>Behind-the-scenes from the workshop, match highlights, and new drops first.</p>
        </div>
        <div className="social-grid">
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon" style={{ background: "linear-gradient(135deg,#000,#25F4EE22)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 3c.4 2 1.9 3.5 4 3.8v3c-1.5 0-2.9-.4-4-1.2v6.4c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V3h3z"/></svg>
            </div>
            <div className="social-card-info">
              <h3>TikTok</h3>
              <span className="social-count">50K+ Followers</span>
              <p>@mj.sports99 &mdash; bat crafting, unboxings &amp; more</p>
            </div>
            <span className="social-follow-btn">Follow</span>
          </a>

          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-card">
            <div className="social-card-icon" style={{ background: "linear-gradient(135deg,#1877F2,#0d5bc4)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.5-1.5h1.5V4.35C16.25 4.25 15.19 4 14 4c-2.5 0-4 1.5-4 4.5V10.5H7.5v3H10V21h3.5z"/></svg>
            </div>
            <div className="social-card-info">
              <h3>Facebook</h3>
              <span className="social-count">7.7K Followers</span>
              <p>MJ Sports, Sialkot &mdash; matches, offers &amp; updates</p>
            </div>
            <span className="social-follow-btn">Follow</span>
          </a>
        </div>
      </div>
    </section>
  );
}