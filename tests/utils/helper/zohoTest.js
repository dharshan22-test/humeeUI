const Imap = require("imap");
const { simpleParser } = require("mailparser");

const imap = new Imap({
  user: "yogesh@synctag.com",
  password: "AJb7yVmRse8E",
  host: "imap.zoho.com",
  port: 993,
  tls: true
});

function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}

imap.once("ready", function () {

  console.log("Connected to Zoho mailbox");

  openInbox(function (err, box) {

    if (err) throw err;

    imap.search(["ALL"], function (err, results) {

      if (!results.length) {
        console.log("No emails found");
        return;
      }

      const latestEmail = results.slice(-1);

      const fetch = imap.fetch(latestEmail, { bodies: "" });

      fetch.on("message", function (msg) {

        msg.on("body", function (stream) {

          simpleParser(stream, async (err, parsed) => {

            console.log("\nSubject:", parsed.subject);
            console.log("From:", parsed.from.text);
            console.log("Body:", parsed.text);

            imap.end();

          });

        });

      });

    });

  });

});

imap.once("error", function (err) {
  console.log("Error:", err);
});

imap.connect();