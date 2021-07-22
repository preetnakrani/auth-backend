const fs = require("fs");
const mustache = require("mustache");
const path = require("path");
const juice = require("juice");

async function loadTemplate(templatePath, context) {
  let subject = getSubject(path.join(templatePath, "subject.txt"), context);
  let text = getText(path.join(templatePath, "text.txt"), context);
  let html = null;
  try {
    html = await getHTML(path.join(templatePath, "body.html"), context);
  } catch (e) {
    console.log(e.message);
    throw new Error("Error making template");
  }
  return { html, text, subject };
}

const getSubject = (subjectPath, context) => {
  let subject = fs.readFileSync(subjectPath, {
    encoding: "utf8",
    flag: "r",
  });
  return mustache.render(subject, context);
};

const getText = (textPath, context) => {
  let text = fs.readFileSync(textPath, {
    encoding: "utf8",
    flag: "r",
  });
  return mustache.render(text, context);
};

const getHTML = (HTMLPath, context) => {
  return new Promise((resolve, reject) => {
    let html = fs.readFileSync(HTMLPath, {
      encoding: "utf8",
      flag: "r",
    });

    juice.juiceFile(HTMLPath, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      html = result;
      html = mustache.render(html, context);
      return resolve(html);
    });
  });
};

module.exports = loadTemplate;
