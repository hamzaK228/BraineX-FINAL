const fs = require('fs');
const https = require('http'); // universities.hipolabs.com is http

const top20 = [
  { id: "mit", name: "Massachusetts Institute of Technology (MIT)", city: "Cambridge", country: "USA", ranking: 1, tuition: 57590, acceptance_rate: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", programs: ["Computer Science", "Engineering", "Physics"], type: "Private", students: 11934 },
  { id: "imperial", name: "Imperial College London", city: "London", country: "UK", ranking: 2, tuition: 34000, acceptance_rate: 14, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Imperial_College_London_new_logo.svg/1024px-Imperial_College_London_new_logo.svg.png", programs: ["Medicine", "Engineering", "Business"], type: "Public", students: 20000 },
  { id: "oxford", name: "University of Oxford", city: "Oxford", country: "UK", ranking: 3, tuition: 35000, acceptance_rate: 17, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1024px-Oxford-University-Circlet.svg.png", programs: ["Humanities", "Sciences", "Philosophy"], type: "Public", students: 25905 },
  { id: "harvard", name: "Harvard University", city: "Cambridge", country: "USA", ranking: 4, tuition: 54002, acceptance_rate: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/1024px-Harvard_University_shield.png", programs: ["Law", "Business", "Medicine"], type: "Private", students: 25266 },
  { id: "cambridge", name: "University of Cambridge", city: "Cambridge", country: "UK", ranking: 5, tuition: 36000, acceptance_rate: 21, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/University_of_Cambridge_logo.svg/1024px-University_of_Cambridge_logo.svg.png", programs: ["Mathematics", "Science", "Engineering"], type: "Public", students: 24270 },
  { id: "stanford", name: "Stanford University", city: "Stanford", country: "USA", ranking: 6, tuition: 56169, acceptance_rate: 4, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Stanford_University_seal_2003.svg/1024px-Stanford_University_seal_2003.svg.png", programs: ["Computer Science", "Economics", "Biology"], type: "Private", students: 17381 },
  { id: "eth_zurich", name: "ETH Zurich", city: "Zurich", country: "Switzerland", ranking: 7, tuition: 1500, acceptance_rate: 27, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/ETH_Z%C3%BCrich_Logo_black.svg/1024px-ETH_Z%C3%BCrich_Logo_black.svg.png", programs: ["Engineering", "Architecture", "Science"], type: "Public", students: 24500 },
  { id: "nus", name: "National University of Singapore (NUS)", city: "Singapore", country: "Singapore", ranking: 8, tuition: 30000, acceptance_rate: 5, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/NUS_coat_of_arms.svg/1024px-NUS_coat_of_arms.svg.png", programs: ["Engineering", "Science", "Computing"], type: "Public", students: 31300 },
  { id: "ucl", name: "University College London (UCL)", city: "London", country: "UK", ranking: 9, tuition: 32000, acceptance_rate: 12, logo: "https://upload.wikimedia.org/wikipedia/en/d/d1/University_College_London_logo.svg", programs: ["Architecture", "Education", "Psychology"], type: "Public", students: 43000 },
  { id: "caltech", name: "California Institute of Technology", city: "Pasadena", country: "USA", ranking: 10, tuition: 58680, acceptance_rate: 3, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/California_Institute_of_Technology_seal.svg/1024px-California_Institute_of_Technology_seal.svg.png", programs: ["Physics", "Chemistry", "Engineering"], type: "Private", students: 2397 },
  { id: "upenn", name: "University of Pennsylvania", city: "Philadelphia", country: "USA", ranking: 11, tuition: 63452, acceptance_rate: 6, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_shield_with_banner.svg/1024px-UPenn_shield_with_banner.svg.png", programs: ["Business", "Nursing", "Law"], type: "Private", students: 28000 },
  { id: "berkeley", name: "UC Berkeley", city: "Berkeley", country: "USA", ranking: 12, tuition: 44000, acceptance_rate: 11, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/1024px-Seal_of_University_of_California%2C_Berkeley.svg.png", programs: ["Computer Science", "Engineering", "Economics"], type: "Public", students: 45000 },
  { id: "melbourne", name: "University of Melbourne", city: "Melbourne", country: "Australia", ranking: 13, tuition: 30000, acceptance_rate: 70, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/University_of_Melbourne_Coat_of_Arms.svg/1024px-University_of_Melbourne_Coat_of_Arms.svg.png", programs: ["Law", "Medicine", "Education"], type: "Public", students: 54000 },
  { id: "pku", name: "Peking University", city: "Beijing", country: "China", ranking: 14, tuition: 5000, acceptance_rate: 1, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Peking_University_seal.svg/1024px-Peking_University_seal.svg.png", programs: ["Humanities", "Sciences", "Social Sciences"], type: "Public", students: 46000 },
  { id: "ntu", name: "Nanyang Technological University", city: "Singapore", country: "Singapore", ranking: 15, tuition: 28000, acceptance_rate: 35, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Nanyang_Technological_University_coat_of_arms.svg/1024px-Nanyang_Technological_University_coat_of_arms.svg.png", programs: ["Engineering", "Business", "Medicine"], type: "Public", students: 33000 },
  { id: "cornell", name: "Cornell University", city: "Ithaca", country: "USA", ranking: 16, tuition: 61015, acceptance_rate: 8, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cornell_University_seal.svg/1024px-Cornell_University_seal.svg.png", programs: ["Hotel Management", "Engineering", "Agriculture"], type: "Private", students: 25000 },
  { id: "hku", name: "University of Hong Kong", city: "Hong Kong", country: "Hong Kong", ranking: 17, tuition: 22000, acceptance_rate: 10, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/62/University_of_Hong_Kong_coat_of_arms.svg/1024px-University_of_Hong_Kong_coat_of_arms.svg.png", programs: ["Dentistry", "Education", "Biomedicine"], type: "Public", students: 31000 },
  { id: "sydney", name: "University of Sydney", city: "Sydney", country: "Australia", ranking: 18, tuition: 32000, acceptance_rate: 30, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/University_of_Sydney_coat_of_arms.svg/1024px-University_of_Sydney_coat_of_arms.svg.png", programs: ["Medicine", "Law", "Arts"], type: "Public", students: 73000 },
  { id: "unsw", name: "University of New South Wales", city: "Sydney", country: "Australia", ranking: 19, tuition: 33000, acceptance_rate: 35, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/UNSW_shield.svg/1024px-UNSW_shield.svg.png", programs: ["Engineering", "Business", "Law"], type: "Public", students: 63000 },
  { id: "tsinghua", name: "Tsinghua University", city: "Beijing", country: "China", ranking: 20, tuition: 5000, acceptance_rate: 2, logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Tsinghua_University_Seal.svg/1024px-Tsinghua_University_Seal.svg.png", programs: ["Engineering", "Computer Science"], type: "Public", students: 53302 }
];

const programPool = [
  ["Engineering", "Business", "Medicine"],
  ["Law", "Arts", "Humanities"],
  ["Computer Science", "Data Science", "AI"],
  ["Architecture", "Design", "Fine Arts"],
  ["Biology", "Chemistry", "Physics"],
  ["Psychology", "Sociology", "Education"]
];

https.get('http://universities.hipolabs.com/search', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const unis = JSON.parse(data);
    let finalUnis = [...top20];
    let topNames = top20.map(u => u.name.toLowerCase());
    
    let currentRank = 21;
    for (let u of unis) {
      if (finalUnis.length >= 500) break;
      
      let uName = u.name;
      // skip if it's too similar to top 20
      if (topNames.some(tn => tn.includes(uName.toLowerCase()) || uName.toLowerCase().includes(tn))) {
         continue;
      }

      // Generate plausible random data
      let r = currentRank;
      let tuition = Math.floor(Math.random() * 40000) + 5000;
      let acceptance = Math.floor(Math.random() * 60) + 10;
      let students = Math.floor(Math.random() * 50000) + 5000;
      let programs = programPool[Math.floor(Math.random() * programPool.length)];
      let type = Math.random() > 0.5 ? "Public" : "Private";

      finalUnis.push({
        id: "uni_" + r,
        name: u.name,
        city: u["state-province"] || "City",
        country: u.country,
        ranking: r,
        tuition: tuition,
        acceptance_rate: acceptance,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Education_-_The_Noun_Project.svg/1024px-Education_-_The_Noun_Project.svg.png", // generic fallback logo
        programs: programs,
        type: type,
        students: students
      });
      
      currentRank++;
    }

    fs.mkdirSync('./public/data', { recursive: true });
    fs.writeFileSync('./public/data/qs_top_500.json', JSON.stringify(finalUnis, null, 2));
    console.log("Successfully generated top 500 universities!");
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
