"use client";

import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { GrantsContext } from "../../Context/GrantsContext";
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloudDownload,
  AiOutlineFilter,
} from "react-icons/ai";
import {
  FaHandshake,
  FaLightbulb,
  FaLink,
  FaChartLine,
  FaUsers,
  FaRegLightbulb,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import DescriptionRenderer from "../../Components/DescriptionRender";
import { BusinessContext } from "../../Context/BusinessContext";

export default function ExploreFunding() {
  const { fetchMatchedGrants, isLoading, matchedGrants } =
    useContext(GrantsContext);
  const { businessDetails } = useContext(BusinessContext);
  const [filters, setFilters] = useState({
    sector: "",
    fundingType: "",
    maxAmount: "",
    region: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortedGrants, setSortedGrants] = useState([]);
  const [filteredGrants, setFilteredGrants] = useState([]);
  const [showApplyPopup, setShowApplyPopup] = useState(false);
  const isInitialMount = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const grantsPerPage = 9;

  // Update filtered grants whenever filters or sort options change
  useEffect(() => {
    let result = [...matchedGrants];

    // Apply filters
    if (filters.sector) {
      result = result.filter((grant) => {
        if (!grant.sectors) return false;
        
        const searchTerm = filters.sector.toLowerCase();
        
        if (typeof grant.sectors === 'string') {
          return grant.sectors.toLowerCase().includes(searchTerm);
        } else if (Array.isArray(grant.sectors)) {
          return grant.sectors.some(sector => 
            typeof sector === 'string' && sector.toLowerCase().includes(searchTerm)
          );
        }
        
        return false;
      });
    }
    if (filters.fundingType) {
      result = result.filter(
        (grant) =>
          grant.fundingType &&
          grant.fundingType.toLowerCase() === filters.fundingType.toLowerCase()
      );
    }
    if (filters.maxAmount) {
      const maxAmount = parseInt(filters.maxAmount);
      result = result.filter((grant) => {
        const grantAmount = parseInt(
          grant.maxAmount?.replace(/[^0-9]/g, "") || "0"
        );
        return grantAmount <= maxAmount;
      });
    }
    if (filters.region) {
      result = result.filter(
        (grant) =>
          grant.region &&
          grant.region.toLowerCase() === filters.region.toLowerCase()
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case "score":
          comparison = b.score - a.score;
          break;
        case "amount":
          const amountA = parseInt(a.maxAmount?.replace(/[^0-9]/g, "") || "0");
          const amountB = parseInt(b.maxAmount?.replace(/[^0-9]/g, "") || "0");
          comparison = amountB - amountA;
          break;
        case "deadline":
          if (a.deadline && b.deadline) {
            comparison = new Date(a.deadline) - new Date(b.deadline);
          } else if (a.deadline) {
            comparison = -1;
          } else if (b.deadline) {
            comparison = 1;
          }
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? -comparison : comparison;
    });

    setFilteredGrants(result);
    setSortedGrants(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [matchedGrants, filters, sortOption, sortOrder]);

  const indexOfLastGrant = currentPage * grantsPerPage;
  const indexOfFirstGrant = indexOfLastGrant - grantsPerPage;
  const currentGrants = filteredGrants.slice(
    indexOfFirstGrant,
    indexOfLastGrant
  );

  // Extract unique filter options from grants data
  const allSectors = Array.from(
    new Set(
      matchedGrants?.flatMap((grant) => {
        if (!grant?.sectors) return [];
        // Handle both string (CSV) and array formats
        return typeof grant.sectors === 'string'
          ? grant.sectors.split(/,\s*/)
          : Array.isArray(grant.sectors)
            ? grant.sectors
            : [];
      })
    )
  ).filter(Boolean);

  const allFundingTypes = Array.from(
    new Set(matchedGrants.map((grant) => grant.fundingType))
  ).filter(Boolean);

  const allRegions = Array.from(
    new Set(matchedGrants.map((grant) => grant.region))
  ).filter(Boolean);

  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const colors = {
        primary: [215,28,39], // #F97316
        secondary: [249, 115, 22], // Use same for accents
        accent: [249, 115, 22], // For buttons/links
        background: [255, 255, 255], // #ffffff
        text: [0, 0, 0], // Black
        lightText: [120, 120, 120], // Subtle gray for less important text
        white: [255, 255, 255],
        whiteT: [255, 255, 255,50],
      };

      function addTOCHeader(isContinued = false) {
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.text);
        safeText(
          isContinued ? "Table of Contents (cont.)" : "Table of Contents",
          20,
          50
        );
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(1.5);
        doc.line(20, 55, 91, 55);
      }

      // Current date formatting
      const currentDate = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedDate = `${monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`;

      // Helper function for safe text rendering with max width
      const safeText = (text, x, y, options = {}) => {
        if (!text) text = "";
        if (typeof text !== "string") text = String(text);

        // Calculate available width (default to 170mm if not specified)
        const maxWidth = options.maxWidth || 170;

        // Split text into multiple lines if needed
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y, options);

        // Return the height used by the text
        return lines.length * (options.lineHeight || 7);
      };


      //cover page image
      doc.addImage(
        "/pdf-img/home.webp", // <-- make sure the image exists in public folder
        "PNG", // or 'JPG' depending on your export
        0, // x
        0, // y
        210, // width in mm (A4 width)
        297, // height in mm (A4 height)
        "SLOW"
      );
   const borderX = 22;
const maxWidth = doc.internal.pageSize.width - (borderX * 2); // Calculate available width
const companyName = businessDetails?.companyName || '';

doc.setFont("helvetica", "bold");
doc.setTextColor(...colors.primary);
doc.setFontSize(42);

// Split text into multiple lines if needed
const lines = doc.splitTextToSize(companyName, maxWidth);

// Draw each line with proper vertical spacing
let yPosition = 250;
lines.forEach((line, index) => {
  doc.text(line, borderX, yPosition + (index * 20)); // 50 is line height, adjust as needed
});
      // ===== TABLE OF CONTENTS =====
   doc.addPage();
addTOCHeader(false);

// Set borders
doc.setDrawColor(...colors.primary);
doc.setLineWidth(10);
doc.line(0, 0, 0, 297); 
doc.line(210, 0, 210, 297); 

let yPos = 70;

// List of grants with improved spacing
doc.setFontSize(12);
filteredGrants.forEach((grant, index) => {
  const number = (index + 1).toString().padStart(2, "0");
  
  // Square dimensions
  const squareSize = 8;
  const squareX = 20;
  const squareY = yPos;
  const textX = squareX + squareSize + 10; // 10px spacing after square

  // Number with square background
  doc.setFillColor(...colors.primary);
  doc.rect(squareX-3, squareY-1, squareSize, squareSize, "F"); // Square instead of circle
  doc.setFontSize(30);
  doc.setTextColor(...colors.lightText); 
  doc.setFont("helvetica", "bold");
  doc.text(number, squareX + squareSize/2, squareY + squareSize/2 + 2, { 
    align: "center",
    baseline: "middle"
  });

  // Grant name text
  doc.setTextColor(...colors.text);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(grant.programName, 130);
  doc.text(lines, textX, yPos + squareSize/2 + 2, { baseline: "middle" });

  // Add subtle separator
  const titleHeight = lines.length * 6;

  yPos += Math.max(titleHeight, squareSize) + 15;

  // Page break logic
  if (yPos > 250) {
    doc.addPage();
    // Draw borders on new page
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(10);
    doc.line(0, 0, 0, 297);
    doc.line(210, 0, 210, 297);
    addTOCHeader(true);
    yPos = 70;
  }
});

      const imagePaths = [
  "/pdf-img/1.png",
  "/pdf-img/2.png",
  "/pdf-img/3.png",
  "/pdf-img/4.png",
  "/pdf-img/5.png",
  "/pdf-img/6.png",
];

      // ===== GRANT DETAIL PAGES =====
      filteredGrants.forEach((grant, index) => {
        doc.addPage();

  const borderX = 8;
  const borderY = 12;
  const borderWidth = 186;
  const borderHeight = 273;
   doc.setFontSize(35);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.lightText);
         const programName = (grant.programName || `Grant ${index + 1}`).toUpperCase();
        doc.text(programName, borderX + 5, 30, {
          maxWidth: 190
        });

   const imageIndex = index % imagePaths.length; // Repeats after 7 images
  const imgPath = imagePaths[imageIndex];
  doc.setFontSize(20);
doc.text(`Funding Overview`, borderX +15, 80, {
          maxWidth: 140
        });
  // Add image below title (adjust Y position as needed)
  doc.addImage({
    imageData: imgPath,
    x: borderX+3, // Slight padding from left border
    y: 15, // Below title (adjust this value)
    width: 190, // Adjust width
    height: 180, // Adjust height
    compression:"SLOW"
  });

/// Yellow box
const headerBoxY = borderY + 150;
doc.setFillColor(...colors.primary);

// Define yellow box details first to calculate needed height
const yellowBoxDetails = [
  {
    label: "Funding Amount:",
    value: grant.maxAmount || "Not specified",
  },
  {
    label: "Percentage Covered:",
    value: grant.percentCovered || "Not specified",
  },
  { label: "Region:", value: grant.region || "Not specified" },
  {
    label: "Funding Type:",
    value: grant.fundingType || "Not specified",
  },
  { label: "Deadline:", value: grant.deadline || "Rolling" },
];

// Calculate required height based on content
const columnCount = 5;
const columnWidth = 190 / columnCount;
const startX = borderX + 2;
let maxLines = 1;

// Pre-calculate how many lines each value will need
yellowBoxDetails.forEach((detail) => {
  const valueText = doc.splitTextToSize(detail.value, columnWidth - 10);
  if (valueText.length > maxLines) {
    maxLines = valueText.length;
  }
});

// Calculate dynamic height (base height + extra for multi-line values)
const boxHeight = 30 + (maxLines > 1 ? (maxLines - 1) * 8 : 0);
doc.rect(0, headerBoxY, 210, boxHeight, "F");

// Draw content in yellow box
const centerY = headerBoxY + 15 + (maxLines > 1 ? (maxLines - 1) * 4 : 0);

yellowBoxDetails.forEach((detail, index) => {
  const columnCenter = startX + (index * columnWidth) + (columnWidth / 2);
  
  // Label
  doc.setFontSize(10);
  doc.setTextColor(...colors.white);
  doc.setFont("helvetica", "bold");
  doc.text(detail.label, columnCenter, centerY - 5, { align: "center" });

  // Value
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const valueText = doc.splitTextToSize(detail.value, columnWidth - 10);
  const valueY = centerY + (valueText.length > 1 ? 3 : 5);
  doc.text(valueText, columnCenter, valueY, { align: "center" });
});

// Adjust following content based on yellow box height
let contentY = headerBoxY + boxHeight + 8; // 20px margin after yellow box

        // --- Sectors Section ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...colors.lightText);
        doc.text("Sectors", borderX + 5, contentY + 8);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        doc.setTextColor(...colors.text);
        const sectorsLines = doc.splitTextToSize(
          grant.sectors || "Not specified",
          borderWidth - 30
        );
        doc.text(sectorsLines, borderX + 5, contentY + 14);

        contentY += sectorsLines.length * 5 + 5; // Add some space after sectors

        // --- Two-column layout for other details ---
        let leftY = contentY;
        let rightY = contentY;

        // Find the lower Y of the two columns to start the next section
        let sectionY = Math.max(leftY, rightY) + 15;

        // --- Description Section ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...colors.lightText);
        doc.text("Description", borderX + 5, sectionY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        doc.setTextColor(...colors.text);

        let descY = sectionY + 7;
        const description = Array.isArray(grant.description)
          ? grant.description
            .map((item) => (typeof item === "string" ? item : item.content))
            .join("\n")
          : grant.description || "No description provided.";

        const descLines = doc.splitTextToSize(description, borderWidth - 20);
        doc.text(descLines, borderX + 5, descY);

        descY += descLines.length * 6 + 10;

        // --- Program Goals (if any) ---
        if (grant.goals && descY < borderY + borderHeight - 30) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.setTextColor(...colors.primary);
          doc.text("Program Goals", borderX + 10, descY);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(...colors.text);
          const goalsLines = doc.splitTextToSize(grant.goals, borderWidth - 20);

          // Check if there's enough space for goals
          if (
            descY + goalsLines.length * 6 + 14 <
            borderY + borderHeight - 20
          ) {
            doc.text(goalsLines, borderX + 10, descY + 8);
            descY += goalsLines.length * 6 + 14;
          }
        }
      });

      // ===== THANK YOU PAGE =====
      doc.addPage();

       doc.addImage(
        "/pdf-img/thanku.webp", // <-- make sure the image exists in public folder
        "PNG", // or 'JPG' depending on your export
        0, // x
        0, // y
        210, // width in mm (A4 width)
        297, // height in mm (A4 height)
        undefined,
        "FAST"
      );

      const filename = `Funding_Opportunities_${businessDetails.companyName || "YourOrganization"
        }_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;
    if (name === "sortOption") {
      setSortOption(value);
    } else if (name === "sortOrder") {
      setSortOrder(value);
    }
  };

  const clearFilters = () => {
    setFilters({
      sector: "",
      fundingType: "",
      maxAmount: "",
      region: "",
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Set isInitialMount to false after first render
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Popup Modal */}
      {showApplyPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-xl max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-purple-900 mb-4">
              Consult a consultancy with Grantshub
            </h3>
            <p className="text-gray-700 mb-6">
              Our experts will help you with the application process for this
              grant.
            </p>
            <button
              onClick={() => setShowApplyPopup(false)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
      {isLoading ? (
        <motion.div
          className="flex justify-center items-center h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AiOutlineLoading3Quarters className="animate-spin text-5xl text-orange-500" />
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-bold text-orange-800 mb-4"
            >
              Explore Funding Opportunities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-orange-700 mb-8"
            >
              Discover grants that align with your innovation goals
            </motion.p>

            {/* Filter/Sort Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                <AiOutlineFilter />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </motion.button>

              {/* <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort by:
                </label>
                <select
                  id="sort"
                  name="sortOption"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="bg-transparent border-none focus:ring-0 text-sm"
                >
                  <option value="score">Relevance</option>
                  <option value="amount">Funding Amount</option>
                  <option value="deadline">Deadline</option>
                </select>
                <select
                  name="sortOrder"
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="bg-transparent border-none focus:ring-0 text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div> */}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-6 rounded-xl shadow-lg mb-8 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sector
                    </label>
                    <select
                      name="sector"
                      value={filters.sector}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">All Sectors</option>
                      {allSectors.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Funding Type
                    </label>
                    <select
                      name="fundingType"
                      value={filters.fundingType}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">All Types</option>
                      {allFundingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Amount
                    </label>
                    <select
                      name="maxAmount"
                      value={filters.maxAmount}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Any Amount</option>
                      <option value="100000">Up to $100,000</option>
                      <option value="250000">Up to $250,000</option>
                      <option value="500000">Up to $500,000</option>
                      <option value="1000000">Up to $1,000,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      name="region"
                      value={filters.region}
                      onChange={handleFilterChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">All Regions</option>
                      {allRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Section */}
          {filteredGrants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <FaChartLine className="text-4xl text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {filteredGrants.length}
                </h3>
                <p className="text-gray-600">Matching Grants</p>
              </div>
              {/* <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <FaUsers className="text-4xl text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {Math.max(...filteredGrants.map((g) => g.score))}/20
                </h3>
                <p className="text-gray-600">Top Match Score</p>
              </div> */}
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <FaRegLightbulb className="text-4xl text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {new Set(filteredGrants.map((g) => g.region)).size}
                </h3>
                <p className="text-gray-600">Regions Covered</p>
              </div>
            </motion.div>
          )}

          {filteredGrants && filteredGrants.length > 0 ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl mb-12 flex items-center justify-center mx-auto shadow-lg transform hover:shadow-xl transition-all duration-300"
                onClick={handleDownloadPDF}
              >
                <AiOutlineCloudDownload className="text-2xl mr-2" />
                Download Detailed Report
              </motion.button>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredGrants.map((grant, index) => (
                  <motion.div
                    key={index + (currentPage - 1) * grantsPerPage}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {grant.fundingType}
                        </span>
                      </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="bg-purple-100 rounded-full p-3">
                          <FaHandshake className="text-purple-500 text-2xl" />
                        </div>
                         <h2 className="font-bold ml-2 text-purple-900 text-xl 
                line-clamp-2 overflow-hidden text-ellipsis
                break-words">
    {grant.programName}
  </h2>
                      </div>
                      
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Amount:</span>{" "}
                        {grant.maxAmount}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Coverage:</span>{" "}
                        {grant.percentCovered}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Deadline:</span>{" "}
                        {grant.deadline || "Rolling"}
                      </p>
                    </div>

                    <DescriptionRenderer
                      indexToRender={1}
                      data={grant.description}
                    />

                    <div className="mt-6 flex flex-col gap-3">
                      <div className="border-t border-gray-100 pt-3"></div>
                      <div className="flex justify-center gap-4">
                        {grant.link && (
                          <a
                            href={grant.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-300 text-sm"
                          >
                            <FaLink className="mr-2" />
                            Visit Website
                          </a>
                        )}
                        <button
                          onClick={() => setShowApplyPopup(true)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 text-sm"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* {totalPages > 1 && (
                <div className="flex justify-center items-center mt-10 gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )} */}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <FaLightbulb className="text-5xl text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No matching grants found
              </h3>
              <p className="text-gray-600 mb-4">
                {Object.values(filters).some((f) => f)
                  ? "Try adjusting your filters"
                  : "Check back later for new opportunities"}
              </p>
              {Object.values(filters).some((f) => f) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-purple-600 hover:text-purple-800 flex items-center mx-auto"
                >
                  <FaTimes className="mr-2" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
