import { useState, useEffect } from "react";
import axios from "axios";

import {
  Shield,
  Search,
  History,
  ChevronDown,
  ChevronRight,
  Network,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

function App() {

  const [url, setUrl] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  const [showAllScans, setShowAllScans] = useState(false);

  const [openSections, setOpenSections] = useState({
    ports: true,
    ssl: false,
    headers: false,
  });

  const toggleSection = (section) => {

    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });

  };

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

    <div className="min-h-screen bg-black text-white overflow-hidden">

      <div className="grid lg:grid-cols-[320px_1fr] h-screen">

        {/* SIDEBAR */}

        <div className="border-r border-zinc-900 bg-zinc-950 flex flex-col">

          {/* HEADER */}

          <div className="p-6 border-b border-zinc-900">

            <div className="flex items-center gap-4">

              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">

                <History
                  className="text-red-500"
                  size={30}
                />

              </div>

              <div>

                <h2 className="text-4xl font-black">
                  Recent Scans
                </h2>

                <p className="text-zinc-500">
                  Security scan history
                </p>

              </div>

            </div>

          </div>

          {/* HISTORY */}

          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {(showAllScans
              ? history
              : history.slice(0, 6)
            )
              .filter((item) => item?.report?.headers?.summary)
              .map((item, index) => {

                const risk =
                  item?.report?.headers?.summary?.overall_risk;

                const domain =
                  item?.report?.target ||
                  "Unknown Target";

                return (

                  <div
                    key={index}
                    onClick={() => setResult(item.report)}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-red-500 transition-all cursor-pointer"
                  >

                    <div className="flex items-center justify-between mb-4">

                      <div
                        className={`w-4 h-4 rounded-full ${
                          risk === "High"
                            ? "bg-red-500"
                            : risk === "Medium"
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        }`}
                      />

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          risk === "High"
                            ? "bg-red-500/10 text-red-400"
                            : risk === "Medium"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-green-500/10 text-green-400"
                        }`}
                      >

                        {risk}

                      </span>

                    </div>

                    <p className="font-bold text-lg break-all">

                      {domain}

                    </p>

                  </div>

                );
              })}

            {/* COLLAPSE BUTTON */}

            {history.length > 6 && (

              <button
                onClick={() =>
                  setShowAllScans(!showAllScans)
                }
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 font-bold hover:border-red-500 transition"
              >

                {showAllScans
                  ? "Show Less"
                  : "View All Scans"}

              </button>

            )}

          </div>

        </div>

        {/* MAIN */}

        <div className="overflow-y-auto">

          <div className="max-w-7xl mx-auto p-8">

            {/* HEADER */}

            <div className="mb-12">

              <div className="flex items-center gap-6">

                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">

                  <Shield
                    className="text-red-500"
                    size={60}
                  />

                </div>

                <div>

                  <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
                    Vulnerability Scanner
                  </h1>

                  <p className="text-zinc-500 text-xl mt-2">
                    Advanced vulnerability intelligence dashboard
                  </p>

                </div>

              </div>

            </div>

            {/* SEARCH */}

            <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-4 mb-10">

              <div className="flex flex-col lg:flex-row gap-4">

                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-5 text-xl outline-none focus:border-red-500 transition"
                />

                <button
                  onClick={handleScan}
                  disabled={loading}
                  className={`px-10 py-5 rounded-2xl font-bold text-xl transition ${
                    loading
                      ? "bg-zinc-700 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >

                  {loading ? (
                    "Scanning..."
                  ) : (
                    <div className="flex items-center gap-3">

                      <Search size={24} />

                      Scan Target

                    </div>
                  )}

                </button>

              </div>

            </div>

            {/* EMPTY STATE */}

            {!result ? (

              <div className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-24 text-center">

                <Shield
                  size={90}
                  className="mx-auto text-zinc-700 mb-8"
                />

                <h2 className="text-5xl font-black mb-4">
                  No Scan Selected
                </h2>

                <p className="text-zinc-500 text-xl">
                  Start scanning a target to view results
                </p>

              </div>

            ) : (

              <div className="space-y-8">

                {/* SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

                    <p className="text-zinc-500 mb-4 text-lg">
                      Risk Level
                    </p>

                    <h2
                      className={`text-5xl font-black ${
                        result?.headers?.summary?.overall_risk === "High"
                          ? "text-red-500"
                          : result?.headers?.summary?.overall_risk === "Medium"
                          ? "text-yellow-400"
                          : "text-green-500"
                      }`}
                    >

                      {result?.headers?.summary?.overall_risk}

                    </h2>

                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

                    <p className="text-zinc-500 mb-4 text-lg">
                      Open Ports
                    </p>

                    <h2 className="text-5xl font-black">

                      {result?.ports?.total_open_ports}

                    </h2>

                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

                    <p className="text-zinc-500 mb-4 text-lg">
                      Missing Headers
                    </p>

                    <h2 className="text-5xl font-black">

                      {result?.headers?.summary?.missing_headers}

                    </h2>

                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

                    <p className="text-zinc-500 mb-4 text-lg">
                      Headers Checked
                    </p>

                    <h2 className="text-5xl font-black">

                      {result?.headers?.summary?.total_headers_checked}

                    </h2>

                  </div>

                </div>

                {/* PORTS */}

                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl">

                  <button
                    onClick={() => toggleSection("ports")}
                    className="w-full flex items-center justify-between p-8"
                  >

                    <div className="flex items-center gap-4">

                      <Network
                        className="text-red-500"
                        size={34}
                      />

                      <h2 className="text-4xl font-black">
                        Open Ports & Vulnerabilities
                      </h2>

                    </div>

                    {openSections.ports ? (
                      <ChevronDown size={30} />
                    ) : (
                      <ChevronRight size={30} />
                    )}

                  </button>

                  {openSections.ports && (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-8">

                      {result?.ports?.open_ports?.map(
                        (port, index) => (

                          <div
                            key={index}
                            className="bg-black border border-zinc-800 rounded-3xl p-8"
                          >

                            <div className="flex items-center justify-between mb-6">

                              <div>

                                <h2 className="text-6xl font-black text-red-500">
                                  {port.port}
                                </h2>

                                <p className="text-zinc-400 text-2xl mt-2">
                                  {port.service}
                                </p>

                              </div>

                              <div className="bg-green-500/10 text-green-400 px-5 py-2 rounded-full font-bold">

                                Open

                              </div>

                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5">

                              <p className="text-zinc-500 mb-2">
                                Banner
                              </p>

                              <p className="text-zinc-300 break-all">

                                {port.banner}

                              </p>

                            </div>

                            {port.cves &&
                              port.cves.length > 0 && (

                                <div className="space-y-4">

                                  <h3 className="text-xl font-bold text-red-400">
                                    Known Vulnerabilities
                                  </h3>

                                  {port.cves.map((cve, idx) => (

                                    <div
                                      key={idx}
                                      className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5"
                                    >

                                      <p className="font-bold text-red-400 mb-2">

                                        {cve.cve_id}

                                      </p>

                                      <p className="text-zinc-300 mb-3">

                                        {cve.description}

                                      </p>

                                      <span className="text-sm font-bold bg-red-500/10 text-red-400 px-3 py-1 rounded-full">

                                        Severity: {cve.severity}

                                      </span>

                                    </div>

                                  ))}

                                </div>

                              )}

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

                {/* SSL */}

                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl">

                  <button
                    onClick={() => toggleSection("ssl")}
                    className="w-full flex items-center justify-between p-8"
                  >

                    <h2 className="text-4xl font-black">
                      SSL Information
                    </h2>

                    {openSections.ssl ? (
                      <ChevronDown size={30} />
                    ) : (
                      <ChevronRight size={30} />
                    )}

                  </button>

                  {openSections.ssl && (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-8">

                      <div className="bg-black border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-500 mb-3">
                          SSL Status
                        </p>

                        <p className="text-2xl font-bold text-green-500">

                          {result?.ssl?.ssl_enabled
                            ? "Enabled"
                            : "Disabled"}

                        </p>

                      </div>

                      <div className="bg-black border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-500 mb-3">
                          Issuer
                        </p>

                        <p className="text-xl font-bold">

                          {result?.ssl?.issuer?.organizationName ||
                            "Unknown"}

                        </p>

                      </div>

                      <div className="bg-black border border-zinc-800 rounded-3xl p-6">

                        <p className="text-zinc-500 mb-3">
                          Expiry Date
                        </p>

                        <p className="text-xl font-bold break-all">

                          {result?.ssl?.expiry_date ||
                            "Unavailable"}

                        </p>

                      </div>

                    </div>

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