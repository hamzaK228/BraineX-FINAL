import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

async function main() {
  const csvPath = path.join(process.cwd(), "2026_QS_World University_Rankings.csv");
  const workbook = XLSX.readFile(csvPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

  let markdown = "| Rank | University Name | Country | Region | Overall Score |\n";
  markdown += "| :--- | :--- | :--- | :--- | :--- |\n";

  for (const row of rawData) {
    const rank = row["Rank"] || "-";
    const name = row["Name"] || "Unknown";
    const country = row["Country/Territory"] || "Unknown";
    const region = row["Region"] || "Unknown";
    const score = row["Overall SCORE"] || "-";

    markdown += `| ${rank} | ${name} | ${country} | ${region} | ${score} |\n`;
  }

  const outputPath = path.join(process.cwd(), "obsidian_table.md");
  fs.writeFileSync(outputPath, markdown);
  console.log(`Generated full table with ${rawData.length} rows at: ${outputPath}`);
}

main().catch(console.error);
