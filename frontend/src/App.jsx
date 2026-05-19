import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/scan", {
        url: url,
      });

      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          Vulnerability Scanner
        </h1>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-zinc-900 border border-zinc-700"
          />

          <button
            onClick={handleScan}
            className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-xl font-semibold"
          >
            Scan
          </button>
        </div>

        {result && (
          <div className="space-y-6">

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700">
              <h2 className="text-2xl font-bold mb-4">Scan Summary</h2>

              <p>
                Total Headers Checked:{" "}
                {result.summary.total_headers_checked}
              </p>

              <p>
                Missing Headers:{" "}
                {result.summary.missing_headers}
              </p>

              <p>
                Overall Risk:{" "}
                <span className="text-red-500 font-bold">
                  {result.summary.overall_risk}
                </span>
              </p>
            </div>

            {Object.entries(result.details).map(([header, data]) => (
              <div
                key={header}
                className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700"
              >
                <h3 className="text-xl font-bold mb-2">{header}</h3>

                <p>Status: {data.status}</p>

                <p>
                  Risk:{" "}
                  <span
                    className={
                      data.risk === "High"
                        ? "text-red-500"
                        : data.risk === "Medium"
                        ? "text-yellow-400"
                        : "text-green-500"
                    }
                  >
                    {data.risk}
                  </span>
                </p>

                {data.recommendation && (
                  <p className="mt-2 text-zinc-300">
                    Recommendation: {data.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;