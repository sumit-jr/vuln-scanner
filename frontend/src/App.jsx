import { useState, useEffect } from "react";
import axios from "axios";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Search,
  History,
  Network,
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

    if (!url) return;

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

      <div className="grid lg:grid-cols-[380px_1fr] min-h-screen">

        {/* SIDEBAR */}

        <div className="border-r border-zinc-800 p-6 bg-black/50 backdrop-blur-2xl">

          <div className="flex items-center gap-3 mb-8">

            <History
              className="text-red-500"
              size={28}
            />

            <h2 className="text-3xl font-bold">
              Recent Scans
            </h2>

          </div>

          <div className="space-y-4">

            {history.length === 0 && (
              <p className="text-zinc-500">
                No scans yet
              </p>
            )}

            {history
              .filter((item) => item?.report?.headers?.summary)
              .map((item, index) => (

                <div
                  key={index}
                  onClick={() => setResult(item.report)}
                  className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl hover:border-red-500 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                >

                  <p className="font-semibold text-lg break-all mb-2">

                    {item.file_name
                      .replace("_report.json", "")
                      .replace("scan_", "")}

                  </p>

                  <p
                    className={`font-semibold ${
                      item?.report?.headers?.summary?.overall_risk === "High"
                        ? "text-red-500"
                        : item?.report?.headers?.summary?.overall_risk === "Medium"
                        ? "text-yellow-400"
                        : "text-green-500"
                    }`}
                  >

                    {item?.report?.headers?.summary?.overall_risk} Risk

                  </p>

                </div>
              ))}

          </div>

        </div>

        {/* MAIN */}

        <div className="p-8 lg:p-12">

          <div className="max-w-full">

            {/* HEADER */}

            <div className="mb-10">

              <div className="flex items-center gap-4 mb-4">

                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">

                  <Shield
                    className="text-red-500"
                    size={50}
                  />

                </div>

                <div>

                  <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Vulnerability Scanner
                  </h1>

                  <p className="text-zinc-400 text-lg mt-2">
                    Scan websites for vulnerabilities, SSL issues, and open ports
                  </p>

                </div>

              </div>

            </div>

            {/* SEARCH */}

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 mb-10 backdrop-blur-xl">

              <div className="flex flex-col lg:flex-row gap-4">

                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-zinc-950/80 border border-zinc-700 rounded-2xl px-6 py-5 text-lg outline-none focus:border-red-500 transition placeholder:text-zinc-500"
                />

                <button
                  onClick={handleScan}
                  disabled={loading}
                  className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    loading
                      ? "bg-zinc-700 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 hover:scale-105"
                  }`}
                >

                  {loading ? (
                    "Scanning..."
                  ) : (
                    <div className="flex items-center gap-3">

                      <Search size={22} />

                      Scan

                    </div>
                  )}

                </button>

              </div>

            </div>

            {/* EMPTY STATE */}

            {!result ? (

              <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-3xl p-20 text-center">

                <Shield
                  size={80}
                  className="mx-auto text-zinc-700 mb-6"
                />

                <h2 className="text-4xl font-bold mb-4">
                  No Scan Selected
                </h2>

                <p className="text-zinc-400 text-lg">
                  Start scanning a website to view security analysis
                </p>

              </div>

            ) : (

              <div className="space-y-8">

                {/* SUMMARY */}

                <div className="grid md:grid-cols-3 gap-6">

                  <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl">

                    <h2 className="text-zinc-400 mb-3 text-lg">
                      Headers Checked
                    </h2>

                    <p className="text-5xl font-black">
                      {result?.headers?.summary?.total_headers_checked}
                    </p>

                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl">

                    <h2 className="text-zinc-400 mb-3 text-lg">
                      Missing Headers
                    </h2>

                    <p className="text-5xl font-black">
                      {result?.headers?.summary?.missing_headers}
                    </p>

                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl">

                    <h2 className="text-zinc-400 mb-3 text-lg">
                      Overall Risk
                    </h2>

                    <p
                      className={`text-5xl font-black ${
                        result?.headers?.summary?.overall_risk === "High"
                          ? "text-red-500"
                          : result?.headers?.summary?.overall_risk === "Medium"
                          ? "text-yellow-400"
                          : "text-green-500"
                      }`}
                    >

                      {result?.headers?.summary?.overall_risk}

                    </p>

                  </div>

                </div>

                {/* SSL */}

                <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl">

                  <h2 className="text-3xl font-bold mb-8">
                    SSL Information
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">

                    <div>

                      <p className="text-zinc-400 mb-2">
                        SSL Status
                      </p>

                      <p className="text-green-500 text-xl font-bold">
                        {result?.ssl?.ssl_enabled ? "Enabled" : "Disabled"}
                      </p>

                    </div>

                    <div>

                      <p className="text-zinc-400 mb-2">
                        Issuer
                      </p>

                      <p className="text-xl font-semibold">
                        {result?.ssl?.issuer?.organizationName || "Unknown"}
                      </p>

                    </div>

                    <div>

                      <p className="text-zinc-400 mb-2">
                        Expiry Date
                      </p>

                      <p className="text-xl font-semibold">
                        {result?.ssl?.expiry_date || "Unavailable"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PORTS */}

                <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl">

                  <div className="flex items-center gap-3 mb-8">

                    <Network
                      className="text-red-500"
                      size={30}
                    />

                    <h2 className="text-3xl font-bold">
                      Open Ports
                    </h2>

                  </div>

                  {result?.ports?.open_ports?.length > 0 ? (

                    <div className="grid md:grid-cols-3 gap-6">

                      {result?.ports?.open_ports?.map((port, index) => (

                        <div
                          key={index}
                          className="bg-zinc-800/70 border border-zinc-700 p-6 rounded-2xl"
                        >

                          <p className="text-zinc-400 mb-2">
                            Port
                          </p>

                          <h3 className="text-4xl font-black text-red-500 mb-4">
                            {port.port}
                          </h3>

                          <p className="text-lg font-semibold">
                            {port.service}
                          </p>

                          <p className="text-green-500 mt-2 font-semibold">
                            {port.status}
                          </p>
                          <p className="text-zinc-400 text-sm mt-4 break-all">
                            {port.banner}
                          </p>
                          {port.cves?.length > 0 && (

  <div className="mt-5 space-y-3">

    <p className="text-red-400 font-bold">
      Known Vulnerabilities
    </p>

    {port.cves.map((cve, idx) => (

      <div
        key={idx}
        className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
      >

        <p className="text-red-400 font-bold">
          {cve.cve_id}
        </p>

        <p className="text-sm text-zinc-300 mt-1">
          {cve.description}
        </p>

        <p
          className={`mt-2 font-semibold ${
            cve.severity === "Critical"
              ? "text-red-500"
              : cve.severity === "High"
              ? "text-orange-400"
              : "text-yellow-400"
          }`}
        >

          Severity: {cve.severity}

        </p>

      </div>

    ))}

  </div>

)}

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-zinc-400">
                      No open ports detected
                    </p>

                  )}

                </div>

                {/* HEADER DETAILS */}

                <div className="grid md:grid-cols-2 gap-6">

                  {Object.entries(result?.headers?.details || {}).map(
                    ([header, data]) => (

                      <div
                        key={header}
                        className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl p-8 rounded-3xl hover:border-red-500 transition"
                      >

                        <h3 className="text-2xl font-bold mb-6">
                          {header}
                        </h3>

                        <div className="space-y-4">

                          <div className="flex items-center gap-3">

                            {data.status === "Missing" ? (

                              <AlertTriangle
                                size={20}
                                className="text-red-500"
                              />

                            ) : (

                              <CheckCircle
                                size={20}
                                className="text-green-500"
                              />

                            )}

                            <span
                              className={
                                data.status === "Missing"
                                  ? "text-red-500 font-semibold text-lg"
                                  : "text-green-500 font-semibold text-lg"
                              }
                            >

                              {data.status}

                            </span>

                          </div>

                          <p className="text-lg">

                            Risk:{" "}

                            <span
                              className={
                                data.risk === "High"
                                  ? "text-red-500 font-bold"
                                  : data.risk === "Medium"
                                  ? "text-yellow-400 font-bold"
                                  : "text-green-500 font-bold"
                              }
                            >

                              {data.risk}

                            </span>

                          </p>

                          {data.recommendation && (

                            <div className="mt-4 p-5 rounded-2xl bg-zinc-800/70 border border-zinc-700">

                              <p className="text-zinc-300">
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

            {/* FOOTER */}

            <footer className="border-t border-zinc-800 mt-12 py-6 text-center text-zinc-500">

              <span className="text-red-500 font-semibold">
                Vulnerability Scanner
              </span>

              <span className="mx-3 text-zinc-700">|</span>

              Built with FastAPI & React

            </footer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;