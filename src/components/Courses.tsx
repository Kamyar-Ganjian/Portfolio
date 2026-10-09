import { profile } from "@/data/profile";

export default function Courses() {
  return (
    <section className="courses-section section-wrap" aria-labelledby="courses-title">
      <div className="courses-heading" data-reveal><p className="section-kicker"><span>12</span> Continuous learning</p><h2 id="courses-title">Study, alongside<br /><em>the work.</em></h2></div>
      <div className="course-list">
        {profile.courses.map((course) => (
          <a className="course-item" data-reveal href={course.url} target="_blank" rel="noopener noreferrer" key={course.title}>
            <span className="course-status">{course.status === "ongoing" ? "IN PROGRESS" : "COMPLETED"}</span>
            <span className="course-title">{course.title}</span>
            <span className="course-provider">{course.provider}</span>
            <span className="course-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
