const playwright = require("playwright");
const compareImages = require("resemblejs/compareImages");
const config = require("./config.json");
const fs = require("fs");

const { viewportHeight, viewportWidth, scenarios, options } = config;
const timestamp4440='20231129T220950'
const timestamp5710='20231129T223452'

async function executeTest() {
  if (scenarios.length === 0) {
    return;
  }
  let resultInfo = {};
  let datetime = new Date().toISOString().replace(/:/g, ".");
  for (e of scenarios) {
    for (s in e.steps) {
      const data = await compareImages(
        fs.readFileSync(
          `../PuppeteerGhost5-71/PuppeteerTester/screenshots/` +timestamp5710+`/Escenario` +
            e.number +
            `/` +
            e.steps[s] +
            `.png`
        ),
        fs.readFileSync(
          `../PuppeteerGhost4-44-0/PuppeteerTester/screenshots/` +timestamp4440+`/Escenario` +
          e.number +
          `/` +
          e.steps[s] +
          `.png`
        ),
        options
      );
      resultInfo[e.number + "-" + s] = {
        isSameDimensions: data.isSameDimensions,
        dimensionDifference: data.dimensionDifference,
        rawMisMatchPercentage: data.rawMisMatchPercentage,
        misMatchPercentage: data.misMatchPercentage,
        diffBounds: data.diffBounds,
        analysisTime: data.analysisTime,
      };
      if (!fs.existsSync(`./results/report_part2`)) {
        fs.mkdirSync(`./results/report_part2`, { recursive: true }); // Create directory recursively
      }

      fs.writeFileSync(
        `./results/report_part2/compare-${e.number}-${s}.png`,
        data.getBuffer()
      );
    }
  }
  fs.writeFileSync(
    `./results/report_part2/report.html`,
    createReport(datetime, resultInfo)
  );
  fs.copyFileSync("./index.css", `./results/report_part2/index.css`);
  console.log(
    "------------------------------------------------------------------------------------"
  );
  console.log("Execution finished. Check the report under the results folder");
  return resultInfo;
}
(async () => console.log(await executeTest()))();
function compareScenarios(e, resInfo) {
  const stepsHTML = e.steps.map((_, s) => `
    <div class="scenarios" id="scenario-${e.number}-step-${s}">
      <div class="btitle">
        <h2>Escenario ${e.numberVRT} Step: ${e.steps[s]}</h2>
        <p>Data: ${JSON.stringify(resInfo[`${e.number}-${s}`])}</p>
      </div>
      <div class="imgline">
        <div class="imgcontainer">
          <span class="imgname">Ghost V4.44.0</span>
          <img class="img2" src="../../../PuppeteerGhost4-44-0/PuppeteerTester/screenshots/${timestamp4440}/Escenario${
            e.number
          }/${e.steps[s]}.png" id="testImage" label="Test">
        </div>
        <div class="imgcontainer">
          <span class="imgname">Ghost V5.71.0</span>
          <img class="img2" src="../../../PuppeteerGhost5-71/PuppeteerTester/screenshots/${timestamp5710}/Escenario${
            e.number
          }/${e.steps[s]}.png" id="testImage" label="Test">
        </div>
      </div>
      <div class="imgline">
        <div class="imgcontainer">
          <span class="imgname">Diff</span>
          <img class="imgfull" src="./compare-${
            e.number
          }-${s}.png" id="diffImage" label="Diff">
        </div>
      </div>
    </div>`
  ).join('');

  return stepsHTML;
}
function createReport(datetime, resInfo) {
  return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Report for Ghost Resemble</h1>
            <p>Executed: ${datetime}</p>
            <select id="scenarioFilter">
              <option value="all">All Scenarios</option>
              ${config.scenarios.map(e => `<option value="${e.number}">Escenario ${e.numberVRT}</option>`).join('')}
            </select>
            <div id="visualizer">
              ${config.scenarios.map(e => compareScenarios(e, resInfo)).join('')}
            </div>

            <script>
              document.getElementById('scenarioFilter').addEventListener('change', function() {
                const selectedScenario = this.value;
                const scenarios = document.querySelectorAll('.scenarios');
                scenarios.forEach(scenario => {
                  if (selectedScenario === 'all' || scenario.id.includes('scenario-' + selectedScenario)) {
                    scenario.style.display = 'block';
                  } else {
                    scenario.style.display = 'none';
                  }
                });
              });
            </script>
        </body>
    </html>`;
}

