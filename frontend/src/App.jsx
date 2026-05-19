import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/scan", {
        url: url,
      });

      setResult(response.data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Vulnerability Scanner
        </h1>

        <p className="text-zinc-400 mb-8">
          Scan websites for missing security headers and risks
        </p>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-zinc-900 border border-zinc-700 outline-none focus:border-red-500"
          />

          <button
            onClick={handleScan}
            className="bg-red-600 hover:bg-red-700 transition px-6 py-4 rounded-xl font-semibold"
          >
            Scan
          </button>
        </div>

        {loading && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-4 rounded-xl mb-6">
            Scanning target...
          </div>
        )}

        {result && (
          <div className="space-y-8">

            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-zinc-400 mb-2">
                  Headers Checked
                </h2>

                <p className="text-4xl font-bold">
                  {result.summary.total_headers_checked}
                </p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-zinc-400 mb-2">
                  Missing Headers
                </h2>

                <p className="text-4xl font-bold">
                  {result.summary.missing_headers}
                </p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-zinc-400 mb-2">
                  Overall Risk
                </h2>

                <p
                  className={`text-4xl font-bold ${
                    result.summary.overall_risk === "High"
                      ? "text-red-500"
                      : result.summary.overall_risk === "Medium"
                      ? "text-yellow-400"
                      : "text-green-500"
                  }`}
                >
                  {result.summary.overall_risk}
                </p>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {Object.entries(result.details).map(([header, data]) => (
                <div
                  key={header}
                  className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 hover:border-red-500 transition"
                >
                  <h3 className="text-xl font-bold mb-4">
                    {header}
                  </h3>

                  <div className="space-y-2">

                    <p>
                      Status:{" "}
                      <span
                        className={
                          data.status === "Missing"
                            ? "text-red-500 font-semibold"
                            : "text-green-500 font-semibold"
                        }
                      >
                        {data.status}
                      </span>
                    </p>

                    <p>
                      Risk:{" "}
                      <span
                        className={
                          data.risk === "High"
                            ? "text-red-500 font-semibold"
                            : data.risk === "Medium"
                            ? "text-yellow-400 font-semibold"
                            : "text-green-500 font-semibold"
                        }
                      >
                        {data.risk}
                      </span>
                    </p>

                    {data.recommendation && (
                      <div className="mt-4 p-4 rounded-xl bg-zinc-800">
                        <p className="text-zinc-300 text-sm">
                          {data.recommendation}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;