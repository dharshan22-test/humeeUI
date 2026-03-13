const Imap = require("imap");
const { simpleParser } = require("mailparser");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatImapDate(date) {
  const day = String(date.getDate());
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function getDefaultImapConfig() {
  return {
    user: "ydtest22@gmail.com",
    password: "pxod wxjx ckrm zwao",
    host: "imap.gmail.com",
    port: Number(993),
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false
    }
  };
}

function normalizeIncludes(value) {
  return (value || "").toLowerCase();
}

function addressMatches(addressField, containsValue) {
  if (!containsValue) return true;
  if (!addressField || !Array.isArray(addressField.value)) return false;

  const needle = normalizeIncludes(containsValue);
  return addressField.value.some((entry) => {
    const address = normalizeIncludes(entry.address);
    const name = normalizeIncludes(entry.name);
    return address.includes(needle) || name.includes(needle);
  });
}

function textMatches(text, containsValue) {
  if (!containsValue) return true;
  return normalizeIncludes(text).includes(normalizeIncludes(containsValue));
}

function messageMatches(parsed, filters) {
  const { subjectContains, bodyContains, fromContains, toContains } = filters;
  return (
    textMatches(parsed.subject, subjectContains) &&
    textMatches(parsed.text, bodyContains) &&
    addressMatches(parsed.from, fromContains) &&
    addressMatches(parsed.to, toContains)
  );
}

function parseMessage(stream) {
  return new Promise((resolve, reject) => {
    simpleParser(stream, (parseErr, parsed) => {
      if (parseErr) {
        reject(parseErr);
        return;
      }

      resolve(parsed);
    });
  });
}

function fetchLatestMatchingEmailOnce(options) {
  const {
    imapConfig,
    mailbox = "INBOX",
    since,
    unseenOnly = false,
    maxFetch = 10,
    subjectContains,
    bodyContains,
    fromContains,
    toContains
  } = options;

  return new Promise((resolve, reject) => {
    const client = new Imap(imapConfig);
    let settled = false;
    const parseTasks = [];

    const safeResolve = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const safeReject = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    client.once("ready", () => {
      client.openBox(mailbox, true, (openErr) => {
        if (openErr) {
          client.end();
          safeReject(openErr);
          return;
        }

        const criteria = [];
        if (unseenOnly) criteria.push("UNSEEN");
        else criteria.push("ALL");
        if (since instanceof Date) criteria.push(["SINCE", formatImapDate(since)]);

        client.search(criteria, (searchErr, results) => {
          if (searchErr) {
            client.end();
            safeReject(searchErr);
            return;
          }

          if (!results || results.length === 0) {
            client.end();
            safeResolve(null);
            return;
          }

          const uids = results.slice(-maxFetch);
          const fetch = client.fetch(uids, { bodies: "" });

          fetch.on("message", (msg) => {
            msg.on("body", (stream) => {
              parseTasks.push(parseMessage(stream));
            });
          });

          fetch.once("error", (fetchErr) => {
            client.end();
            safeReject(fetchErr);
          });

          fetch.once("end", async () => {
            try {
              const parsedEmails = await Promise.all(parseTasks);
              const matches = parsedEmails
                .filter((mail) =>
                  messageMatches(mail, { subjectContains, bodyContains, fromContains, toContains })
                )
                .sort((a, b) => {
                  const aTime = a.date ? new Date(a.date).getTime() : 0;
                  const bTime = b.date ? new Date(b.date).getTime() : 0;
                  return bTime - aTime;
                });

              client.end();
              safeResolve(matches[0] || null);
            } catch (parseErr) {
              client.end();
              safeReject(parseErr);
            }
          });
        });
      });
    });

    client.once("error", (error) => {
      safeReject(error);
    });

    client.connect();
  });
}

async function waitForLatestEmail(options = {}) {
  const {
    timeoutMs = 120000,
    pollIntervalMs = 5000,
    since = new Date(Date.now() - 60 * 1000),
    imapConfig = getDefaultImapConfig()
  } = options;

  if (!imapConfig.user || !imapConfig.password) {
    throw new Error("Missing IMAP credentials. Set GMAIL_IMAP_USER and GMAIL_IMAP_PASSWORD.");
  }

  const started = Date.now();
  while (Date.now() - started <= timeoutMs) {
    const mail = await fetchLatestMatchingEmailOnce({ ...options, since, imapConfig });
    if (mail) return mail;
    await sleep(pollIntervalMs);
  }

  throw new Error(`No matching email arrived within ${timeoutMs}ms.`);
}

module.exports = {
  fetchLatestMatchingEmailOnce,
  waitForLatestEmail
};
