import { skillGroups } from "@/content/profile";
export default function About() {
  return (
    <section id="about" className="section wrap" aria-labelledby="about-title">
      <div className="about-grid">
        <div>
          <p className="eyebrow">02 / THE PERSON BEHIND THE WORK</p>
          <h2 id="about-title">
            Curious by nature.
            <br />
            Builder by choice<span>.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            I’m Akib, a software engineer and Computer Science & Engineering
            undergraduate at BRAC University, based in Dhaka.
          </p>
          <p>
            I work across frontend interfaces, backend APIs, databases, and AI
            integrations. I’m especially interested in turning an idea into a
            useful product—and understanding the details that make it reliable.
          </p>
          <p>
            My work in AI software QA keeps me close to real user problems.
            Outside that work, I build products, compete in hackathons, and
            teach Python and Scratch.
          </p>
        </div>
      </div>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            <div className="tag-list">
              {group.items.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
