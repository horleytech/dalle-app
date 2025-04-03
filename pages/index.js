import { useState } from "react";

export default function Home() {
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const correctPassword = process.env.NEXT_PUBLIC_PASSWORD || "demo123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect password.");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg("");
    setImageUrl("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.image_url);
      } else {
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", textAlign: "center" }}>
      <h1>My DALL·E 3 Image Generator</h1>
      {!isAuthenticated ? (
        <form onSubmit={handleLogin} style={{ marginTop: "2rem" }}>
          <input
            type="password"
            placeholder="Enter Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem" }}
          />
          <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "1rem", fontSize: "1rem" }}>
            Login
          </button>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        </form>
      ) : (
        <>
          <div style={{ marginTop: "2rem" }}>
            <input
              type="text"
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem", width: "300px" }}
            />
            <button onClick={handleGenerate} style={{ padding: "0.5rem 1rem", marginLeft: "1rem", fontSize: "1rem" }}>
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </div>
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          {imageUrl && (
            <div style={{ marginTop: "2rem" }}>
              <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
