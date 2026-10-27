import AwardPhotoGallery from "./AwardPhotoGallery";
import { awardAlbums } from "@/content/award-photos";
import { awards } from "@/content/awards";
import { Trophy, ArrowUpRight } from "lucide-react";
export default function Achievements() {
  return (
    <section
      id="achievements"
      className="achievements-band"
      aria-labelledby="achievements-title"
    >
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RECOGNITION</p>
            <h2 id="achievements-title">
              Built. Tested. Recognized<span>.</span>
            </h2>
          </div>
          <Trophy className="section-icon" size={30} />
        </div>
        <div className="awards-grid">
          {awards.map((award, i) => (
            <div className="award" key={award.event}>
              <span className="award-index">0{i + 1}</span>
              <div>
                <h3>{award.title}</h3>
                <p>{award.event}</p>
                <small>{award.detail}</small>
              </div>
              <ArrowUpRight size={18} />
            </div>
          ))}
        </div>
        <AwardPhotoGallery albums={awardAlbums} />
      </div>
    </section>
  );
}
