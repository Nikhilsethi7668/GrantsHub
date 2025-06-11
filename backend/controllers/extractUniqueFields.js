import { Grants } from "../models/grant.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUniqueSectorsAndSaveToJson = async (req, res) => {
  try {
    const documents = await Grants.find({}, { Sectors: 1, _id: 0 });
    
    const allSectors = documents.flatMap(doc => {
      if (!doc.Sectors) return [];
      
      // Handle both array and string cases with better cleaning
      const sectors = Array.isArray(doc.Sectors) 
        ? doc.Sectors 
        : String(doc.Sectors).split(',');
      
      return sectors.map(s => {
        // Advanced cleaning
        let clean = s.trim()
          .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
          .replace(/\s+/g, ' ') // Collapse multiple spaces
          .replace(/^["']|["']$/g, ''); // Remove surrounding quotes
        
        // Standardize common variations
        clean = clean
          .replace(/&/g, 'and')
          .replace(/[\-–—]/g, '-'); // Standardize hyphens
        
        return clean;
      }).filter(s => s.length > 0);
    });

    console.log("Total sector entries:", allSectors.length);
    console.log("Sample sectors before deduplication:", [...new Set(allSectors)].slice(0, 50));

    // Case-insensitive deduplication with original case preservation
    const sectorMap = new Map();
    allSectors.forEach(sector => {
      const lower = sector.toLowerCase();
      if (!sectorMap.has(lower)) {
        sectorMap.set(lower, sector);
      }
    });
    const uniqueSectors = Array.from(sectorMap.values());

    // Advanced sorting
    uniqueSectors.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    console.log("Unique sectors count:", uniqueSectors.length);
    console.log("First 50 unique sectors:", uniqueSectors.slice(0, 50));

    // Save to file
    const filePath = path.join(__dirname, '../output/uniqueSectors.json');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(uniqueSectors, null, 2));

    res.status(200).json({
      success: true,
      totalEntries: allSectors.length,
      uniqueCount: uniqueSectors.length,
      sample: uniqueSectors.slice(0, 50),
      message: `Found ${uniqueSectors.length} unique sectors from ${allSectors.length} total entries`
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: "Check for hidden characters or inconsistent formatting in sector data"
    });
  }
};