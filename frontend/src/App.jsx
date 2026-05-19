import { useState, useEffect } from "react";
import axios from "axios";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  History
} from "lucide-react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/reports"
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleScan = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/scan",
        {
          url: url,
        }
      );

      setResult(response.data);

      fetchReports();

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white">

      <div className="grid lg:grid-cols-4">

        {/* SIDEBAR */}

        <div className="border-r border-zinc-800 p-6 min-h-screen bg-black/40 backdrop-blur-xl">

          <div className="flex items-center gap-3 mb-8">
            <History className="text-red-500" />

            <h2 className="text-2xl font-bold">
              Recent Scans
            </h2>
          </div>

          <div className="space-y-3">

            {history.length === 0 && (
              <p className="text-zinc-500">
                No scans yet
              </p>
            )}

            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => setResult(item.report)}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-red-500 transition cursor-pointer"
              >
                <p className="font-semibold break-all">
                  {item.file_name.replace("_report.json", "")}
                </p>

                <p
                  className={`text-sm mt-2 ${
                    item.report.summary.overall_risk === "High"
                      ? "text-red-500"
                      : item.report.summary.overall_risk === "Medium"
                      ? "text-yellow-400"
                      : "text-green-500"
                  }`}
                >
                  {item.report.summary.overall_risk} Risk
                </p>
              </div>
            ))}

          </div>
        </div>

        {/* MAIN CONTENT */}

        <div className="lg:col-span-3 p-10">

          <div className="max-w-5xl mx-auto">

            <div className="flex items-center gap-4 mb-3">
              <Shield className="text-red-500" size={50} />

              <h1 className="text-5xl font-bold">
                Vulnerability Scanner
              </h1>
            </div>

            <p className="text-zinc-400 mb-8 text-lg">
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
                disabled={loading}
                className={`px-6 py-4 rounded-xl font-semibold transition ${
                  loading
                    ? "bg-zinc-700 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  "Scanning..."
                ) : (
                  <div className="flex items-center gap-2">
                    <Search size={18} />
                    Scan
                  </div>
                )}
              </button>

            </div>

            {loading && (
              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 p-4 rounded-xl mb-6">
                Scanning target...
              </div>
            )}

            {!result ? (

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">

                <Shield
                  size={60}
                  className="mx-auto text-zinc-600 mb-4"
                />

                <h2 className="text-2xl font-bold mb-2">
                  No Scan Selected
                </h2>

                <p className="text-zinc-400">
                  Start scanning a website to view security analysis
                </p>

              </div>

            ) : (

              <div className="space-y-8">

                {/* SUMMARY */}

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

                {/* DETAILS */}

                <div className="grid md:grid-cols-2 gap-6">

                  {Object.entries(result.details).map(
                    ([header, data]) => (
                      <div
                        key={header}
                        className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 hover:border-red-500 transition"
                      >
                        <h3 className="text-xl font-bold mb-4">
                          {header}
                        </h3>

                        <div className="space-y-3">

                          <div className="flex items-center gap-2">

                            {data.status === "Missing" ? (
                              <AlertTriangle
                                size={18}
                                className="text-red-500"
                              />
                            ) : (
                              <CheckCircle
                                size={18}
                                className="text-green-500"
                              />
                            )}

                            <span
                              className={
                                data.status === "Missing"
                                  ? "text-red-500 font-semibold"
                                  : "text-green-500 font-semibold"
                              }
                            >
                              {data.status}
                            </span>

                          </div>

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
                    )
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;