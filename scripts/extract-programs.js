const fs = require('fs');

const content = fs.readFileSync('src/app/(public)/programs/page.tsx', 'utf8');
const startToken = 'const programsData: Program[] = [';
const startIndex = content.indexOf(startToken);

if (startIndex !== -1) {
    let openBrackets = 0;
    let endIndex = -1;
    const startPoint = startIndex + startToken.length - 1;
    
    for (let i = startPoint; i < content.length; i++) {
        if (content[i] === '[') openBrackets++;
        if (content[i] === ']') {
            openBrackets--;
            if (openBrackets === 0) {
                endIndex = i;
                break;
            }
        }
    }

    if (endIndex !== -1) {
        const data = content.substring(startPoint, endIndex + 1);
        const scriptContent = `const programsData = ${data};\nmodule.exports = programsData;`;
        fs.writeFileSync('scripts/temp-programs.js', scriptContent);
        console.log('Extracted successfully');
    } else {
        console.log('Failed to find closing bracket');
    }
} else {
    console.log('Failed to find start token');
}
