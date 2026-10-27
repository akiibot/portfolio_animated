import { experience } from "@/content/experience";
export default function Experience() {
  return (
    <section
      id="experience"
      className="section wrap bordered-section"
      aria-labelledby="experience-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / EXPERIENCE</p>
          <h2 id="experience-title">
            Learning through doing<span>.</span>
          </h2>
        </div>
      </div>
      <div className="experience-list">
        {experience.map((job) => (
          <article className="experience-row" key={job.company}>
            <p className="date-label">{job.date}</p>
            <div>
              <p className="eyebrow">{job.company}</p>
              <h3>{job.role}</h3>
              <p className="job-label">{job.label}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
