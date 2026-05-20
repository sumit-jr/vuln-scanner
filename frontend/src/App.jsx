import {
  Shield,
  Search,
  History,
  ChevronDown,
  ChevronRight,
  Network,
  AlertTriangle,
  CheckCircle,
  Trash2,
} from "lucide-react";

import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [url, setUrl] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  const [showAllScans, setShowAllScans] = useState(false);


  const [openSections, setOpenSections] = useState({
    ports: true,
    ssl: true,
    headers: true,
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

  const deleteScan = async (fileName) => {

  try {

    await axios.delete(
      `http://127.0.0.1:8000/reports/${fileName}`
    );

    const updatedHistory = history.filter(
      (item) => item.file_name !== fileName
    );

    setHistory(updatedHistory);

    if (
      result &&
      history.find(
        (item) => item.file_name === fileName
      )?.report?.target === result?.target
    ) {

      setResult(null);

    }

  } catch (error) {

    console.log(error);

  }

};
const exportJSON = () => {

  if (!result) return;

  const dataStr = JSON.stringify(
    result,
    null,
    2
  );

  const blob = new Blob(
    [dataStr],
    {
      type: "application/json"
    }
  );

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `${result.target}-report.json`;

  link.click();

};

const exportPDF = () => {

  if (!result) return;

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(22);

  doc.text(
    "Vulnerability Scan Report",
    20,
    y
  );

  y += 20;

  doc.setFontSize(14);

  doc.text(
    `Target: ${result.target}`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Risk Level: ${result.headers.summary.overall_risk}`,
    20,
    y
  );

  y += 10;

  doc.text(
    `Open Ports: ${result.ports.total_open_ports}`,
    20,
    y
  );

  y += 20;

  doc.setFontSize(18);

  doc.text(
    "Open Ports",
    20,
    y
  );

  y += 15;

  result.ports.open_ports.forEach((port) => {

    doc.setFontSize(12);

    doc.text(
      `Port ${port.port} (${port.service})`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Banner: ${port.banner}`,
      25,
      y
    );

    y += 8;

    if (port.cves.length > 0) {

      port.cves.forEach((cve) => {

        doc.text(
          `${cve.cve_id} - ${cve.severity}`,
          30,
          y
        );

        y += 8;

      });

    }

    y += 10;

  });

  doc.save(
    `${result.target}-report.pdf`
  );

};

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="grid lg:grid-cols-[320px_1fr] h-screen">

       {/* SIDEBAR */}

<div className="border-r border-zinc-900 bg-zinc-950 flex flex-col h-screen sticky top-0">

  {/* HEADER */}

  <div className="p-6 border-b border-zinc-900">

    <div className="flex items-center gap-4">

      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">

        <History
          className="text-red-500"
          size={32}
        />

      </div>

      <div>

        <h2 className="text-5xl font-black leading-none">
          Recent
          <br />
          Scans
        </h2>

        <p className="text-zinc-500 mt-2">
          Security scan history
        </p>

      </div>

    </div>

  </div>

  {/* HISTORY LIST */}

<div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 pb-32">

  {(showAllScans ? history : history.slice(0, 5)).map(
    (item, index) => {

      const risk =
        item.report?.headers?.summary?.overall_risk ||
        "Low";

      const domain =
        item.report?.target ||
        item.file_name
          ?.replace(".json", "")
          ?.replace("scan_", "") ||
        "Unknown Target";

      return (

        <div
          key={index}
          onClick={() => setResult(item.report)}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-red-500 transition-all cursor-pointer group"
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

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

            <button
              onClick={(e) => {

                e.stopPropagation();

                deleteScan(item.file_name);

              }}
              className="text-zinc-500 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >

              <Trash2 size={18} />

            </button>

          </div>

          <div className="mt-5">

            <p className="font-bold text-xl break-all text-white">

              {domain}

            </p>

          </div>

        </div>

      );

    }
  )}
  
  {history.length > 5 && (

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

</div>{/* END SIDEBAR */}



        {/* MAIN */}

        <div className="overflow-y-auto h-screen">

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
                <div className="mb-8">

  <p className="text-zinc-500 text-lg mb-2">
    Current Target
  </p>

  <h2 className="text-4xl font-black break-all">

    {result?.target}

  </h2>

</div>
<div className="flex gap-4 mb-8">

  <button
    onClick={exportJSON}
    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-bold transition"
  >

    Export JSON

  </button>

  <button
    onClick={exportPDF}
    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold transition"
  >

    Export PDF

  </button>

</div>

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

                {/* TECHNOLOGIES */}

<div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

  <div className="flex items-center gap-4 mb-8">

    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">

      <Shield
        className="text-blue-400"
        size={30}
      />

    </div>

    <div>

      <h2 className="text-4xl font-black">
        Technology Fingerprinting
      </h2>

      <p className="text-zinc-500 mt-1">
        Detected technologies and frameworks
      </p>

    </div>

  </div>

  {result?.technologies?.length > 0 ? (

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {result.technologies.map((tech, index) => (

      <div
        key={index}
        className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-blue-500 transition"
      >

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3 className="text-2xl font-black text-blue-300">

              {tech.name}

            </h3>

            <p className="text-zinc-500 mt-1">
              Technology Detection
            </p>

          </div>

          <div className="bg-blue-500/10 text-blue-300 px-4 py-2 rounded-full font-bold text-sm">

            {tech.confidence}%

          </div>

        </div>

        {/* PROGRESS BAR */}

        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">

          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500"
            style={{
              width: `${tech.confidence}%`
            }}
          />

        </div>

      </div>

    ))}

  </div>

) : (

    <div className="bg-black border border-zinc-800 rounded-2xl p-8 text-center">

      <p className="text-zinc-500 text-lg">
        No technologies detected
      </p>

    </div>

  )}

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

                      {result?.ports?.open_ports?.map((port, index) => {
                        return (
                          <div
                            key={index}
                            className="bg-black border border-zinc-800 rounded-3xl p-8"
                          >

                            <div className="flex items-center justify-between mb-6">

                              <div>

                                <h2 className="text-5xl lg:text-6xl font-black text-red-500 break-all">
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

                            {port.cves && port.cves.length > 0 && (
                              <div className="space-y-4">

                                <h3 className="text-xl font-bold text-red-400">
                                  Known Vulnerabilities
                                </h3>

                                {port.cves.map((cve, idx) => {
                                  return (
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
                                  );
                                })}

                              </div>
                            )}

                          </div>
                        );
                      })}

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