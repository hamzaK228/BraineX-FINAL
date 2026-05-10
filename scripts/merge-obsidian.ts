import fs from "fs";
import path from "path";

const obsidianPath = "d:/Programs/Obsidian/Resources_for_AI/QS_2026_World_University_Rankings.md";
const tablePath = path.join(process.cwd(), "obsidian_table.md");

try {
    const obsidianContent = fs.readFileSync(obsidianPath, "utf-8");
    const tableContent = fs.readFileSync(tablePath, "utf-8");

    const lines = obsidianContent.split("\n");
    
    // Find markers or use known line numbers
    // Table starts at line 123 (index 122)
    // Table ends at line 955 (index 954)
    
    const header = lines.slice(0, 122).join("\n");
    const footer = lines.slice(955).join("\n");

    const finalContent = `${header}\n${tableContent}\n${footer}`;
    
    fs.writeFileSync(obsidianPath, finalContent);
    console.log("Successfully updated Obsidian file with 1500+ universities.");
} catch (error) {
    console.error("Error merging files:", error);
}
