const assert = require("assert");
const puppeteer = require("puppeteer");
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const LoginPage = require("./LoginPage");
const PostsPage = require("./postsPage");
const TagsPage = require("./tagsPage");
const ghostUrl = "http://localhost:2369/ghost/";
const userEmail = "prueba@prueba.com";
const userPassword = "prueba12345";

// Create a directory with a timestamp
const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
const screenshotDirectory = `./screenshots/${timestamp}/`;
/**
 * Ensure the directory exists
 * @param {string} directoryPath - The directory path
 */
const ensureDirectoryExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};
ensureDirectoryExists(screenshotDirectory);
const runScenarios = async () => {
  await runScenario1();
await runScenario2();
  await runScenario3();
  await runScenario4();
  await runScenario5();
  await runScenario6();
  await runScenario7();
  await runScenario8();
  await runScenario9();
  await runScenario16();
};
/**
 * Escenario 1: Como usuario administrador realizo el inicio sesión en Ghost (positivo)
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se ingresa un correo valido
 * And: Se ingresa una contraseña valida
 * And: Se da clic en el botón de iniciar de sesión
 * Then: Se verifica que se encuentre en el dashboard
 */ 
const runScenario1 = async () => {
 try{ const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario1/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  const afterlogin = await loginPage.login(userEmail, userPassword);

  // Get the URL from the page after login
  const url = afterlogin.url();

  // Close the browser after completing the tests
  await browser.close();

  // Perform the assertion after all the asynchronous operations are complete
  assert.equal(url, "http://localhost:2369/ghost/#/dashboard");
  console.log(
    "E1-Test Passed - Expected: http://localhost:2369/ghost/#/dashboard, Actual: ",
    url,
    "."
  );}catch(e) { // Close the browser after completing the tests
    await browser.close();
    console.log(
      "E1-Test Failed - Expected: ",
      e.expected,
      ", Actual: ",
      e.actual,
      "."
    )}
}
;
/**
 * Escenario 2: Como usuario administrador realizo el inicio sesión en Ghost (negativo)
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se ingresa un correo vacío - correo invalido
 * And: Se ingresa una contraseña vacía - contraseña invalida
 * And: Se da clic en el botón de iniciar de sesión
 * Then: Se valida el mensaje de error
 */ 
const runScenario2 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario2/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  // Use await to ensure that visit completes before moving to login
  await loginPage.visit();

  const testData = [
    { email: "", password: "", error: "Please fill out the form to sign in." },
    {
      email: faker.internet.email(),
      password: faker.internet.password(),
      error: "There is no user with that email address.",
    },
  ];

  for (const data of testData) {
    const afterlogin = await loginPage.login(data.email, data.password);

    // Get the actual error message text
    const actualErrorMessage = await afterlogin.$eval(".main-error", (el) =>
      el.textContent.trim()
    );
    // Compare with the expected error message
    try {
      assert.equal(actualErrorMessage, data.error);
      console.log(
        "E2-Test Passed - Expected:",
        data.error,
        ", Actual:",
        actualErrorMessage
      );
    } catch (e) {
      console.error(
        "E2-Test Failed - Expected:",
        data.error,
        ", Actual:",
        actualErrorMessage
      );
    }
  }

  await browser.close();}catch(e) {  // Close the browser after completing the tests
    await browser.close();console.log(e)}
}

/**
 * Escenario 3: Como usuario administrador realizo el inicio sesión en Ghost (negativo)
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se ingresa un correo no existente- correo de usuario base de datos pero no existente
 * And: Se da clic en el botón de olvide contraseña
 * Then: Se valida el mensaje de error
 */
const runScenario3 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario3/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);
  await loginPage.visit();
  const testData = [
    {
      email: userEmail,
      error: "Failed to send email",
      error2: "Too many attempts try again",
    },
    {
      email: faker.internet.email(),
      error: "User not found",
      error2: "Too many attempts try again",
    },
  ];

  for (const data of testData) {
    const afterForgot = await loginPage.forgotPassword(data.email);

    // Get the actual error message text
    const actualErrorMessage = await afterForgot.$eval(".main-error", (el) =>
      el.textContent.trim()
    );
    // Compare with the expected error message
    try {
      assert.ok(
        actualErrorMessage.includes(data.error) ||
          actualErrorMessage.includes(data.error2)
      );

      console.log(
        "E3-Test Passed - Expected: '",
        data.error,
        "' OR '",
        data.error2,
        ", Actual:",
        actualErrorMessage
      );
    } catch (e) {
      console.error(
        e,
        "E3-Test Failed - Expected:",
        data.error,
        "' OR '",
        data.error2,
        ", Actual:",
        actualErrorMessage
      );
    }
  }

  await browser.close();}catch(e){ // Close the browser after completing the tests
    await browser.close();console.log(e)}}

/**
 * Escenario 4: Como usuario administrador creo un nuevo post para publicarlo en el sitio web
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Posts
 * And: Se da clic en el botón de New Post
 * And:Se ingresa una cadena de texto al título del post
 * And:Se ingresa un texto al contenido del post
 * And: Se da click en el publish
 * And: Se da click en Continue, final review
 * And: Se da click en Publish post, right now
 * And: Se da click en posts
 * Then:Se valida que el post este creado
 */ const runScenario4 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario4/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  const afterlogin = await loginPage.login(userEmail, userPassword);
  const postPage = new PostsPage(
    page,
    ghostUrl,
    screenshotDirectoryEscenario
  );
   await Promise.resolve(postPage.visit());
 const afterPostVisit= await Promise.resolve(postPage.createPost());
 await page.waitForTimeout(5000);


  // Close the browser after completing the tests
  await browser.close();

  console.log("E4-Test Passed ")}catch(e){
     // Close the browser after completing the tests
  await browser.close();
  console.log(e,
    "E4-Test Failed - Expected: ",
    e.expected,
    ", Actual: ",
    e.actual,
    "."
  )}
}
/**
 * Escenario 5: Como usuario administrador creo un nuevo borrador de post para el sitio web
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Posts
 * And: Se da clic en el botón de New Post
 * And:Se ingresa una cadena de texto al título del post
 * And:Se ingresa un texto al contenido del post
 * And: Se da click en posts
 * Then:Se valida que aparezaca en el listado de posts el borador que se acabo de crear
 */ 
const runScenario5 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario5/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  const afterlogin = await loginPage.login(userEmail, userPassword);
  const postPage = new PostsPage(
    page,
    ghostUrl,
    screenshotDirectoryEscenario
  );
   await Promise.resolve(postPage.visit());
 const afterPostVisit= await Promise.resolve(postPage.createDraft());
 await page.waitForTimeout(5000);


  // Close the browser after completing the tests
  await browser.close();

  console.log(
    "E5-Test Passed"
  );}catch(e){
  console.log(e,
    "E5-Test Failed",
  )}}

/**
 * Escenario 6: Como usuario administrador creo un nuevo post con publicación programada
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Posts
 * And: Se da clic en el botón de New Post
 * And:Se ingresa una cadena de texto al título del post
 * And:Se ingresa un texto al contenido del post
 * And: Se da click en el publish
 * And: Se da click en el dropdown de configuración de publicación del post
 * And: Se da click en la opcion de publicar luego
 * And: Se da click en Continue, final review
 * And: Se da click en Publish post, right now
 * And: Se da click en posts
 * Then:Se valida que el post este creado
 */ 
const runScenario6 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario6/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  const afterlogin = await loginPage.login(userEmail, userPassword);
  const postPage = new PostsPage(
    page,
    ghostUrl,
    screenshotDirectoryEscenario
  );
   await Promise.resolve(postPage.visit());
 const afterPostVisit= await Promise.resolve(postPage.createPostScheduled());
 await page.waitForTimeout(5000);


  // Close the browser after completing the tests
  await browser.close();

  console.log("E6-Test Passed ");}catch(e){
    console.log(e,
      "E6-Test Failed",
    )}}
/**
 * Escenario 7: Como usuario administrador creo un nuevo tag para usarlo en el sitio web
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Tags
 * And: Se da clic en el botón de New Tag
 * And:Se ingresa una cadena de texto al nombre del tag
 * And:Se ingresa un texto a la descripción del tag
 * And: Se da click en Save
 * And: Se da click en Tags
 * And: Se da click en published Tags
 * Then:Se valida que el post este creado
 */
const runScenario7 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario7/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  await loginPage.login(userEmail, userPassword);
  const tagsPage = new TagsPage(page, ghostUrl, screenshotDirectoryEscenario);

  const newTagName = faker.lorem.sentence(2);
  await Promise.resolve(tagsPage.visit());
  await Promise.resolve(tagsPage.createTag(newTagName, true));
  await page.waitForTimeout(5000);

  // Close the browser after completing the tests
  await browser.close();
  console.log("E7-Test Passed ");}catch(e){
    console.log(e,
      "E7-Test Failed",
    )}}
/**
 * Escenario 8:  Como usuario administrador creo un nuevo tag (negativo)
 *
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Tags
 * And: Se da clic en el botón de New Tag
 * And:Se ingresa un texto a la descripción del tag
 * And: Se da click en Save
 * Then:Debe aparecer un mensaje de error exigiéndome un nombre de tag
 */
const runScenario8 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario8/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  await loginPage.login(userEmail, userPassword);
  const tagsPage = new TagsPage(page, ghostUrl, screenshotDirectoryEscenario);
  await Promise.resolve(tagsPage.visit());
  await Promise.resolve(tagsPage.createTagError());
  await page.waitForTimeout(5000);

  // Close the browser after completing the tests
  await browser.close();
  console.log("E8-Test Passed ");}catch(e){
    console.log(e,
      "E8-Test Failed",
    )}}
/**
 * Escenario 9: Como usuario administrador creo un nuevo internal tag
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Tags
 * And: Se da clic en el botón de New Tag
 * And:Se ingresa una cadena de texto al nombre del tag (con # al inicio del nombre)
 * And:Se ingresa un texto a la descripción del tag
 * And: Se da click en Save
 * And: Se da click en Tags
 * And: Se da click en internal Tags
 * Then:Se valida que el post este creado
 */
const runScenario9 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario9/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  await loginPage.login(userEmail, userPassword);
  const tagsPage = new TagsPage(page, ghostUrl, screenshotDirectoryEscenario);

  const newTagName = '#'+faker.lorem.sentence(2);
  await Promise.resolve(tagsPage.visit());
  await Promise.resolve(tagsPage.createTag(newTagName, false));
  await page.waitForTimeout(5000);

  // Close the browser after completing the tests
  await browser.close();
  console.log("E9-Test Passed ");}catch(e){
    console.log(e,
      "E9-Test Failed",
    )}}
/**
 * Escenario 16: Como usuario administrador edito un tag creado previamente (caso positivo)
 * Given: Se ingresa a la página correspondiente a login
 * When: Se da clic en el botón de Tags
 * And: Se selecciona el tag que ha sido creado previamente
 * And:Se ingresa una nueva cadena de texto al nombre del tag 
 * And: Se da click en Save
 * And: Se da click en Tags
 * Then:Se valida que el tag que ha sido creado previamente se le ha modificado el titulo
 */
const runScenario16 = async () => {
  try{
  const screenshotDirectoryEscenario = `./screenshots/${timestamp}/Escenario16/`;
  ensureDirectoryExists(screenshotDirectoryEscenario);
  const browser = await puppeteer.launch({ headless: "new"});
  const page = await browser.newPage();
  const loginPage = new LoginPage(page, ghostUrl, screenshotDirectoryEscenario);

  await loginPage.visit();

  await loginPage.login(userEmail, userPassword);
  const tagsPage = new TagsPage(page, ghostUrl, screenshotDirectoryEscenario);

  const newTagName = faker.lorem.sentence(2);
  await Promise.resolve(tagsPage.visit());
  await Promise.resolve(tagsPage.editTag(newTagName));
  await page.waitForTimeout(5000);

  // Close the browser after completing the tests
  await browser.close();
  console.log("E16-Test Passed ");}catch(e){
    console.log(e,
      "E16-Test Failed",
    )}}
runScenarios();