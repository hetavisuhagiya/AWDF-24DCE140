import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch("https://api.github.com/users/hetavisuhagiya/repos")

      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })

      .then((data) => {
        setRepos(data);
      })

      .catch((err) => {
        setError(err.message);
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) return <Spinner />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="content-card">
      <h2>GitHub Repositories</h2>

      <ul className="repo-list">
        {repos.map((repo) => (
          <li className="repo-item" key={repo.id}>
            <strong>{repo.name}</strong>
            <br />
            <a
              className="repo-link"
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
            >
              {repo.html_url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;